import type { LoginRequest, LoginResponse, RegisterRequest } from '../types';
import { api } from '../lib/axios';

const USE_MOCK_AUTH = import.meta.env.VITE_USE_MOCK_AUTH === 'true';

// Mock user data for development
const MOCK_USER = {
    id: '1',
    name: 'Admin User',
    email: 'admin@workmesh.com',
    role: 'Admin' as const,
    photoUrl: undefined,
};

const MOCK_TOKEN = 'mock-jwt-token-' + Date.now();

export const authService = {
    async login(credentials: LoginRequest): Promise<LoginResponse> {
        // Mock authentication for development
        if (USE_MOCK_AUTH) {
            // Simulate network delay
            await new Promise(resolve => setTimeout(resolve, 800));

            // Validate credentials
            if (credentials.email === 'admin@workmesh.com' && credentials.password === 'admin123') {
                return {
                    user: MOCK_USER,
                    token: MOCK_TOKEN,
                };
            } else {
                throw new Error('Invalid email or password');
            }
        }

        // Real API call
        const response = await api.post<LoginResponse>('/auth/login', {
            email: credentials.email,
            password: credentials.password,
        });
        return response.data;
    },

    async logout(): Promise<void> {
        if (USE_MOCK_AUTH) {
            await new Promise(resolve => setTimeout(resolve, 300));
            return;
        }
        await api.post('/auth/logout');
    },

    async register(data: RegisterRequest): Promise<void> {
        if (USE_MOCK_AUTH) {
            await new Promise(resolve => setTimeout(resolve, 800));
            if (!data.companyName?.trim()) throw new Error('Company name is required');
            if (!data.location?.trim()) throw new Error('Location is required');
            if (!data.email?.trim()) throw new Error('Email is required');
            if (!data.password || data.password.length < 6) throw new Error('Password must be at least 6 characters');
            return;
        }

        await api.post('/auth/register', data);
    },

    async refreshToken(): Promise<{ token: string }> {
        if (USE_MOCK_AUTH) {
            return { token: MOCK_TOKEN };
        }
        const response = await api.post<{ token: string }>('/auth/refresh');
        return response.data;
    },
};
