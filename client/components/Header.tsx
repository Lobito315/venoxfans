'use client';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Header() {
    const router = useRouter();
    const pathname = usePathname();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isCreator, setIsCreator] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const userStr = localStorage.getItem('user');

        if (token && userStr) {
            setIsLoggedIn(true);
            try {
                const userObj = JSON.parse(userStr);
                setIsCreator(userObj.isCreator === true);
            } catch (e) { }
        } else {
            setIsLoggedIn(false);
            setIsCreator(false);
        }
    }, [pathname]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setIsLoggedIn(false);
        setIsCreator(false);
        router.push('/');
        router.refresh();
    };

    return (
        <header className="sticky top-0 z-50 glass w-full border-b border-[#d948ef]/15">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center">
                        <Link href="/" className="flex-shrink-0 flex items-center gap-1.5">
                            <span className="text-2xl font-bold gradient-text tracking-tight">VenoxFans</span>
                        </Link>
                        <nav className="hidden md:ml-10 md:flex md:space-x-8">
                            <Link href="/explore" className="text-gray-300 hover:text-[#d948ef] px-3 py-2 rounded-md text-sm font-medium transition-colors">
                                Explore
                            </Link>
                            <Link href="/feed" className="text-gray-300 hover:text-[#d948ef] px-3 py-2 rounded-md text-sm font-medium transition-colors">
                                Feed
                            </Link>
                        </nav>
                    </div>

                    <div className="flex items-center gap-4">
                        {isLoggedIn ? (
                            <>
                                <Link
                                    href={isCreator ? "/dashboard/creator" : "/dashboard/user"}
                                    className="text-sm font-bold gradient-text hover:opacity-80 transition"
                                >
                                    Dashboard
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="text-sm font-medium bg-[#d948ef]/10 hover:bg-[#d948ef]/20 text-[#d948ef] px-4 py-2 rounded-full transition-all border border-[#d948ef]/25"
                                >
                                    Log out
                                </button>
                            </>
                        ) : (
                            <>
                                <Link href="/login" className="text-sm font-medium text-gray-300 hover:text-[#d948ef] transition-colors">
                                    Log in
                                </Link>
                                <Link href="/signup" className="text-sm font-medium bg-[#d948ef] hover:brightness-110 text-white px-4 py-2 rounded-full transition-all shadow-lg shadow-[#d948ef]/25">
                                    Sign up
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}
