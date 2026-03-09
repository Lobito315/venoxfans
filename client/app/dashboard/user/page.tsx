'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const NAV_LINKS = [
    { href: '/dashboard/user', label: 'Subscriptions', icon: '⭐' },
    { href: '/dashboard/user/purchases', label: 'Purchased Content', icon: '🔓' },
    { href: '/dashboard/user/payment', label: 'Payment Methods', icon: '💳' },
    { href: '/dashboard/user/settings', label: 'Account Settings', icon: '⚙️' },
];

const MOCK_SUBS = [
    { id: 1, name: 'Elena Thorne', handle: 'elenathorne', price: 9.99, renewsOn: 'Apr 15, 2026', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=elenathorne' },
    { id: 2, name: 'Marcus J.', handle: 'marcusj_fit', price: 4.99, renewsOn: 'Apr 22, 2026', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=marcusj' },
];

const MOCK_TRANSACTIONS = [
    { id: 1, icon: '📸', label: 'Summer Photoshoot Set', from: '@elenathorne', date: 'Mar 5, 2026', amount: '$15.00' },
    { id: 2, icon: '💬', label: 'Paid Direct Message', from: '@marcusj_fit', date: 'Mar 3, 2026', amount: '$5.00' },
    { id: 3, icon: '🎬', label: 'Exclusive BTS Video', from: '@elenathorne', date: 'Feb 28, 2026', amount: '$12.00' },
];

export default function UserDashboard() {
    const [username, setUsername] = useState('');
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
    const [email, setEmail] = useState('');

    useEffect(() => {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            try {
                const u = JSON.parse(userStr);
                setUsername(u.username || '');
                setAvatarUrl(u.avatarUrl || null);
                setEmail(u.email || '');
            } catch (e) { }
        }
    }, []);

    const avatarSrc = avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${username || 'user'}`;

    return (
        <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col md:flex-row gap-8">
            {/* ── Sidebar ── */}
            <aside className="w-full md:w-60 shrink-0">
                <div className="glass rounded-2xl p-5 border border-white/5 sticky top-24">
                    {/* User mini-profile */}
                    <div className="flex items-center gap-3 mb-6 px-1">
                        <img src={avatarSrc} alt={username} className="w-10 h-10 rounded-full object-cover border-2 border-[#d948ef]/30" />
                        <div className="min-w-0">
                            <p className="text-sm font-bold truncate">{username || 'My Account'}</p>
                            <p className="text-xs text-gray-500 truncate">{email}</p>
                        </div>
                    </div>

                    <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3 px-1">My Account</h2>
                    <nav className="space-y-1">
                        {NAV_LINKS.map(({ href, label, icon }) => {
                            const isActive = href === '/dashboard/user';
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

            {/* ── Main Content ── */}
            <main className="flex-grow min-w-0 space-y-8">
                {/* ── Profile Overview Card ── */}
                <div className="glass rounded-2xl border border-white/5 overflow-hidden">
                    <div className="h-20 bg-gradient-to-r from-[#d948ef]/30 via-[#7c3aed]/20 to-[#1f1022]/50" />
                    <div className="px-6 pb-6 -mt-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                        <div className="flex items-end gap-4">
                            <img
                                src={avatarSrc}
                                alt={username}
                                className="w-20 h-20 rounded-full border-4 border-[#1f1022] object-cover shadow-xl"
                            />
                            <div className="mb-1">
                                <h1 className="text-xl font-bold">{username || 'My Account'}</h1>
                                <p className="text-sm text-gray-500">Fan · Member since 2026</p>
                            </div>
                        </div>
                        <Link
                            href="/dashboard/user/settings"
                            className="mb-1 text-sm font-semibold text-[#d948ef] border border-[#d948ef]/30 hover:bg-[#d948ef]/10 px-4 py-2 rounded-full transition-all"
                        >
                            Edit Profile
                        </Link>
                    </div>
                </div>

                {/* ── Active Subscriptions ── */}
                <section>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-bold">Active Subscriptions</h2>
                        <Link href="/explore" className="text-xs text-[#d948ef] hover:text-[#e879f9] font-medium transition-colors">
                            Discover creators →
                        </Link>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                        {MOCK_SUBS.map(sub => (
                            <div key={sub.id} className="glass rounded-2xl border border-[#d948ef]/10 hover:border-[#d948ef]/30 transition-all p-5 flex items-center gap-4">
                                <img src={sub.avatar} alt={sub.name} className="w-14 h-14 rounded-full border-2 border-[#d948ef]/30 object-cover shrink-0" />
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <h3 className="font-bold text-sm">{sub.name}</h3>
                                        <span className="text-xs text-gray-500">@{sub.handle}</span>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-0.5">Renews {sub.renewsOn}</p>
                                    <div className="flex items-center gap-2 mt-2">
                                        <span className="text-sm font-bold">${sub.price}<span className="text-xs font-normal text-gray-500">/mo</span></span>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end gap-2 shrink-0">
                                    <Link href={`/${sub.handle}`} className="text-xs font-semibold text-[#d948ef] hover:text-[#e879f9] transition-colors">
                                        View →
                                    </Link>
                                    <button className="text-xs text-red-500 hover:text-red-400 transition-colors font-medium">
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        ))}

                        {MOCK_SUBS.length === 0 && (
                            <div className="sm:col-span-2 text-center glass rounded-2xl border border-white/5 py-16">
                                <div className="text-4xl mb-3">⭐</div>
                                <p className="text-gray-400 text-sm">You have no active subscriptions.</p>
                                <Link href="/explore" className="inline-block mt-4 text-sm font-semibold text-[#d948ef] hover:text-[#e879f9] transition-colors">
                                    Discover creators →
                                </Link>
                            </div>
                        )}
                    </div>
                </section>

                {/* ── Transaction History ── */}
                <section>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-bold">Purchase History</h2>
                        <Link href="/dashboard/user/purchases" className="text-xs text-[#d948ef] hover:text-[#e879f9] font-medium transition-colors">
                            View all →
                        </Link>
                    </div>
                    <div className="glass rounded-2xl border border-white/5 overflow-hidden">
                        {/* Table header */}
                        <div className="flex items-center px-5 py-3 bg-white/3 border-b border-white/5 text-xs font-bold text-gray-500 uppercase tracking-wider">
                            <span className="flex-1">Item</span>
                            <span className="hidden sm:block w-32 text-center">Creator</span>
                            <span className="hidden sm:block w-28 text-center">Date</span>
                            <span className="w-20 text-right">Amount</span>
                        </div>
                        <div className="divide-y divide-white/5">
                            {MOCK_TRANSACTIONS.map(tx => (
                                <div key={tx.id} className="flex items-center gap-3 px-5 py-4 hover:bg-white/3 transition-colors">
                                    <span className="text-xl w-8 text-center shrink-0">{tx.icon}</span>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-white truncate">{tx.label}</p>
                                        <p className="text-xs text-gray-500 sm:hidden">{tx.from} · {tx.date}</p>
                                    </div>
                                    <span className="hidden sm:block w-32 text-center text-xs text-gray-400">{tx.from}</span>
                                    <span className="hidden sm:block w-28 text-center text-xs text-gray-500">{tx.date}</span>
                                    <span className="w-20 text-right font-bold text-sm text-white">{tx.amount}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}
