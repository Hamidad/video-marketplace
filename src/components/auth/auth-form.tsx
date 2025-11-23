'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Mail, Lock, Loader2, ArrowLeft, User } from 'lucide-react';
import { useToast } from '@/components/ui/toast-context';

interface AuthFormProps {
    mode: 'signin' | 'signup';
    onBack: () => void;
    onSuccess: () => void;
}

export function AuthForm({ mode: initialMode, onBack, onSuccess }: AuthFormProps) {
    const [mode, setMode] = useState(initialMode);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [loading, setLoading] = useState(false);
    const supabase = createClient();
    const { showToast } = useToast();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (mode === 'signup') {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: {
                            full_name: fullName,
                            role: 'seeker', // Default role, can be changed later
                        },
                    },
                });
                if (error) throw error;
                showToast('Account created! You can now sign in.', 'success');
                // Auto sign in or switch to sign in? Supabase auto signs in if email confirm is off.
                // If email confirm is on, we should tell them.
                // For this demo, assuming email confirm is off or we just let them know.
                onSuccess();
            } else {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) throw error;
                showToast('Signed in successfully', 'success');
                onSuccess();
            }
        } catch (error: unknown) {
            console.error('Auth error:', error);
            const errorMessage = error instanceof Error ? error.message : 'Authentication failed';
            showToast(errorMessage, 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-6 animate-in slide-in-from-right duration-500">
            <div className="w-full max-w-md">
                <button
                    onClick={onBack}
                    className="mb-8 text-zinc-400 hover:text-white flex items-center gap-2 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back
                </button>

                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold mb-2">
                        {mode === 'signin' ? 'Welcome Back' : 'Create Account'}
                    </h1>
                    <p className="text-zinc-400">
                        {mode === 'signin'
                            ? 'Enter your credentials to access your account'
                            : 'Join the marketplace today'}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {mode === 'signup' && (
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-zinc-300">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 w-5 h-5" />
                                <input
                                    type="text"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-3 pl-10 pr-4 outline-none focus:border-blue-500 transition-colors"
                                    placeholder="John Doe"
                                    required
                                />
                            </div>
                        </div>
                    )}

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-300">Email</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 w-5 h-5" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-3 pl-10 pr-4 outline-none focus:border-blue-500 transition-colors"
                                placeholder="you@example.com"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-300">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 w-5 h-5" />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-3 pl-10 pr-4 outline-none focus:border-blue-500 transition-colors"
                                placeholder="••••••••"
                                required
                                minLength={6}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full p-4 bg-white text-black rounded-xl font-bold text-lg hover:bg-zinc-200 transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mt-6"
                    >
                        {loading ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            mode === 'signin' ? 'Sign In' : 'Sign Up'
                        )}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <button
                        onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
                        className="text-zinc-400 hover:text-white text-sm transition-colors"
                    >
                        {mode === 'signin'
                            ? "Don't have an account? Sign up"
                            : "Already have an account? Sign in"}
                    </button>
                </div>
            </div>
        </div>
    );
}
