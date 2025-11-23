import { createClient } from './supabase/client';

interface VideoRow {
    id: string;
    title: string;
    description: string;
    video_url: string;
    thumbnail_url: string | null;
    industry: string | null;
    job_type: string | null;
    location: string | null;
    salary_range: string | null;
    user_id: string;
    profiles: {
        username: string | null;
        avatar_url: string | null;
    } | null;
}

export interface Video {
    id: string;
    title: string;
    description: string;
    videoUrl: string;
    thumbnailUrl: string;
    industry: string;
    jobType: string;
    location: string;
    salaryRange: string;
    likes: number;
    username: string;
    userAvatar: string;
    isLiked: boolean;
    isSaved: boolean;
    tags: string[];
    resumeDetails?: {
        experience: string;
        education: string;
        skills: string[];
    };
    jobDetails?: {
        company: string;
        requirements: string[];
        benefits: string[];
    };
}

export const videoService = {
    async getVideos(): Promise<Video[]> {
        const supabase = createClient();

        const { data, error } = await supabase
            .from('videos')
            .select(`
                *,
                profiles:user_id (
                    username,
                    avatar_url
                )
            `)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching videos:', error);
            return [];
        }

        return (data as VideoRow[]).map((video) => ({
            id: video.id,
            title: video.title,
            description: video.description,
            videoUrl: video.video_url,
            thumbnailUrl: video.thumbnail_url || 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1000&auto=format&fit=crop', // Fallback
            industry: video.industry || 'Other',
            jobType: video.job_type || 'Full-time',
            location: video.location || 'Remote',
            salaryRange: video.salary_range || 'Competitive',
            likes: 0, // TODO: Implement likes table
            username: video.profiles?.username || 'User',
            userAvatar: video.profiles?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${video.user_id}`,
            isLiked: false, // TODO: Check user likes
            isSaved: false, // TODO: Check user saves
            tags: [], // TODO: Add tags column
            // Mock details for now until we add columns
            resumeDetails: {
                experience: '2 years',
                education: 'Bachelor Degree',
                skills: ['React', 'TypeScript']
            },
            jobDetails: {
                company: 'Tech Corp',
                requirements: ['3+ years exp', 'Remote'],
                benefits: ['Health', 'Dental']
            }
        }));
    },

    async uploadVideo(file: File, metadata: {
        title: string;
        description?: string;
        industry?: string;
        jobType?: string;
        location?: string;
        salaryRange?: string;
    }) {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) throw new Error('User not authenticated');

        // 1. Upload file to storage
        const fileExt = file.name.split('.').pop();
        const fileName = `${user.id}/${Date.now()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
            .from('videos')
            .upload(fileName, file);

        if (uploadError) throw uploadError;

        // 2. Get public URL
        const { data: { publicUrl } } = supabase.storage
            .from('videos')
            .getPublicUrl(fileName);

        // 3. Insert record into database
        const { data, error: dbError } = await supabase
            .from('videos')
            .insert({
                user_id: user.id,
                title: metadata.title,
                description: metadata.description,
                video_url: publicUrl,
                industry: metadata.industry,
                job_type: metadata.jobType,
                location: metadata.location,
                salary_range: metadata.salaryRange
            })
            .select()
            .single();

        if (dbError) throw dbError;
        return data;
    }
};
