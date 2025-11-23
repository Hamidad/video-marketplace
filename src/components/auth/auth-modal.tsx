'use client';

import { X } from 'lucide-react';
import { AuthOptions } from '@/components/onboarding/auth-options';
import { useAuth } from '@/hooks/use-auth';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
    const { login } = useAuth();

    if (!isOpen) return null;

    const handleSelect = (option: 'signup' | 'signin' | 'guest') => {
        if (option === 'guest') {
            onClose();
            return;
        }

        // For mock purposes, we'll just simulate a login based on selection
        // In a real app, this would show a form
        // Let's default to 'employer' for now, or maybe toggle?
        // For simplicity in this mock, let's just log them in as an employer
        login('employer');
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in duration-200">
            <div className="relative w-full max-w-md bg-black rounded-2xl overflow-hidden shadow-2xl border border-zinc-800">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-10 p-2 bg-zinc-900/50 rounded-full text-zinc-400 hover:text-white transition-colors"
                >
                    <X size={20} />
                </button>

                <AuthOptions onSelect={handleSelect} />
            </div>
        </div>
    );
}
