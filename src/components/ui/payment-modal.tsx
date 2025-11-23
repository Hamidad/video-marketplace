'use client';

import { useState } from 'react';
import { X, CreditCard, CheckCircle } from 'lucide-react';
import { unlockService } from '@/lib/unlock-service';

interface PaymentModalProps {
    seekerId: string;
    seekerName: string;
    price: number;
    onClose: () => void;
    onSuccess: () => void;
}

export function PaymentModal({ seekerId, seekerName, price, onClose, onSuccess }: PaymentModalProps) {
    const [isProcessing, setIsProcessing] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handlePayment = async () => {
        setIsProcessing(true);
        try {
            await unlockService.unlockProfile(seekerId, 'PAYMENT');
            setIsSuccess(true);
            setTimeout(() => {
                onSuccess();
                onClose();
            }, 1500);
        } catch {
            console.error('Payment failed');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-zinc-900 w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl">

                {/* Header */}
                <div className="p-4 border-b border-gray-100 dark:border-zinc-800 flex justify-between items-center">
                    <h3 className="font-bold text-lg">Unlock Profile</h3>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full" aria-label="Close">
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col items-center text-center">
                    {isSuccess ? (
                        <div className="py-8 animate-in zoom-in duration-300">
                            <CheckCircle className="w-16 h-16 text-green-500 mb-4 mx-auto" />
                            <h4 className="text-xl font-bold mb-2">Unlocked!</h4>
                            <p className="text-gray-500">You can now view {seekerName}&apos;s full details.</p>
                        </div>
                    ) : (
                        <>
                            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-4">
                                <CreditCard className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                            </div>

                            <h4 className="text-xl font-bold mb-2">Unlock {seekerName}</h4>
                            <p className="text-gray-500 mb-6 text-sm">
                                Get access to full resume, contact details, and direct messaging.
                            </p>

                            <div className="w-full bg-gray-50 dark:bg-zinc-800/50 p-4 rounded-xl mb-6 flex justify-between items-center">
                                <span className="font-medium">Total</span>
                                <span className="text-xl font-bold">${price.toFixed(2)}</span>
                            </div>

                            <button
                                onClick={handlePayment}
                                disabled={isProcessing}
                                className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100 flex items-center justify-center gap-2"
                            >
                                {isProcessing ? 'Processing...' : 'Pay & Unlock'}
                            </button>
                        </>
                    )}
                </div>

                {!isSuccess && (
                    <div className="p-4 bg-gray-50 dark:bg-zinc-800/30 text-center">
                        <p className="text-xs text-gray-400">Secure payment powered by Stripe (Mock)</p>
                    </div>
                )}
            </div>
        </div>
    );
}
