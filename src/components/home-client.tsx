'use client';

import { useState, useEffect } from 'react';
import { Feed } from '@/components/ui/feed';
import { LanguageSelection } from '@/components/onboarding/language-selection';
import { AuthOptions } from '@/components/onboarding/auth-options';

export function HomeClient() {
    // State to track the current step
    // 'loading' -> 'language' -> 'auth' -> 'feed'
    const [step, setStep] = useState<'loading' | 'language' | 'auth' | 'feed'>('loading');

    useEffect(() => {
        // Check if user has already onboarded
        const hasOnboarded = localStorage.getItem('hasOnboarded');
        if (hasOnboarded) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setStep('feed');
        } else {
            setStep('language');
        }
    }, []);

    const handleLanguageSelect = () => {
        // In a real app, we would set the locale here

        setStep('auth');
    };

    const handleAuthSelect = (option: 'signup' | 'signin' | 'guest') => {
        console.log('Selected auth:', option);
        // For prototype, we just move to feed and mark as onboarded
        localStorage.setItem('hasOnboarded', 'true');
        setStep('feed');
    };

    if (step === 'loading') return null;

    if (step === 'language') {
        return <LanguageSelection onSelect={handleLanguageSelect} />;
    }

    if (step === 'auth') {
        return <AuthOptions onSelect={handleAuthSelect} />;
    }

    return <Feed />;
}
