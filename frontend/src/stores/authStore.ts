import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import apiClient from '../api/client';

interface User {
    id: string;
    username: string;
    email: string;
    fullName: string;
    role: string;
}

interface AuthState {
    token: string | null;
    user: User | null;
    login: (username: string, password: string) => Promise<void>;
    setAuth: (token: string, user: User) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            token: null,
            user: null,
            login: async (username, password) => {
                const response = await apiClient.post('/auth/login', { username, password });
                const { accessToken, user } = response.data;
                set({ token: accessToken, user });
            },
            setAuth: (token, user) => set({ token, user }),
            logout: () => set({ token: null, user: null }),
        }),
        {
            name: 'auth-storage',
        },
    ),
);
