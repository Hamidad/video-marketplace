'use client';
import { VideoPlayer } from './video-player';
import { Heart, Share2, Bookmark, Info, SlidersHorizontal } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { useUserRole } from '@/hooks/use-user-role';
import { useInteractions } from '@/hooks/use-interactions';
import { useToast } from './toast-context';
import { unlockService } from '@/lib/unlock-service';

import { useAuth } from '@/hooks/use-auth';

interface FeedItemProps {
    id?: string;
    videoSrc: string;
    poster?: string;
    username: string;
    name?: string;
    userAvatar: string;
    description: string;
    tags?: string[];
    resumeDetails?: Record<string, unknown>;
    jobDetails?: Record<string, unknown>;
    onFilterClick?: () => void;
    onShowDetails?: () => void;
}

export function FeedItem({ id = '1', videoSrc, poster, username, name, userAvatar, description, tags = ['React', 'Next.js', 'Frontend'], resumeDetails, onFilterClick, onShowDetails }: FeedItemProps) {
    const { role } = useUserRole();
    const { isVideoLiked, isVideoSaved, toggleLikeVideo, toggleSaveVideo } = useInteractions();
    const { showToast } = useToast();
    const { isAuthenticated } = useAuth();

    const isLiked = isVideoLiked(id);
    const isSaved = isVideoSaved(id);
    const isUnlocked = unlockService.isUnlocked(username);

    // Determine display name
    const getDisplayName = () => {
        // If job seeker (has resumeDetails) and not unlocked
        // And user is employer OR not authenticated (signed out)
        if (resumeDetails && !isUnlocked && (role === 'employer' || !isAuthenticated)) {
            return name ? name.split(' ')[0] : username;
        }
        // Otherwise show full name or username
        return name || username;
    };

    const displayName = getDisplayName();

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: `Check out ${displayName}'s profile`,
                text: description,
                url: window.location.href,
            }).catch(console.error);
        } else {
            // Fallback
            navigator.clipboard.writeText(window.location.href);
            showToast('Link copied to clipboard!', 'success');
        }
    };

    return (
        <div className="relative w-full h-full snap-start snap-always">
            <VideoPlayer src={videoSrc} poster={poster} autoPlay className="h-full object-cover" />

            {/* Overlay Info */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/90 pointer-events-none" />

            <div className="absolute bottom-0 left-0 right-0 p-4 pb-4 pt-32 bg-gradient-to-t from-black via-black/60 to-transparent">
                <div className="flex items-end justify-between">
                    <div className="flex-1 mr-12">
                        <div className="flex items-center gap-2 mb-3">
                            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white relative">
                                <Image src={userAvatar} alt={displayName} fill className="object-cover" />
                            </div>
                            <div>
                                <span className="text-white font-bold text-lg block leading-tight">@{displayName}</span>
                                <button
                                    onClick={onShowDetails}
                                    className="mt-1 bg-white/20 hover:bg-white/30 backdrop-blur-md text-white text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1 transition-all active:scale-95"
                                >
                                    <Info size={12} />
                                    Details
                                </button>
                            </div>
                        </div>

                        <div className="transition-all duration-300">
                            <p className="text-white/90 text-sm line-clamp-2 mb-2">{description}</p>
                            <div className="flex flex-wrap gap-2">
                                {tags.map(tag => (
                                    <span key={tag} className="text-xs bg-black/40 backdrop-blur-sm px-2 py-1 rounded text-zinc-300">
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Action Bar */}
            <div className="absolute bottom-4 right-2 flex flex-col gap-6 items-center">
                {/* Share */}
                <button
                    aria-label="Share video"
                    onClick={handleShare}
                    className="flex flex-col items-center gap-1 group active:scale-95 transition-transform"
                >
                    <div className="p-2 rounded-full bg-black/40 backdrop-blur-sm group-active:scale-90 transition-transform">
                        <Share2 className="w-7 h-7 text-white" />
                    </div>
                    <span className="text-white text-xs font-medium shadow-black drop-shadow-md">Share</span>
                </button>

                {/* Like */}
                <button
                    onClick={() => {
                        toggleLikeVideo(id);
                        if (!isLiked) showToast('Liked video', 'success');
                    }}
                    className="flex flex-col items-center gap-1 group active:scale-95 transition-transform"
                >
                    <div className="p-2 rounded-full bg-black/40 backdrop-blur-sm group-active:scale-90 transition-transform">
                        <Heart className={cn("w-7 h-7 transition-colors", isLiked ? "fill-red-500 text-red-500" : "text-white")} />
                    </div>
                    <span className="text-white text-xs font-medium shadow-black drop-shadow-md">Like</span>
                </button>

                {/* Save */}
                <button
                    onClick={() => {
                        toggleSaveVideo(id);
                        if (!isSaved) showToast('Saved to collection', 'success');
                    }}
                    className="flex flex-col items-center gap-1 group active:scale-95 transition-transform"
                >
                    <div className="p-2 rounded-full bg-black/40 backdrop-blur-sm group-active:scale-90 transition-transform">
                        <Bookmark className={cn("w-7 h-7 transition-colors", isSaved ? "fill-yellow-500 text-yellow-500" : "text-white")} />
                    </div>
                    <span className="text-white text-xs font-medium shadow-black drop-shadow-md">Save</span>
                </button>

                {/* Filter */}
                <button
                    onClick={onFilterClick}
                    className="flex flex-col items-center gap-1 group active:scale-95 transition-transform"
                >
                    <div className="p-2 rounded-full bg-black/40 backdrop-blur-sm group-active:scale-90 transition-transform">
                        <SlidersHorizontal className="w-7 h-7 text-white" />
                    </div>
                    <span className="text-white text-xs font-medium shadow-black drop-shadow-md">Filter</span>
                </button>
            </div>
        </div>
    );
}
