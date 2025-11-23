'use client';

import { Suspense } from 'react';
import { useState, useEffect } from 'react';
import { MessageCircle, Search, User, Trash2 } from 'lucide-react';
import { chatService, Chat } from '@/lib/chat-service';
import { useUserRole } from '@/hooks/use-user-role';
import { ChatView } from '@/components/ui/chat-view';
import { useSearchParams } from 'next/navigation';
import { useToast } from '@/components/ui/toast-context';

function InboxContent() {
    const [chats, setChats] = useState<Chat[]>([]);
    const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<string>('All');
    const [customCategories, setCustomCategories] = useState<string[]>([]);
    const [isAddingCategory, setIsAddingCategory] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState('');
    const { role } = useUserRole();
    const searchParams = useSearchParams();
    const chatIdParam = searchParams.get('chatId');
    const { showToast } = useToast();

    useEffect(() => {
        // In a real app, we'd get the real user ID. 
        // For this mock, we'll fetch 'all' to ensure we see the demo interactions.
        const loadedChats = chatService.getChats('all');
        setChats(loadedChats);

        // Auto-select chat if param exists
        if (chatIdParam) {
            const chatToSelect = loadedChats.find(c => c.id === chatIdParam);
            if (chatToSelect) {
                setSelectedChat(chatToSelect);
            }
        }
    }, [chatIdParam]); // Run when param changes or on mount

    // Derive categories from chats
    const jobCategories = Array.from(new Set(chats.map(c => c.jobTitle).filter(Boolean))) as string[];
    const allCategories = ['All', ...jobCategories, ...customCategories];

    // Filter chats
    const filteredChats = chats.filter(chat => {
        if (selectedCategory === 'All') return true;
        if (jobCategories.includes(selectedCategory)) return chat.jobTitle === selectedCategory;
        // For custom categories, we'd check tags. Currently just showing all for custom to demonstrate UI
        // In a real app: return chat.tags?.includes(selectedCategory);
        return true;
    });

    const handleAddCategory = () => {
        if (newCategoryName.trim()) {
            setCustomCategories([...customCategories, newCategoryName.trim()]);
            setNewCategoryName('');
            setIsAddingCategory(false);
        }
    };

    const handleDeleteChat = (e: React.MouseEvent, chatId: string) => {
        e.stopPropagation();
        if (confirm('Are you sure you want to delete this chat?')) {
            chatService.deleteChat(chatId);
            setChats(prev => prev.filter(c => c.id !== chatId));
            showToast('Chat deleted', 'success');
            if (selectedChat?.id === chatId) {
                setSelectedChat(null);
            }
        }
    };

    if (selectedChat) {
        return (
            <div className="h-[calc(100dvh-8rem)] mt-16 bg-white dark:bg-black">
                <ChatView
                    chat={selectedChat}
                    onBack={() => setSelectedChat(null)}
                    onDelete={(chatId) => {
                        if (confirm('Are you sure you want to delete this chat?')) {
                            chatService.deleteChat(chatId);
                            setChats(prev => prev.filter(c => c.id !== chatId));
                            setSelectedChat(null);
                            showToast('Chat deleted', 'success');
                        }
                    }}
                />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white dark:bg-black pt-16 px-4 pb-24">

            {/* Search */}
            <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                    type="text"
                    placeholder="Search messages..."
                    className="w-full bg-gray-100 dark:bg-zinc-900 rounded-lg pl-10 pr-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            {/* Categories */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar mb-6 -mx-4 px-4 pb-2">
                {allCategories.map(category => (
                    <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors ${selectedCategory === category
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-zinc-700'
                            }`}
                    >
                        {category}
                    </button>
                ))}

                {isAddingCategory ? (
                    <div className="flex items-center gap-2 bg-gray-100 dark:bg-zinc-800 rounded-full px-2 py-1">
                        <input
                            type="text"
                            value={newCategoryName}
                            onChange={(e) => setNewCategoryName(e.target.value)}
                            placeholder="New Category"
                            className="bg-transparent outline-none text-sm w-24 px-2"
                            autoFocus
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') handleAddCategory();
                                if (e.key === 'Escape') setIsAddingCategory(false);
                            }}
                        />
                        <button onClick={handleAddCategory} className="text-blue-600 text-xs font-bold px-2">ADD</button>
                    </div>
                ) : (
                    <button
                        onClick={() => setIsAddingCategory(true)}
                        className="whitespace-nowrap px-3 py-2 rounded-full bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-zinc-700 flex items-center justify-center"
                    >
                        <span className="text-lg leading-none">+</span>
                    </button>
                )}
            </div>

            {/* Chat List */}
            {filteredChats.length > 0 ? (
                <div className="space-y-2">
                    {filteredChats.map((chat) => {
                        const otherParticipantName = role === 'seeker' ? chat.employerName : chat.seekerName;
                        const lastMsg = chat.lastMessage;

                        return (
                            <div
                                key={chat.id}
                                onClick={() => setSelectedChat(chat)}
                                className="group flex items-center gap-4 p-4 bg-gray-50 dark:bg-zinc-900/50 rounded-xl border border-gray-100 dark:border-zinc-800 active:scale-[0.98] transition-transform cursor-pointer relative"
                            >
                                <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-zinc-800 flex items-center justify-center shrink-0">
                                    <User className="w-6 h-6 text-gray-500" />
                                </div>
                                <div className="flex-1 min-w-0 pr-14">
                                    <div className="flex justify-between items-baseline mb-1">
                                        <h3 className="font-semibold truncate">{otherParticipantName}</h3>
                                        {lastMsg && (
                                            <span className="text-xs text-gray-400">
                                                {new Date(lastMsg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                                        {lastMsg ? lastMsg.text : 'No messages yet'}
                                    </p>
                                    {chat.jobTitle && (
                                        <span className="inline-block mt-1 text-[10px] px-2 py-0.5 bg-blue-500/10 text-blue-500 rounded-full">
                                            {chat.jobTitle}
                                        </span>
                                    )}
                                </div>
                                <button
                                    onClick={(e) => handleDeleteChat(e, chat.id)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-full opacity-0 group-hover:opacity-100 transition-all"
                                    title="Delete chat"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        );
                    })}
                </div>
            ) : (
                /* Empty State */
                <div className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="w-20 h-20 bg-gray-100 dark:bg-zinc-900 rounded-full flex items-center justify-center mb-4">
                        <MessageCircle className="w-10 h-10 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium mb-2">No messages found</h3>
                    <p className="text-gray-500 max-w-xs">
                        Try selecting a different category or starting a new conversation.
                    </p>
                </div>
            )}
        </div>
    );
}

export default function InboxPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-white dark:bg-black pt-16 px-4 flex items-center justify-center">Loading...</div>}>
            <InboxContent />
        </Suspense>
    );
}
