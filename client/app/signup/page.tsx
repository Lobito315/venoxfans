'use client';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useGoogleLogin } from '@react-oauth/google';

export default function SignupPage() {
    const router = useRouter();
    const [role, setRole] = useState<'user' | 'creator'>('user');
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [ageError, setAgeError] = useState('');

    const calculateAge = (dob: string) => {
        const birthday = new Date(dob);
        const today = new Date();
        let age = today.getFullYear() - birthday.getFullYear();
        const m = today.getMonth() - birthday.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthday.getDate())) age--;
        return age;
    };

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newDob = e.target.value;
        setDateOfBirth(newDob);
        if (role === 'creator') {
            setAgeError(calculateAge(newDob) < 18 ? 'You must be at least 18 years old to register as a creator.' : '');
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (role === 'creator' && calculateAge(dateOfBirth) < 18) {
            setAgeError('You must be at least 18 years old to register as a creator.');
            return;
        }

        const formData = new FormData(e.currentTarget);
        const username = formData.get('username');
        const email = formData.get('email');
        const password = formData.get('password');

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, email, password, role, dateOfBirth: role === 'creator' ? dateOfBirth : undefined }),
            });

            const data = await res.json();

            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));

            router.push(role === 'creator' ? '/dashboard/creator' : '/dashboard/user');
        } catch (error: any) {
            console.error('Signup error:', error);
            alert(error.message);
        }
    };

    const signupWithGoogle = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/auth/google`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ token: tokenResponse.access_token }),
                });

                const data = await res.json();

                if (!res.ok) {
                    throw new Error(data.error || 'Google signup failed');
                }

                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));

                // Always push to user dashboard on google signup flow since google accounts have no built-in "creator" toggle initially
                router.push('/dashboard/user');
                
            } catch (err: any) {
                console.error('Google Signup Error:', err);
                alert(err.message || 'Google signup failed');
            }
        },
        onError: () => {
            alert('Google signup failed or was cancelled');
        }
    });

    return (
        <div className="min-h-[calc(100vh-80px)] flex flex-col justify-center py-12 sm:px-6 lg:px-8"
            style={{ background: 'radial-gradient(ellipse at top left, rgba(217,72,239,0.12) 0%, var(--background) 60%)' }}>
            <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
                <div className="flex justify-center mb-4">
                    <span className="text-4xl">✨</span>
                </div>
                <h2 className="mt-2 text-center text-4xl font-extrabold text-white">
                    Join VenoxFans
                </h2>
                <p className="mt-2 text-center text-sm text-gray-400">
                    Already have an account?{' '}
                    <Link href="/login" className="font-medium text-[#d948ef] hover:text-[#e879f9] transition">
                        Log in here
                    </Link>
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="glass py-8 px-4 sm:rounded-2xl sm:px-10 border border-[#d948ef]/15 shadow-2xl shadow-[#d948ef]/5">
                    {/* Role Toggle */}
                    <div className="mb-6 flex p-1 glass rounded-full relative border border-[#d948ef]/15">
                        <div
                            className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-[#d948ef]/20 rounded-full transition-transform duration-300 ease-in-out ${role === 'creator' ? 'translate-x-[calc(100%+4px)]' : 'translate-x-0'}`}
                        ></div>
                        <button
                            onClick={() => { setRole('user'); setAgeError(''); }}
                            className={`flex-1 py-2 text-sm font-bold z-10 transition-colors ${role === 'user' ? 'text-[#d948ef]' : 'text-gray-400 hover:text-white'}`}
                        >
                            As User
                        </button>
                        <button
                            onClick={() => { setRole('creator'); if (dateOfBirth) handleDateChange({ target: { value: dateOfBirth } } as React.ChangeEvent<HTMLInputElement>); }}
                            className={`flex-1 py-2 text-sm font-bold z-10 transition-colors ${role === 'creator' ? 'text-[#d948ef]' : 'text-gray-400 hover:text-white'}`}
                        >
                            As Creator
                        </button>
                    </div>

                    <form className="space-y-5" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-gray-300">Username</label>
                            <div className="mt-1">
                                <input
                                    id="username" name="username" type="text" required placeholder="@yourhandle"
                                    className="appearance-none block w-full px-3 py-3 border border-[#d948ef]/20 bg-[#1f1022]/60 rounded-xl shadow-sm placeholder-gray-500 focus:outline-none focus:ring-[#d948ef] focus:border-[#d948ef] sm:text-sm text-white"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-300">Email address</label>
                            <div className="mt-1">
                                <input
                                    id="email" name="email" type="email" autoComplete="email" required
                                    className="appearance-none block w-full px-3 py-3 border border-[#d948ef]/20 bg-[#1f1022]/60 rounded-xl shadow-sm placeholder-gray-500 focus:outline-none focus:ring-[#d948ef] focus:border-[#d948ef] sm:text-sm text-white"
                                />
                            </div>
                        </div>

                        {role === 'creator' && (
                            <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                                <label htmlFor="dob" className="block text-sm font-medium text-gray-300">
                                    Date of Birth <span className="text-[#d948ef] text-xs ml-1">(Must be 18+)</span>
                                </label>
                                <div className="mt-1">
                                    <input
                                        id="dob" name="dob" type="date" required
                                        max={new Date().toISOString().split('T')[0]}
                                        value={dateOfBirth}
                                        onChange={handleDateChange}
                                        className={`appearance-none block w-full px-3 py-3 border ${ageError ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-[#d948ef]/20 focus:ring-[#d948ef] focus:border-[#d948ef]'} bg-[#1f1022]/60 rounded-xl shadow-sm placeholder-gray-500 focus:outline-none sm:text-sm text-white`}
                                    />
                                </div>
                                {ageError && <p className="mt-2 text-sm text-red-400">{ageError}</p>}
                                <div className="mt-3 p-3 bg-[#d948ef]/10 border border-[#d948ef]/25 rounded-lg">
                                    <p className="text-xs text-[#e879f9]">
                                        <span className="font-bold">Identity Verification:</span> You will need to provide a valid government-issued ID to receive payouts.
                                    </p>
                                </div>
                            </div>
                        )}

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-300">Password</label>
                            <div className="mt-1">
                                <input
                                    id="password" name="password" type="password" required
                                    className="appearance-none block w-full px-3 py-3 border border-[#d948ef]/20 bg-[#1f1022]/60 rounded-xl shadow-sm placeholder-gray-500 focus:outline-none focus:ring-[#d948ef] focus:border-[#d948ef] sm:text-sm text-white"
                                />
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={role === 'creator' && !!ageError}
                                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-full shadow-lg shadow-[#d948ef]/25 text-sm font-bold text-white bg-[#d948ef] hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#d948ef] transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
                            >
                                Create Account
                            </button>
                        </div>
                    </form>

                    <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-[#d948ef]/15" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-[#2a1832] text-gray-400">Or continue with</span>
                            </div>
                        </div>

                        <div className="mt-6">
                            <button 
                                onClick={() => signupWithGoogle()}
                                className="w-full flex items-center justify-center px-4 py-3 border border-[#d948ef]/20 rounded-full shadow-sm bg-[#1f1022]/50 text-sm font-medium text-white hover:bg-[#d948ef]/10 transition-colors"
                            >
                                <img className="h-5 w-5 mr-2" src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" />
                                Continue with Google
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
