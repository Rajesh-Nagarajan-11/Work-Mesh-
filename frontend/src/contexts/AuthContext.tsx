import React, { createContext, useState, useEffect, useCallback } from 'react';
import type { User, AuthState, LoginRequest } from '../types';
import { authService } from '../services/authService';

interface AuthContextType extends AuthState {
    login: (credentials: LoginRequest) => Promise<void>;
    logout: () => Promise<void>;
    refreshUser: () => Promise<void>;
    updateUser: (user: Partial<User>) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [authState, setAuthState] = useState<AuthState>({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: true,
    });

    // Initialize auth state from storage and validate session
    useEffect(() => {
        const initializeAuth = async () => {
            const token = localStorage.getItem('auth_token');
            const userStr = localStorage.getItem('user');

            if (token && userStr) {
                try {
                    const user: User = JSON.parse(userStr);
                    
                    // Try to refresh token to validate session
                    try {
                        const refreshResponse = await authService.refreshToken();
                        const newToken = refreshResponse.token;
                        localStorage.setItem('auth_token', newToken);
                        
                        setAuthState({
                            user,
                            token: newToken,
                            isAuthenticated: true,
                            isLoading: false,
                        });
                    } catch {
                        // Token refresh failed - session expired
                        console.warn('Session expired, please login again');
                        localStorage.removeItem('auth_token');
                        localStorage.removeItem('user');
                        setAuthState({
                            user: null,
                            token: null,
                            isAuthenticated: false,
                            isLoading: false,
                        });
                    }
                } catch (error) {
                    console.error('Failed to parse user from storage:', error);
                    localStorage.removeItem('auth_token');
                    localStorage.removeItem('user');
                    setAuthState({
                        user: null,
                        token: null,
                        isAuthenticated: false,
                        isLoading: false,
                    });
                }
            } else {
                setAuthState({
                    user: null,
                    token: null,
                    isAuthenticated: false,
                    isLoading: false,
                });
            }
        };

        initializeAuth();
    }, []);

    const login = useCallback(async (credentials: LoginRequest) => {
        setAuthState((prev) => ({ ...prev, isLoading: true }));

        try {
            const response = await authService.login(credentials);

            localStorage.setItem('auth_token', response.token);
            localStorage.setItem('user', JSON.stringify(response.user));

            setAuthState({
                user: response.user,
                token: response.token,
                isAuthenticated: true,
                isLoading: false,
            });
        } catch (error) {
            setAuthState({
                user: null,
                token: null,
                isAuthenticated: false,
                isLoading: false,
            });
            throw error;
        }
    }, []);

    const logout = useCallback(async () => {
        try {
            await authService.logout();
        } catch (error) {
            console.error('Logout failed:', error);
        } finally {
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user');

            setAuthState({
                user: null,
                token: null,
                isAuthenticated: false,
                isLoading: false,
            });
        }
    }, []);

    const refreshUser = useCallback(async () => {
        // Placeholder for refreshing user data from server
        const userStr = localStorage.getItem('user');
        if (userStr) {
            try {
                const user: User = JSON.parse(userStr);
                setAuthState((prev) => ({
                    ...prev,
                    user,
                }));
            } catch (error) {
                console.error('Failed to refresh user:', error);
            }
        }
    }, []);

    // Update user info locally (e.g., after profile edit)
    const updateUser = useCallback((updates: Partial<User>) => {
        setAuthState((prev) => {
            if (!prev.user) return prev;
            const updatedUser = { ...prev.user, ...updates };
            localStorage.setItem('user', JSON.stringify(updatedUser));
            return { ...prev, user: updatedUser };
        });
    }, []);

    return (
        <AuthContext.Provider
            value={{
                ...authState,
                login,
                logout,
                refreshUser,
                updateUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
