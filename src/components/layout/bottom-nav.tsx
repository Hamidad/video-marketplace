'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Heart, MessageCircle, Bookmark, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Locale } from '../../i18n-config';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function BottomNav({ lang, dict }: { lang: Locale; dict: any }) {
    const pathname = usePathname();

    const navItems = [
        {
            label: dict.nav.home,
            href: `/${lang}`,
            icon: Home,
            active: pathname === `/${lang}`,
        },
        {
            label: dict.nav.liked,
            href: `/${lang}/liked`,
            icon: Heart,
            active: pathname === `/${lang}/liked`,
        },
        {
            label: dict.nav.inbox,
            href: `/${lang}/inbox`,
            icon: MessageCircle,
            active: pathname === `/${lang}/inbox`,
        },
        {
            label: dict.nav.saved,
            href: `/${lang}/saved`,
            icon: Bookmark,
            active: pathname === `/${lang}/saved`,
        },
        {
            label: dict.nav.profile,
            href: `/${lang}/profile`,
            icon: User,
            active: pathname === `/${lang}/profile`,
        },
    ];

    return (
        <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md z-50 bg-white dark:bg-black border-t border-gray-200 dark:border-gray-800 pb-safe">
            <div className="flex justify-around items-center h-16">
                {navItems.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                            'flex flex-col items-center justify-center w-full h-full space-y-1',
                            item.active
                                ? 'text-blue-600 dark:text-blue-400'
                                : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                        )}
                    >
                        <item.icon className="w-6 h-6" />
                        <span className="text-xs font-medium">{item.label}</span>
                    </Link>
                ))}
            </div>
        </nav>
    );
}
