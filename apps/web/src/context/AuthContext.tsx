'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';

interface User {
    id: string;
    email: string;
    name?: string;
    phoneNumber?: string;
    profileImage?: string;
    role: 'USER' | 'ADMIN';
    credit?: number;
}

interface AuthContextType {
    user: User | null;
    login: (token: string, user: User) => void;
    logout: () => void;
    refreshProfile: () => Promise<void>;
    isAuthenticated: boolean;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    login: () => { },
    logout: () => { },
    refreshProfile: async () => { },
    isAuthenticated: false,
    isLoading: true,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const initAuth = async () => {
            const token = localStorage.getItem('token');
            const storedUser = localStorage.getItem('user');

            if (token) {
                if (storedUser && storedUser !== "undefined") {
                    try {
                        setUser(JSON.parse(storedUser));
                    } catch (e) {
                        console.error("Failed to parse user from local storage", e);
                    }
                }

                try {
                    const { data } = await api.get('/users/profile');
                    localStorage.setItem('user', JSON.stringify(data));
                    setUser(data);
                } catch (error) {
                    console.error('Failed to validate token/fetch profile', error);
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    setUser(null);
                }
            } else {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
            }
            setIsLoading(false);
        };

        initAuth();
    }, []);

    const login = (token: string, userData: User) => {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);

        if (userData.role === 'ADMIN') {
            router.push('/admin');
        } else {
            router.push('/');
        }
    };

    const refreshProfile = async () => {
        try {
            const { data } = await api.get('/users/profile');
            localStorage.setItem('user', JSON.stringify(data));
            setUser(data);
        } catch (error: any) {
            console.error('Failed to refresh profile', error);
            if (error.response?.status === 401) {
                logout();
            }
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        router.push('/auth/login');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, refreshProfile, isAuthenticated: !!user, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
