'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './page.module.css';

interface Props {
    children: React.ReactNode;
}

export default function MobileLayout({ children }: Props) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const pathname = usePathname();

    const isActive = (path: string) => {
        if (path === '/') return pathname === '/';
        return pathname.startsWith(path);
    };

    return (
        <main className={styles.main}>
            {/* Hamburger Menu Button */}
            <button
                className={styles.menuButton}
                onClick={() => setSidebarOpen(!sidebarOpen)}
                aria-label="Toggle menu"
            >
                {sidebarOpen ? '✕' : '☰'}
            </button>

            {/* Overlay */}
            <div
                className={`${styles.sidebarOverlay} ${sidebarOpen ? styles.open : ''}`}
                onClick={() => setSidebarOpen(false)}
            />

            {/* Sidebar */}
            <aside className={`${styles.sidebar} ${sidebarOpen ? styles.open : ''}`}>
                <div className={styles.logo}>GATEタレントAD進捗</div>
                <nav className={styles.nav}>
                    <Link
                        href="/"
                        className={`${styles.navItem} ${isActive('/') && pathname === '/' ? styles.active : ''}`}
                        onClick={() => setSidebarOpen(false)}
                    >
                        Dashboard
                    </Link>
                    <Link
                        href="/talents"
                        className={`${styles.navItem} ${isActive('/talents') ? styles.active : ''}`}
                        onClick={() => setSidebarOpen(false)}
                    >
                        Talents
                    </Link>
                    <Link
                        href="/auditions"
                        className={`${styles.navItem} ${isActive('/auditions') ? styles.active : ''}`}
                        onClick={() => setSidebarOpen(false)}
                    >
                        Auditions
                    </Link>
                    <div className={styles.navItem}>Settings</div>
                </nav>
            </aside>

            {/* Main Content */}
            <div className={styles.content}>
                {children}
            </div>
        </main>
    );
}
