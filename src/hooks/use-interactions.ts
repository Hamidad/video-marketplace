'use client';

import { useState, useEffect } from 'react';

interface InteractionsState {
    likedVideoIds: string[];
    savedVideoIds: string[];
    likedUserIds: string[];
    savedUserIds: string[];
}

export function useInteractions() {
    const [state, setState] = useState<InteractionsState>({
        likedVideoIds: [],
        savedVideoIds: [],
        likedUserIds: [],
        savedUserIds: [],
    });

    const [isLoaded, setIsLoaded] = useState(false);

    // Load from localStorage on mount
    useEffect(() => {
        const savedState = localStorage.getItem('userInteractions');
        if (savedState) {
            try {
                // eslint-disable-next-line react-hooks/set-state-in-effect
                setState(JSON.parse(savedState));
            } catch (e) {
                console.error('Failed to parse interactions state', e);
            }
        }
        setIsLoaded(true);
    }, []);

    // Save to localStorage whenever state changes
    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem('userInteractions', JSON.stringify(state));
        }
    }, [state, isLoaded]);

    const toggleLikeVideo = (videoId: string) => {
        setState(prev => ({
            ...prev,
            likedVideoIds: prev.likedVideoIds.includes(videoId)
                ? prev.likedVideoIds.filter(id => id !== videoId)
                : [...prev.likedVideoIds, videoId]
        }));
    };

    const toggleSaveVideo = (videoId: string) => {
        setState(prev => ({
            ...prev,
            savedVideoIds: prev.savedVideoIds.includes(videoId)
                ? prev.savedVideoIds.filter(id => id !== videoId)
                : [...prev.savedVideoIds, videoId]
        }));
    };

    const toggleLikeUser = (username: string) => {
        setState(prev => ({
            ...prev,
            likedUserIds: prev.likedUserIds.includes(username)
                ? prev.likedUserIds.filter(id => id !== username)
                : [...prev.likedUserIds, username]
        }));
    };

    const toggleSaveUser = (username: string) => {
        setState(prev => ({
            ...prev,
            savedUserIds: prev.savedUserIds.includes(username)
                ? prev.savedUserIds.filter(id => id !== username)
                : [...prev.savedUserIds, username]
        }));
    };

    const isVideoLiked = (videoId: string) => state.likedVideoIds.includes(videoId);
    const isVideoSaved = (videoId: string) => state.savedVideoIds.includes(videoId);
    const isUserLiked = (username: string) => state.likedUserIds.includes(username);
    const isUserSaved = (username: string) => state.savedUserIds.includes(username);

    return {
        ...state,
        toggleLikeVideo,
        toggleSaveVideo,
        toggleLikeUser,
        toggleSaveUser,
        isVideoLiked,
        isVideoSaved,
        isUserLiked,
        isUserSaved,
        isLoaded
    };
}
