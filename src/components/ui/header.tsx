'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { AuthModal } from '@/components/auth/auth-modal';
import Image from 'next/image';

export function Header() {
    const pathname = usePathname();
    const { user, isAuthenticated } = useAuth();
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

    const getPageTitle = () => {
        if (pathname?.includes('/saved')) return 'Saved';
        if (pathname?.includes('/liked')) return 'Liked';
        if (pathname?.includes('/inbox')) return 'Inbox';
        if (pathname?.includes('/profile')) return 'Profile';
        return 'Home';
    };

    const title = getPageTitle();

    return (
        <>
            <header className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-md z-50 h-16 flex items-center px-6 bg-black/20 backdrop-blur-md border-b border-white/5 pointer-events-auto">
                <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center shrink-0">
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600 font-black text-xl tracking-tighter">
                            Linkr
                        </span>
                    </div>

                    {isAuthenticated && user ? (
                        <div className="flex items-center gap-2 animate-in fade-in slide-in-from-left-4 duration-500">
                            <div className="w-8 h-8 rounded-full bg-zinc-800 overflow-hidden border border-white/10 relative">
                                <Image
                                    src={user.avatar}
                                    alt={user.name}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xs font-bold text-white leading-none">{user.name}</span>
                                <span className="text-[10px] text-zinc-400 capitalize leading-tight">{user.role}</span>
                            </div>
                        </div>
                    ) : (
                        <button
                            onClick={() => setIsAuthModalOpen(true)}
                            className="text-xs font-bold bg-white text-black px-3 py-1.5 rounded-full hover:bg-zinc-200 transition-colors animate-in fade-in slide-in-from-left-4 duration-500"
                        >
                            Sign In
                        </button>
                    )}
                </div>

                {title && (
                    <div className="ml-auto">
                        <span className="text-white font-semibold text-lg tracking-tight drop-shadow-md">{title}</span>
                    </div>
                )}
            </header>

            <AuthModal
                isOpen={isAuthModalOpen}
                onClose={() => setIsAuthModalOpen(false)}
            />
        </>
    );
}
