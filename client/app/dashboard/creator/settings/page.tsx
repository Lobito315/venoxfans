'use client';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getApiUrl } from '../../../utils/apiConfig';

interface UserData {
    id: string;
    username: string;
    email: string;
    isCreator: boolean;
    avatarUrl?: string;
    coverUrl?: string;
    bio?: string;
}

export default function CreatorSettings() {
    const router = useRouter();
    const [user, setUser] = useState<UserData | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const [coverPreview, setCoverPreview] = useState<string | null>(null);
    const [bio, setBio] = useState('');
    const [saving, setSaving] = useState(false);
    const [saveMsg, setSaveMsg] = useState('');
    const fileRef = useRef<HTMLInputElement>(null);
    const coverRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            try {
                const parsed = JSON.parse(userStr) as UserData;
                setUser(parsed);
                setAvatarPreview(parsed.avatarUrl || null);
                setCoverPreview(parsed.coverUrl || null);
                setBio(parsed.bio || '');
            } catch (e) { }
        }
    }, []);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onloadend = () => { setAvatarPreview(reader.result as string); };
        reader.readAsDataURL(file);
    };

    const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onloadend = () => { setCoverPreview(reader.result as string); };
        reader.readAsDataURL(file);
    };

    const handleSave = async () => {
        if (!user) return;
        setSaving(true);
        setSaveMsg('');
        try {
            const res = await fetch(`${getApiUrl()}/api/users/profile`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: user.username,
                    avatarUrl: avatarPreview,
                    coverUrl: coverPreview,
                    bio,
                }),
            });

            if (!res.ok) throw new Error('Failed to save');
            const updated = await res.json();

            // Update localStorage with new data
            const updatedUser = { ...user, avatarUrl: updated.avatarUrl, coverUrl: updated.coverUrl, bio: updated.bio };
            localStorage.setItem('user', JSON.stringify(updatedUser));
            setUser(updatedUser);
            setSaveMsg('✅ Profile updated successfully!');
        } catch (err) {
            setSaveMsg('❌ Failed to save. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteAccount = async () => {
        if (!user) return;
        if (!confirm('⚠️ WARNING: This action is permanent and cannot be undone. All your posts, subscriptions, and data will be deleted. Are you sure?')) return;
        
        const secondConfirm = confirm('Are you REALLY sure? This will also remove your media from our storage.');
        if (!secondConfirm) return;

        setSaving(true);
        try {
            const res = await fetch(`${getApiUrl()}/api/users/profile`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: user.id }),
            });

            if (!res.ok) {
                const text = await res.text();
                let errMsg = 'Failed to delete account';
                try {
                    const errData = JSON.parse(text);
                    errMsg = errData.error || errData.message || errMsg;
                } catch (e) {
                    errMsg = `Server Error (${res.status}): ${text.substring(0, 100)}`;
                }
                throw new Error(errMsg);
            }
            
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            router.push('/');
            router.refresh();
            alert('Your account has been deleted. We are sorry to see you go.');
        } catch (err: any) {
            alert(`Error deleting account: ${err.message}`);
        } finally {
            setSaving(false);
        }
    };

    const avatarSrc = avatarPreview || (user?.username ? `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}` : 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"%3E%3Ccircle cx="12" cy="12" r="12" fill="%23374151"/%3E%3C/svg%3E');

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
                    <Link href="/dashboard/creator/payouts" className="block px-4 py-3 rounded-xl hover:bg-white/5 text-gray-300 font-medium transition">
                        Earnings &amp; Payouts
                    </Link>
                    <Link href="/dashboard/creator/settings" className="block px-4 py-3 rounded-xl bg-purple-600/20 text-purple-400 font-medium">
                        Page Settings
                    </Link>
                </nav>
            </aside>

            <main className="flex-grow space-y-8">
                <section className="glass rounded-2xl p-8 border border-white/10">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold">Page Settings</h2>
                        {user && (
                            <Link href={`/${user.username}`} className="text-sm bg-purple-600 hover:bg-purple-700 font-medium px-6 py-2 rounded-full transition shadow-[0_0_15px_rgba(139,92,246,0.3)]">
                                View Public Profile ↗
                            </Link>
                        )}
                    </div>
                    <p className="text-gray-400 mb-8 pb-8 border-b border-white/10">Manage your creator profile, avatar, bio, and public appearance.</p>

                    {/* Cover / Banner Upload */}
                    <div className="mb-8">
                        <label className="block text-sm font-medium text-gray-400 mb-4">Profile Banner</label>
                        <div
                            className="relative w-full h-36 rounded-xl overflow-hidden bg-purple-900/40 border-2 border-dashed border-white/10 hover:border-purple-500 transition-colors cursor-pointer group"
                            onClick={() => coverRef.current?.click()}
                        >
                            {coverPreview && (
                                <img src={coverPreview} alt="Cover" className="w-full h-full object-cover" />
                            )}
                            <div className={`absolute inset-0 flex flex-col items-center justify-center gap-2 ${coverPreview ? 'bg-black/40 opacity-0 group-hover:opacity-100' : ''} transition-opacity`}>
                                <span className="text-3xl">🖼️</span>
                                <p className="text-sm font-medium text-white">{coverPreview ? 'Change Banner' : 'Click to upload banner'}</p>
                                <p className="text-xs text-gray-400">Recommended: 1500×500px</p>
                            </div>
                        </div>
                        <input
                            ref={coverRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleCoverChange}
                        />
                    </div>

                    {/* Avatar Upload */}
                    <div className="mb-8">
                        <label className="block text-sm font-medium text-gray-400 mb-4">Profile Avatar</label>
                        <div className="flex items-center gap-6">
                            <div className="relative group cursor-pointer" onClick={() => fileRef.current?.click()}>
                                <img
                                    src={avatarSrc}
                                    alt="Avatar"
                                    className="w-24 h-24 rounded-full object-cover border-4 border-white/10 group-hover:border-purple-500 transition-colors"
                                />
                                <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <span className="text-2xl">📷</span>
                                </div>
                            </div>
                            <div>
                                <button
                                    onClick={() => fileRef.current?.click()}
                                    className="block mb-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl text-sm font-medium transition border border-white/10"
                                >
                                    Change Avatar
                                </button>
                                <p className="text-xs text-gray-500">JPG, PNG or GIF. Max 5MB.</p>
                                <input
                                    ref={fileRef}
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleFileChange}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6 max-w-lg">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Username</label>
                            <input type="text" disabled className="w-full bg-background/50 border border-white/10 rounded-xl px-4 py-3 text-gray-500 cursor-not-allowed" value={user ? `@${user.username}` : ''} />
                            <p className="text-xs text-gray-500 mt-2">Your profile link: venoxfans.com/{user?.username}</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Bio</label>
                            <textarea
                                value={bio}
                                onChange={(e) => setBio(e.target.value)}
                                placeholder="Tell your subscribers about yourself..."
                                rows={3}
                                className="w-full bg-background/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 resize-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Account Email</label>
                            <input type="email" disabled className="w-full bg-background/50 border border-white/10 rounded-xl px-4 py-3 text-gray-500 cursor-not-allowed" value={user?.email || ''} />
                        </div>

                        <div className="pt-2">
                            <span className="inline-block px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-xs font-bold uppercase tracking-wider">
                                Account Role: {user?.isCreator ? 'Verified Creator 🌟' : 'Fan'}
                            </span>
                        </div>

                        {saveMsg && (
                            <p className={`text-sm font-medium ${saveMsg.startsWith('✅') ? 'text-green-400' : 'text-red-400'}`}>{saveMsg}</p>
                        )}

                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-xl transition disabled:opacity-50"
                        >
                            {saving ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>

                    <hr className="border-white/10 my-10" />
                    
                    <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-6">
                        <h3 className="text-xl font-bold text-red-400 mb-2">Danger Zone</h3>
                        <p className="text-sm text-gray-500 mb-6">Permanently delete your account and all associated data. This action is irreversible.</p>
                        <button 
                            onClick={handleDeleteAccount}
                            disabled={saving}
                            className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 px-6 py-2.5 rounded-xl font-bold transition disabled:opacity-50"
                        >
                            {saving ? 'Processing...' : 'Delete My Account'}
                        </button>
                    </div>
                </section>
            </main>
        </div>
    );
}
