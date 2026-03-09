import Link from 'next/link';

// Mock data for display purposes
const CATEGORIES = ['All', 'Fitness', 'Music', 'Gaming', 'Art', 'Lifestyle', 'Education', 'Cosplay'];

const MOCK_CREATORS = [
    { id: 1, handle: 'alex_fitness', name: 'Alex Johnson', subs: '12K', img: 'https://i.pravatar.cc/150?u=1' },
    { id: 2, handle: 'sarah_art', name: 'Sarah Creates', subs: '8.5K', img: 'https://i.pravatar.cc/150?u=2' },
    { id: 3, handle: 'gamer_ninja', name: 'Ninja Pro', subs: '45K', img: 'https://i.pravatar.cc/150?u=3' },
    { id: 4, handle: 'music_vibes', name: 'Chill Beats', subs: '21K', img: 'https://i.pravatar.cc/150?u=4' },
    { id: 5, handle: 'chef_mario', name: 'Mario Cooks', subs: '15K', img: 'https://i.pravatar.cc/150?u=5' },
    { id: 6, handle: 'travel_bug', name: 'Wanderlust', subs: '32K', img: 'https://i.pravatar.cc/150?u=6' },
];

export default function ExplorePage() {
    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            {/* Search Header */}
            <div className="mb-10 text-center md:text-left flex flex-col md:flex-row justify-between items-center gap-6">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Explore Creators</h1>
                    <p className="text-gray-400">Find and support the best content creators.</p>
                </div>
                <div className="relative w-full md:w-96">
                    <input
                        type="text"
                        placeholder="Search creators, posts..."
                        className="w-full glass rounded-full px-6 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 border-white/10"
                    />
                    <button className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white">
                        🔍
                    </button>
                </div>
            </div>

            {/* Categories */}
            <div className="flex overflow-x-auto gap-3 pb-4 mb-8 scrollbar-hide">
                {CATEGORIES.map((cat, idx) => (
                    <button
                        key={idx}
                        className={`whitespace-nowrap px-6 py-2 rounded-full text-sm font-medium transition-colors ${idx === 0 ? 'bg-purple-600 text-white' : 'glass text-gray-300 hover:bg-white/10'}`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Trending Creators Grid */}
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">🔥 Trending This Week</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {MOCK_CREATORS.map(creator => (
                    <div key={creator.id} className="glass rounded-2xl p-6 flex flex-col items-center text-center hover:bg-white/5 transition-colors cursor-pointer group">
                        <div className="relative">
                            <img
                                src={creator.img}
                                alt={creator.name}
                                className="w-24 h-24 rounded-full object-cover border-4 border-background mb-4 group-hover:border-purple-500 transition-colors"
                            />
                            <div className="absolute bottom-4 right-0 bg-green-500 w-4 h-4 rounded-full border-2 border-background"></div>
                        </div>
                        <h3 className="text-lg font-bold">{creator.name}</h3>
                        <p className="text-gray-400 text-sm mb-4">@{creator.handle}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-300 mb-6">
                            <span>👥 {creator.subs} fans</span>
                            <span>⭐ 4.9</span>
                        </div>
                        <Link href={`/${creator.handle}`} className="w-full bg-white/10 hover:bg-purple-600 text-white py-2 rounded-full font-medium transition-colors">
                            View Profile
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
}
