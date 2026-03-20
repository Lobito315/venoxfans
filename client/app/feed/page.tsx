'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { isVideoUrl, getCleanMediaUrl } from '../utils/media_utils';
import { getApiUrl } from '../utils/apiConfig';
import PayPalCheckout from '@/components/PayPalCheckout';

interface Post {
    id: string;
    content: string | null;
    mediaUrls: string[];
    isPremium: boolean;
    price: number | null;
    createdAt: string;
    creator: {
        id: string;
        username: string;
        avatarUrl: string | null;
    };
    _count: { likes: number; comments: number };
}

interface Comment {
    id: string;
    content: string;
    createdAt: string;
    user: {
        username: string;
        avatarUrl: string | null;
    };
}

function timeAgo(dateStr: string) {
    const diff = Date.now() - new Date(dateStr).getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
}

export default function FeedPage() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [currentUser, setCurrentUser] = useState<any>(null);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    // Interactions
    const [selectedPost, setSelectedPost] = useState<Post | null>(null);
    const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState('');
    const [commentLoading, setCommentLoading] = useState(false);
    
    // PayPal Checkout State
    const [showCheckout, setShowCheckout] = useState(false);
    const [checkoutData, setCheckoutData] = useState<{ type: 'SUBSCRIPTION' | 'PURCHASE', targetId: string, amount: number } | null>(null);

    useEffect(() => {
        // Get user session
        const userStr = localStorage.getItem('user');
        if (userStr) {
            try {
                setCurrentUser(JSON.parse(userStr));
            } catch (e) {
                console.error('Error parsing user', e);
            }
        }

        fetchPosts(1, true);
    }, []);

    const fetchPosts = (pageToFetch: number, isInitial = false) => {
        if (isInitial) setLoading(true);
        else setLoadingMore(true);

        fetch(`${getApiUrl()}/api/posts/feed?page=${pageToFetch}&limit=10`)
            .then(res => res.json())
            .then(data => {
                const fetchedPosts = data.posts || [];
                if (isInitial) {
                    setPosts(fetchedPosts);
                } else {
                    setPosts(prev => [...prev, ...fetchedPosts]);
                }
                
                setHasMore(pageToFetch < (data.metadata?.totalPages || 1));
                setPage(pageToFetch);
                setLoading(false);
                setLoadingMore(false);
            })
            .catch(() => {
                setLoading(false);
                setLoadingMore(false);
            });
    };

    const loadMore = () => {
        if (loadingMore || !hasMore) return;
        fetchPosts(page + 1);
    };

    const fetchComments = (postId: string) => {
        fetch(`${getApiUrl()}/api/posts/${postId}/comments`)
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) setComments(data);
            });
    };

    const handleLike = (postId: string) => {
        if (!currentUser) {
            alert('Please login to like posts');
            return;
        }

        fetch(`${getApiUrl()}/api/posts/${postId}/like`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: currentUser.id })
        })
            .then(res => res.json())
            .then(data => {
                setPosts(prev => prev.map(p => p.id === postId ? { ...p, _count: { ...p._count, likes: data.count } } : p));
            });
    };

    const handleComment = (e: React.FormEvent) => {
        e.preventDefault();
        const selectedPostId = selectedPost?.id;
        if (!newComment.trim() || !selectedPostId || !currentUser) return;

        setCommentLoading(true);
        fetch(`${getApiUrl()}/api/posts/${selectedPostId}/comment`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: currentUser.id, content: newComment })
        })
            .then(res => res.json())
            .then(comment => {
                setComments(prev => [comment, ...prev]);
                setNewComment('');
                setCommentLoading(false);
                setPosts(prev => prev.map(p => p.id === selectedPostId ? { ...p, _count: { ...p._count, comments: p._count.comments + 1 } } : p));
            })
            .catch(() => setCommentLoading(false));
    const openCheckout = (type: 'SUBSCRIPTION' | 'PURCHASE', targetId: string, amount: number) => {
        if (!currentUser) {
            alert('Please login to continue');
            return;
        }
        setCheckoutData({ type, targetId, amount });
        setShowCheckout(true);
    };

    const handleCheckoutSuccess = () => {
        setShowCheckout(false);
        alert('Payment successful! Your access will be updated shortly.');
        window.location.reload();
    };

    return (
        <div className="max-w-2xl mx-auto px-4 py-8">
            {/* Create Post Input */}
            <div className="glass rounded-2xl p-4 mb-8 flex gap-4 items-center cursor-pointer hover:bg-white/5 transition-colors border border-[#d948ef]/10">
                <div className="w-10 h-10 rounded-full bg-[#d948ef] flex items-center justify-center text-sm font-bold text-white uppercase">
                    {currentUser?.username?.substring(0, 2) || 'ME'}
                </div>
                <div className="text-gray-500 bg-background/50 rounded-full px-4 py-2 flex-grow h-10 flex items-center border border-white/5">
                    What's on your mind?
                </div>
                <button className="text-[#d948ef] hover:text-[#e879f9] px-2 text-xl transition-colors">📸</button>
            </div>

            {/* Feed Stream */}
            <div className="space-y-6">
                {loading ? (
                    <div className="flex flex-col items-center py-20 gap-4">
                        <div className="w-10 h-10 rounded-full border-4 border-[#d948ef] border-t-transparent animate-spin" />
                        <p className="text-gray-400 text-sm">Brewing your feed...</p>
                    </div>
                ) : posts.length === 0 ? (
                    <div className="text-center py-20 glass rounded-2xl border border-white/5">
                        <span className="text-5xl block mb-4">🏜️</span>
                        <p className="text-gray-400">The feed is empty. Start following creators!</p>
                    </div>
                ) : (
                    posts.map(post => (
                        <div key={post.id} className="glass rounded-2xl overflow-hidden border border-white/5 shadow-2xl shadow-[#d948ef]/5">
                            {/* Post Header */}
                            <div className="p-4 flex items-center justify-between border-b border-white/5">
                                <Link href={`/${post.creator.username}`} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                                    <img
                                        src={post.creator.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${post.creator.username}`}
                                        alt={post.creator.username}
                                        className="w-10 h-10 rounded-full object-cover"
                                    />
                                    <div>
                                        <h3 className="font-bold text-sm text-white">{post.creator.username}</h3>
                                        <p className="text-gray-400 text-[10px] uppercase tracking-wider">{post.creator.username} • {timeAgo(post.createdAt)}</p>
                                    </div>
                                </Link>
                                <button className="text-gray-500 hover:text-white transition-colors">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" /></svg>
                                </button>
                            </div>

                            {/* Post Content */}
                            <div className="p-4">
                                <p className="text-sm text-gray-200 mb-4 whitespace-pre-wrap leading-relaxed">{post.content}</p>

                                {/* Media Handling */}
                                {post.mediaUrls?.[0] && !post.isPremium && (
                                    <div className="rounded-xl overflow-hidden bg-black max-h-[600px] w-full flex items-center justify-center border border-white/5 cursor-pointer" onClick={() => { setSelectedPost(post); setCurrentMediaIndex(0); fetchComments(post.id); }}>
                                        {isVideoUrl(post.mediaUrls[0]) ? (
                                            <div className="w-full h-full relative">
                                                <video src={getCleanMediaUrl(post.mediaUrls[0])} controls className="max-w-full max-h-[600px] w-auto h-auto" />
                                                <div className="absolute top-3 right-3 bg-black/50 px-2 py-1 rounded text-[10px] text-white font-bold pointer-events-none">VIDEO</div>
                                            </div>
                                        ) : (
                                            <img src={getCleanMediaUrl(post.mediaUrls[0])} alt="Post content" className="object-contain max-w-full max-h-[600px] w-auto h-auto" />
                                        )}
                                    </div>
                                )}

                                {/* Paywall Overlay */}
                                {post.isPremium && (
                                    <div className="relative rounded-xl overflow-hidden bg-surface flex flex-col items-center justify-center h-72 border border-[#d948ef]/20 group">
                                        <div className="absolute inset-0 bg-[#d948ef]/5 blur-3xl scale-125"></div>
                                        <div className="relative z-10 flex flex-col items-center text-center p-6">
                                            <div className="w-16 h-16 rounded-full bg-[#d948ef]/20 border border-[#d948ef]/30 flex items-center justify-center mb-4 transition-transform group-hover:scale-110 duration-300">
                                                <span className="text-3xl">🔒</span>
                                            </div>
                                            <h4 className="font-bold text-lg mb-2 text-white">Premium Content</h4>
                                            <p className="text-gray-400 text-sm mb-6">
                                                {post.price ? `Purchase for $${post.price.toFixed(2)}` : 'Exclusive for subscribers'}
                                            </p>
                                            <button 
                                                onClick={() => openCheckout('PURCHASE', post.id, post.price || 0)}
                                                className="bg-[#d948ef] hover:brightness-110 text-white font-bold px-8 py-2.5 rounded-full transition-all shadow-lg shadow-[#d948ef]/30"
                                            >
                                                {post.price ? `Unlock $${post.price.toFixed(2)}` : 'Subscribe to View'}
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Engagement Buttons */}
                            <div className="px-4 py-3 flex items-center gap-6 border-t border-white/5">
                                <button
                                    onClick={() => handleLike(post.id)}
                                    className="flex items-center gap-2 text-gray-400 hover:text-[#d948ef] transition-colors group"
                                >
                                    <span className="group-hover:scale-125 transition-transform duration-200">❤️</span>
                                    <span className="text-xs font-semibold">{post._count?.likes || 0}</span>
                                </button>
                                <button
                                    onClick={() => { setSelectedPost(post); setCurrentMediaIndex(0); fetchComments(post.id); }}
                                    className="flex items-center gap-2 text-gray-400 hover:text-[#d948ef] transition-colors group"
                                >
                                    <span className="group-hover:scale-125 transition-transform duration-200">💬</span>
                                    <span className="text-xs font-semibold">{post._count?.comments || 0}</span>
                                </button>
                                <button 
                                    onClick={() => openCheckout('PURCHASE', post.id, 5)} // Example $5 tip
                                    className="flex items-center gap-2 text-gray-400 hover:text-[#d948ef] transition-colors ml-auto group"
                                >
                                    <span className="group-hover:rotate-12 transition-transform duration-200">💸</span>
                                    <span className="text-xs font-semibold uppercase tracking-tighter">Send Tip $5</span>
                                </button>
                            </div>
                        </div>
                    ))
                )}

                {/* Pagination Controls */}
                {!loading && hasMore && (
                    <div className="flex justify-center py-8">
                        <button 
                            onClick={loadMore}
                            disabled={loadingMore}
                            className="bg-white/5 hover:bg-white/10 text-white border border-white/10 px-8 py-3 rounded-full transition-all flex items-center gap-2 group"
                        >
                            {loadingMore ? (
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <span className="group-hover:translate-y-1 transition-transform">⬇️</span>
                            )}
                            {loadingMore ? 'Loading journey...' : 'Load more adventures'}
                        </button>
                    </div>
                )}

                {!loading && !hasMore && posts.length > 0 && (
                    <div className="text-center py-12 opacity-30 select-none">
                        <p className="text-xs uppercase tracking-[0.2em]">You've reached the edge of the universe</p>
                    </div>
                )}
            </div>

            {/* ── Post Viewer Modal ── */}
            {selectedPost && (() => {
                const currentPost = posts.find(p => p.id === selectedPost.id) || selectedPost;
                return (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 md:p-6">
                        <div className="absolute inset-0 bg-black/95 backdrop-blur-xl" onClick={() => setSelectedPost(null)} />
                        <button onClick={() => setSelectedPost(null)} className="absolute top-4 right-4 md:top-6 md:right-6 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white z-[110] transition-colors">
                            ✕
                        </button>
                        
                        <div className="relative w-full max-w-6xl h-full max-h-[90vh] bg-[#1a0f1e] border border-white/10 rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row animate-in zoom-in-95 duration-200">
                            {/* Left Side: Media Carousel */}
                            <div className="w-full md:w-3/5 lg:w-2/3 max-h-[50vh] md:max-h-none bg-black flex items-center justify-center overflow-hidden relative group/media">
                                {currentPost.mediaUrls?.length > 0 ? (
                                    <>
                                        {(() => {
                                            const rawUrl = currentPost.mediaUrls[currentMediaIndex] || currentPost.mediaUrls[0];
                                            const url = getCleanMediaUrl(rawUrl);
                                            const isVideo = isVideoUrl(url);
                                            
                                            return isVideo ? (
                                                <video 
                                                    key={url}
                                                    src={url} 
                                                    controls 
                                                    autoPlay 
                                                    className="w-full h-full object-contain max-h-[50vh] md:max-h-[90vh]" 
                                                />
                                            ) : (
                                                <img 
                                                    key={url}
                                                    src={url} 
                                                    alt="Post" 
                                                    className="w-full h-full object-contain max-h-[50vh] md:max-h-[90vh]" 
                                                />
                                            );
                                        })()}

                                        {/* Carousel Controls */}
                                        {currentPost.mediaUrls.length > 1 && (
                                            <>
                                                <button 
                                                    onClick={(e) => { e.stopPropagation(); setCurrentMediaIndex(prev => (prev > 0 ? prev - 1 : currentPost.mediaUrls.length - 1)); }}
                                                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-[#d948ef]/80 rounded-full flex items-center justify-center text-white opacity-0 group-hover/media:opacity-100 transition-all z-20"
                                                >
                                                    ←
                                                </button>
                                                <button 
                                                    onClick={(e) => { e.stopPropagation(); setCurrentMediaIndex(prev => (prev < currentPost.mediaUrls.length - 1 ? prev + 1 : 0)); }}
                                                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-[#d948ef]/80 rounded-full flex items-center justify-center text-white opacity-0 group-hover/media:opacity-100 transition-all z-20"
                                                >
                                                    →
                                                </button>
                                                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
                                                    {currentPost.mediaUrls.map((_, i) => (
                                                        <div key={i} className={`w-1.5 h-1.5 rounded-full transition-all ${i === currentMediaIndex ? 'bg-[#d948ef] w-4' : 'bg-white/40'}`} />
                                                    ))}
                                                </div>
                                            </>
                                        )}
                                    </>
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-[#d948ef]/20 to-[#7c3aed]/10 flex items-center justify-center p-8 text-center min-h-[30vh]">
                                        <p className="text-lg md:text-2xl text-white font-medium">{currentPost.content}</p>
                                    </div>
                                )}
                            </div>

                            {/* Right Side: Info & Comments */}
                            <div className="w-full md:w-2/5 lg:w-1/3 flex flex-col bg-[#2a1832] h-[40vh] md:h-full flex-grow">
                                {/* Header / Author */}
                                <div className="px-5 py-4 border-b border-white/5 flex items-center gap-3 shrink-0">
                                    <img
                                        src={currentPost.creator.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentPost.creator.username}`}
                                        alt={currentPost.creator.username || 'User'}
                                        className="w-10 h-10 rounded-full object-cover shrink-0 border border-white/10"
                                    />
                                    <div>
                                        <h3 className="font-bold text-white text-sm">{currentPost.creator.username}</h3>
                                        <span className="text-[10px] text-gray-500 uppercase tracking-wider">{timeAgo(currentPost.createdAt)}</span>
                                    </div>
                                </div>

                                {/* Caption (if media exists) */}
                                {currentPost.mediaUrls?.[0] && currentPost.content && (
                                    <div className="px-5 py-3 border-b border-white/5 shrink-0">
                                        <p className="text-sm text-gray-200 leading-relaxed whitespace-pre-wrap">{currentPost.content}</p>
                                    </div>
                                )}

                                {/* Stats */}
                                <div className="px-5 py-3 flex items-center gap-6 border-b border-white/5 shrink-0 text-sm">
                                    <button
                                        onClick={() => handleLike(currentPost.id)}
                                        className="flex items-center gap-2 text-gray-400 hover:text-[#d948ef] transition-colors group"
                                    >
                                        <span className="group-hover:scale-125 transition-transform duration-200">❤️</span>
                                        <span className="font-semibold">{currentPost._count?.likes || 0}</span>
                                    </button>
                                    <div className="flex items-center gap-2 text-gray-400">
                                        <span>💬</span>
                                        <span className="font-semibold">{currentPost._count?.comments || 0}</span>
                                    </div>
                                </div>

                                {/* Comments List */}
                                <div className="p-5 flex-1 overflow-y-auto space-y-4 no-scrollbar">
                                    {comments.length === 0 ? (
                                        <div className="text-center py-10 flex flex-col items-center opacity-50">
                                            <span className="text-3xl mb-2">🎈</span>
                                            <p className="text-sm text-white">No comments yet</p>
                                            <p className="text-xs text-white">Start the conversation!</p>
                                        </div>
                                    ) : (
                                        comments.map(c => (
                                            <div key={c.id} className="flex gap-3">
                                                <img
                                                    src={c.user.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${c.user.username}`}
                                                    alt={c.user.username}
                                                    className="w-8 h-8 rounded-full object-cover shrink-0 border border-white/10"
                                                />
                                                <div className="flex-1 bg-black/20 rounded-2xl rounded-tl-sm p-3 border border-white/5">
                                                    <div className="flex items-center justify-between gap-2 mb-1">
                                                        <span className="text-xs font-bold text-white max-w-[120px] truncate">{c.user.username}</span>
                                                        <span className="text-[10px] text-gray-500 shrink-0">{timeAgo(c.createdAt)}</span>
                                                    </div>
                                                    <p className="text-xs text-gray-300 leading-relaxed">{c.content}</p>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>

                                {/* Input Area */}
                                <form onSubmit={handleComment} className="p-4 bg-black/40 border-t border-white/5 shrink-0">
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={newComment}
                                            onChange={(e) => setNewComment(e.target.value)}
                                            placeholder="Add a comment..."
                                            className="w-full bg-[#1f1022] border border-white/10 rounded-full py-3.5 pl-5 pr-14 text-sm focus:outline-none focus:border-[#d948ef]/50 transition-colors shadow-inner text-white placeholder:text-gray-500"
                                        />
                                        <button
                                            type="submit"
                                            disabled={commentLoading || !newComment.trim()}
                                            className="absolute right-1.5 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[#d948ef] text-white flex items-center justify-center hover:brightness-110 disabled:opacity-50 disabled:grayscale transition-all shadow-lg shadow-[#d948ef]/40"
                                        >
                                            <svg className="w-5 h-5 ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" /></svg>
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                );
            })()}
            {/* ── Checkout Modal ── */}
            {showCheckout && checkoutData && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowCheckout(false)} />
                    <div className="relative bg-[#1a0f1e] border border-white/10 rounded-3xl p-8 max-w-md w-full animate-in zoom-in-95 duration-200">
                        <button onClick={() => setShowCheckout(false)} className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors">
                            ✕
                        </button>
                        <h2 className="text-2xl font-bold mb-2">Complete Payment</h2>
                        <p className="text-gray-400 mb-6">
                            {checkoutData.type === 'SUBSCRIPTION' 
                                ? `Subscribe for $${checkoutData.amount.toFixed(2)}/month.`
                                : `Unlock this post for a one-time payment of $${checkoutData.amount.toFixed(2)}.`
                            }
                        </p>
                        
                        <div className="space-y-4">
                            <PayPalCheckout 
                                amount={checkoutData.amount}
                                type={checkoutData.type}
                                targetId={checkoutData.targetId}
                                onSuccess={handleCheckoutSuccess}
                                onError={(err) => alert('Payment error: ' + (err.message || 'Unknown error'))}
                            />
                            
                            <p className="text-[10px] text-center text-gray-600 px-4">
                                By completing the payment, you agree to our Terms of Service. Payments are processed securely via PayPal.
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
