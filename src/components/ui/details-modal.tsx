'use client';

import { useState, useEffect } from 'react';
import { X, Heart, Bookmark, FileText, MessageCircle, Phone, Lock, CheckCircle, Briefcase, DollarSign, ChevronLeft, ChevronRight } from 'lucide-react';
import { useInteractions } from '@/hooks/use-interactions';
import { PaymentModal } from './payment-modal';
import { unlockService } from '@/lib/unlock-service';
import { chatService } from '@/lib/chat-service';
import { useToast } from './toast-context';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { useUserRole } from '@/hooks/use-user-role';

interface DetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    username: string;
    tags: string[];
    userRole: 'employer' | 'seeker';
    resumeDetails?: {
        bio: string;
        experience: string;
        education?: string;
        certifications?: string[];
        skills: string[];
    };
    jobDetails?: {
        title: string;
        salary: string;
        description: string;
        requirements: string[];
    };
    name?: string;
    onNext?: () => void;
    onPrev?: () => void;
    hasNext?: boolean;
    hasPrev?: boolean;
}

export function DetailsModal({ isOpen, onClose, username, name, tags, userRole, resumeDetails, jobDetails, onNext, onPrev, hasNext, hasPrev }: DetailsModalProps) {
    const { isUserLiked, isUserSaved, toggleLikeUser, toggleSaveUser } = useInteractions();
    const [isUnlocked, setIsUnlocked] = useState(() => unlockService.isUnlocked(username));
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const { showToast } = useToast();
    const { isAuthenticated } = useAuth();

    // Reset unlocked state when username changes (navigation)
    useEffect(() => {
        setIsUnlocked(unlockService.isUnlocked(username));
    }, [username]);

    const isLiked = isUserLiked(username);
    const isSaved = isUserSaved(username);

    // Determine display name
    const getDisplayName = () => {
        // If job seeker (has resumeDetails) and not unlocked
        // And user is employer OR not authenticated (signed out)
        if (resumeDetails && !isUnlocked && (userRole === 'employer' || !isAuthenticated)) {
            return name ? name.split(' ')[0] : username;
        }
        // Otherwise show full name or username
        return name || username;
    };

    const displayName = getDisplayName();

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in duration-200">
            <div className="bg-zinc-900 w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl border border-zinc-800 flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="p-4 border-b border-zinc-800 flex justify-between items-center shrink-0">
                    <div className="flex items-center gap-2">
                        <h3 className="font-bold text-lg text-white">
                            {userRole === 'employer' ? `${displayName}'s Profile` : 'Job Details'}
                        </h3>
                    </div>
                    <div className="flex items-center gap-2">
                        {(onPrev || onNext) && (
                            <div className="flex items-center bg-zinc-800 rounded-full p-1 mr-2">
                                <button
                                    onClick={onPrev}
                                    disabled={!hasPrev}
                                    className="p-1.5 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-700 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                                    aria-label="Previous profile"
                                >
                                    <ChevronLeft size={18} />
                                </button>
                                <div className="w-px h-4 bg-zinc-700 mx-1" />
                                <button
                                    onClick={onNext}
                                    disabled={!hasNext}
                                    className="p-1.5 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-700 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                                    aria-label="Next profile"
                                >
                                    <ChevronRight size={18} />
                                </button>
                            </div>
                        )}
                        <button aria-label="Close details" onClick={onClose} className="p-2 hover:bg-zinc-800 rounded-full text-zinc-400 hover:text-white transition-colors">
                            <X size={20} />
                        </button>
                    </div>
                </div>

                {/* Scrollable Content */}
                <div className="overflow-y-auto p-6 space-y-8">

                    {/* Actions */}
                    <div className="flex gap-4">
                        <button
                            onClick={() => {
                                toggleLikeUser(username);
                                if (!isLiked) showToast('Liked profile', 'success');
                            }}
                            className={`flex-1 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all ${isLiked ? 'bg-pink-500/20 text-pink-500' : 'bg-zinc-800 text-white hover:bg-zinc-700'
                                }`}
                        >
                            <Heart className={isLiked ? 'fill-current' : ''} size={20} />
                            {isLiked ? 'Liked' : 'Like'}
                        </button>
                        <button
                            onClick={() => {
                                toggleSaveUser(username);
                                if (!isSaved) showToast('Saved profile', 'success');
                            }}
                            className={`flex-1 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all ${isSaved ? 'bg-blue-500/20 text-blue-500' : 'bg-zinc-800 text-white hover:bg-zinc-700'
                                }`}
                        >
                            <Bookmark className={isSaved ? 'fill-current' : ''} size={20} />
                            {isSaved ? 'Saved' : 'Save'}
                        </button>
                    </div>

                    {/* Content based on Role */}
                    {userRole === 'employer' ? (
                        // EMPLOYER VIEW
                        <>
                            {/* Resume Details (Free to View) */}
                            {resumeDetails && (
                                <div className="space-y-6">
                                    <div>
                                        <h4 className="text-sm font-medium text-zinc-400 mb-3 uppercase tracking-wider flex items-center gap-2">
                                            <FileText size={16} /> Bio
                                        </h4>
                                        <p className="text-zinc-300 leading-relaxed">{resumeDetails.bio}</p>
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-medium text-zinc-400 mb-3 uppercase tracking-wider flex items-center gap-2">
                                            <Briefcase size={16} /> Experience
                                        </h4>
                                        <p className="text-zinc-300 leading-relaxed">{resumeDetails.experience}</p>
                                    </div>
                                    {resumeDetails.education && (
                                        <div>
                                            <h4 className="text-sm font-medium text-zinc-400 mb-3 uppercase tracking-wider flex items-center gap-2">
                                                <CheckCircle size={16} /> Education
                                            </h4>
                                            <p className="text-zinc-300 leading-relaxed">{resumeDetails.education}</p>
                                        </div>
                                    )}
                                    {resumeDetails.certifications && resumeDetails.certifications.length > 0 && (
                                        <div>
                                            <h4 className="text-sm font-medium text-zinc-400 mb-3 uppercase tracking-wider flex items-center gap-2">
                                                <CheckCircle size={16} /> Certifications
                                            </h4>
                                            <ul className="list-disc list-inside text-zinc-300 space-y-1">
                                                {resumeDetails.certifications.map((cert, idx) => (
                                                    <li key={idx}>{cert}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Tags */}
                            <div>
                                <h4 className="text-sm font-medium text-zinc-400 mb-3 uppercase tracking-wider">Skills & Tags</h4>
                                <div className="flex flex-wrap gap-2">
                                    {tags.map((tag) => (
                                        <span key={tag} className="px-3 py-1 bg-zinc-800 text-zinc-300 rounded-lg text-sm border border-zinc-700">
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Locked Contact & Actions Section */}
                            <div className="relative mt-8 p-6 rounded-xl border border-zinc-800 bg-zinc-800/30 overflow-hidden">
                                {!isUnlocked && (
                                    <div className="absolute inset-0 backdrop-blur-md bg-black/60 flex flex-col items-center justify-center z-10 p-6 text-center">
                                        <Lock className="w-10 h-10 text-yellow-500 mb-3" />
                                        <h4 className="text-lg font-bold text-white mb-1">Unlock Contact Info</h4>
                                        <p className="text-zinc-400 text-sm mb-4">Get access to direct messaging, email, phone, and PDF resume.</p>
                                        <button
                                            onClick={() => setShowPaymentModal(true)}
                                            className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-2 px-6 rounded-full transition-colors"
                                        >
                                            Unlock for $4.99
                                        </button>
                                    </div>
                                )}

                                <div className={!isUnlocked ? 'opacity-20 blur-sm' : ''}>
                                    <h4 className="text-sm font-medium text-zinc-400 mb-4 uppercase tracking-wider">Contact & Actions</h4>

                                    <div className="space-y-3 mb-6">
                                        <div className="flex items-center gap-3 text-zinc-300">
                                            <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center">
                                                <MessageCircle size={16} />
                                            </div>
                                            <span>Direct Message</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-zinc-300">
                                            <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center">
                                                <Phone size={16} />
                                            </div>
                                            <span>+1 (555) 123-4567</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-zinc-300">
                                            <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center">
                                                <FileText size={16} />
                                            </div>
                                            <span>resume.pdf</span>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <button
                                            onClick={() => showToast('Downloading resume...', 'info')}
                                            className="w-full py-4 font-bold rounded-xl transition-all active:scale-95 bg-zinc-700 hover:bg-zinc-600 text-white"
                                        >
                                            Download PDF
                                        </button>
                                        <ApplyButton employerName={userRole === 'employer' ? 'Current User' : username} jobTitle="Direct Message" isDirectMessage={true} seekerName={username} />
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (
                        // SEEKER VIEW
                        <>
                            {jobDetails && (
                                <div className="space-y-6">
                                    <div>
                                        <h4 className="text-sm font-medium text-zinc-400 mb-3 uppercase tracking-wider flex items-center gap-2">
                                            <Briefcase size={16} /> Job Title
                                        </h4>
                                        <p className="text-zinc-300 leading-relaxed">{jobDetails.title}</p>
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-medium text-zinc-400 mb-3 uppercase tracking-wider flex items-center gap-2">
                                            <DollarSign size={16} /> Salary
                                        </h4>
                                        <p className="text-zinc-300 leading-relaxed">{jobDetails.salary}</p>
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-medium text-zinc-400 mb-3 uppercase tracking-wider flex items-center gap-2">
                                            <FileText size={16} /> Description
                                        </h4>
                                        <p className="text-zinc-300 leading-relaxed">{jobDetails.description}</p>
                                    </div>
                                    {jobDetails.requirements && jobDetails.requirements.length > 0 && (
                                        <div>
                                            <h4 className="text-sm font-medium text-zinc-400 mb-3 uppercase tracking-wider flex items-center gap-2">
                                                <CheckCircle size={16} /> Requirements
                                            </h4>
                                            <ul className="list-disc list-inside text-zinc-300 space-y-1">
                                                {jobDetails.requirements.map((req, idx) => (
                                                    <li key={idx}>{req}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Tags */}
                            <div>
                                <h4 className="text-sm font-medium text-zinc-400 mb-3 uppercase tracking-wider">Skills & Tags</h4>
                                <div className="flex flex-wrap gap-2">
                                    {tags.map((tag) => (
                                        <span key={tag} className="px-3 py-1 bg-zinc-800 text-zinc-300 rounded-lg text-sm border border-zinc-700">
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <ApplyButton employerName={username} jobTitle={jobDetails?.title} />
                        </>
                    )}
                </div>
            </div>

            {showPaymentModal && (
                <PaymentModal
                    seekerId={username}
                    seekerName={username}
                    price={4.99}
                    onClose={() => setShowPaymentModal(false)}
                    onSuccess={() => {
                        setIsUnlocked(true);
                        setShowPaymentModal(false);
                        showToast('Contact info unlocked!', 'success');
                    }}
                />
            )}
        </div>
    );
}

interface ApplyButtonProps {
    employerName: string;
    jobTitle?: string;
    isDirectMessage?: boolean;
    seekerName?: string;
}

function ApplyButton({ employerName, jobTitle, isDirectMessage = false, seekerName }: ApplyButtonProps) {
    const [applied, setApplied] = useState(false);
    const { showToast } = useToast();
    const router = useRouter();
    const { user } = useAuth();
    const { role } = useUserRole();

    // Check if already applied
    useEffect(() => {
        if (typeof window !== 'undefined' && user) {
            const chats = chatService.getChats('all');
            const currentUserId = user.name;

            // Determine participants based on role
            // If I am seeker, I am applying to employerName
            // If I am employer, I am contacting seekerName
            const otherPartyId = role === 'employer' ? seekerName : employerName;

            if (currentUserId && otherPartyId) {
                const existingChat = chats.find(c =>
                    c.participants.includes(currentUserId) &&
                    c.participants.includes(otherPartyId) &&
                    (isDirectMessage ? c.jobTitle === 'Direct Message' : c.jobTitle === jobTitle)
                );

                if (existingChat) {
                    // eslint-disable-next-line react-hooks/set-state-in-effect
                    setApplied(true);
                } else {
                    setApplied(false);
                }
            }
        }
    }, [user, role, employerName, seekerName, jobTitle, isDirectMessage]);

    const handleApply = () => {
        if (!user) {
            showToast('Please sign in to apply', 'error');
            return;
        }

        // Determine IDs and Names
        let eId, sId, eName, sName;

        if (role === 'employer') {
            // Employer contacting Seeker
            eId = user.name;
            sId = seekerName || 'Seeker';
            eName = eId;
            sName = sId;
        } else {
            // Seeker applying to Employer
            eId = employerName;
            sId = user.name;
            eName = eId;
            sName = sId;
        }

        // 1. Unlock the seeker's profile (simulated)
        unlockService.unlockProfile(sId, 'APPLICATION');

        // 2. Create a chat
        const message = isDirectMessage
            ? `Hi ${sName}, I'd like to discuss a potential opportunity.`
            : `Hi ${eName}, I'm interested in your ${jobTitle || 'job posting'}. Here is my application.`;

        const newChat = chatService.createChat(
            eId,
            sId,
            eName,
            sName,
            message,
            isDirectMessage ? 'Direct Message' : jobTitle
        );

        if (isDirectMessage) {
            showToast('Starting chat...', 'success');
            router.push(`/inbox?chatId=${newChat.id}`);
        } else {
            setApplied(true);
            showToast('Application sent & Profile Unlocked!', 'success');
        }
    };

    return (
        <button
            onClick={handleApply}
            disabled={applied && !isDirectMessage}
            className={`w-full py-4 font-bold rounded-xl transition-all active:scale-95 ${isDirectMessage ? 'mt-0' : 'mt-4'
                } ${applied && !isDirectMessage
                    ? 'bg-green-500 text-white cursor-default'
                    : 'bg-blue-600 hover:bg-blue-500 text-white'
                }`}
        >
            {isDirectMessage ? 'Send Message' : (applied ? 'Application Sent!' : 'Apply Now')}
        </button>
    );
}
