import axios from 'axios';
import type { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import type { ApiResponse, ApiError } from '../types';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// Create axios instance
export const apiClient = axios.create({
    baseURL: BASE_URL,
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true, // Important for cookies/JWT
});

// Request interceptor - attach auth token
apiClient.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem('auth_token');
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error: AxiosError) => {
        return Promise.reject(error);
    }
);

// Response interceptor - handle errors globally
apiClient.interceptors.response.use(
    (response: AxiosResponse<ApiResponse<unknown>>) => {
        return response;
    },
    async (error: AxiosError<ApiError>) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

        // Handle 401 - Unauthorized
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // Attempt to refresh token
                const refreshResponse = await axios.post(`${BASE_URL}/auth/refresh`, {}, {
                    withCredentials: true,
                });

                const newToken = refreshResponse.data.token;
                localStorage.setItem('auth_token', newToken);

                // Retry original request with new token
                if (originalRequest.headers) {
                    originalRequest.headers.Authorization = `Bearer ${newToken}`;
                }
                return apiClient(originalRequest);
            } catch (refreshError) {
                // Refresh failed - logout user
                localStorage.removeItem('auth_token');
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }

        // Handle other errors
        const apiError: ApiError = {
            message: error.response?.data?.message || error.message || 'An unexpected error occurred',
            errors: error.response?.data?.errors,
            statusCode: error.response?.status || 500,
        };

        return Promise.reject(apiError);
    }
);

// Helper functions for common HTTP methods
export const api = {
    get: <T>(url: string, config = {}) =>
        apiClient.get<ApiResponse<T>>(url, config).then((res) => res.data),

    post: <T>(url: string, data?: unknown, config = {}) =>
        apiClient.post<ApiResponse<T>>(url, data, config).then((res) => res.data),

    put: <T>(url: string, data?: unknown, config = {}) =>
        apiClient.put<ApiResponse<T>>(url, data, config).then((res) => res.data),

    patch: <T>(url: string, data?: unknown, config = {}) =>
        apiClient.patch<ApiResponse<T>>(url, data, config).then((res) => res.data),

    delete: <T>(url: string, config = {}) =>
        apiClient.delete<ApiResponse<T>>(url, config).then((res) => res.data),
};

export default apiClient;
