'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getApiUrl } from '../../utils/apiConfig';

const NAV_LINKS = [
    { href: '/dashboard/creator', label: 'Overview', icon: '◈' },
    { href: '/dashboard/creator/posts', label: 'Content Manager', icon: '▤' },
    { href: '/dashboard/creator/subscribers', label: 'Subscribers', icon: '👥' },
    { href: '/dashboard/creator/payouts', label: 'Earnings & Payouts', icon: '💰' },
    { href: '/dashboard/creator/settings', label: 'Page Settings', icon: '⚙️' },
];

const STATS = [
    {
        label: 'Gross Revenue (30d)',
        value: '$4,250',
        trend: '+12.5%',
        trendUp: true,
        icon: '💵',
        accent: 'from-[#d948ef] to-[#a21caf]',
        glow: 'shadow-[#d948ef]/20',
    },
    {
        label: 'Active Subscribers',
        value: '850',
        trend: '+42 new',
        trendUp: true,
        icon: '⭐',
        accent: 'from-[#d948ef]/80 to-[#7c3aed]',
        glow: 'shadow-[#d948ef]/15',
    },
    {
        label: 'Profile Views (30d)',
        value: '128.4K',
        trend: 'Last 30 days',
        trendUp: null,
        icon: '👁️',
        accent: 'from-violet-600 to-indigo-700',
        glow: 'shadow-violet-500/15',
    },
];

