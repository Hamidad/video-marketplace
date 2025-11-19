'use client';

import { useState } from 'react';
import { VideoPlayer } from './video-player';
import { Heart, MessageCircle, Share2, Bookmark, Lock, Unlock } from 'lucide-react';
import Image from 'next/image';
import { unlockService } from '@/lib/unlock-service';
import { PaymentModal } from './payment-modal';
import { cn } from '@/lib/utils';

interface FeedItemProps {
    videoSrc: string;
    poster?: string;
    username: string;
    userAvatar: string;
    description: string;
    likes: number;
    comments: number;
}

export function FeedItem({ videoSrc, poster, username, userAvatar, description, likes, comments }: FeedItemProps) {
    const [isUnlocked, setIsUnlocked] = useState(false);
    const [showPaymentModal, setShowPaymentModal] = useState(false);

    const handleUnlockClick = () => {
        if (!isUnlocked) {
            setShowPaymentModal(true);
        }
    };

    return (
        <div className="relative w-full h-[calc(100vh-4rem)] snap-start">
            <VideoPlayer src={videoSrc} poster={poster} autoPlay className="h-full" />

            {/* Overlay Info */}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 via-black/50 to-transparent pt-32 pb-24">
                <div className="flex items-end justify-between">
                    <div className="flex-1 mr-12">
                        <div className="flex items-center gap-2 mb-3">
                            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white relative">
                                <Image src={userAvatar} alt={username} fill className="object-cover" />
                            </div>
                            <div>
                                <span className="text-white font-bold text-lg block leading-tight">@{username}</span>
                                {isUnlocked ? (
                                    <span className="text-green-400 text-xs flex items-center gap-1">
                                        <Unlock size={10} /> Unlocked
                                    </span>
                                ) : (
                                    <button
                                        onClick={handleUnlockClick}
                                        className="text-yellow-400 text-xs flex items-center gap-1 hover:underline"
                                    >
                                        <Lock size={10} /> Unlock Profile
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className={cn("transition-all duration-300", !isUnlocked && "blur-sm select-none")}>
                            <p className="text-white/90 text-sm line-clamp-2">{description}</p>
                            <div className="mt-2 flex gap-2">
                                <span className="text-xs bg-white/20 px-2 py-1 rounded text-white">Resume.pdf</span>
                                <span className="text-xs bg-white/20 px-2 py-1 rounded text-white">contact@email.com</span>
                            </div>
                        </div>

                        {!isUnlocked && (
                            <div className="absolute bottom-28 left-4 right-16">
                                <button
                                    onClick={handleUnlockClick}
                                    className="bg-blue-600 text-white text-sm font-bold px-4 py-2 rounded-full shadow-lg animate-pulse"
                                >
                                    Unlock to View Details
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Right Action Bar */}
            <div className="absolute bottom-24 right-2 flex flex-col gap-6 items-center">
                <ActionBtn icon={Heart} label={likes.toString()} />
                <ActionBtn icon={MessageCircle} label={comments.toString()} />
                <ActionBtn icon={Bookmark} label="Save" />
                <ActionBtn icon={Share2} label="Share" />
            </div>

            {showPaymentModal && (
                <PaymentModal
                    seekerId={username}
                    seekerName={username}
                    price={4.99}
                    onClose={() => setShowPaymentModal(false)}
                    onSuccess={() => setIsUnlocked(true)}
                />
            )}
        </div>
    );
}

function ActionBtn({ icon: Icon, label }: { icon: React.ElementType, label: string }) {
    return (
        <button className="flex flex-col items-center gap-1 group">
            <div className="p-2 rounded-full bg-black/40 backdrop-blur-sm group-active:scale-90 transition-transform">
                <Icon className="w-7 h-7 text-white" />
            </div>
            <span className="text-white text-xs font-medium shadow-black drop-shadow-md">{label}</span>
        </button>
    );
}
