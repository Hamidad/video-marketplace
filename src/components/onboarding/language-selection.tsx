'use client';

import { Globe } from 'lucide-react';

interface LanguageSelectionProps {
    onSelect: (lang: string) => void;
}

export function LanguageSelection({ onSelect }: LanguageSelectionProps) {
    const languages = [
        { code: 'en', name: 'English', native: 'English' },
        { code: 'es', name: 'Spanish', native: 'Español' },
        { code: 'fr', name: 'French', native: 'Français' },
        { code: 'de', name: 'German', native: 'Deutsch' },
        { code: 'zh', name: 'Chinese', native: '中文' },
    ];

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-6 animate-in fade-in duration-500">
            <div className="w-full max-w-md">
                <div className="text-center mb-12">
                    <div className="w-20 h-20 bg-zinc-900 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-900/20">
                        <Globe className="w-10 h-10 text-blue-500" />
                    </div>
                    <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
                        Select Language
                    </h1>
                    <p className="text-zinc-400">Choose your preferred language to continue</p>
                </div>

                <div className="space-y-3">
                    {languages.map((lang) => (
                        <button
                            key={lang.code}
                            onClick={() => onSelect(lang.code)}
                            className="w-full p-4 bg-zinc-900/50 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 rounded-xl flex items-center justify-between transition-all active:scale-98 group"
                        >
                            <div className="flex flex-col items-start">
                                <span className="font-medium text-zinc-200 group-hover:text-white transition-colors">
                                    {lang.native}
                                </span>
                                <span className="text-xs text-zinc-500">{lang.name}</span>
                            </div>
                            <div className="w-4 h-4 rounded-full border-2 border-zinc-700 group-hover:border-blue-500 transition-colors" />
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
