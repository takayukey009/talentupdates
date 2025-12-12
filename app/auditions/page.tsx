import React from 'react';
import Link from 'next/link';
import { getTalents } from '@/lib/data';
import styles from '../page.module.css'; // Reuse main styles for consistency

export const dynamic = 'force-dynamic';

export default async function AuditionsPage() {
    const talents = await getTalents();

    // Flatten and filter for Won auditions
    const wonAuditions = talents.flatMap(talent =>
        talent.auditions
            .filter(a => a.status === 'Won')
            .map(a => ({
                ...a,
                talentId: talent.id,
                talentName: talent.name
            }))
    );

    // Sort by date (descending, assuming date string allows basic sorting or just keep order)
    // Sheets dates are often "MM/DD", so sorting might be imperfect without year. 
    // We'll just display them as retrieved for now, or maybe reverse to show newest if sheets are appended.
    // Actually, usually sheets are top-down. 

    return (
        <main className={styles.main}>
            <aside className={styles.sidebar}>
                <div className={styles.logo}>STARBOARD</div>
                <nav className={styles.nav}>
                    <Link href="/" className={styles.navItem}>Dashboard</Link>
                    <div className={styles.navItem}>Talents</div>
                    <div className={`${styles.navItem} ${styles.active}`}>Auditions</div>
                    <div className={styles.navItem}>Settings</div>
                </nav>
            </aside>

            <div className={styles.content}>
                <header className={styles.header}>
                    <h1 className={styles.pageTitle}>Won Auditions History</h1>
                    <div className={styles.userProfile}>Manager</div>
                </header>

                <section>
                    <div className="glass-panel" style={{ padding: '2rem' }}>
                        {wonAuditions.length === 0 ? (
                            <div style={{ textAlign: 'center', color: '#94a3b8' }}>No won auditions found.</div>
                        ) : (
                            <table style={{ width: '100%', borderCollapse: 'collapse', color: '#e2e8f0' }}>
                                <thead>
                                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', textAlign: 'left' }}>
                                        <th style={{ padding: '1rem', fontWeight: '500', color: '#94a3b8' }}>Talent</th>
                                        <th style={{ padding: '1rem', fontWeight: '500', color: '#94a3b8' }}>Project</th>
                                        <th style={{ padding: '1rem', fontWeight: '500', color: '#94a3b8' }}>Client</th>
                                        <th style={{ padding: '1rem', fontWeight: '500', color: '#94a3b8' }}>Category</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {wonAuditions.map((audition, index) => (
                                        <tr key={`${audition.id}-${index}`} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                            <td style={{ padding: '1rem' }}>
                                                <Link href={`/talents/${audition.talentId}`} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#fff', textDecoration: 'none' }}>
                                                    <span style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem' }}>
                                                        {audition.talentName.charAt(0)}
                                                    </span>
                                                    {audition.talentName}
                                                </Link>
                                            </td>
                                            <td style={{ padding: '1rem', fontWeight: 'bold' }}>{audition.projectTitle}</td>
                                            <td style={{ padding: '1rem', fontSize: '0.9rem', color: '#cbd5e1' }}>{audition.client}</td>
                                            <td style={{ padding: '1rem' }}>
                                                <span style={{
                                                    padding: '0.25rem 0.75rem',
                                                    borderRadius: '20px',
                                                    fontSize: '0.8rem',
                                                    background: 'rgba(255, 255, 255, 0.1)',
                                                    border: '1px solid rgba(255, 255, 255, 0.1)'
                                                }}>
                                                    {audition.category}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </section>
            </div>
        </main>
    );
}
