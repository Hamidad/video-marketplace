export interface VideoUploadResponse {
    id: string;
    playbackId: string;
    status: 'ready' | 'processing' | 'error';
}

export const mockVideoService = {
    upload: async (file: File): Promise<VideoUploadResponse> => {
        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 2000));

        // Simulate validation
        if (file.size > 50 * 1024 * 1024) {
            throw new Error('File too large (max 50MB)');
        }

        return {
            id: Math.random().toString(36).substring(7),
            playbackId: URL.createObjectURL(file), // Use local blob for preview
            status: 'ready',
        };
    },
};
