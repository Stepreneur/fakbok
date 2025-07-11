"use client"
import { useState, useEffect, useCallback, useRef } from "react";
import { X, Send, Clock, Loader2, RefreshCw } from "lucide-react";

export default function CommentsModal({ isOpen, onClose, postId, post }) {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [loading, setLoading] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const commentsContainerRef = useRef(null);
    const scrollTimeoutRef = useRef(null);

    const fetchComments = useCallback(async (page = 1, append = false) => {
        if (!postId) return;
        
        try {
            if (page === 1) {
                setLoading(true);
            } else {
                setLoadingMore(true);
            }
            
            const response = await fetch(`/api/posts?postId=${postId}&commentPage=${page}&commentLimit=5`);
            const data = await response.json();
            
            if (data.success) {
                const newComments = data.post.comments || [];
                
                if (append) {
                    setComments(prev => [...prev, ...newComments]);
                } else {
                    setComments(newComments);
                }
                
                // ถ้าได้น้อยกว่า 5 comments แสดงว่าไม่มีอีกแล้ว
                setHasMore(newComments.length === 5);
                setCurrentPage(page);
            }
        } catch (error) {
            console.error('Error fetching comments:', error);
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    }, [postId]);

    // Fetch comments when modal opens
    useEffect(() => {
        if (isOpen && postId) {
            setComments([]);
            setCurrentPage(1);
            setHasMore(true);
            fetchComments(1, false);
        }
    }, [isOpen, postId, fetchComments]);

    // Handle scroll to load more comments with debounce
    const handleScroll = useCallback(() => {
        if (!commentsContainerRef.current || loadingMore || !hasMore) return;
        
        const { scrollTop, scrollHeight, clientHeight } = commentsContainerRef.current;
        
        // Load more when user scrolls to bottom (within 50px)
        if (scrollTop + clientHeight >= scrollHeight - 50) {
            // Clear existing timeout
            if (scrollTimeoutRef.current) {
                clearTimeout(scrollTimeoutRef.current);
            }
            
            // Set new timeout to prevent rapid calls
            scrollTimeoutRef.current = setTimeout(() => {
                if (!loadingMore && hasMore) {
                    fetchComments(currentPage + 1, true);
                }
            }, 300);
        }
    }, [loadingMore, hasMore, currentPage, fetchComments]);

    // Add scroll event listener
    useEffect(() => {
        const container = commentsContainerRef.current;
        if (container && isOpen) {
            container.addEventListener('scroll', handleScroll);
            return () => {
                container.removeEventListener('scroll', handleScroll);
                // Clear timeout on cleanup
                if (scrollTimeoutRef.current) {
                    clearTimeout(scrollTimeoutRef.current);
                }
            };
        }
    }, [handleScroll, isOpen]);

    const handleRefreshComments = async () => {
        setComments([]);
        setCurrentPage(1);
        setHasMore(true);
        fetchComments(1, false);
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
                // Refresh comments from first page
                fetchComments(1, false);
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
                    <div className="flex items-center gap-2">
                        <button 
                            onClick={handleRefreshComments}
                            disabled={loading}
                            className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <RefreshCw className={`w-4 h-4 text-white ${loading ? 'animate-spin' : ''}`} />
                        </button>
                        <button 
                            onClick={onClose}
                            className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
                        >
                            <X className="w-5 h-5 text-white" />
                        </button>
                    </div>
                </div>

                {/* Comments List */}
                <div 
                    ref={commentsContainerRef}
                    className="flex-1 overflow-y-auto p-6 space-y-4"
                >
                    {loading ? (
                        <div className="text-center text-white/60">กำลังโหลดคอมเม้น...</div>
                    ) : comments.length === 0 ? (
                        <div className="text-center text-white/60">ยังไม่มีคอมเม้น</div>
                    ) : (
                        <>
                            {comments.map((comment, index) => (
                                <div key={`${comment.id}-${comment.createdAt}-${index}`} className="bg-white/10 rounded-xl p-4">
                                    <div className="text-white text-sm leading-relaxed mb-2">
                                        {comment.content}
                                    </div>
                                    <div className="flex items-center gap-2 text-white/50 text-xs">
                                        <Clock size={12} />
                                        <span>{formatTimeAgo(comment.createdAt)}</span>
                                    </div>
                                </div>
                            ))}
                            
                            {/* Loading more indicator */}
                            {loadingMore && (
                                <div className="flex items-center justify-center py-4">
                                    <Loader2 className="w-5 h-5 text-white/60 animate-spin" />
                                    <span className="ml-2 text-white/60 text-sm">กำลังโหลดคอมเม้นเพิ่ม...</span>
                                </div>
                            )}
                            
                            {/* End of comments indicator */}
                            {!hasMore && comments.length > 0 && (
                                <div className="text-center text-white/40 text-sm py-4">
                                    ไม่มีคอมเม้นเพิ่มเติม
                                </div>
                            )}
                        </>
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