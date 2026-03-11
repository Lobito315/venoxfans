'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

interface Creator {
    id: string;
    username: string;
    avatarUrl: string | null;
    coverUrl: string | null;
    bio: string | null;
    isCreator: boolean;
    subscriptionPrice: number | null;
}

interface Post {
    id: string;
    content: string | null;
    mediaUrls: string[];
    isPremium: boolean;
    price: number | null;
    createdAt: string;
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

const FALLBACK_COVER = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop';

function timeAgo(dateStr: string) {
    const diff = Date.now() - new Date(dateStr).getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
}

type Tab = 'Posts' | 'Media' | 'Streams' | 'Collections';
const TABS: Tab[] = ['Posts', 'Media', 'Streams', 'Collections'];

export default function CreatorProfilePage() {
    const params = useParams();
    const username = params?.username as string;

    const [creator, setCreator] = useState<Creator | null>(null);
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<Tab>('Posts');
    const [isFollowing, setIsFollowing] = useState(false);

    // Interactions
    const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState('');
    const [commentLoading, setCommentLoading] = useState(false);
    const [currentUser, setCurrentUser] = useState<any>(null);

    useEffect(() => {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            try {
                setCurrentUser(JSON.parse(userStr));
            } catch (e) {
                console.error('Error parsing user from localStorage', e);
            }
        }
    }, []);

