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
    bio?: string;
}

export default function UserSettings() {
    const router = useRouter();
    const [user, setUser] = useState<UserData | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const [bio, setBio] = useState('');
    const [saving, setSaving] = useState(false);
    const [saveMsg, setSaveMsg] = useState('');
    const fileRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            try {
                const parsed = JSON.parse(userStr) as UserData;
                setUser(parsed);
                setAvatarPreview(parsed.avatarUrl || null);
                setBio(parsed.bio || '');
            } catch (e) { }
        }
    }, []);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onloadend = () => {
            setAvatarPreview(reader.result as string);
        };
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
                    bio,
                }),
            });

            if (!res.ok) throw new Error('Failed to save');
            const updated = await res.json();

            const updatedUser = { ...user, avatarUrl: updated.avatarUrl, bio: updated.bio };
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
        if (!confirm('Are you sure you want to delete your account? This action is permanent.')) return;
        
        setSaving(true);
        try {
            const res = await fetch(`${getApiUrl()}/api/users/profile`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: user.id }),
            });

            if (!res.ok) {
                const errData = await res.json().catch(() => ({}));
                throw new Error(errData.error || 'Failed to delete');
            }

            localStorage.removeItem('token');
            localStorage.removeItem('user');
            router.push('/');
            router.refresh();
            alert('Your account has been deleted.');
        } catch (err: any) {
            alert(`Error deleting account: ${err.message || 'Unknown error'}`);
        } finally {
            setSaving(false);
        }
    };

    const avatarSrc = avatarPreview || (user?.username ? `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}` : 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"%3E%3Ccircle cx="12" cy="12" r="12" fill="%23374151"/%3E%3C/svg%3E');

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Account Settings</h1>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                {/* Sidebar Navigation */}
                <div className="glass rounded-2xl flex flex-col p-4 h-fit gap-2">
                    <Link href="/dashboard/user" className="px-4 py-3 rounded-xl hover:bg-white/5 text-gray-300 transition">
                        Active Subscriptions
                    </Link>
                    <Link href="/dashboard/user/purchases" className="px-4 py-3 rounded-xl hover:bg-white/5 text-gray-300 transition">
                        Purchased Content (PPV)
                    </Link>
                    <Link href="/dashboard/user/payment" className="px-4 py-3 rounded-xl hover:bg-white/5 text-gray-300 transition">
                        Payment Methods
                    </Link>
                    <Link href="/dashboard/user/settings" className="px-4 py-3 rounded-xl bg-purple-600/20 text-purple-400 font-medium">
                        Account Settings
                    </Link>
                </div>

                {/* Content Area */}
                <div className="md:col-span-3 space-y-6">
                    <div className="glass p-8 rounded-2xl">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold">Profile Information</h2>
                            {user && (
                                <Link href={`/${user.username}`} className="text-sm bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full transition border border-white/5">
                                    View Public Profile ↗
                                </Link>
                            )}
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

                        <div className="space-y-4 max-w-lg">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Username</label>
                                <input type="text" disabled className="w-full bg-background/50 border border-white/10 rounded-xl px-4 py-3 text-gray-500 cursor-not-allowed" value={user ? `@${user.username}` : ''} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Email</label>
                                <input type="email" disabled className="w-full bg-background/50 border border-white/10 rounded-xl px-4 py-3 text-gray-500 cursor-not-allowed" value={user?.email || ''} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Bio</label>
                                <textarea
                                    value={bio}
                                    onChange={(e) => setBio(e.target.value)}
                                    placeholder="Tell the world about yourself..."
                                    rows={3}
                                    className="w-full bg-background/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 resize-none"
                                />
                            </div>
                            <div className="pt-2">
                                <span className="inline-block px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-xs font-bold uppercase tracking-wider">
                                    Account Role: {user?.isCreator ? 'Creator' : 'Fan'}
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

                            <hr className="border-white/10 my-8" />
                            <h3 className="text-lg font-bold text-red-400 mb-4">Danger Zone</h3>
                            <button 
                                onClick={handleDeleteAccount}
                                disabled={saving}
                                className="px-6 py-2 border border-red-500/50 text-red-400 rounded-xl hover:bg-red-500/10 transition disabled:opacity-50"
                            >
                                {saving ? 'Deleting...' : 'Delete Account'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
