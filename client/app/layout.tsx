import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Link from 'next/link';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'VenoxFans | Modern Creator Platform',
  description: 'Support your favorite creators, discover exclusive content, and interact with the community.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        {/* Navigation Bar */}
        <header className="sticky top-0 z-50 glass w-full border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <Link href="/" className="flex-shrink-0 flex items-center">
                  <span className="text-2xl font-bold gradient-text tracking-tight">VenoxFans</span>
                </Link>
                <nav className="hidden md:ml-10 md:flex md:space-x-8">
                  <Link href="/explore" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
                    Explore
                  </Link>
                  <Link href="/feed" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
                    Feed
                  </Link>
                </nav>
              </div>
              <div className="flex items-center gap-4">
                <Link href="/login" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
                  Log in
                </Link>
                <Link href="/signup" className="text-sm font-medium bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-full transition-all shadow-[0_0_15px_rgba(139,92,246,0.5)]">
                  Sign up
                </Link>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-grow">
          {children}
        </main>

        {/* Footer */}
        <footer className="border-t border-white/10 py-10 mt-20 bg-background/80 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="text-center md:text-left">
                <span className="text-xl font-bold gradient-text tracking-tight mb-2 block">VenoxFans</span>
                <p className="text-sm text-gray-500">The Next Generation of Creator Economy.</p>
              </div>
              <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-400">
                <Link href="/terms" className="hover:text-purple-400 transition-colors">Terms of Service</Link>
                <Link href="/privacy" className="hover:text-purple-400 transition-colors">Privacy Policy</Link>
                <Link href="/cookies" className="hover:text-purple-400 transition-colors">Cookie Policy</Link>
              </div>
            </div>
            <div className="mt-8 pt-8 border-t border-white/5 text-center text-sm text-gray-600">
              <p>&copy; {new Date().getFullYear()} VenoxFans. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
