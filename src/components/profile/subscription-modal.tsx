'use client';

import { X, Check, Crown } from 'lucide-react';

interface SubscriptionModalProps {
    isOpen: boolean;
    onClose: () => void;
    userRole: 'employer' | 'seeker';
}

export function SubscriptionModal({ isOpen, onClose, userRole }: SubscriptionModalProps) {
    if (!isOpen) return null;

    const plans = userRole === 'employer' ? [
        {
            name: 'Basic',
            price: 'Free',
            features: ['Post 1 Job', 'View 5 Profiles'],
            recommended: false
        },
        {
            name: 'Standard',
            price: '$49/mo',
            features: ['Post 5 Jobs', 'View 25 Profiles', 'Verified Badge'],
            recommended: true
        },
        {
            name: 'Pro',
            price: '$250/mo',
            features: ['Unlimited Job Posts', 'Unlimited Profile Views', 'Verified Badge'],
            recommended: false
        },
        {
            name: 'Enterprise',
            price: 'Custom',
            features: ['Dedicated Account Manager', 'API Access', 'Custom Branding'],
            recommended: false
        }
    ] : [
        {
            name: 'Basic',
            price: 'Free',
            features: ['30 Second Video', 'Apply to 10 Jobs', 'Basic Profile'],
            recommended: false
        },
        {
            name: 'Premium',
            price: '$9/mo',
            features: ['Unlimited Applications', 'Verified Badge', '60 Second Video'],
            recommended: true
        }
    ];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white dark:bg-zinc-900 w-full max-w-4xl rounded-3xl overflow-hidden shadow-2xl border border-gray-200 dark:border-zinc-800 flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="p-6 border-b border-gray-100 dark:border-zinc-800 flex justify-between items-center bg-gray-50 dark:bg-zinc-900/50">
                    <div>
                        <h2 className="text-2xl font-bold flex items-center gap-2">
                            <Crown className="text-yellow-500 fill-yellow-500" />
                            Upgrade your {userRole === 'employer' ? 'Hiring' : 'Career'}
                        </h2>
                        <p className="text-gray-500 dark:text-gray-400 mt-1">Choose the plan that fits your needs</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-200 dark:hover:bg-zinc-800 rounded-full transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Plans Grid */}
                <div className="overflow-y-auto p-6 md:p-8">
                    <div className="grid md:grid-cols-3 gap-6">
                        {plans.map((plan) => (
                            <div
                                key={plan.name}
                                className={`relative rounded-2xl p-6 border-2 flex flex-col ${plan.recommended
                                    ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-900/10'
                                    : 'border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900'
                                    }`}
                            >
                                {plan.recommended && (
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                                        Most Popular
                                    </div>
                                )}

                                <div className="mb-6 text-center">
                                    <h3 className="text-lg font-bold mb-2">{plan.name}</h3>
                                    <div className="text-3xl font-black">{plan.price}</div>
                                </div>

                                <ul className="space-y-3 mb-8 flex-1">
                                    {plan.features.map((feature) => (
                                        <li key={feature} className="flex items-start gap-3 text-sm">
                                            <Check size={16} className="text-green-500 mt-0.5 shrink-0" />
                                            <span className="text-gray-600 dark:text-gray-300">{feature}</span>
                                        </li>
                                    ))}
                                </ul>

                                <button
                                    className={`w-full py-3 rounded-xl font-bold transition-all active:scale-95 ${plan.recommended
                                        ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20'
                                        : 'bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 text-gray-900 dark:text-white'
                                        }`}
                                    onClick={() => {
                                        // Mock subscription logic
                                        onClose();
                                        alert(`Subscribed to ${plan.name} plan!`);
                                    }}
                                >
                                    {plan.price === 'Free' ? 'Current Plan' : 'Subscribe'}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
