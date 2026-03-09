import Link from 'next/link';

export default function UserDashboard() {
    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">My Account</h1>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                {/* Sidebar Navigation */}
                <div className="glass rounded-2xl flex flex-col p-4 h-fit gap-2">
                    <Link href="/dashboard/user" className="px-4 py-3 rounded-xl bg-purple-600/20 text-purple-400 font-medium">
                        Active Subscriptions
                    </Link>
                    <Link href="/dashboard/user/purchases" className="px-4 py-3 rounded-xl hover:bg-white/5 text-gray-300 transition">
                        Purchased Content (PPV)
                    </Link>
                    <Link href="/dashboard/user/payment" className="px-4 py-3 rounded-xl hover:bg-white/5 text-gray-300 transition">
                        Payment Methods
                    </Link>
                    <Link href="/dashboard/user/settings" className="px-4 py-3 rounded-xl hover:bg-white/5 text-gray-300 transition">
                        Account Settings
                    </Link>
                </div>

                {/* Content Area */}
                <div className="md:col-span-3 space-y-6">
                    <h2 className="text-xl font-bold border-b border-white/10 pb-4">Your Subscriptions</h2>

                    <div className="grid sm:grid-cols-2 gap-4">
                        {[1, 2].map(i => (
                            <div key={i} className="glass p-5 rounded-2xl flex items-center justify-between border hover:border-purple-500/50 transition-colors border-white/10">
                                <div className="flex items-center gap-4">
                                    <img src={`https://i.pravatar.cc/150?u=${i}`} className="w-14 h-14 rounded-full border-2 border-purple-500" alt="Creator" />
                                    <div>
                                        <h3 className="font-bold">Creator {i}</h3>
                                        <p className="text-xs text-gray-400">Renews on Oct {15 + i}, 2026</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className="block font-bold text-lg">$4.99<span className="text-sm font-normal text-gray-500">/mo</span></span>
                                    <button className="text-xs text-red-400 hover:underline mt-1">Cancel</button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-12">
                        <h2 className="text-xl font-bold border-b border-white/10 pb-4 mb-6">Recent Unlock History</h2>
                        <div className="glass rounded-2xl overflow-hidden">
                            <div className="p-4 border-b border-white/10 flex justify-between bg-black/20 text-sm font-bold text-gray-400">
                                <span>Item</span>
                                <span>Price</span>
                            </div>
                            <div className="p-4 flex justify-between border-b border-white/5 items-center">
                                <div className="flex gap-3 items-center">
                                    <span className="text-2xl">📸</span>
                                    <div>
                                        <span className="block text-sm font-medium">Summer Photoshoot Set</span>
                                        <span className="block text-xs text-gray-500">From @creator_1</span>
                                    </div>
                                </div>
                                <span className="font-bold">$15.00</span>
                            </div>
                            <div className="p-4 flex justify-between items-center">
                                <div className="flex gap-3 items-center">
                                    <span className="text-2xl">💬</span>
                                    <div>
                                        <span className="block text-sm font-medium">Paid Direct Message</span>
                                        <span className="block text-xs text-gray-500">To @creator_2</span>
                                    </div>
                                </div>
                                <span className="font-bold">$5.00</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
