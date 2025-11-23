'use client';

import { useEffect, useRef } from 'react';
import { FeedItem } from './feed-item';
import { FilterModal } from './filter-modal';
import { ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import { INDUSTRIES } from '@/lib/mock-data';
import { DetailsModal } from './details-modal';
import { useUserRole } from '@/hooks/use-user-role';

interface VideoFeedProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    items: any[];
    initialIndex?: number;
    onClose?: () => void;
    showFilter?: boolean;
}

export function VideoFeed({ items, initialIndex = 0, onClose, showFilter = false }: VideoFeedProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [showFilterModal, setShowFilterModal] = useState(false);
    const [activeCategory, setActiveCategory] = useState('All');
    const [activeJobType, setActiveJobType] = useState('All');
    const [detailsModalIndex, setDetailsModalIndex] = useState<number | null>(null);
    const { role } = useUserRole();

    useEffect(() => {
        if (containerRef.current && initialIndex > 0) {
            const itemHeight = containerRef.current.clientHeight;
            containerRef.current.scrollTop = initialIndex * itemHeight;
        }
    }, [initialIndex]);

    const filteredItems = items.filter(item => {
        if (!showFilter) return true;
        const categoryMatch = activeCategory === 'All' || item.industry === activeCategory;
        const jobTypeMatch = activeJobType === 'All' || item.jobType === activeJobType;
        return categoryMatch && jobTypeMatch;
    });

    const handleNextDetails = () => {
        if (detailsModalIndex !== null && detailsModalIndex < filteredItems.length - 1) {
            setDetailsModalIndex(detailsModalIndex + 1);
        }
    };

    const handlePrevDetails = () => {
        if (detailsModalIndex !== null && detailsModalIndex > 0) {
            setDetailsModalIndex(detailsModalIndex - 1);
        }
    };

    const currentDetailsItem = detailsModalIndex !== null ? filteredItems[detailsModalIndex] : null;

    return (
        <div className="relative h-[calc(100dvh-8rem)] mt-16 w-full bg-black overflow-hidden">
            {showFilter && (
                <FilterModal
                    isOpen={showFilterModal}
                    onClose={() => setShowFilterModal(false)}
                    onApply={(category, jobType) => {
                        setActiveCategory(category);
                        setActiveJobType(jobType);
                    }}
                    categories={INDUSTRIES}
                    activeCategory={activeCategory}
                    activeJobType={activeJobType}
                />
            )}

            {onClose && (
                <button
                    onClick={onClose}
                    aria-label="Go back"
                    className="absolute top-6 left-4 z-50 p-2 rounded-full bg-black/50 text-white backdrop-blur-md hover:bg-black/70 transition-colors"
                >
                    <ArrowLeft size={24} />
                </button>
            )}

            <div
                ref={containerRef}
                className="h-full w-full overflow-y-scroll snap-y snap-mandatory scroll-smooth no-scrollbar overscroll-y-none"
            >
                {filteredItems.map((item, index) => (
                    <FeedItem
                        key={item.id}
                        {...item}
                        resumeDetails={item.resumeDetails}
                        jobDetails={item.jobDetails}
                        onFilterClick={showFilter ? () => setShowFilterModal(true) : undefined}
                        onShowDetails={() => setDetailsModalIndex(index)}
                    />
                ))}

                {filteredItems.length === 0 && (
                    <div className="h-full flex items-center justify-center text-white/50">
                        <p>No videos found</p>
                    </div>
                )}
            </div>

            {currentDetailsItem && (
                <DetailsModal
                    isOpen={!!currentDetailsItem}
                    onClose={() => setDetailsModalIndex(null)}
                    username={currentDetailsItem.username}
                    name={currentDetailsItem.name}
                    tags={currentDetailsItem.tags}
                    userRole={role}
                    resumeDetails={currentDetailsItem.resumeDetails}
                    jobDetails={currentDetailsItem.jobDetails}
                    onNext={handleNextDetails}
                    onPrev={handlePrevDetails}
                    hasNext={detailsModalIndex !== null && detailsModalIndex < filteredItems.length - 1}
                    hasPrev={detailsModalIndex !== null && detailsModalIndex > 0}
                />
            )}
        </div>
    );
}
