'use client';

import { MessageCircle, Search } from 'lucide-react';

export default function InboxPage() {
    return (
        <div className="min-h-screen bg-white dark:bg-black pt-16 px-4">
            <h1 className="text-2xl font-bold mb-6">Inbox</h1>

            {/* Search */}
            <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                    type="text"
                    placeholder="Search messages..."
                    className="w-full bg-gray-100 dark:bg-gray-900 rounded-lg pl-10 pr-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            {/* Empty State */}
            <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-20 h-20 bg-gray-100 dark:bg-gray-900 rounded-full flex items-center justify-center mb-4">
                    <MessageCircle className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium mb-2">No messages yet</h3>
                <p className="text-gray-500 max-w-xs">
                    Connect with employers or job seekers to start a conversation.
                </p>
            </div>
        </div>
    );
}
