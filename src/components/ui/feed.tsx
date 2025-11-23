'use client';

import { useEffect, useState } from 'react';
import { VideoFeed } from './video-feed';
import { videoService, Video } from '@/lib/video-service';
import { Loader2 } from 'lucide-react';

export function Feed() {
    const [videos, setVideos] = useState<Video[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadVideos = async () => {
            try {
                const data = await videoService.getVideos();
                setVideos(data);
            } catch (error) {
                console.error('Failed to load videos:', error);
            } finally {
                setLoading(false);
            }
        };

        loadVideos();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-black text-white">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            </div>
        );
    }

    return <VideoFeed items={videos} showFilter={true} />;
}
