'use client';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useGoogleLogin } from '@react-oauth/google';
import { getApiUrl } from '../utils/apiConfig';

export default function LoginPage() {
    const router = useRouter();
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');

        const formData = new FormData(e.currentTarget);
        const email = formData.get('email');
        const password = formData.get('password');

        try {
            const res = await fetch(`${getApiUrl()}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Login failed');
            }

            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));

            if (data.user?.isCreator) {
                router.push('/dashboard/creator');
            } else {
                router.push('/dashboard/user');
            }
        } catch (err: any) {
            console.error('Login Error:', err);
            setError(err.message);
        }
    };

    const loginWithGoogle = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            try {
                const res = await fetch(`${getApiUrl()}/api/auth/google`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ token: tokenResponse.access_token }),
                });

                const data = await res.json();

                if (!res.ok) {
                    throw new Error(data.error || 'Google login failed');
                }

                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));

                if (data.user?.isCreator) {
                    router.push('/dashboard/creator');
                } else {
                    router.push('/dashboard/user');
                }
            } catch (err: any) {
                console.error('Google Login Error:', err);
                setError(err.message || 'Google login failed');
            }
        },
        onError: () => {
            setError('Google login failed or was cancelled');
        }
    });

    return (
        <div className="min-h-[calc(100vh-80px)] flex flex-col justify-center py-12 sm:px-6 lg:px-8"
            style={{ background: 'radial-gradient(ellipse at top right, rgba(217,72,239,0.12) 0%, var(--background) 60%)' }}>
            <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
                <div className="flex justify-center mb-4">
                    <span className="text-4xl">💎</span>
                </div>
                <h2 className="mt-2 text-center text-4xl font-extrabold text-white">
                    Welcome back
                </h2>
                <p className="mt-2 text-center text-sm text-gray-400">
                    Or{' '}
                    <Link href="/signup" className="font-medium text-[#d948ef] hover:text-[#e879f9] transition">
                        create a new account
                    </Link>
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="glass py-8 px-4 sm:rounded-2xl sm:px-10 border border-[#d948ef]/15 shadow-2xl shadow-[#d948ef]/5">
                    {error && (
                        <div className="mb-6 bg-red-500/10 border border-red-500/50 p-3 rounded-lg text-center">
                            <p className="text-sm font-medium text-red-400">{error}</p>
                        </div>
                    )}
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                                Email address
                            </label>
                            <div className="mt-1">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    className="appearance-none block w-full px-3 py-3 border border-[#d948ef]/20 bg-[#1f1022]/60 rounded-xl shadow-sm placeholder-gray-500 focus:outline-none focus:ring-[#d948ef] focus:border-[#d948ef] sm:text-sm text-white"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                                Password
                            </label>
                            <div className="mt-1">
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    className="appearance-none block w-full px-3 py-3 border border-[#d948ef]/20 bg-[#1f1022]/60 rounded-xl shadow-sm placeholder-gray-500 focus:outline-none focus:ring-[#d948ef] focus:border-[#d948ef] sm:text-sm text-white"
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input
                                    id="remember-me"
                                    name="remember-me"
                                    type="checkbox"
                                    className="h-4 w-4 accent-[#d948ef] focus:ring-[#d948ef] border-[#d948ef]/20 rounded"
                                />
                                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-300">
                                    Remember me
                                </label>
                            </div>

                            <div className="text-sm">
                                <a href="#" className="font-medium text-[#d948ef] hover:text-[#e879f9] transition">
                                    Forgot your password?
                                </a>
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-full shadow-lg shadow-[#d948ef]/20 text-sm font-bold text-white bg-[#d948ef] hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#d948ef] transition-all"
                            >
                                Sign in
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
                                onClick={() => loginWithGoogle()}
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
