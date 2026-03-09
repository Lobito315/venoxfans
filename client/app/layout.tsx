import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Link from 'next/link';
import AppShell from '@/components/AppShell';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'VenoxFans | Modern Creator Platform',
  description: 'Support your favorite creators, discover exclusive content, and interact with the community.',
};

const footer = (
  <footer className="border-t border-white/10 py-10 mt-20 bg-background/80 backdrop-blur-md">
    <div className="max-w-7xl mx-auto px-4">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-center md:text-left">
          <span className="text-xl font-bold gradient-text tracking-tight mb-2 block">VenoxFans</span>
          <p className="text-sm text-gray-500">The Next Generation of Creator Economy.</p>
        </div>
        <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-400">
          <Link href="/terms" className="hover:text-[#d948ef] transition-colors">Terms of Service</Link>
          <Link href="/privacy" className="hover:text-[#d948ef] transition-colors">Privacy Policy</Link>
          <Link href="/cookies" className="hover:text-[#d948ef] transition-colors">Cookie Policy</Link>
        </div>
      </div>
      <div className="mt-8 pt-8 border-t border-white/5 text-center text-sm text-gray-600">
        <p>© {new Date().getFullYear()} VenoxFans. All rights reserved.</p>
      </div>
    </div>
  </footer>
);

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" rel="stylesheet" />
      </head>
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        <AppShell footer={footer}>
          {children}
        </AppShell>
      </body>
    </html>
  );
}
