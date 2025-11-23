'use client';

import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Trash2, User, Send } from 'lucide-react';
import { chatService, Chat } from '@/lib/chat-service';
import { useUserRole } from '@/hooks/use-user-role';

interface ChatViewProps {
    chat: Chat;
    onBack: () => void;
    onDelete?: (chatId: string) => void;
}

export function ChatView({ chat: initialChat, onBack, onDelete }: ChatViewProps) {
    const [chat, setChat] = useState<Chat>(initialChat);
    const [newMessage, setNewMessage] = useState('');
    const { role } = useUserRole();
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Determine current user ID (mock)
    const currentUserId = role === 'seeker' ? 'current_seeker_id' : 'current_employer_id'; // This needs to match what we used in ApplyButton
    // Note: In ApplyButton we used 'current_seeker_id'. 
    // If we are the employer, we need to know who we are.
    // For this mock, let's assume if we are viewing the chat, we are one of the participants.
    // We'll use a simple heuristic: if the message sender is NOT the other person, it's us.

    const otherParticipantName = role === 'seeker' ? chat.employerName : chat.seekerName;

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [chat.messages]);

    const handleSendMessage = () => {
        if (!newMessage.trim()) return;

        const sentMsg = chatService.sendMessage(chat.id, currentUserId, newMessage);
        if (sentMsg) {
            // Update local state to show message immediately
            setChat(prev => ({
                ...prev,
                messages: [...prev.messages, sentMsg],
                lastMessage: sentMsg,
                updatedAt: Date.now()
            }));
            setNewMessage('');
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    return (
        <div className="flex flex-col h-full bg-white dark:bg-black">
            {/* Header */}
            <div className="flex items-center gap-3 p-4 border-b border-gray-100 dark:border-zinc-800">
                <button
                    onClick={onBack}
                    aria-label="Back to inbox"
                    className="p-2 -ml-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full transition-colors"
                >
                    <ArrowLeft size={20} />
                </button>

                <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-zinc-800 flex items-center justify-center">
                    <User className="w-5 h-5 text-gray-500" />
                </div>

                <div className="flex-1">
                    <h3 className="font-bold text-lg leading-tight">{otherParticipantName}</h3>
                    <p className="text-xs text-green-500 font-medium">Online</p>
                </div>

                {onDelete && (
                    <button
                        onClick={() => onDelete(chat.id)}
                        className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-400 hover:text-red-500 rounded-full transition-colors"
                        title="Delete chat"
                    >
                        <Trash2 size={20} />
                    </button>
                )}
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {chat.messages.map((msg) => {
                    // Check if message is from current user
                    // For the mock, we used 'current_seeker_id' in ApplyButton.
                    // If we are the seeker, messages from 'current_seeker_id' are ours.
                    const isMe = msg.senderId === currentUserId;

                    return (
                        <div
                            key={msg.id}
                            className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                        >
                            <div
                                className={`max-w-[80%] p-3 rounded-2xl ${isMe
                                    ? 'bg-blue-600 text-white rounded-tr-none'
                                    : 'bg-gray-100 dark:bg-zinc-800 text-gray-900 dark:text-gray-100 rounded-tl-none'
                                    }`}
                            >
                                <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                                <span className={`text-[10px] mt-1 block opacity-70 ${isMe ? 'text-blue-100' : 'text-gray-500'}`}>
                                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-gray-100 dark:border-zinc-800 bg-white dark:bg-black">
                <div className="flex items-end gap-2 bg-gray-50 dark:bg-zinc-900 p-2 rounded-xl border border-gray-200 dark:border-zinc-800 focus-within:ring-2 focus-within:ring-blue-500 transition-all">
                    <textarea
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Type a message..."
                        className="flex-1 bg-transparent border-none outline-none resize-none max-h-32 min-h-[40px] py-2 px-2 text-sm h-auto"
                        rows={1}
                    />
                    <button
                        onClick={handleSendMessage}
                        aria-label="Send message"
                        disabled={!newMessage.trim()}
                        className="p-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:hover:bg-blue-600 text-white rounded-lg transition-colors mb-0.5"
                    >
                        <Send size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
}
