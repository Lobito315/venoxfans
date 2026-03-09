'use client';
import Link from 'next/link';
import { useState } from 'react';

export default function SignupPage() {
    const [role, setRole] = useState<'user' | 'creator'>('user');
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [ageError, setAgeError] = useState('');

    const calculateAge = (dob: string) => {
        const birthday = new Date(dob);
        const today = new Date();
        let age = today.getFullYear() - birthday.getFullYear();
        const m = today.getMonth() - birthday.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthday.getDate())) {
            age--;
        }
        return age;
    };

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newDob = e.target.value;
        setDateOfBirth(newDob);

        if (role === 'creator') {
            const age = calculateAge(newDob);
            if (age < 18) {
                setAgeError('You must be at least 18 years old to register as a creator.');
            } else {
                setAgeError('');
            }
        }
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (role === 'creator' && calculateAge(dateOfBirth) < 18) {
            setAgeError('You must be at least 18 years old to register as a creator.');
            return;
        }
        // Proceed with registration...
        console.log('Registering as', role);
    };

    return (
        <div className="min-h-[calc(100vh-80px)] flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-pink-900/20 via-background to-background">
            <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
                <h2 className="mt-6 text-center text-4xl font-extrabold text-white">
                    Join VenoxFans
                </h2>
                <p className="mt-2 text-center text-sm text-gray-400">
                    Already have an account?{' '}
                    <Link href="/login" className="font-medium text-pink-400 hover:text-pink-300 transition">
                        Log in here
                    </Link>
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="glass py-8 px-4 sm:rounded-2xl sm:px-10 border border-white/10 shadow-2xl">
                    {/* Role Toggle */}
                    <div className="mb-6 flex p-1 glass rounded-full relative">
                        <div
                            className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white/10 rounded-full transition-transform duration-300 ease-in-out ${role === 'creator' ? 'translate-x-[calc(100%+4px)]' : 'translate-x-0'}`}
                        ></div>
                        <button
                            onClick={() => { setRole('user'); setAgeError(''); }}
                            className={`flex-1 py-2 text-sm font-bold z-10 transition-colors ${role === 'user' ? 'text-white' : 'text-gray-400 hover:text-white'}`}
                        >
                            As User
                        </button>
                        <button
                            onClick={() => { setRole('creator'); if (dateOfBirth) handleDateChange({ target: { value: dateOfBirth } } as React.ChangeEvent<HTMLInputElement>); }}
                            className={`flex-1 py-2 text-sm font-bold z-10 transition-colors ${role === 'creator' ? 'text-white' : 'text-gray-400 hover:text-white'}`}
                        >
                            As Creator
                        </button>
                    </div>

                    <form className="space-y-5" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-gray-300">
                                Username
                            </label>
                            <div className="mt-1">
                                <input
                                    id="username"
                                    name="username"
                                    type="text"
                                    required
                                    placeholder="@yourhandle"
                                    className="appearance-none block w-full px-3 py-3 border border-gray-700 bg-background/50 rounded-xl shadow-sm placeholder-gray-500 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm text-white"
                                />
                            </div>
                        </div>

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
                                    className="appearance-none block w-full px-3 py-3 border border-gray-700 bg-background/50 rounded-xl shadow-sm placeholder-gray-500 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm text-white"
                                />
                            </div>
                        </div>

                        {/* Age Verification for Creators */}
                        {role === 'creator' && (
                            <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                                <label htmlFor="dob" className="block text-sm font-medium text-gray-300">
                                    Date of Birth <span className="text-pink-400 text-xs ml-1">(Must be 18+)</span>
                                </label>
                                <div className="mt-1">
                                    <input
                                        id="dob"
                                        name="dob"
                                        type="date"
                                        required
                                        max={new Date().toISOString().split('T')[0]}
                                        value={dateOfBirth}
                                        onChange={handleDateChange}
                                        className={`appearance-none block w-full px-3 py-3 border ${ageError ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-700 focus:ring-pink-500 focus:border-pink-500'} bg-background/50 rounded-xl shadow-sm placeholder-gray-500 focus:outline-none sm:text-sm text-white`}
                                    />
                                </div>
                                {ageError && <p className="mt-2 text-sm text-red-400">{ageError}</p>}
                                <div className="mt-3 p-3 bg-pink-900/20 border border-pink-500/30 rounded-lg">
                                    <p className="text-xs text-pink-200">
                                        <span className="font-bold">Identity Verification:</span> You will need to provide a valid government-issued ID to receive payouts.
                                    </p>
                                </div>
                            </div>
                        )}

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                                Password
                            </label>
                            <div className="mt-1">
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                    className="appearance-none block w-full px-3 py-3 border border-gray-700 bg-background/50 rounded-xl shadow-sm placeholder-gray-500 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm text-white"
                                />
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={role === 'creator' && !!ageError}
                                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-full shadow-[0_0_15px_rgba(236,72,153,0.3)] text-sm font-bold text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
                            >
                                Create Account
                            </button>
                        </div>
                    </form>

                    <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-700" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-surface text-gray-400">Or continue with</span>
                            </div>
                        </div>

                        <div className="mt-6 flex flex-col gap-3">
                            <button className="w-full flex items-center justify-center px-4 py-3 border border-gray-700 rounded-full shadow-sm bg-background/50 text-sm font-medium text-white hover:bg-white/5 transition-colors">
                                <img className="h-5 w-5 mr-2" src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" />
                                Google
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
