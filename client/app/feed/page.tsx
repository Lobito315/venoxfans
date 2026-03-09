import Link from 'next/link';

// Mock feed data
const MOCK_POSTS = [
    {
        id: 1,
        creator: { handle: 'alex_fitness', name: 'Alex Johnson', img: 'https://i.pravatar.cc/150?u=1' },
        content: 'Just finished an intense leg day workout! Full routine dropping tomorrow for VIP tier subscribers. Stay tuned! 💪🔥',
        media: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=1000&auto=format&fit=crop',
        likes: 1240,
        comments: 84,
        isPremium: false,
        time: '2 hours ago'
    },
    {
        id: 2,
        creator: { handle: 'sarah_art', name: 'Sarah Creates', img: 'https://i.pravatar.cc/150?u=2' },
        content: 'Sneak peek at my latest digital portrait commission. The colors are really popping on this one! ✨🎨',
        media: null,
        likes: 856,
        comments: 42,
        isPremium: true,
        price: 5.00,
        time: '5 hours ago'
    }
];

export default function FeedPage() {
    return (
        <div className="max-w-2xl mx-auto px-4 py-8">
            {/* Create Post Input (Mock) */}
            <div className="glass rounded-2xl p-4 mb-8 flex gap-4 items-center cursor-pointer hover:bg-white/5 transition-colors">
                <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center text-sm font-bold">ME</div>
                <div className="text-gray-500 bg-background/50 rounded-full px-4 py-2 flex-grow h-10 flex items-center">
                    What's on your mind?
                </div>
                <button className="text-purple-400 hover:text-purple-300 px-2 text-xl">📸</button>
            </div>

            {/* Feed Stream */}
            <div className="space-y-6">
                {MOCK_POSTS.map(post => (
                    <div key={post.id} className="glass rounded-2xl overflow-hidden">
                        {/* Post Header */}
                        <div className="p-4 flex items-center justify-between border-b border-white/5">
                            <Link href={`/${post.creator.handle}`} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                                <img src={post.creator.img} alt={post.creator.name} className="w-10 h-10 rounded-full" />
                                <div>
                                    <h3 className="font-bold text-sm">{post.creator.name}</h3>
                                    <p className="text-gray-400 text-xs">@{post.creator.handle} • {post.time}</p>
                                </div>
                            </Link>
                            <button className="text-gray-400 hover:text-white">•••</button>
                        </div>

                        {/* Post Content */}
                        <div className="p-4">
                            <p className="text-sm text-gray-200 mb-4 whitespace-pre-wrap">{post.content}</p>

                            {/* Media Handling */}
                            {post.media && !post.isPremium && (
                                <div className="rounded-xl overflow-hidden bg-black max-h-[500px] flex items-center justify-center">
                                    <img src={post.media} alt="Post content" className="object-cover max-w-full" />
                                </div>
                            )}

                            {/* Paywall Overlay */}
                            {post.isPremium && (
                                <div className="relative rounded-xl overflow-hidden bg-surface flex flex-col items-center justify-center h-64 border border-purple-500/20">
                                    <div className="absolute inset-0 bg-background/80 blur-md"></div>
                                    <div className="relative z-10 flex flex-col items-center text-center p-6">
                                        <span className="text-4xl mb-4 text-purple-400">🔒</span>
                                        <h4 className="font-bold text-lg mb-2">Locked Premium Content</h4>
                                        <p className="text-gray-400 text-sm mb-4">Subscribe to unlock or purchase for ${post.price?.toFixed(2)}</p>
                                        <button className="bg-purple-600 hover:bg-purple-700 text-white font-medium px-6 py-2 rounded-full transition-colors">
                                            Unlock Content
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Engagement Buttons */}
                        <div className="px-4 py-3 flex items-center gap-6 border-t border-white/5 text-gray-400 text-sm">
                            <button className="flex items-center gap-2 hover:text-pink-500 transition-colors">
                                <span>❤️</span> {post.likes}
                            </button>
                            <button className="flex items-center gap-2 hover:text-blue-500 transition-colors">
                                <span>💬</span> {post.comments}
                            </button>
                            <button className="flex items-center gap-2 hover:text-green-500 transition-colors ml-auto">
                                <span>💸</span> Tip
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
