'use client';

import { useState } from 'react';
import { FeedItem } from './feed-item';
import { FilterBar } from './filter-bar';
import { MOCK_FEED, INDUSTRIES } from '@/lib/mock-data';

export function Feed() {
    const [activeFilter, setActiveFilter] = useState('All');

    const filteredFeed = activeFilter === 'All'
        ? MOCK_FEED
        : MOCK_FEED.filter(item => item.industry === activeFilter);

    return (
        <div className="relative h-screen w-full bg-black overflow-hidden">
            <FilterBar
                filters={INDUSTRIES}
                activeFilter={activeFilter}
                onSelect={setActiveFilter}
            />

            <div className="h-full w-full overflow-y-scroll snap-y snap-mandatory no-scrollbar">
                {filteredFeed.map((item) => (
                    <FeedItem
                        key={item.id}
                        videoSrc={item.videoSrc}
                        poster={item.poster}
                        username={item.username}
                        userAvatar={item.userAvatar}
                        description={item.description}
                        likes={item.likes}
                        comments={item.comments}
                    />
                ))}

                {filteredFeed.length === 0 && (
                    <div className="h-full flex items-center justify-center text-white/50">
                        <p>No videos found in {activeFilter}</p>
                    </div>
                )}
            </div>
        </div>
    );
}
