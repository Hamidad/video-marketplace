
export interface Message {
    id: string;
    senderId: string;
    text: string;
    timestamp: number;
    isSystem?: boolean;
}

export interface Chat {
    id: string;
    participants: string[]; // [employerId, seekerId]
    messages: Message[];
    lastMessage?: Message;
    updatedAt: number;
    employerName: string;
    seekerName: string;
    jobTitle?: string;
    tags?: string[];
}

// Mock storage key
const STORAGE_KEY = 'ag_chats';

export const chatService = {
    getChats: (userId: string): Chat[] => {
        if (typeof window === 'undefined') return [];
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) return [];

        try {
            const allChats: Chat[] = JSON.parse(stored);
            // Filter chats where the user is a participant
            // For this mock, we'll assume the current user is identified by 'userId'
            // In a real app, we'd check against the authenticated user's ID
            return allChats.filter(chat => chat.participants.includes(userId) || userId === 'all');
        } catch (e) {
            console.error('Failed to parse chats', e);
            return [];
        }
    },

    createChat: (employerId: string, seekerId: string, employerName: string, seekerName: string, initialMessage?: string, jobTitle?: string, tags?: string[]): Chat => {
        const chats = chatService.getChats('all');

        // Check if chat already exists
        const existingChat = chats.find(c =>
            c.participants.includes(employerId) && c.participants.includes(seekerId)
        );

        if (existingChat) {
            if (initialMessage) {
                chatService.sendMessage(existingChat.id, seekerId, initialMessage, true);
            }
            // Update job title if provided and not present
            if (jobTitle && !existingChat.jobTitle) {
                existingChat.jobTitle = jobTitle;
                // Update in storage
                const index = chats.findIndex(c => c.id === existingChat.id);
                if (index !== -1) {
                    chats[index] = existingChat;
                    localStorage.setItem(STORAGE_KEY, JSON.stringify(chats));
                }
            }
            return existingChat;
        }

        const newChat: Chat = {
            id: Math.random().toString(36).substring(2, 9),
            participants: [employerId, seekerId],
            messages: [],
            updatedAt: Date.now(),
            employerName,
            seekerName,
            jobTitle,
            tags
        };

        if (initialMessage) {
            const msg: Message = {
                id: Math.random().toString(36).substring(2, 9),
                senderId: seekerId,
                text: initialMessage,
                timestamp: Date.now(),
                isSystem: true
            };
            newChat.messages.push(msg);
            newChat.lastMessage = msg;
        }

        chats.push(newChat);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(chats));
        return newChat;
    },

    sendMessage: (chatId: string, senderId: string, text: string, isSystem: boolean = false): Message | null => {
        const chats = chatService.getChats('all');
        const chatIndex = chats.findIndex(c => c.id === chatId);

        if (chatIndex === -1) return null;

        const msg: Message = {
            id: Math.random().toString(36).substring(2, 9),
            senderId,
            text,
            timestamp: Date.now(),
            isSystem
        };

        chats[chatIndex].messages.push(msg);
        chats[chatIndex].lastMessage = msg;
        chats[chatIndex].updatedAt = Date.now();

        localStorage.setItem(STORAGE_KEY, JSON.stringify(chats));
        return msg;
    },

    // Helper to clear chats for testing
    clearChats: () => {
        localStorage.removeItem(STORAGE_KEY);
    },

    deleteChat: (chatId: string): boolean => {
        const chats = chatService.getChats('all');
        const newChats = chats.filter(c => c.id !== chatId);

        if (newChats.length !== chats.length) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(newChats));
            return true;
        }
        return false;
    }
};
