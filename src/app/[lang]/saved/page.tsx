'use client';

import LikedPage from '../liked/page';

export default function SavedPage() {
    return (
        <>
            <div className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-black border-b border-gray-200 dark:border-gray-800 p-4 text-center font-bold">
                Saved Items
            </div>
            <div className="pt-4">
                <LikedPage />
            </div>
        </>
    );
}
