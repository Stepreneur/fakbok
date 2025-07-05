"use client"
import { useState, useEffect } from "react";
import { X, Send, Clock } from "lucide-react";

export default function CommentsModal({ isOpen, onClose, postId, post }) {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [loading, setLoading] = useState(false);

    // Fetch comments when modal opens
    useEffect(() => {
        if (isOpen && postId) {
            fetchComments();
        }
    }, [isOpen, postId]);

    const fetchComments = async () => {
        try {
            setLoading(true);
            const response = await fetch(`/api/posts?postId=${postId}`);
            const data = await response.json();
            
            if (data.success) {
                setComments(data.post.comments || []);
            }
        } catch (error) {
            console.error('Error fetching comments:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmitComment = async (e) => {
        e.preventDefault();
        
        if (!newComment.trim()) return;

        setIsSubmitting(true);

        try {
            const response = await fetch('/api/comments', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    postId: postId,
                    content: newComment.trim()
                }),
            });

            const data = await response.json();

            if (data.success) {
                setNewComment("");
                // Refresh comments
                fetchComments();
            }
        } catch (error) {
            console.error('Error adding comment:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const formatTimeAgo = (createdAt) => {
        const now = new Date();
        const commentTime = new Date(createdAt);
        const diffInMs = now - commentTime;
        const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
        const diffInMinutes = Math.floor((diffInMs % (1000 * 60 * 60)) / (1000 * 60));
        
        if (diffInHours > 0) {
            return `${diffInHours} ชั่วโมง`;
        } else if (diffInMinutes > 0) {
            return `${diffInMinutes} นาที`;
        } else {
            return 'เมื่อสักครู่';
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
            <div className="w-full max-w-md bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 max-h-[80vh] flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-white/20">
                    <h2 className="text-white text-xl font-bold">คอมเม้น</h2>
                    <button 
                        onClick={onClose}
                        className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
                    >
                        <X className="w-5 h-5 text-white" />
                    </button>
                </div>

                {/* Comments List */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    {loading ? (
                        <div className="text-center text-white/60">กำลังโหลดคอมเม้น...</div>
                    ) : comments.length === 0 ? (
                        <div className="text-center text-white/60">ยังไม่มีคอมเม้น</div>
                    ) : (
                        comments.map((comment) => (
                            <div key={comment.id} className="bg-white/10 rounded-xl p-4">
                                <div className="text-white text-sm leading-relaxed mb-2">
                                    {comment.content}
                                </div>
                                <div className="flex items-center gap-2 text-white/50 text-xs">
                                    <Clock size={12} />
                                    <span>{formatTimeAgo(comment.createdAt)}</span>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Comment Form */}
                <div className="p-6 border-t border-white/20">
                    <form onSubmit={handleSubmitComment} className="flex gap-2">
                        <input
                            type="text"
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="เขียนคอมเม้น..."
                            className="flex-1 bg-white/20 text-white placeholder-white/50 rounded-xl px-4 py-3 border border-white/30 focus:outline-none focus:border-white/50"
                            maxLength={200}
                        />
                        <button
                            type="submit"
                            disabled={isSubmitting || !newComment.trim()}
                            className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl flex items-center justify-center hover:from-blue-600 hover:to-purple-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Send className="w-5 h-5" />
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
} 