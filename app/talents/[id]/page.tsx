import React from 'react';
import styles from '../../page.module.css';
import { getTalentById, getTalents } from '@/lib/data';
import Link from 'next/link';
import TalentDetailList from './TalentDetailList';
import SnsChart from './SnsChart';

export const dynamic = 'force-dynamic';

export default async function TalentDetail({ params }: { params: Promise<{ id: string }> }) {
    const { id: rawId } = await params;
    const id = decodeURIComponent(rawId);
    const talent = await getTalentById(id);

    if (!talent) {
        return (
            <div className={styles.main} style={{ padding: '2rem', textAlign: 'center' }}>
                <h2 style={{ color: 'red' }}>Talent not found</h2>
                <Link href="/" style={{ textDecoration: 'underline', marginTop: '1rem', display: 'block' }}>Return to Dashboard</Link>
            </div>
        );
    }

    return (
        <main className={styles.main}>
            <aside className={styles.sidebar}>
                <div className={styles.logo}>GATEタレントAD進捗</div>
                <nav className={styles.nav}>
                    <Link href="/" className={styles.navItem}>Dashboard</Link>
                    <div className={`${styles.navItem} ${styles.active}`}>Talents</div>
                    <Link href="/auditions" className={styles.navItem}>Auditions</Link>
                    <div className={styles.navItem}>Settings</div>
                </nav>
            </aside>

            <div className={styles.content}>
                <header className={styles.header}>
                    <div>
                        <Link href="/" style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '0.5rem', display: 'block' }}>← Back to Dashboard</Link>
                        <h1 className={styles.pageTitle}>{talent.name}</h1>
                    </div>
                </header>

                <section>
                    <TalentDetailList talent={talent} />
                </section>

                <section>
                    <SnsChart talent={talent} />
                </section>
            </div>
        </main>
    );
}
