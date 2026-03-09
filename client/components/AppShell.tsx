'use client';

import { usePathname } from 'next/navigation';
import Header from './Header';

/** Routes where the global header and footer are hidden (they have their own). */
const STANDALONE_ROUTES = ['/'];

export default function AppShell({ footer, children }: { footer: React.ReactNode; children: React.ReactNode }) {
    const pathname = usePathname();
    const isStandalone = STANDALONE_ROUTES.includes(pathname);

    return (
        <>
            {!isStandalone && <Header />}
            <main className="flex-grow">{children}</main>
            {!isStandalone && footer}
        </>
    );
}