    const fetchComments = (postId: string) => {
        fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/posts/${postId}/comments`)
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

        fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/posts/${postId}/like`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: currentUser.id })
        })
            .then(res => res.json())
            .then(data => {
                // Update post count from backend
                setPosts(prev => prev.map(p => {
                    if (p.id === postId) {
                        return {
                            ...p,
                            _count: {
                                ...p._count,
                                likes: data.count
                            }
                        };
                    }
                    return p;
                }));
            });
    };

    const handleComment = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim() || !selectedPostId) return;
        if (!currentUser) {
            alert('Please login to comment');
            return;
        }

        setCommentLoading(true);
        fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/posts/${selectedPostId}/comment`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: currentUser.id, content: newComment })
        })
            .then(res => res.json())
            .then(comment => {
                setComments(prev => [comment, ...prev]);
                setNewComment('');
                setCommentLoading(false);
                // Update post count
                setPosts(prev => prev.map(p => p.id === selectedPostId ? { ...p, _count: { ...p._count, comments: p._count.comments + 1 } } : p));
            })
            .catch(() => setCommentLoading(false));
    };

    useEffect(() => {
        if (!username) return;
        fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/users/${username}`)
            .then(res => res.json())
            .then(data => {
                if (data && !data.error) {
                    setCreator(data);
                    return fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/posts/creator/${data.id}`);
                }
                return Promise.resolve(null); // If no creator found or error, prevent next .then from trying to fetch posts
            })
            .then(res => res?.json())
            .then(data => {
                if (Array.isArray(data)) setPosts(data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [username]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 rounded-full border-4 border-[#d948ef] border-t-transparent animate-spin" />
                    <p className="text-gray-400 text-sm">Loading profile...</p>
                </div>
            </div>
        );
    }

    if (!creator) {
        return (
            <div className="max-w-2xl mx-auto px-4 py-24 text-center">
                <div className="glass rounded-3xl p-20 border border-white/5">
                    <div className="text-7xl mb-6">👤</div>
                    <h1 className="text-3xl font-bold mb-3">User not found</h1>
                    <p className="text-gray-400 mb-8">The profile @{username} doesn't exist on VenoxFans.</p>
                    <Link href="/explore" className="inline-block bg-[#d948ef] hover:brightness-110 px-8 py-3 rounded-full font-semibold transition-all shadow-lg shadow-[#d948ef]/30">
                        Discover Creators
                    </Link>
                </div>
            </div>
        );
    }

    const avatarSrc = creator.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${creator.username}`;
    const coverSrc = creator.coverUrl || FALLBACK_COVER;

    const totalLikes = posts.reduce((acc, p) => acc + (p._count?.likes || 0), 0);
    const formattedLikes = totalLikes >= 1000 ? `${(totalLikes / 1000).toFixed(1)}K` : totalLikes.toString();

    const publicPosts = posts.filter(p => !p.isPremium);
    const mediaPosts = posts.filter(p => p.mediaUrls?.length > 0);

    const gridPosts = activeTab === 'Posts' ? posts
        : activeTab === 'Media' ? mediaPosts
            : [];

    return (
        <div className="pb-20">
            {/* ── Hero Banner ── */}
            <div className="relative h-56 md:h-80 w-full overflow-hidden">
                <img
                    src={coverSrc}
                    alt="Cover"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/70" />
            </div>

            <div className="max-w-6xl mx-auto px-4 sm:px-6">
                {/* ── Profile Header ── */}
                <div className="relative -mt-20 md:-mt-24 flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/10">
                    {/* Avatar + Info */}
                    <div className="flex flex-col md:flex-row gap-5 items-start md:items-end">
                        {/* Avatar */}
                        <div className="relative shrink-0">
                            <img
                                src={avatarSrc}
                                alt={creator.username}
                                className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-[#0f1115] object-cover shadow-2xl"
                            />
                            <span className="absolute bottom-2 right-2 w-5 h-5 bg-green-500 border-2 border-[#0f1115] rounded-full shadow-lg" title="Online" />
                        </div>

                        {/* Name / Handle / Stats */}
                        <div className="mb-2">
                            <div className="flex items-center gap-2 flex-wrap">
                                <h1 className="text-2xl md:text-3xl font-bold">{creator.username}</h1>
                                {creator.isCreator && (
                                    <span className="flex items-center gap-1 text-xs font-bold bg-[#d948ef]/15 text-[#d948ef] px-2.5 py-1 rounded-full border border-[#d948ef]/20">
                                        ✓ Verified
                                    </span>
                                )}
                            </div>
                            <p className="text-gray-400 text-sm mt-0.5">@{creator.username}</p>
                            <div className="flex gap-5 mt-3 text-sm">
                                <div><span className="font-bold text-white">{formattedLikes}</span> <span className="text-gray-400">Likes</span></div>
                                <div><span className="font-bold text-white">{posts.length}</span> <span className="text-gray-400">Posts</span></div>
                                {creator.isCreator && (
                                    <div><span className="font-bold text-white">—</span> <span className="text-gray-400">Subscribers</span></div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 mb-2 w-full md:w-auto">
                        {/* DM */}
                        <button
                            className="w-12 h-12 rounded-full glass border border-[#d948ef]/20 flex items-center justify-center text-gray-300 hover:text-[#d948ef] hover:border-[#d948ef]/40 transition-all shrink-0"
                            title="Send message"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                            </svg>
                        </button>

                        {/* Follow */}
                        <button
                            onClick={() => setIsFollowing(f => !f)}
                            className={`flex-1 md:flex-none md:px-8 h-12 rounded-full font-bold text-sm transition-all border ${isFollowing
                                ? 'bg-[#d948ef]/20 border-[#d948ef]/40 text-[#e879f9]'
                                : 'border-[#d948ef] text-[#d948ef] hover:bg-[#d948ef]/10'
                                }`}
                        >
                            {isFollowing ? 'Following ✓' : 'Follow'}
                        </button>

                        {/* Subscribe */}
                        {creator.isCreator && (
                            <button className="flex-1 md:flex-none md:px-8 h-12 rounded-full bg-[#d948ef] text-white font-bold text-sm hover:brightness-110 shadow-lg shadow-[#d948ef]/30 transition-all">
                                Subscribe ${creator.subscriptionPrice?.toFixed(2) || '9.99'}/mo
                            </button>
                        )}
                    </div>
                </div>

                {/* ── Bio ── */}
                <div className="py-5 max-w-3xl">
                    <p className="text-gray-300 leading-relaxed mb-3">
                        {creator.bio || (creator.isCreator
                            ? 'Digital creator sharing exclusive content with subscribers. 💖'
                            : 'Fan of great content.')}
                    </p>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1.5">
                            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                            Worldwide
                        </span>
                        <span className="flex items-center gap-1.5">
                            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
                            venoxfans.com/@{creator.username}
                        </span>
                    </div>
                </div>

                {/* ── Tabs ── */}
                <div className="flex border-b border-white/10 overflow-x-auto no-scrollbar mb-8">
                    {TABS.map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-6 py-4 text-sm font-semibold whitespace-nowrap transition-colors border-b-2 -mb-px ${activeTab === tab
                                ? 'border-[#d948ef] text-[#d948ef]'
                                : 'border-transparent text-gray-500 hover:text-gray-300'
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* ── Content Grid ── */}
                {(activeTab === 'Streams' || activeTab === 'Collections') ? (
                    <div className="text-center py-24 glass rounded-2xl border border-white/5">
                        <div className="text-5xl mb-4">{activeTab === 'Streams' ? '🎙️' : '🗂️'}</div>
                        <p className="text-gray-400">No {activeTab.toLowerCase()} available yet.</p>
                    </div>
                ) : gridPosts.length === 0 ? (
                    <div className="text-center py-24 glass rounded-2xl border border-white/5">
                        <div className="text-5xl mb-4">📭</div>
                        <p className="text-gray-400">No posts yet.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {gridPosts.map(post => {
                            const isLocked = post.isPremium;
                            const thumb = post.mediaUrls?.[0];

                            if (isLocked) {
                                return (
                                    <div key={post.id} className="relative aspect-square rounded-2xl overflow-hidden">
                                        {/* Blurred background */}
                                        {thumb ? (
                                            <img src={thumb} alt="locked" className="w-full h-full object-cover blur-2xl scale-110" />
                                        ) : (
                                            <div className="w-full h-full bg-gradient-to-br from-[#d948ef]/30 to-[#7c3aed]/20" />
                                        )}
                                        {/* Overlay */}
                                        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center p-5 text-center">
                                            <div className="w-14 h-14 rounded-full bg-[#d948ef]/20 border border-[#d948ef]/30 flex items-center justify-center mb-3">
                                                <svg className="w-6 h-6 text-[#d948ef]" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                                                    <rect width="18" height="11" x="3" y="11" rx="2" ry="2" strokeLinecap="round" strokeLinejoin="round" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 11V7a5 5 0 0 1 10 0v4" />
                                                </svg>
                                            </div>
                                            <p className="text-white font-bold text-sm mb-1">
                                                {post.price ? `Unlock for $${post.price}` : 'Subscribers Only'}
                                            </p>
                                            <p className="text-gray-400 text-xs mb-4 line-clamp-2">{post.content || 'Exclusive content'}</p>
                                            <button className="w-full bg-[#d948ef] text-white text-xs font-bold py-2.5 rounded-full hover:brightness-110 transition-all shadow-lg shadow-[#d948ef]/25">
                                                {post.price ? `Unlock $${post.price}` : `Subscribe $${creator.subscriptionPrice?.toFixed(2) || '9.99'}`}
                                            </button>
                                        </div>
                                    </div>
                                );
                            }

                            // Public post
                            return (
                                <div key={post.id} className="aspect-square rounded-2xl overflow-hidden group cursor-pointer relative bg-surface">
                                    {thumb ? (
                                        <img
                                            src={thumb}
                                            alt="Post"
                                            className="w-full h-full object-contain bg-black group-hover:scale-105 transition duration-500"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-br from-[#d948ef]/20 to-[#7c3aed]/10 flex items-center justify-center p-4 text-center">
                                            <p className="text-sm text-white line-clamp-4">{post.content}</p>
                                        </div>
                                    )}
                                    {/* Hover overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                                        <p className="text-white text-xs line-clamp-2 mb-2">{post.content}</p>
                                        <div className="flex items-center gap-3 text-gray-300 text-xs shadow-text">
                                            <button
                                                onClick={(e) => { e.stopPropagation(); handleLike(post.id); }}
                                                className="flex items-center gap-1 hover:text-[#d948ef] transition-colors"
                                            >
                                                <span>❤️</span> {post._count?.likes || 0}
                                            </button>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); setSelectedPostId(post.id); fetchComments(post.id); }}
                                                className="flex items-center gap-1 hover:text-[#d948ef] transition-colors"
                                            >
                                                <span>💬</span> {post._count?.comments || 0}
                                            </button>
                                            <span className="ml-auto">{timeAgo(post.createdAt)}</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* ── Comments Modal/Overlay ── */}
            {selectedPostId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setSelectedPostId(null)} />
                    <div className="relative w-full max-w-lg bg-[#2a1832] border border-white/10 rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
                        {/* Header */}
                        <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
                            <h3 className="font-bold text-white">Comments</h3>
                            <button onClick={() => setSelectedPostId(null)} className="text-gray-500 hover:text-white">✕</button>
                        </div>

                        {/* Comments List */}
                        <div className="p-6 h-[400px] overflow-y-auto space-y-4 no-scrollbar">
                            {comments.length === 0 ? (
                                <p className="text-center text-gray-500 py-10">No comments yet. Be the first!</p>
                            ) : (
                                comments.map(c => (
                                    <div key={c.id} className="flex gap-3">
                                        <img
                                            src={c.user.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${c.user.username}`}
                                            alt={c.user.username}
                                            className="w-8 h-8 rounded-full object-cover shrink-0"
                                        />
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between gap-2">
                                                <span className="text-sm font-bold text-white">{c.user.username}</span>
                                                <span className="text-[10px] text-gray-500">{timeAgo(c.createdAt)}</span>
                                            </div>
                                            <p className="text-sm text-gray-300 mt-0.5">{c.content}</p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Input Area */}
                        <form onSubmit={handleComment} className="p-4 bg-black/20 border-t border-white/5">
                            <div className="relative">
                                <input
                                    type="text"
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    placeholder="Add a comment..."
                                    className="w-full bg-white/5 border border-white/10 rounded-full py-2.5 pl-5 pr-12 text-sm focus:outline-none focus:border-[#d948ef]/50 transition-colors"
                                />
                                <button
                                    type="submit"
                                    disabled={commentLoading || !newComment.trim()}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[#d948ef] text-white flex items-center justify-center hover:brightness-110 disabled:opacity-50 disabled:grayscale transition-all"
                                >
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" /></svg>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
