import Link from 'next/link';

export default function UserPayment() {
    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">My Account</h1>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                {/* Sidebar Navigation */}
                <div className="glass rounded-2xl flex flex-col p-4 h-fit gap-2">
                    <Link href="/dashboard/user" className="px-4 py-3 rounded-xl hover:bg-white/5 text-gray-300 transition">
                        Active Subscriptions
                    </Link>
                    <Link href="/dashboard/user/purchases" className="px-4 py-3 rounded-xl hover:bg-white/5 text-gray-300 transition">
                        Purchased Content (PPV)
                    </Link>
                    <Link href="/dashboard/user/payment" className="px-4 py-3 rounded-xl bg-purple-600/20 text-purple-400 font-medium">
                        Payment Methods
                    </Link>
                    <Link href="/dashboard/user/settings" className="px-4 py-3 rounded-xl hover:bg-white/5 text-gray-300 transition">
                        Account Settings
                    </Link>
                </div>

                {/* Content Area */}
                <div className="md:col-span-3 space-y-6">
                    <div className="glass p-8 rounded-2xl flex flex-col items-center justify-center text-center py-20">
                        <span className="text-6xl mb-4">💳</span>
                        <h2 className="text-2xl font-bold mb-2">No Payment Methods</h2>
                        <p className="text-gray-400 mb-6 max-w-sm">Add a credit card or connect your crypto wallet to start subscribing to creators.</p>
                        <button className="bg-white text-black font-bold px-6 py-3 rounded-full hover:bg-gray-200 transition">
                            Add New Card
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
