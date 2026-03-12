'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getApiUrl } from '../../../utils/apiConfig';

interface Post {
    id: string;
    content: string | null;
    mediaUrls: string[];
    isPremium: boolean;
    price: number | null;
    createdAt: string;
    _count: { likes: number; comments: number };
}

export default function CreatorPosts() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [userId, setUserId] = useState<string | null>(null);
    const [deleting, setDeleting] = useState<string | null>(null);

    useEffect(() => {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            try {
                const user = JSON.parse(userStr);
                setUserId(user.id);
                fetchPosts(user.id);
            } catch (e) { setLoading(false); }
        } else {
            setLoading(false);
        }
    }, []);

    const fetchPosts = async (id: string) => {
        setLoading(true);
        try {
            const res = await fetch(`${getApiUrl()}/api/posts/creator/${id}`);
            const data = await res.json();
            if (Array.isArray(data)) setPosts(data);
        } catch (e) { }
        setLoading(false);
    };

    const handleDelete = async (postId: string) => {
        if (!confirm('Are you sure you want to delete this post? This action cannot be undone.')) return;
        setDeleting(postId);
        try {
            const res = await fetch(`${getApiUrl()}/api/posts/${postId}`, { method: 'DELETE' });
            if (res.ok) {
                setPosts(prev => prev.filter(p => p.id !== postId));
            } else {
                alert('Failed to delete post. Please try again.');
            }
        } catch (e) {
            alert('Error deleting post.');
        }
        setDeleting(null);
    };

    const formatDate = (dateStr: string) =>
        new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

    return (
        <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col md:flex-row gap-8">
            <aside className="w-full md:w-64 glass rounded-2xl p-6 h-fit shrink-0">
                <h2 className="text-xl font-bold mb-8 gradient-text">Creator Studio</h2>
                <nav className="space-y-2">
                    <Link href="/dashboard/creator" className="block px-4 py-3 rounded-xl hover:bg-white/5 text-gray-300 font-medium transition">Overview</Link>
                    <Link href="/dashboard/creator/posts" className="block px-4 py-3 rounded-xl bg-purple-600/20 text-purple-400 font-medium">Content Manager</Link>
                    <Link href="/dashboard/creator/subscribers" className="block px-4 py-3 rounded-xl hover:bg-white/5 text-gray-300 font-medium transition">Subscribers List</Link>
                    <Link href="/dashboard/creator/payouts" className="block px-4 py-3 rounded-xl hover:bg-white/5 text-gray-300 font-medium transition">Earnings &amp; Payouts</Link>
                    <Link href="/dashboard/creator/settings" className="block px-4 py-3 rounded-xl hover:bg-white/5 text-gray-300 font-medium transition">Page Settings</Link>
                </nav>
            </aside>

            <main className="flex-grow space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold">Content Manager</h1>
                        <p className="text-gray-400 text-sm mt-1">{posts.length} post{posts.length !== 1 ? 's' : ''} published</p>
                    </div>
                    <Link
                        href="/dashboard/creator"
                        className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-5 py-2 rounded-full transition shadow-[0_0_15px_rgba(139,92,246,0.3)] text-sm"
                    >
                        + New Post
                    </Link>
                </div>

                {/* Posts List */}
                {loading ? (
                    <div className="glass rounded-2xl p-20 text-center text-gray-400">Loading your posts...</div>
                ) : posts.length === 0 ? (
                    <div className="glass rounded-2xl p-20 text-center">
                        <div className="text-6xl mb-4">📸</div>
                        <h2 className="text-2xl font-bold mb-2">No Posts Yet</h2>
                        <p className="text-gray-400 mb-6">Publish your first post from the Overview tab.</p>
                        <Link href="/dashboard/creator" className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-6 py-3 rounded-full transition">
                            Create First Post
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {posts.map(post => (
                            <div key={post.id} className="glass rounded-2xl p-5 border border-white/10 flex gap-4 items-start">
                                {/* Media Thumbnail */}
                                <div className="w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden bg-white/5 flex items-center justify-center border border-white/10">
                                    {post.mediaUrls?.[0] ? (
                                        <img
                                            src={post.mediaUrls[0]}
                                            alt="Post thumbnail"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <span className="text-2xl text-gray-500">📝</span>
                                    )}
                                </div>

                                {/* Content */}
                                <div className="flex-grow min-w-0">
                                    <p className="text-white font-medium line-clamp-2 text-sm mb-2">
                                        {post.content || <span className="italic text-gray-500">Media-only post</span>}
                                    </p>
                                    <div className="flex flex-wrap gap-3 text-xs text-gray-400">
                                        <span>📅 {formatDate(post.createdAt)}</span>
                                        <span>❤️ {post._count.likes} likes</span>
                                        <span>💬 {post._count.comments} comments</span>
                                        {post.mediaUrls?.length > 0 && <span>🖼️ {post.mediaUrls.length} media</span>}
                                        {post.isPremium && (
                                            <span className="bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full font-bold">
                                                {post.price ? `PPV $${post.price}` : 'Subscribers Only'}
                                            </span>
                                        )}
                                        {!post.isPremium && (
                                            <span className="bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full font-bold">Free</span>
                                        )}
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex gap-2 flex-shrink-0">
                                    <button
                                        onClick={() => handleDelete(post.id)}
                                        disabled={deleting === post.id}
                                        className="text-xs bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 px-3 py-1.5 rounded-lg transition disabled:opacity-50"
                                    >
                                        {deleting === post.id ? '...' : '🗑️ Delete'}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
