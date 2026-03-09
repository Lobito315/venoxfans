import Link from 'next/link';
import Image from 'next/image';

interface ProfileParams {
    params: { username: string };
}

export default function CreatorProfilePage({ params }: ProfileParams) {
    // In a real app we would fetch creator details using params.username
    const creator = {
        username: params.username,
        name: 'Featured Creator',
        bio: 'Digital artist & fitness enthusiast. Subscribe for exclusive insights and tutorials! ✨🎨',
        avatar: 'https://i.pravatar.cc/150?u=' + params.username,
        cover: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop',
        followers: '24.5K',
        subscriptionPrice: 4.99,
    };

    const MOCK_POSTS = [
        { id: 1, type: 'free', img: 'https://images.unsplash.com/photo-1549880338-65dd4d022c74?w=500&auto=format&fit=crop' },
        { id: 2, type: 'premium', locked: true, price: null },
        { id: 3, type: 'premium', locked: true, price: null },
        { id: 4, type: 'free', img: 'https://images.unsplash.com/photo-1552083375-1447ce886485?w=500&auto=format&fit=crop' },
        { id: 5, type: 'ppv', locked: true, price: 15.0 },
        { id: 6, type: 'premium', locked: true, price: null },
    ];

    return (
        <div className="max-w-4xl mx-auto pb-20">
            {/* Cover Image */}
            <div className="w-full h-48 md:h-72 relative bg-purple-900 border-b border-white/10">
                <Image src={creator.cover} alt="Cover" layout="fill" objectFit="cover" className="opacity-70" />
            </div>

            {/* Profile Info */}
            <div className="px-4 relative -mt-16 md:-mt-24 mb-8 text-center md:text-left">
                <div className="flex flex-col md:flex-row items-center md:items-end justify-between gap-4">
                    <div className="flex flex-col md:flex-row items-center gap-4">
                        <img
                            src={creator.avatar}
                            alt={creator.username}
                            className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-background object-cover shadow-xl"
                        />
                        <div className="md:mb-4">
                            <h1 className="text-3xl font-bold">{creator.name}</h1>
                            <p className="text-gray-400">@{creator.username}</p>
                        </div>
                    </div>
                    <div className="flex gap-3 md:mb-4 w-full md:w-auto px-4 md:px-0">
                        <button className="flex-1 glass text-white font-medium py-2 px-6 rounded-full hover:bg-white/10 transition">
                            Follow
                        </button>
                        <button className="flex-1 bg-purple-600 hover:bg-purple-700 font-medium py-2 px-6 rounded-full shadow-[0_0_15px_rgba(139,92,246,0.3)] transition transform hover:scale-105">
                            Subscribe ${creator.subscriptionPrice}/mo
                        </button>
                    </div>
                </div>

                <div className="mt-6 md:ml-[176px] px-2 md:px-0">
                    <p className="text-gray-300 mb-4 whitespace-pre-wrap">{creator.bio}</p>
                    <div className="flex items-center gap-6 text-sm text-gray-400">
                        <span><strong className="text-white text-lg">{creator.followers}</strong> Fans</span>
                        <span><strong className="text-white text-lg">{MOCK_POSTS.length}</strong> Posts</span>
                        <span><strong className="text-white text-lg">15K</strong> Likes</span>
                    </div>
                </div>
            </div>

            {/* Content Grid */}
            <div className="px-4 border-t border-white/10 pt-8">
                <h2 className="text-xl font-bold mb-6">Latest Content</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {MOCK_POSTS.map(post => (
                        <div key={post.id} className="aspect-square relative rounded-xl overflow-hidden glass group cursor-pointer">
                            {post.type === 'free' && post.img ? (
                                <img src={post.img} alt="Post" className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                            ) : (
                                <div className="w-full h-full bg-surface flex flex-col items-center justify-center p-4 text-center transition group-hover:bg-surface-hover">
                                    <span className="text-4xl text-purple-400 mb-2">🔒</span>
                                    {post.type === 'ppv' ? (
                                        <span className="text-sm font-bold bg-pink-600 px-3 py-1 rounded-full mt-2">Unlock ${post.price}</span>
                                    ) : (
                                        <span className="text-sm text-gray-400">Subscribers Only</span>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
