'use client';

import { useAuth } from './use-auth';
import { createClient } from '@/lib/supabase/client';

type UserRole = 'employer' | 'seeker';

export function useUserRole() {
    const { user, loading } = useAuth();
    const supabase = createClient();

    const setUserRole = async (newRole: UserRole) => {
        if (!user) return;

        try {
            const { error } = await supabase
                .from('profiles')
                .update({ role: newRole })
                .eq('id', user.id);

            if (error) throw error;

            // Reload to reflect changes since useAuth fetches on mount/session change
            window.location.reload();
        } catch (error) {
            console.error('Error updating role:', error);
        }
    };

    return { role: user?.role || 'seeker', setUserRole, loading };
}
