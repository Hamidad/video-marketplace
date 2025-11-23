'use client';

import { useState, useRef } from 'react';
import { Upload, X, Loader2 } from 'lucide-react';
import { videoService } from '@/lib/video-service';
import { VideoPlayer } from '@/components/ui/video-player';
import { INDUSTRIES } from '@/lib/mock-data';

interface VideoUploadProps {
    onSuccess?: (video: Record<string, unknown>) => void;
}

export function VideoUpload({ onSuccess }: VideoUploadProps) {
    const [file, setFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Metadata state
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [industry, setIndustry] = useState(INDUSTRIES[1]); // Default to Tech
    const [jobType, setJobType] = useState('Full-time');
    const [location, setLocation] = useState('');
    const [salaryRange, setSalaryRange] = useState('');

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
            if (video.duration > 60.5) { // Increased to 60s for demo flexibility
                setError('Video must be 60 seconds or less');
            } else {
                setFile(file);
                setPreviewUrl(URL.createObjectURL(file));
            }
        };
        video.src = URL.createObjectURL(file);
    };

    const handleUpload = async () => {
        if (!file) return;
        if (!title) {
            setError('Title is required');
            return;
        }

        setIsUploading(true);
        try {
            const newVideo = await videoService.uploadVideo(file, {
                title,
                description,
                industry,
                jobType,
                location,
                salaryRange
            });

            if (onSuccess) {
                onSuccess(newVideo);
            }
            clearFile();
        } catch (err: unknown) {
            console.error('Upload error:', err);
            const errorMessage = err instanceof Error ? err.message : 'Failed to upload video. Please try again.';
            setError(errorMessage);
            setIsUploading(false);
        }
    };

    const clearFile = () => {
        setFile(null);
        setPreviewUrl(null);
        setError(null);
        setTitle('');
        setDescription('');
        setLocation('');
        setSalaryRange('');
        if (inputRef.current) inputRef.current.value = '';
    };

    return (
        <div className="w-full max-w-md mx-auto p-4">
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-8 text-center mb-6">
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
                            <p className="text-sm text-gray-500">MP4, WebM up to 60s</p>
                        </div>
                    </div>
                ) : (
                    <div className="relative aspect-[9/16] bg-black rounded-lg overflow-hidden">
                        {previewUrl && <VideoPlayer src={previewUrl} />}
                        <button
                            aria-label="Remove video"
                            onClick={clearFile}
                            className="absolute top-2 right-2 p-1 bg-black/50 rounded-full text-white z-10"
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
                    title="Upload video"
                />
            </div>

            {file && (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Title *</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full p-3 bg-zinc-100 dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800"
                            placeholder="e.g. Senior React Developer"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full p-3 bg-zinc-100 dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 min-h-[80px]"
                            placeholder="Tell us about yourself or the role..."
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Industry</label>
                            <select
                                value={industry}
                                onChange={(e) => setIndustry(e.target.value)}
                                className="w-full p-3 bg-zinc-100 dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800"
                                aria-label="Select Industry"
                            >
                                {INDUSTRIES.filter(i => i !== 'All').map(i => (
                                    <option key={i} value={i}>{i}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Job Type</label>
                            <select
                                value={jobType}
                                onChange={(e) => setJobType(e.target.value)}
                                className="w-full p-3 bg-zinc-100 dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800"
                                aria-label="Select Job Type"
                            >
                                <option value="Full-time">Full-time</option>
                                <option value="Part-time">Part-time</option>
                                <option value="Contract">Contract</option>
                                <option value="Freelance">Freelance</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Location</label>
                            <input
                                type="text"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                className="w-full p-3 bg-zinc-100 dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800"
                                placeholder="e.g. Remote, NY"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Salary Range</label>
                            <input
                                type="text"
                                value={salaryRange}
                                onChange={(e) => setSalaryRange(e.target.value)}
                                className="w-full p-3 bg-zinc-100 dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800"
                                placeholder="e.g. $100k - $120k"
                            />
                        </div>
                    </div>

                    <button
                        onClick={handleUpload}
                        disabled={isUploading}
                        className="w-full mt-6 py-3 bg-blue-600 text-white rounded-lg font-medium flex items-center justify-center gap-2 disabled:opacity-50 hover:bg-blue-700 transition-colors"
                    >
                        {isUploading && <Loader2 className="animate-spin w-5 h-5" />}
                        {isUploading ? 'Uploading...' : 'Post Video'}
                    </button>
                </div>
            )}

            {error && (
                <p className="mt-4 text-red-500 text-sm text-center bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">{error}</p>
            )}
        </div>
    );
}
