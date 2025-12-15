import React from 'react';
import Link from 'next/link';
import { getTalents } from '@/lib/data';
import styles from '../page.module.css';
import TalentsTable from './TalentsTable';

export const dynamic = 'force-dynamic';

export default async function TalentsPage() {
    const talents = await getTalents();

    return (
        <main className={styles.main}>
            <aside className={styles.sidebar}>
                <div className={styles.logo}>GATEタレントAD進捗</div>
                <nav className={styles.nav}>
                    <Link href="/" className={styles.navItem}>Dashboard</Link>
                    <Link href="/talents" className={`${styles.navItem} ${styles.active}`}>Talents</Link>
                    <Link href="/auditions" className={styles.navItem}>Auditions</Link>
                    <div className={styles.navItem}>Settings</div>
                </nav>
            </aside>

            <div className={styles.content}>
                <header className={styles.header}>
                    <h1 className={styles.pageTitle}>Talents List <span style={{ fontSize: '0.8rem', opacity: 0.5 }}>(v1.1)</span></h1>
                    <div className={styles.userProfile}>Manager</div>
                </header>

                <section>
                    <TalentsTable talents={talents} />
                </section>
            </div>
        </main>
    );
}