const RECENT_ACTIVITY = [
    { type: 'subscription', user: 'user_101', amount: '+$9.99', time: '2h ago', icon: '⭐', color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/20' },
    { type: 'ppv', user: 'user_88', amount: '+$15.00', time: '5h ago', icon: '🔓', color: 'text-[#d948ef]', bg: 'bg-[#d948ef]/10 border-[#d948ef]/20' },
    { type: 'subscription', user: 'user_204', amount: '+$9.99', time: '8h ago', icon: '⭐', color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/20' },
    { type: 'tip', user: 'user_55', amount: '+$5.00', time: '1d ago', icon: '💖', color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/20' },
];

export default function CreatorDashboard() {
    const router = useRouter();
    const [content, setContent] = useState('');
    const [mediaFiles, setMediaFiles] = useState<{ url: string; file: File }[]>([]);
    const [isPremium, setIsPremium] = useState(false);
    const [price, setPrice] = useState('0.00');
    const [isPublishing, setIsPublishing] = useState(false);
    const [userId, setUserId] = useState<string | null>(null);
    const [username, setUsername] = useState('');
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

    useEffect(() => {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            try {
                const userObj = JSON.parse(userStr);
                setUserId(userObj.id);
                setUsername(userObj.username || '');
                setAvatarUrl(userObj.avatarUrl || null);
            } catch (e) { }
        } else {
            router.push('/login');
        }
    }, [router]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const files = Array.from(e.target.files);
            if (mediaFiles.length + files.length > 4) {
                return alert('You can only attach up to 4 media files per post.');
            }
            const newMedia = files.map(file => ({ url: URL.createObjectURL(file), file }));
            setMediaFiles(prev => [...prev, ...newMedia]);
        }
    };

    const removeMedia = (index: number) => {
        setMediaFiles(prev => prev.filter((_, i) => i !== index));
    };

    const handlePublish = async () => {
        if (!userId) return alert('You must be logged in to publish');
        if (!content.trim() && mediaFiles.length === 0) return alert('Please add text or media for your post');

        setIsPublishing(true);
        try {
            const mediaUrls = await Promise.all(mediaFiles.map(async (m) => {
                // 1. Get presigned URL
                console.log(`[Publish] Getting upload URL for ${m.file.name}...`);
                const res = await fetch(`${getApiUrl()}/api/posts/upload-url?fileName=${encodeURIComponent(m.file.name)}&contentType=${encodeURIComponent(m.file.type || 'application/octet-stream')}`);
                
                if (!res.ok) {
                    const errorData = await res.json().catch(() => ({}));
                    throw new Error(`Permission failed: ${errorData.error || res.statusText}`);
                }
                const { uploadUrl, fileUrl } = await res.json();

                // 2. Upload directly to S3
                console.log(`[Publish] Uploading ${m.file.name} directly to storage...`);
                const uploadRes = await fetch(uploadUrl, {
                    method: 'PUT',
                    headers: { 'Content-Type': m.file.type || 'application/octet-stream' },
                    body: m.file
                });

                if (!uploadRes.ok) {
                    // This is usually a CORS or AWS permission issue
                    throw new Error(`Storage upload failed for ${m.file.name}. Please check storage configuration.`);
                }
                
                return fileUrl;
            }));

            // 3. Create the post record in the database
            console.log(`[Publish] Saving post record to database...`);
            const res = await fetch(`${getApiUrl()}/api/posts`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'X-User-Id': userId // Temporary auth mechanism matching controller
                },
                body: JSON.stringify({
                    creatorId: userId,
                    content,
                    mediaUrls,
                    isPremium,
                    price: isPremium ? parseFloat(price) : null
                })
            });

            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                throw new Error(data.error || 'The server rejected the post. Please try again.');
            }

            alert('Post published successfully! 🚀');
            setContent('');
            setMediaFiles([]);
            setIsPremium(false);
            setPrice('0.00');
            
            // Refresh dashboard or redirect if needed
            router.refresh();
        } catch (error: any) {
            console.error('[Publish Error]', error);
            alert(`Error: ${error.message}`);
        } finally {
            setIsPublishing(false);
        }
    };

    const avatarSrc = avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${username || 'creator'}`;

    return (
        <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col md:flex-row gap-8">
            {/* ── Sidebar ── */}
            <aside className="w-full md:w-60 shrink-0">
                <div className="glass rounded-2xl p-5 border border-white/5 sticky top-24">
                    {/* Creator mini-profile */}
                    <div className="flex items-center gap-3 mb-6 px-1">
                        <img src={avatarSrc} alt={username} className="w-10 h-10 rounded-full object-cover border-2 border-[#d948ef]/30" />
                        <div className="min-w-0">
                            <p className="text-sm font-bold truncate">{username || 'Creator'}</p>
                            <p className="text-xs text-gray-500 truncate">@{username}</p>
                        </div>
                    </div>

                    <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3 px-1">Creator Studio</h2>
                    <nav className="space-y-1">
                        {NAV_LINKS.map(({ href, label, icon }) => {
                            const isActive = href === '/dashboard/creator';
                            return (
                                <Link
                                    key={href}
                                    href={href}
                                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${isActive
                                        ? 'bg-[#d948ef]/15 text-[#d948ef]'
                                        : 'text-gray-400 hover:bg-white/5 hover:text-white'
                                        }`}
                                >
                                    <span>{icon}</span>
                                    {label}
                                </Link>
                            );
                        })}
                    </nav>
                </div>
            </aside>

            {/* ── Main Panel ── */}
            <main className="flex-grow min-w-0 space-y-8">
                {/* ── KPI Cards ── */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {STATS.map(stat => (
                        <div key={stat.label} className={`glass rounded-2xl p-6 border border-white/5 relative overflow-hidden shadow-xl ${stat.glow}`}>
                            {/* Gradient accent bar */}
                            <div className={`absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b ${stat.accent} rounded-l-2xl`} />
                            <div className="flex items-start justify-between mb-3">
                                <p className="text-gray-400 text-xs font-medium">{stat.label}</p>
                                <span className="text-xl">{stat.icon}</span>
                            </div>
                            <p className="text-3xl font-bold tracking-tight mb-1">{stat.value}</p>
                            {stat.trendUp !== null ? (
                                <span className={`inline-flex items-center gap-1 text-xs font-semibold ${stat.trendUp ? 'text-green-400' : 'text-red-400'}`}>
                                    {stat.trendUp ? '▲' : '▼'} {stat.trend}
                                </span>
                            ) : (
                                <span className="text-xs text-gray-500">{stat.trend}</span>
                            )}
                        </div>
                    ))}
                </div>

                {/* ── Post Composer ── */}
                <section className="glass rounded-2xl border border-white/5">
                    <div className="p-5 border-b border-white/5 flex items-center justify-between">
                        <h2 className="text-lg font-bold">New Post</h2>
                        <Link href="/dashboard/creator/posts" className="text-xs text-[#d948ef] hover:text-[#e879f9] font-medium transition-colors">
                            View all posts →
                        </Link>
                    </div>

                    <div className="p-5">
                        {/* Composer area */}
                        <div className="flex gap-3">
                            <img src={avatarSrc} alt={username} className="w-10 h-10 rounded-full object-cover border border-white/10 shrink-0 mt-1" />
                            <div className="flex-1 min-w-0">
                                <div className="border border-[#d948ef]/20 focus-within:border-[#d948ef]/60 transition-colors rounded-xl overflow-hidden bg-black/20">
                                    <textarea
                                        value={content}
                                        onChange={e => setContent(e.target.value)}
                                        placeholder="What's on your mind? Tell your subscribers..."
                                        className="w-full bg-transparent p-4 text-white placeholder-gray-600 focus:outline-none resize-none h-28 text-sm"
                                    />
                                    <div className="bg-white/5 px-4 py-2.5 flex items-center gap-3 border-t border-white/5">
                                        <label className="flex items-center gap-1.5 text-gray-400 hover:text-[#d948ef] transition text-xs font-medium cursor-pointer">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                            Photo / Video
                                            <input type="file" multiple accept="image/*,video/*,.mp4,.mov,.webm,.ogg,.m4v,.3gp,.mkv,.avi" className="hidden" onChange={handleFileChange} />
                                        </label>
                                        <span className="text-gray-700 text-xs">JPG · PNG · MP4 up to 10MB</span>
                                    </div>
                                </div>

                                {/* Media Previews */}
                                {mediaFiles.length > 0 && (
                                    <div className="flex gap-3 overflow-x-auto pb-2 mt-3">
                                        {mediaFiles.map((media, index) => (
                                            <div key={index} className="relative w-24 h-24 flex-shrink-0 group rounded-xl overflow-hidden border border-white/10">
                                                {media.file.type.startsWith('video/') ? (
                                                    <video src={media.url} className="w-full h-full object-cover" muted />
                                                ) : (
                                                    <img src={media.url} alt="Preview" className="w-full h-full object-cover" />
                                                )}
                                                <button
                                                    onClick={() => removeMedia(index)}
                                                    className="absolute top-1.5 right-1.5 bg-black/70 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition hover:bg-red-600"
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Options Row */}
                                <div className="mt-3 flex flex-wrap gap-3 items-center">
                                    {/* PPV Toggle */}
                                    <button
                                        onClick={() => setIsPremium(p => !p)}
                                        className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${isPremium
                                            ? 'bg-[#d948ef]/15 border-[#d948ef]/30 text-[#e879f9]'
                                            : 'border-white/10 text-gray-500 hover:border-white/20 hover:text-gray-300'
                                            }`}
                                    >
                                        🔒 {isPremium ? 'PPV: On' : 'PPV: Off'}
                                    </button>

                                    {isPremium && (
                                        <div className="flex items-center gap-2 text-xs font-medium text-gray-400">
                                            <span>Price ($)</span>
                                            <input
                                                type="number"
                                                value={price}
                                                onChange={e => setPrice(e.target.value)}
                                                placeholder="0.00"
                                                step="0.01"
                                                min="0"
                                                className="bg-black/30 border border-[#d948ef]/20 rounded-lg px-3 py-1.5 w-20 text-white focus:outline-none focus:border-[#d948ef] text-xs"
                                            />
                                        </div>
                                    )}

                                    <button
                                        onClick={handlePublish}
                                        disabled={isPublishing}
                                        className="ml-auto bg-[#d948ef] text-white font-bold px-6 py-2 rounded-full text-sm transition hover:brightness-110 shadow-[0_0_15px_rgba(217,72,239,0.3)] disabled:opacity-50"
                                    >
                                        {isPublishing ? 'Publishing…' : 'Publish Post'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ── Recent Earnings Activity ── */}
                <section className="glass rounded-2xl border border-white/5 overflow-hidden">
                    <div className="p-5 border-b border-white/5 flex items-center justify-between">
                        <h2 className="text-lg font-bold">Recent Earnings</h2>
                        <Link href="/dashboard/creator/payouts" className="text-xs text-[#d948ef] hover:text-[#e879f9] font-medium transition-colors">
                            View all →
                        </Link>
                    </div>
                    <div className="divide-y divide-white/5">
                        {RECENT_ACTIVITY.map((item, i) => (
                            <div key={i} className="flex items-center gap-4 px-5 py-4 hover:bg-white/3 transition-colors">
                                <div className={`w-10 h-10 rounded-full border flex items-center justify-center text-lg shrink-0 ${item.bg}`}>
                                    {item.icon}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="text-sm font-semibold text-white">
                                        {item.type === 'subscription' ? 'New Subscription' : item.type === 'ppv' ? 'PPV Purchase' : 'Tip Received'}
                                    </p>
                                    <p className="text-xs text-gray-500 truncate">From @{item.user}</p>
                                </div>
                                <div className="text-right shrink-0">
                                    <span className={`block font-bold text-sm ${item.color}`}>{item.amount}</span>
                                    <span className="text-xs text-gray-600">{item.time}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </main>
        </div>
    );
}
