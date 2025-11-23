'use client';

import { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';

interface FilterModalProps {
    isOpen: boolean;
    onClose: () => void;
    onApply: (category: string, jobType: string) => void;
    categories?: string[];
    activeCategory?: string;
    activeJobType?: string;
}

export function FilterModal({ isOpen, onClose, onApply, categories = [], activeCategory = 'All', activeJobType = 'All' }: FilterModalProps) {
    const [selectedCategory, setSelectedCategory] = useState(activeCategory);
    const [selectedJobType, setSelectedJobType] = useState(activeJobType);

    // Update selected when props change or modal opens
    useEffect(() => {
        if (isOpen) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setSelectedCategory(activeCategory);
            setSelectedJobType(activeJobType);
        }
    }, [isOpen, activeCategory, activeJobType]);

    if (!isOpen) return null;

    // Default categories if none provided
    const displayCategories = categories.length > 0 ? categories : ['All', 'Technology', 'Design', 'Marketing', 'Sales', 'Engineering'];
    const jobTypes = ['All', 'Full-time', 'Part-time', 'Contract', 'Freelance'];

    return (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in duration-200">
            <div className="bg-zinc-900 w-full max-w-md rounded-t-2xl sm:rounded-2xl overflow-hidden shadow-2xl border border-zinc-800 animate-in slide-in-from-bottom duration-300">

                {/* Header */}
                <div className="p-4 border-b border-zinc-800 flex justify-between items-center">
                    <h3 className="font-bold text-lg text-white">Filter Feed</h3>
                    <button onClick={onClose} aria-label="Close filter modal" className="p-2 hover:bg-zinc-800 rounded-full text-zinc-400 hover:text-white transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">

                    {/* Categories */}
                    <div>
                        <h4 className="text-sm font-medium text-zinc-400 mb-3 uppercase tracking-wider">Category</h4>
                        <div className="flex flex-wrap gap-2">
                            {displayCategories.map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setSelectedCategory(cat)}
                                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedCategory === cat
                                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20'
                                        : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-white'
                                        }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Job Type */}
                    <div>
                        <h4 className="text-sm font-medium text-zinc-400 mb-3 uppercase tracking-wider">Job Type</h4>
                        <div className="flex flex-wrap gap-2">
                            {jobTypes.map((type) => (
                                <button
                                    key={type}
                                    onClick={() => setSelectedJobType(type)}
                                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedJobType === type
                                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20'
                                        : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-white'
                                        }`}
                                >
                                    {type}
                                </button>
                            ))}
                        </div>
                    </div>

                </div>

                {/* Footer */}
                <div className="p-4 border-t border-zinc-800 bg-zinc-900/50">
                    <button
                        onClick={() => {
                            onApply(selectedCategory, selectedJobType);
                            onClose();
                        }}
                        className="w-full py-3.5 bg-white hover:bg-zinc-200 text-black rounded-xl font-bold transition-all active:scale-95 flex items-center justify-center gap-2"
                    >
                        <Check size={18} />
                        Apply Filters
                    </button>
                </div>
            </div>
        </div>
    );
}
