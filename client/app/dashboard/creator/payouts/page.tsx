import Link from 'next/link';

export default function CreatorPayouts() {
    return (
        <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col md:flex-row gap-8">
            <aside className="w-full md:w-64 glass rounded-2xl p-6 h-fit shrink-0">
                <h2 className="text-xl font-bold mb-8 gradient-text">Creator Studio</h2>
                <nav className="space-y-2">
                    <Link href="/dashboard/creator" className="block px-4 py-3 rounded-xl hover:bg-white/5 text-gray-300 font-medium transition">
                        Overview
                    </Link>
                    <Link href="/dashboard/creator/posts" className="block px-4 py-3 rounded-xl hover:bg-white/5 text-gray-300 font-medium transition">
                        Content Manager
                    </Link>
                    <Link href="/dashboard/creator/subscribers" className="block px-4 py-3 rounded-xl hover:bg-white/5 text-gray-300 font-medium transition">
                        Subscribers List
                    </Link>
                    <Link href="/dashboard/creator/payouts" className="block px-4 py-3 rounded-xl bg-purple-600/20 text-purple-400 font-medium">
                        Earnings & Payouts
                    </Link>
                    <Link href="/dashboard/creator/settings" className="block px-4 py-3 rounded-xl hover:bg-white/5 text-gray-300 font-medium transition">
                        Page Settings
                    </Link>
                </nav>
            </aside>

            <main className="flex-grow space-y-8">
                <section className="glass rounded-2xl p-6 border border-white/10 text-center py-20">
                    <div className="text-6xl mb-4">💸</div>
                    <h2 className="text-2xl font-bold mb-2">Earnings & Payouts</h2>
                    <p className="text-gray-400 mb-6">Manage your bank accounts and request withdrawals from your balance.</p>
                    <p className="text-green-500 text-3xl font-bold mb-8">Available Balance: $0.00</p>
                    <button className="bg-purple-600 px-6 py-2 rounded-full font-medium transition text-white hover:bg-purple-700">
                        Add Payout Method
                    </button>
                </section>
            </main>
        </div>
    );
}
