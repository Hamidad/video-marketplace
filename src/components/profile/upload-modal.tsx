'use client';

import { X } from 'lucide-react';
import { VideoUpload } from '@/components/ui/video-upload';

interface UploadModalProps {
    isOpen: boolean;
    onClose: () => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onUploadSuccess: (video: any) => void;
}

export function UploadModal({ isOpen, onClose, onUploadSuccess }: UploadModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in duration-200">
            <div className="bg-zinc-900 w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl border border-zinc-800 flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="p-4 border-b border-zinc-800 flex justify-between items-center shrink-0">
                    <h3 className="font-bold text-lg text-white">Upload Video</h3>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-zinc-800 rounded-full text-zinc-400 hover:text-white transition-colors"
                        aria-label="Close upload modal"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto">
                    <VideoUpload onSuccess={(video) => {
                        onUploadSuccess(video);
                        onClose();
                    }} />
                </div>
            </div>
        </div>
    );
}
