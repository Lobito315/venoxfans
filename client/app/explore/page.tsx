'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getApiUrl } from '../utils/apiConfig';

// Mock data for display purposes
const CATEGORIES = ['All', 'Fitness', 'Music', 'Gaming', 'Art', 'Lifestyle', 'Education', 'Cosplay'];

interface Creator {
    id: string;
    username: string;
    avatarUrl: string | null;
    bio: string | null;
    _count: { subscribers: number };
}

export default function ExplorePage() {
    const [creators, setCreators] = useState<Creator[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`${getApiUrl()}/api/creators/trending`)
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) setCreators(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

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
                        className="w-full glass rounded-full px-6 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#d948ef] border-[#d948ef]/15"
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
                        className={`whitespace-nowrap px-6 py-2 rounded-full text-sm font-medium transition-colors ${idx === 0 ? 'bg-[#d948ef] text-white shadow-lg shadow-[#d948ef]/20' : 'glass text-gray-300 hover:bg-[#d948ef]/10 hover:text-[#d948ef]'}`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Trending Creators Grid */}
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">🔥 Trending This Week</h2>

            {loading ? (
                <div className="text-center py-20 text-gray-500">Loading creators...</div>
            ) : creators.length === 0 ? (
                <div className="text-center py-20 text-gray-500 glass rounded-2xl">
                    <p className="text-xl mx-auto">No creators found yet. Be the first! 🌟</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {creators.map(creator => (
                        <div key={creator.id} className="glass rounded-2xl p-6 flex flex-col items-center text-center hover:bg-white/5 transition-colors cursor-pointer group">
                            <div className="relative">
                                <img
                                    src={creator.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${creator.username}`}
                                    alt={creator.username}
                                    className="w-24 h-24 rounded-full object-cover border-4 border-[#1f1022] mb-4 group-hover:border-[#d948ef] transition-colors"
                                />
                                <div className="absolute bottom-4 right-0 bg-green-500 w-4 h-4 rounded-full border-2 border-background"></div>
                            </div>
                            <h3 className="text-lg font-bold">{creator.username}</h3>
                            <p className="text-gray-400 text-sm mb-4 line-clamp-2 min-h-[40px] px-2">
                                {creator.bio || 'New creator on VenoxFans!'}
                            </p>
                            <div className="flex items-center gap-4 text-sm text-gray-300 mb-6">
                                <span>👥 {creator._count?.subscribers || 0} fans</span>
                                <span>⭐ 5.0</span>
                            </div>
                            <Link href={`/${creator.username}`} className="w-full bg-[#d948ef]/10 hover:bg-[#d948ef] text-[#d948ef] hover:text-white py-2 rounded-full font-medium transition-colors border border-[#d948ef]/25">
                                View Profile
                            </Link>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
