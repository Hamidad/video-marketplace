'use client';

import { useState } from 'react';
import { Video, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { MOCK_FEED } from '@/lib/mock-data';
import { useInteractions } from '@/hooks/use-interactions';
import Image from 'next/image';
import { VideoFeed } from './video-feed';
import { DetailsModal } from './details-modal';
import { useUserRole } from '@/hooks/use-user-role';

interface CollectionViewProps {
    title: string;
}

export function CollectionView({ title }: CollectionViewProps) {
    const [activeTab, setActiveTab] = useState<'videos' | 'users'>('videos');
    const [selectedVideoIndex, setSelectedVideoIndex] = useState<number | null>(null);
    const [selectedUserIndex, setSelectedUserIndex] = useState<number | null>(null);
    const { likedVideoIds, savedVideoIds, likedUserIds, savedUserIds } = useInteractions();
    const { role } = useUserRole();

    const isLikedView = title === 'Liked';

    // Base filter: items that are liked or saved
    const filteredVideos = MOCK_FEED.filter(item =>
        isLikedView ? likedVideoIds.includes(item.id) : savedVideoIds.includes(item.id)
    );

    // Derive unique users from MOCK_FEED based on saved interactions
    const relevantUsernames = isLikedView ? likedUserIds : savedUserIds;
    const filteredUsers = MOCK_FEED
        .filter(item => relevantUsernames.includes(item.username))
        .filter((item, index, self) =>
            index === self.findIndex((t) => t.username === item.username)
        );

    const handleNextUser = () => {
        if (selectedUserIndex !== null && selectedUserIndex < filteredUsers.length - 1) {
            setSelectedUserIndex(selectedUserIndex + 1);
        }
    };

    const handlePrevUser = () => {
        if (selectedUserIndex !== null && selectedUserIndex > 0) {
            setSelectedUserIndex(selectedUserIndex - 1);
        }
    };

    const currentSelectedUser = selectedUserIndex !== null ? filteredUsers[selectedUserIndex] : null;

    if (selectedVideoIndex !== null) {
        return (
            <div className="fixed inset-0 z-40 bg-black">
                <VideoFeed
                    items={filteredVideos}
                    initialIndex={selectedVideoIndex}
                    onClose={() => setSelectedVideoIndex(null)}
                />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white dark:bg-black pt-20 px-4 pb-24">
            {/* Tabs */}
            <div className="flex mb-6 border-b border-gray-100 dark:border-zinc-800">
                <button
                    onClick={() => setActiveTab('videos')}
                    className={cn(
                        "flex-1 pb-3 text-sm font-medium transition-colors relative",
                        activeTab === 'videos'
                            ? "text-black dark:text-white"
                            : "text-gray-400 hover:text-gray-600"
                    )}
                >
                    Videos ({filteredVideos.length})
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
                            : "text-gray-400 hover:text-gray-600"
                    )}
                >
                    Users ({filteredUsers.length})
                    {activeTab === 'users' && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black dark:bg-white" />
                    )}
                </button>
            </div>

            {/* Content */}
            <div className="grid grid-cols-2 gap-4">
                {activeTab === 'videos' ? (
                    filteredVideos.length > 0 ? (
                        filteredVideos.map((item, index) => (
                            <div
                                key={item.id}
                                onClick={() => setSelectedVideoIndex(index)}
                                className="aspect-[9/16] bg-gray-100 dark:bg-zinc-900 rounded-xl relative overflow-hidden group cursor-pointer"
                            >
                                <Image
                                    src={item.poster}
                                    alt={item.description}
                                    fill
                                    className="object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                <div className="absolute bottom-3 left-3 right-3">
                                    <p className="text-xs text-white font-medium truncate drop-shadow-md">{item.jobDetails.title}</p>
                                    <p className="text-[10px] text-white/80">@{item.username}</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-2 py-12 text-center text-gray-500">
                            <Video className="w-12 h-12 mx-auto mb-3 opacity-20" />
                            <p>No {isLikedView ? 'liked' : 'saved'} videos yet.</p>
                        </div>
                    )
                ) : (
                    filteredUsers.length > 0 ? (
                        filteredUsers.map((item, index) => (
                            <div key={item.username} className="aspect-square bg-gray-50 dark:bg-zinc-900 rounded-xl flex flex-col items-center justify-center gap-3 p-4 border border-gray-100 dark:border-zinc-800">
                                <div className="w-14 h-14 rounded-full bg-gray-200 dark:bg-zinc-800 flex items-center justify-center overflow-hidden relative">
                                    <Image src={item.userAvatar} alt={item.username} fill className="object-cover" />
                                </div>
                                <div className="text-center w-full">
                                    <p className="text-sm font-bold text-gray-900 dark:text-white truncate">@{item.username}</p>
                                    <p className="text-xs text-gray-500 truncate">{item.jobDetails.title}</p>
                                </div>
                                <button
                                    onClick={() => setSelectedUserIndex(index)}
                                    className="w-full py-1.5 text-xs font-semibold bg-black dark:bg-white text-white dark:text-black rounded-lg hover:opacity-90 transition-opacity"
                                >
                                    View Profile
                                </button>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-2 py-12 text-center text-gray-500">
                            <User className="w-12 h-12 mx-auto mb-3 opacity-20" />
                            <p>No {isLikedView ? 'liked' : 'saved'} users yet.</p>
                        </div>
                    )
                )}
            </div>

            {currentSelectedUser && (
                <DetailsModal
                    isOpen={!!currentSelectedUser}
                    onClose={() => setSelectedUserIndex(null)}
                    username={currentSelectedUser.username}
                    name={currentSelectedUser.name}
                    tags={currentSelectedUser.tags}
                    userRole={role}
                    resumeDetails={currentSelectedUser.resumeDetails}
                    jobDetails={currentSelectedUser.jobDetails}
                    onNext={handleNextUser}
                    onPrev={handlePrevUser}
                    hasNext={selectedUserIndex !== null && selectedUserIndex < filteredUsers.length - 1}
                    hasPrev={selectedUserIndex !== null && selectedUserIndex > 0}
                />
            )}
        </div>
    );
}
