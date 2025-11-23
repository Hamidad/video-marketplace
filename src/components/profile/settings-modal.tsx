'use client';

import { X, Bell, Lock, Eye, Moon, HelpCircle, LogOut, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
    const [notifications, setNotifications] = useState(true);
    const [darkMode, setDarkMode] = useState(true);

    // Initialize dark mode state from html class or localStorage
    useEffect(() => {
        const isDark = document.documentElement.classList.contains('dark');
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setDarkMode(isDark);
    }, []);

    const toggleDarkMode = () => {
        const newMode = !darkMode;
        setDarkMode(newMode);
        if (newMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    };

    if (!isOpen) return null;

    const sections = [
        {
            title: 'Account',
            items: [
                { icon: Bell, label: 'Notifications', type: 'toggle', value: notifications, onChange: () => setNotifications(!notifications) },
                { icon: Lock, label: 'Privacy & Security', type: 'link' },
                { icon: Eye, label: 'Content Preferences', type: 'link' },
            ]
        },
        {
            title: 'App Settings',
            items: [
                { icon: Moon, label: 'Dark Mode', type: 'toggle', value: darkMode, onChange: toggleDarkMode },
                { icon: HelpCircle, label: 'Help & Support', type: 'link' },
            ]
        }
    ];

    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-zinc-900 w-full sm:max-w-md sm:rounded-2xl rounded-t-2xl overflow-hidden shadow-2xl animate-in slide-in-from-bottom-10 sm:zoom-in-95 duration-300 h-[85vh] sm:h-auto flex flex-col">
                <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-zinc-800">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">Settings</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full transition-colors text-gray-500 dark:text-zinc-400"
                        aria-label="Close"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4">
                    {sections.map((section, idx) => (
                        <div key={idx} className="mb-6">
                            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-2">
                                {section.title}
                            </h3>
                            <div className="bg-gray-50 dark:bg-black rounded-xl overflow-hidden border border-gray-100 dark:border-zinc-800">
                                {section.items.map((item, itemIdx) => (
                                    <div
                                        key={itemIdx}
                                        className={`flex items-center justify-between p-4 ${itemIdx !== section.items.length - 1 ? 'border-b border-gray-100 dark:border-zinc-800' : ''
                                            }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-white dark:bg-zinc-900 rounded-lg border border-gray-100 dark:border-zinc-800">
                                                <item.icon size={18} className="text-gray-700 dark:text-zinc-300" />
                                            </div>
                                            <span className="font-medium text-gray-900 dark:text-white">{item.label}</span>
                                        </div>

                                        {item.type === 'toggle' ? (
                                            <button
                                                onClick={item.onChange}
                                                aria-label={`Toggle ${item.label}`}
                                                className={`w-11 h-6 rounded-full transition-colors relative ${item.value ? 'bg-blue-600' : 'bg-gray-300 dark:bg-zinc-700'
                                                    }`}
                                            >
                                                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${item.value ? 'left-6' : 'left-1'
                                                    }`} />
                                            </button>
                                        ) : (
                                            <ChevronRight size={18} className="text-gray-400" />
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}

                    <button className="w-full p-4 mt-4 flex items-center justify-center gap-2 text-red-500 font-semibold bg-red-50 dark:bg-red-900/10 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-xl transition-colors">
                        <LogOut size={18} />
                        Log Out
                    </button>

                    <p className="text-center text-xs text-gray-400 mt-6">
                        Version 1.0.0 (Build 2024.11)
                    </p>
                </div>
            </div>
        </div>
    );
}
