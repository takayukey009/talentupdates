import React from 'react';
import Link from 'next/link';
import { getTalents } from '@/lib/data';
import styles from '../page.module.css';

export const dynamic = 'force-dynamic';

export default async function TalentsPage() {
    const talents = await getTalents();

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
                    <h1 className={styles.pageTitle}>Talents List</h1>
                    <div className={styles.userProfile}>Manager</div>
                </header>

                <section>
                    <div className="glass-panel" style={{ padding: '2rem' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', color: '#e2e8f0' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', textAlign: 'left' }}>
                                    <th style={{ padding: '1rem', fontWeight: '500', color: '#94a3b8' }}>Name</th>
                                    <th style={{ padding: '1rem', fontWeight: '500', color: '#94a3b8' }}>Instagram</th>
                                    <th style={{ padding: '1rem', fontWeight: '500', color: '#94a3b8' }}>TikTok</th>
                                    <th style={{ padding: '1rem', fontWeight: '500', color: '#94a3b8' }}>Last Updated</th>
                                </tr>
                            </thead>
                            <tbody>
                                {talents.map((talent) => {
                                    // Get latest SNS data
                                    const latestSns = talent.sns && talent.sns.length > 0
                                        ? talent.sns.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0]
                                        : null;

                                    const formatNum = (num: number) => num ? num.toLocaleString() : '-';

                                    return (
                                        <tr key={talent.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                            <td style={{ padding: '1rem' }}>
                                                <Link href={`/talents/${talent.id}`} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#fff', textDecoration: 'none' }}>
                                                    <span style={{ width: '32px', height: '32px', borderRadius: '50%', background: talent.avatarUrl, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', marginRight: '0.5rem' }}>
                                                        {talent.name.charAt(0)}
                                                    </span>
                                                    <span style={{ fontWeight: 'bold' }}>{talent.name}</span>
                                                </Link>
                                            </td>
                                            <td style={{ padding: '1rem', fontFamily: 'monospace', fontSize: '1rem' }}>
                                                <span style={{ color: '#E1306C', marginRight: '0.5rem' }}>•</span>
                                                {latestSns ? formatNum(latestSns.instagram) : '-'}
                                            </td>
                                            <td style={{ padding: '1rem', fontFamily: 'monospace', fontSize: '1rem' }}>
                                                <span style={{ color: '#00f2ea', marginRight: '0.5rem' }}>•</span>
                                                {latestSns ? formatNum(latestSns.tiktok) : '-'}
                                            </td>
                                            <td style={{ padding: '1rem', fontSize: '0.8rem', color: '#64748b' }}>
                                                {latestSns ? latestSns.date : '-'}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </section>
            </div>
        </main>
    );
}
