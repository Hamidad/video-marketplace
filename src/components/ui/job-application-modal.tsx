'use client';

import { useState } from 'react';
import { X, Send, CheckCircle } from 'lucide-react';
import { unlockService } from '@/lib/unlock-service';

interface JobApplicationModalProps {
    jobId: string;
    employerName: string;
    onClose: () => void;
    onSuccess: () => void;
}

export function JobApplicationModal({ jobId, employerName, onClose, onSuccess }: JobApplicationModalProps) {
    const [message, setMessage] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleApply = async () => {
        if (!message.trim()) return;

        setIsSending(true);
        try {
            // 1. Send application (mock)
            await new Promise(resolve => setTimeout(resolve, 1000));

            // 2. Auto-unlock the applicant for the employer (conceptually)
            // In this demo, we simulate the reverse: The seeker gets "unlocked" status 
            // so we can show the UI change.
            await unlockService.unlockProfile(jobId, 'APPLICATION');

            setIsSuccess(true);
            setTimeout(() => {
                onSuccess();
                onClose();
            }, 1500);
        } catch (error) {
            console.error('Application failed');
        } finally {
            setIsSending(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-zinc-900 w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl">

                <div className="p-4 border-b border-gray-100 dark:border-zinc-800 flex justify-between items-center">
                    <h3 className="font-bold text-lg">Apply to {employerName}</h3>
                    <button onClick={onClose} className="p-1 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6">
                    {isSuccess ? (
                        <div className="flex flex-col items-center text-center py-4">
                            <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
                            <h4 className="text-xl font-bold mb-2">Application Sent!</h4>
                            <p className="text-gray-500">Good luck!</p>
                        </div>
                    ) : (
                        <>
                            <textarea
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Introduce yourself..."
                                className="w-full h-32 p-3 bg-gray-50 dark:bg-zinc-800 rounded-xl resize-none outline-none focus:ring-2 focus:ring-blue-500 mb-4"
                            />

                            <button
                                onClick={handleApply}
                                disabled={isSending || !message.trim()}
                                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                {isSending ? 'Sending...' : (
                                    <>
                                        <span>Send Application</span>
                                        <Send size={16} />
                                    </>
                                )}
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
