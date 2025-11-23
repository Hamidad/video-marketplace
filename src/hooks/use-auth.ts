'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { User as SupabaseUser } from '@supabase/supabase-js';

export interface User {
    id: string;
    email?: string;
    name: string;
    avatar: string;
    role: 'employer' | 'seeker';
}

export function useAuth() {
    const [user, setUser] = useState<User | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    useEffect(() => {
        // Check active session
        const checkSession = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession();
                if (session?.user) {
                    await fetchProfile(session.user);
                } else {
                    setLoading(false);
                }
            } catch (error) {
                console.error('Error checking session:', error);
                setLoading(false);
            }
        };

        checkSession();

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
            if (session?.user) {
                await fetchProfile(session.user);
                setIsAuthenticated(true);
            } else {
                setUser(null);
                setIsAuthenticated(false);
                setLoading(false);
            }
        });

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    const fetchProfile = async (authUser: SupabaseUser) => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', authUser.id)
                .single();

            if (error) {
                console.error('Error fetching profile:', error);
                // Fallback if profile doesn't exist yet (should be created on signup)
                setUser({
                    id: authUser.id,
                    email: authUser.email,
                    name: authUser.user_metadata?.full_name || authUser.email?.split('@')[0] || 'User',
                    avatar: authUser.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${authUser.id}`,
                    role: 'seeker' // Default role
                });
            } else if (data) {
                setUser({
                    id: data.id,
                    email: authUser.email,
                    name: data.full_name || authUser.email?.split('@')[0] || 'User',
                    avatar: data.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.id}`,
                    role: data.role || 'seeker'
                });
            }
            setIsAuthenticated(true);
        } catch (error) {
            console.error('Error in fetchProfile:', error);
        } finally {
            setLoading(false);
        }
    };

    const login = async (role: 'employer' | 'seeker') => {
        // For now, we'll just sign in with a demo account or trigger OAuth
        // Since the UI calls login(role), we might need to adapt this.
        // For this step, let's just trigger Google login as an example, 
        // or we need a real login form.
        // Given the previous mock implementation, we should probably redirect to a login page
        // or show a modal. 

        // TEMPORARY: To keep the "demo" feel working while we transition, 
        // we can't easily "mock" a login with Supabase without real credentials.
        // I will implement a simple anonymous sign-in or warn the user.

        alert('Please implement a real login form with Supabase Auth (Email/Password or OAuth).');
    };

    const logout = async () => {
        await supabase.auth.signOut();
        setUser(null);
        setIsAuthenticated(false);
    };

    return { user, isAuthenticated, loading, login, logout };
}
