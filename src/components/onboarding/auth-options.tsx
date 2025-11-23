'use client';

import { Mail, User, ArrowRight } from 'lucide-react';

interface AuthOptionsProps {
    onSelect: (option: 'signup' | 'signin' | 'guest') => void;
}

export function AuthOptions({ onSelect }: AuthOptionsProps) {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-6 animate-in slide-in-from-right duration-500">
            <div className="w-full max-w-md">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold mb-4 bg-gradient-to-br from-blue-400 to-purple-600 bg-clip-text text-transparent">
                        Welcome
                    </h1>
                    <p className="text-zinc-400 text-lg">Join the marketplace for short-form video jobs.</p>
                </div>

                <div className="space-y-4">
                    <button
                        onClick={() => onSelect('signup')}
                        className="w-full p-4 bg-white text-black rounded-xl font-bold text-lg hover:bg-zinc-200 transition-all active:scale-95 flex items-center justify-center gap-2"
                    >
                        <Mail className="w-5 h-5" />
                        Sign Up
                    </button>

                    <button
                        onClick={() => onSelect('signin')}
                        className="w-full p-4 bg-zinc-900 text-white border border-zinc-800 rounded-xl font-bold text-lg hover:bg-zinc-800 transition-all active:scale-95 flex items-center justify-center gap-2"
                    >
                        <User className="w-5 h-5" />
                        Sign In
                    </button>

                    <div className="relative py-4">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-zinc-800"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-black text-zinc-500">or</span>
                        </div>
                    </div>

                    <button
                        onClick={() => onSelect('guest')}
                        className="w-full p-4 text-zinc-400 hover:text-white font-medium transition-colors flex items-center justify-center gap-2 group"
                    >
                        Continue as Guest
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            </div>
        </div>
    );
}
