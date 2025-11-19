'use client';

import { cn } from '@/lib/utils';

interface FilterBarProps {
    filters: string[];
    activeFilter: string;
    onSelect: (filter: string) => void;
}

export function FilterBar({ filters, activeFilter, onSelect }: FilterBarProps) {
    return (
        <div className="fixed top-0 left-0 right-0 z-40 py-4 px-2 overflow-x-auto no-scrollbar bg-gradient-to-b from-black/60 to-transparent">
            <div className="flex gap-2 px-2">
                {filters.map((filter) => (
                    <button
                        key={filter}
                        onClick={() => onSelect(filter)}
                        className={cn(
                            "px-4 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap backdrop-blur-md",
                            activeFilter === filter
                                ? "bg-white text-black"
                                : "bg-black/30 text-white/80 hover:bg-black/50 border border-white/20"
                        )}
                    >
                        {filter}
                    </button>
                ))}
            </div>
        </div>
    );
}
