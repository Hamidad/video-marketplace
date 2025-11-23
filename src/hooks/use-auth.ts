'use client';

import { useState, useEffect } from 'react';

export interface User {
    name: string;
    avatar: string;
    role: 'employer' | 'seeker';
}

export function useAuth() {
    const [user, setUser] = useState<User | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        // Load from local storage
        const storedUser = localStorage.getItem('authUser');
        if (storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser);
                // eslint-disable-next-line react-hooks/set-state-in-effect
                setUser(parsedUser);
                setIsAuthenticated(true);
            } catch (e) {
                console.error('Failed to parse user from local storage', e);
                localStorage.removeItem('authUser');
            }
        }

        // Listen for changes (e.g. from other tabs or components)
        const handleStorageChange = () => {
            const newUser = localStorage.getItem('authUser');
            if (newUser) {
                setUser(JSON.parse(newUser));
                setIsAuthenticated(true);
            } else {
                setUser(null);
                setIsAuthenticated(false);
            }
        };

        window.addEventListener('auth-change', handleStorageChange);
        return () => window.removeEventListener('auth-change', handleStorageChange);
    }, []);

    const login = (role: 'employer' | 'seeker') => {
        const mockUser: User = {
            name: role === 'employer' ? 'John Doe' : 'Jane Smith',
            avatar: role === 'employer'
                ? 'https://api.dicebear.com/7.x/avataaars/svg?seed=John'
                : 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane',
            role: role
        };

        localStorage.setItem('authUser', JSON.stringify(mockUser));
        // Also update the legacy userRole for compatibility
        localStorage.setItem('userRole', role);
        window.dispatchEvent(new Event('user-role-change'));

        setUser(mockUser);
        setIsAuthenticated(true);
        window.dispatchEvent(new Event('auth-change'));
    };

    const logout = () => {
        localStorage.removeItem('authUser');
        setUser(null);
        setIsAuthenticated(false);
        window.dispatchEvent(new Event('auth-change'));
    };

    return { user, isAuthenticated, login, logout };
}
