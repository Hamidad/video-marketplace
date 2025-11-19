'use client';

import { useState } from 'react';
import { Folder, Video, User } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function LikedPage() {
    const [activeTab, setActiveTab] = useState<'videos' | 'users'>('videos');

    return (
        <div className="min-h-screen bg-white dark:bg-black pt-16 px-4">
            <h1 className="text-2xl font-bold mb-6">Liked & Saved</h1>

            {/* Tabs */}
            <div className="flex mb-6 border-b border-gray-200 dark:border-gray-800">
                <button
                    onClick={() => setActiveTab('videos')}
                    className={cn(
                        "flex-1 pb-3 text-sm font-medium transition-colors relative",
                        activeTab === 'videos'
                            ? "text-black dark:text-white"
                            : "text-gray-500 hover:text-gray-700"
                    )}
                >
                    Videos
                    {activeTab === 'videos' && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black dark:bg-white" />
                    )}
                </button>
                <button
                    onClick={() => setActiveTab('users')}
                    className={cn(
                        "flex-1 pb-3 text-sm font-medium transition-colors relative",
                        activeTab === 'users'
                            ? "text-black dark:text-white"
                            : "text-gray-500 hover:text-gray-700"
                    )}
                >
                    Users
                    {activeTab === 'users' && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black dark:bg-white" />
                    )}
                </button>
            </div>

            {/* Content */}
            <div className="grid grid-cols-2 gap-4">
                {activeTab === 'videos' ? (
                    // Mock Video Grid
                    Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="aspect-[9/16] bg-gray-100 dark:bg-gray-900 rounded-lg relative overflow-hidden group">
                            <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                                <Video size={24} />
                            </div>
                            <div className="absolute bottom-2 left-2 right-2">
                                <p className="text-xs text-white font-medium truncate">Video Title {i + 1}</p>
                            </div>
                        </div>
                    ))
                ) : (
                    // Mock User Grid
                    Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="aspect-square bg-gray-100 dark:bg-gray-900 rounded-lg flex flex-col items-center justify-center gap-2 p-4">
                            <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
                                <User size={32} className="text-gray-400" />
                            </div>
                            <p className="text-sm font-medium text-center">User {i + 1}</p>
                            <button className="text-xs bg-black dark:bg-white text-white dark:text-black px-3 py-1 rounded-full">
                                Follow
                            </button>
                        </div>
                    ))
                )}
            </div>

            {/* Folders Section */}
            <div className="mt-8">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold">Folders</h2>
                    <button className="text-sm text-blue-600 dark:text-blue-400">Create New</button>
                </div>
                <div className="flex gap-4 overflow-x-auto pb-4">
                    {['Inspiration', 'To Watch', 'Candidates'].map((folder) => (
                        <div key={folder} className="flex-shrink-0 w-32">
                            <div className="aspect-square bg-gray-100 dark:bg-gray-900 rounded-xl flex items-center justify-center mb-2">
                                <Folder size={32} className="text-gray-400" />
                            </div>
                            <p className="text-sm font-medium text-center truncate">{folder}</p>
                            <p className="text-xs text-gray-500 text-center">12 items</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
