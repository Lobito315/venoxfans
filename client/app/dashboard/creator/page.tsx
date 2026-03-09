import Link from 'next/link';

export default function CreatorDashboard() {
    return (
        <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col md:flex-row gap-8">
            {/* Sidebar */}
            <aside className="w-full md:w-64 glass rounded-2xl p-6 h-fit shrink-0">
                <h2 className="text-xl font-bold mb-8 gradient-text">Creator Studio</h2>
                <nav className="space-y-2">
                    <Link href="/dashboard/creator" className="block px-4 py-3 rounded-xl bg-purple-600/20 text-purple-400 font-medium">
                        Overview
                    </Link>
                    <Link href="/dashboard/creator/posts" className="block px-4 py-3 rounded-xl hover:bg-white/5 text-gray-300 font-medium transition">
                        Content Manager
                    </Link>
                    <Link href="/dashboard/creator/subscribers" className="block px-4 py-3 rounded-xl hover:bg-white/5 text-gray-300 font-medium transition">
                        Subscribers List
                    </Link>
                    <Link href="/dashboard/creator/payouts" className="block px-4 py-3 rounded-xl hover:bg-white/5 text-gray-300 font-medium transition">
                        Earnings & Payouts
                    </Link>
                    <Link href="/dashboard/creator/settings" className="block px-4 py-3 rounded-xl hover:bg-white/5 text-gray-300 font-medium transition">
                        Page Settings
                    </Link>
                </nav>
            </aside>

            {/* Main Panel */}
            <main className="flex-grow space-y-8">
                {/* Header Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="glass p-6 rounded-2xl border-l-4 border-purple-500">
                        <h3 className="text-gray-400 text-sm font-medium mb-1">Gross Revenue (30d)</h3>
                        <p className="text-3xl font-bold">$4,250.00</p>
                        <span className="text-green-500 text-sm font-medium">+12.5%</span>
                    </div>
                    <div className="glass p-6 rounded-2xl border-l-4 border-pink-500">
                        <h3 className="text-gray-400 text-sm font-medium mb-1">Active Subscribers</h3>
                        <p className="text-3xl font-bold">850</p>
                        <span className="text-green-500 text-sm font-medium">+42 new</span>
                    </div>
                    <div className="glass p-6 rounded-2xl border-l-4 border-blue-500">
                        <h3 className="text-gray-400 text-sm font-medium mb-1">Total Profile Views</h3>
                        <p className="text-3xl font-bold">128.4K</p>
                        <span className="text-gray-500 text-sm mt-1 inline-block">Last 30 days</span>
                    </div>
                </div>

                {/* Quick Upload */}
                <section className="glass rounded-2xl p-6 border border-white/10">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold">Quick Upload</h2>
                    </div>

                    <div className="border-2 border-dashed border-gray-600 hover:border-purple-500 transition-colors rounded-xl p-10 text-center cursor-pointer bg-black/20">
                        <div className="text-4xl mb-4 text-purple-400">📤</div>
                        <h3 className="text-lg font-bold mb-2">Drag and drop media here</h3>
                        <p className="text-gray-400 text-sm mb-6">Supports JPG, PNG, MP4, MOV up to 2GB</p>
                        <button className="bg-purple-600 hover:bg-purple-700 px-6 py-2 rounded-full font-medium transition">
                            Browse Files
                        </button>
                    </div>

                    <div className="mt-6 flex flex-wrap gap-4 items-center">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" className="form-checkbox h-5 w-5 text-purple-600 rounded bg-background border-gray-600 focus:ring-purple-500 focus:ring-offset-background" defaultChecked />
                            <span className="text-sm font-medium">Subscribers Only</span>
                        </label>
                        <div className="mx-2 w-px h-6 bg-gray-700"></div>
                        <label className="flex items-center gap-2 text-sm font-medium">
                            <span>PPV Price ($)</span>
                            <input type="number" placeholder="0.00" className="bg-background border border-gray-700 rounded-lg px-3 py-1 w-24 text-white focus:outline-none focus:border-purple-500" />
                        </label>
                        <button className="ml-auto bg-white text-black hover:bg-gray-200 font-bold px-6 py-2 rounded-full transition shadow-[0_0_10px_rgba(255,255,255,0.2)]">
                            Publish Post
                        </button>
                    </div>
                </section>

                {/* Recent Activity */}
                <section className="glass rounded-2xl overflow-hidden">
                    <div className="p-6 border-b border-white/10">
                        <h2 className="text-xl font-bold">Recent Earnings Activity</h2>
                    </div>
                    <div className="divide-y divide-white/5">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="p-4 flex justify-between items-center hover:bg-white/5 transition">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center font-bold">
                                        $
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-sm">New Subscription</h4>
                                        <p className="text-gray-400 text-xs">User_10{i} subscribed to your tier</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className="font-bold text-green-400">+$4.99</span>
                                    <p className="text-gray-500 text-xs">2h ago</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </main>
        </div>
    );
}
