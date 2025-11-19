'use client';

import { Settings, Share2 } from 'lucide-react';

import Image from 'next/image';

export default function ProfilePage() {
    return (
        <div className="min-h-screen bg-white dark:bg-black pb-20">
            {/* Header */}
            <div className="h-32 bg-gradient-to-r from-blue-500 to-purple-600 relative">
                <div className="absolute top-4 right-4 flex gap-4">
                    <button className="p-2 bg-black/20 rounded-full text-white backdrop-blur-sm">
                        <Share2 size={20} />
                    </button>
                    <button className="p-2 bg-black/20 rounded-full text-white backdrop-blur-sm">
                        <Settings size={20} />
                    </button>
                </div>
            </div>

            {/* Profile Info */}
            <div className="px-4 -mt-12">
                <div className="w-24 h-24 rounded-full border-4 border-white dark:border-black bg-gray-200 overflow-hidden relative">
                    <Image src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="Profile" fill className="object-cover" />
                </div>

                <div className="mt-4">
                    <h1 className="text-2xl font-bold">John Doe</h1>
                    <p className="text-gray-500">Software Engineer</p>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                        Passionate about building great user experiences. Open to new opportunities.
                    </p>
                </div>

                {/* Stats */}
                <div className="flex gap-6 mt-6 border-b border-gray-200 dark:border-gray-800 pb-6">
                    <div className="text-center">
                        <span className="block font-bold text-lg">124</span>
                        <span className="text-xs text-gray-500">Following</span>
                    </div>
                    <div className="text-center">
                        <span className="block font-bold text-lg">8.5k</span>
                        <span className="text-xs text-gray-500">Followers</span>
                    </div>
                    <div className="text-center">
                        <span className="block font-bold text-lg">1.2k</span>
                        <span className="text-xs text-gray-500">Likes</span>
                    </div>
                </div>

                {/* Content Tabs */}
                <div className="mt-6">
                    <div className="grid grid-cols-3 gap-1">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} className="aspect-[3/4] bg-gray-100 dark:bg-gray-900" />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
