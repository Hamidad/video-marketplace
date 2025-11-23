'use client';

import { useState, useEffect } from 'react';
import { Feed } from '@/components/ui/feed';
import { LanguageSelection } from '@/components/onboarding/language-selection';
import { AuthOptions } from '@/components/onboarding/auth-options';
import { AuthForm } from '@/components/auth/auth-form';

export function HomeClient() {
    // State to track the current step
    // 'loading' -> 'language' -> 'auth' -> 'auth-form' -> 'feed'
    const [step, setStep] = useState<'loading' | 'language' | 'auth' | 'auth-form' | 'feed'>('loading');
    const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');

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
        if (option === 'guest') {
            localStorage.setItem('hasOnboarded', 'true');
            setStep('feed');
        } else {
            setAuthMode(option);
            setStep('auth-form');
        }
    };

    const handleAuthSuccess = () => {
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

    if (step === 'auth-form') {
        return (
            <AuthForm
                mode={authMode}
                onBack={() => setStep('auth')}
                onSuccess={handleAuthSuccess}
            />
        );
    }

    return <Feed />;
}
