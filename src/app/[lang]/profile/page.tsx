'use client';

import { useState } from 'react';
import { Settings, Share2, Upload, Video, Crown } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { useUserRole } from '@/hooks/use-user-role';
import { EditProfileModal } from '@/components/profile/edit-profile-modal';
import { SettingsModal } from '@/components/profile/settings-modal';
import { UploadModal } from '@/components/profile/upload-modal';
import { SubscriptionModal } from '@/components/profile/subscription-modal';

export default function ProfilePage() {
    const { role, setUserRole } = useUserRole();
    const [activeTab, setActiveTab] = useState<'about' | 'uploads'>('about');
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [uploadedVideos, setUploadedVideos] = useState<any[]>([]);

    const [profileData, setProfileData] = useState({
        name: 'John Doe',
        title: 'Software Engineer',
        bio: 'Passionate about building great user experiences. Open to new opportunities and excited to connect with talented professionals.',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix'
    });

    const toggleRole = () => {
        setUserRole(role === 'employer' ? 'seeker' : 'employer');
    };

    return (
        <div className="min-h-screen bg-white dark:bg-black pb-24">
            {/* Header */}
            <div className="h-40 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 relative">
                <div className="absolute top-20 right-4 flex gap-3">
                    <button
                        aria-label="Share profile"
                        onClick={() => {
                            if (navigator.share) {
                                navigator.share({
                                    title: `${profileData.name} Profile`,
                                    url: window.location.href
                                }).catch(console.error);
                            } else {
                                alert('Share not supported');
                            }
                        }}
                        className="p-2.5 bg-black/30 hover:bg-black/40 rounded-full text-white backdrop-blur-md transition-colors active:scale-95"
                    >
                        <Share2 size={20} />
                    </button>
                    <button
                        aria-label="Settings"
                        onClick={() => setIsSettingsModalOpen(true)}
                        className="p-2.5 bg-black/30 hover:bg-black/40 rounded-full text-white backdrop-blur-md transition-colors active:scale-95"
                    >
                        <Settings size={20} />
                    </button>
                </div>
            </div>

            {/* Profile Info */}
            <div className="px-6 -mt-16">
                <div className="w-28 h-28 rounded-full border-4 border-white dark:border-black bg-gray-200 overflow-hidden relative shadow-xl">
                    <Image
                        src={profileData.avatar}
                        alt="Profile"
                        fill
                        className="object-cover"
                    />
                </div>

                <div className="mt-4">
                    <div className="flex items-center gap-2">
                        <h1 className="text-2xl font-bold">{profileData.name}</h1>
                        <button
                            onClick={toggleRole}
                            className={cn(
                                "text-xs px-2 py-1 rounded-full font-semibold transition-colors",
                                role === 'employer'
                                    ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                                    : "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400"
                            )}
                        >
                            {role === 'employer' ? 'Employer' : 'Job Seeker'}
                        </button>
                    </div>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{profileData.title}</p>
                    <p className="mt-3 text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                        {profileData.bio}
                    </p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 mt-6">
                    <button
                        onClick={() => setIsEditModalOpen(true)}
                        className="flex-1 py-2.5 bg-black dark:bg-white text-white dark:text-black rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity active:scale-95"
                    >
                        Edit Profile
                    </button>
                    <button
                        onClick={() => setIsSubscriptionModalOpen(true)}
                        className="flex-1 py-2.5 bg-gradient-to-r from-yellow-500 to-amber-600 text-white rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity active:scale-95 flex items-center justify-center gap-2 shadow-lg shadow-yellow-500/20"
                    >
                        <Crown size={18} className="fill-white" />
                        Subscription
                    </button>
                </div>

                {/* Tabs */}
                {role === 'employer' && (
                    <div className="flex mt-8 border-b border-gray-200 dark:border-zinc-800">
                        <button
                            onClick={() => setActiveTab('about')}
                            className={cn(
                                "flex-1 pb-3 text-sm font-medium transition-colors relative",
                                activeTab === 'about'
                                    ? "text-black dark:text-white"
                                    : "text-gray-400 hover:text-gray-600"
                            )}
                        >
                            About
                            {activeTab === 'about' && (
                                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black dark:bg-white" />
                            )}
                        </button>
                        <button
                            onClick={() => setActiveTab('uploads')}
                            className={cn(
                                "flex-1 pb-3 text-sm font-medium transition-colors relative flex items-center justify-center gap-2",
                                activeTab === 'uploads'
                                    ? "text-black dark:text-white"
                                    : "text-gray-400 hover:text-gray-600"
                            )}
                        >
                            <Upload size={16} />
                            Uploads
                            {activeTab === 'uploads' && (
                                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black dark:bg-white" />
                            )}
                        </button>
                    </div>
                )}

                {/* Content */}
                <div className="mt-6">
                    {role === 'employer' && activeTab === 'uploads' ? (
                        <div className="space-y-4">
                            <button
                                onClick={() => setIsUploadModalOpen(true)}
                                className="w-full py-3 border-2 border-dashed border-gray-300 dark:border-zinc-700 rounded-xl flex items-center justify-center gap-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-400 dark:hover:border-zinc-600 transition-colors"
                            >
                                <Upload size={20} />
                                <span className="font-medium">Upload New Video</span>
                            </button>

                            <div className="grid grid-cols-2 gap-4">
                                {uploadedVideos.map((video) => (
                                    <div key={video.id} className="aspect-[9/16] bg-gray-100 dark:bg-zinc-900 rounded-xl relative overflow-hidden group">
                                        <div className="absolute inset-0 flex items-center justify-center text-gray-300">
                                            <Video size={32} />
                                        </div>
                                        {video.previewUrl && (
                                            <video src={video.previewUrl} className="absolute inset-0 w-full h-full object-cover" />
                                        )}
                                        <div className="absolute bottom-3 left-3 right-3">
                                            <p className="text-xs text-white font-medium truncate drop-shadow-md">
                                                New Upload
                                            </p>
                                            <p className="text-xs text-white/70">Just now</p>
                                        </div>
                                    </div>
                                ))}
                                {Array.from({ length: 4 }).map((_, i) => (
                                    <div key={i} className="aspect-[9/16] bg-gray-100 dark:bg-zinc-900 rounded-xl relative overflow-hidden group">
                                        <div className="absolute inset-0 flex items-center justify-center text-gray-300">
                                            <Video size={32} />
                                        </div>
                                        <div className="absolute bottom-3 left-3 right-3">
                                            <p className="text-xs text-white font-medium truncate drop-shadow-md">
                                                Job Posting {i + 1}
                                            </p>
                                            <p className="text-xs text-white/70">2 days ago</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Contact</h3>
                                <div className="space-y-2 text-sm">
                                    <p className="text-gray-700 dark:text-gray-300">📧 john.doe@example.com</p>
                                    <p className="text-gray-700 dark:text-gray-300">📍 San Francisco, CA</p>
                                </div>
                            </div>
                            <div>
                                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Skills</h3>
                                <div className="flex flex-wrap gap-2">
                                    {['React', 'TypeScript', 'Next.js', 'Node.js', 'Design'].map(skill => (
                                        <span key={skill} className="px-3 py-1.5 bg-gray-100 dark:bg-zinc-900 text-gray-700 dark:text-gray-300 rounded-lg text-xs font-medium">
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <EditProfileModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                initialData={profileData}
                onSave={setProfileData}
            />

            <SettingsModal
                isOpen={isSettingsModalOpen}
                onClose={() => setIsSettingsModalOpen(false)}
            />

            <UploadModal
                isOpen={isUploadModalOpen}
                onClose={() => setIsUploadModalOpen(false)}
                onUploadSuccess={(video) => {
                    setUploadedVideos(prev => [video, ...prev]);
                }}
            />

            <SubscriptionModal
                isOpen={isSubscriptionModalOpen}
                onClose={() => setIsSubscriptionModalOpen(false)}
                userRole={role}
            />
        </div>
    );
}
