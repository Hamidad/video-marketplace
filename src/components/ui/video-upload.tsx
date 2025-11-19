'use client';

import { useState, useRef } from 'react';
import { Upload, X, Loader2 } from 'lucide-react';
import { mockVideoService } from '@/lib/video-service';
import { VideoPlayer } from '@/components/ui/video-player';

export function VideoUpload() {
    const [file, setFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            validateAndSetFile(selectedFile);
        }
    };

    const validateAndSetFile = (file: File) => {
        setError(null);

        // Check type
        if (!file.type.startsWith('video/')) {
            setError('Please upload a video file');
            return;
        }

        // Check duration (this is tricky client-side without loading it, 
        // but we can check size as a proxy or load metadata)
        const video = document.createElement('video');
        video.preload = 'metadata';
        video.onloadedmetadata = () => {
            window.URL.revokeObjectURL(video.src);
            if (video.duration > 30.5) { // 0.5s buffer
                setError('Video must be 30 seconds or less');
            } else {
                setFile(file);
                setPreviewUrl(URL.createObjectURL(file));
            }
        };
        video.src = URL.createObjectURL(file);
    };

    const handleUpload = async () => {
        if (!file) return;

        setIsUploading(true);
        try {
            await mockVideoService.upload(file);
            // Handle success (e.g., redirect or show success message)
            alert('Upload successful! (Mock)');
        } catch (err) {
            setError('Upload failed. Please try again.');
        } finally {
            setIsUploading(false);
        }
    };

    const clearFile = () => {
        setFile(null);
        setPreviewUrl(null);
        setError(null);
        if (inputRef.current) inputRef.current.value = '';
    };

    return (
        <div className="w-full max-w-md mx-auto p-4">
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-8 text-center">
                {!file ? (
                    <div
                        className="flex flex-col items-center gap-4 cursor-pointer"
                        onClick={() => inputRef.current?.click()}
                    >
                        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-full">
                            <Upload className="w-8 h-8 text-blue-500" />
                        </div>
                        <div>
                            <p className="font-medium">Click to upload video</p>
                            <p className="text-sm text-gray-500">MP4, WebM up to 30s</p>
                        </div>
                    </div>
                ) : (
                    <div className="relative aspect-[9/16] bg-black rounded-lg overflow-hidden">
                        {previewUrl && <VideoPlayer src={previewUrl} />}
                        <button
                            onClick={clearFile}
                            className="absolute top-2 right-2 p-1 bg-black/50 rounded-full text-white"
                        >
                            <X size={20} />
                        </button>
                    </div>
                )}

                <input
                    ref={inputRef}
                    type="file"
                    accept="video/*"
                    className="hidden"
                    onChange={handleFileSelect}
                />
            </div>

            {error && (
                <p className="mt-4 text-red-500 text-sm text-center">{error}</p>
            )}

            {file && (
                <button
                    onClick={handleUpload}
                    disabled={isUploading}
                    className="w-full mt-4 py-3 bg-blue-600 text-white rounded-lg font-medium flex items-center justify-center gap-2 disabled:opacity-50"
                >
                    {isUploading && <Loader2 className="animate-spin w-5 h-5" />}
                    {isUploading ? 'Uploading...' : 'Post Video'}
                </button>
            )}
        </div>
    );
}
