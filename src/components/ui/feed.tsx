'use client';

import { VideoFeed } from './video-feed';
import { MOCK_FEED } from '@/lib/mock-data';

export function Feed() {
    return <VideoFeed items={MOCK_FEED} showFilter={true} />;
}
