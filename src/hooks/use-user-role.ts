'use client';

import { useState, useEffect } from 'react';

type UserRole = 'employer' | 'seeker';

export function useUserRole() {
    const [role, setRole] = useState<UserRole>('employer');

    useEffect(() => {
        // Load from local storage
        const stored = localStorage.getItem('userRole') as UserRole;
        // eslint-disable-next-line react-hooks/set-state-in-effect
        if (stored) setRole(stored);

        // Listen for changes
        const handleStorageChange = () => {
            const newRole = localStorage.getItem('userRole') as UserRole;
            if (newRole) setRole(newRole);
        };

        window.addEventListener('user-role-change', handleStorageChange);
        return () => window.removeEventListener('user-role-change', handleStorageChange);
    }, []);

    const setUserRole = (newRole: UserRole) => {
        localStorage.setItem('userRole', newRole);
        setRole(newRole);
        window.dispatchEvent(new Event('user-role-change'));
    };

    return { role, setUserRole };
}
