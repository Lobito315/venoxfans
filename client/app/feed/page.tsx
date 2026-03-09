'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';

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
    const [currentUser, setCurrentUser] = useState<any>(null);

    // Interactions
    const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState('');
    const [commentLoading, setCommentLoading] = useState(false);

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

        // Fetch feed
        fetch('http://localhost:5000/api/posts/feed')
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) setPosts(data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    const fetchComments = (postId: string) => {
        fetch(`http://localhost:5000/api/posts/${postId}/comments`)
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

        fetch(`http://localhost:5000/api/posts/${postId}/like`, {
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
        if (!newComment.trim() || !selectedPostId || !currentUser) return;

        setCommentLoading(true);
        fetch(`http://localhost:5000/api/posts/${selectedPostId}/comment`, {
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
                                    <div className="rounded-xl overflow-hidden bg-black max-h-[500px] flex items-center justify-center border border-white/5">
                                        <img src={post.mediaUrls[0]} alt="Post content" className="object-cover max-w-full" />
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
                                            <button className="bg-[#d948ef] hover:brightness-110 text-white font-bold px-8 py-2.5 rounded-full transition-all shadow-lg shadow-[#d948ef]/30">
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
                                    onClick={() => { setSelectedPostId(post.id); fetchComments(post.id); }}
                                    className="flex items-center gap-2 text-gray-400 hover:text-[#d948ef] transition-colors group"
                                >
                                    <span className="group-hover:scale-125 transition-transform duration-200">💬</span>
                                    <span className="text-xs font-semibold">{post._count?.comments || 0}</span>
                                </button>
                                <button className="flex items-center gap-2 text-gray-400 hover:text-[#d948ef] transition-colors ml-auto group">
                                    <span className="group-hover:rotate-12 transition-transform duration-200">💸</span>
                                    <span className="text-xs font-semibold uppercase tracking-tighter">Send Tip</span>
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* ── Comments Modal/Overlay ── */}
            {selectedPostId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setSelectedPostId(null)} />
                    <div className="relative w-full max-w-lg bg-[#2a1832] border border-white/10 rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
                        {/* Header */}
                        <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between bg-black/20">
                            <h3 className="font-bold text-white">Comments</h3>
                            <button onClick={() => setSelectedPostId(null)} className="w-8 h-8 rounded-full flex items-center justify-center text-gray-500 hover:text-white hover:bg-white/5 transition-all">✕</button>
                        </div>

                        {/* Comments List */}
                        <div className="p-6 h-[400px] overflow-y-auto space-y-4 no-scrollbar">
                            {comments.length === 0 ? (
                                <div className="text-center py-20">
                                    <p className="text-gray-500 mb-1">No comments yet.</p>
                                    <p className="text-xs text-[#d948ef]/60">Be the first to share your thoughts!</p>
                                </div>
                            ) : (
                                comments.map(c => (
                                    <div key={c.id} className="flex gap-3 group">
                                        <img
                                            src={c.user?.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${c.user?.username || 'user'}`}
                                            alt={c.user?.username || 'User'}
                                            className="w-9 h-9 rounded-full object-cover shrink-0 border border-white/5"
                                        />
                                        <div className="flex-1 bg-white/5 rounded-2xl p-3 border border-transparent group-hover:border-white/5 transition-colors">
                                            <div className="flex items-center justify-between gap-2 mb-1">
                                                <span className="text-sm font-bold text-white">{c.user?.username || 'Anonymous'}</span>
                                                <span className="text-[10px] text-gray-500">{timeAgo(c.createdAt)}</span>
                                            </div>
                                            <p className="text-sm text-gray-300 leading-relaxed">{c.content}</p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Input Area */}
                        <form onSubmit={handleComment} className="p-4 bg-black/40 border-t border-white/5">
                            <div className="relative">
                                <input
                                    type="text"
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    placeholder="Add a comment..."
                                    className="w-full bg-[#1f1022] border border-white/10 rounded-full py-3 pl-5 pr-14 text-sm focus:outline-none focus:border-[#d948ef]/50 transition-colors shadow-inner"
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
            )}
        </div>
    );
}
