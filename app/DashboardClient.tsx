'use client';

import React, { useState } from 'react';
import styles from './page.module.css';
import { Talent, HighLight } from '@/lib/types';
import Link from 'next/link';

interface DashboardClientProps {
    talents: Talent[];
    highlights: HighLight[];
}

export default function DashboardClient({ talents, highlights }: DashboardClientProps) {
    const [activeTab, setActiveTab] = useState<'dashboard' | 'highlights'>('dashboard');

    return (
        <main className={styles.main}>
            <aside className={styles.sidebar}>
                <div className={styles.logo}>GATEタレントAD進捗</div>
                <nav className={styles.nav}>
                    <div className={`${styles.navItem} ${styles.active}`}>Dashboard</div>
                    <Link href="/talents" className={styles.navItem}>Talents</Link>
                    <Link href="/auditions" className={styles.navItem}>Auditions</Link>
                    <div className={styles.navItem}>Settings</div>
                </nav>
            </aside>

            <div className={styles.content}>
                <header className={styles.header}>
                    <div>
                        <h1 className={styles.pageTitle}>Dashboard Overview</h1>
                        <div className={styles.userProfile}>Manager</div>
                    </div>

                    <div className={styles.tabContainer}>
                        <button
                            className={`${styles.tabButton} ${activeTab === 'dashboard' ? styles.tabActive : ''}`}
                            onClick={() => setActiveTab('dashboard')}
                        >
                            Dashboard
                        </button>
                        <button
                            className={`${styles.tabButton} ${activeTab === 'highlights' ? styles.tabActive : ''}`}
                            onClick={() => setActiveTab('highlights')}
                        >
                            Highlights
                        </button>
                    </div>
                </header>

                {activeTab === 'dashboard' ? (
                    <section>
                        <div className={styles.dashboardGrid}>
                            {talents.map(talent => {
                                const categories = ['Drama', 'Movie', 'Commercial', 'Stage', 'Music', 'Event', 'Other'];
                                const stats = categories.map(cat => {
                                    const total = talent.auditions.filter(a => a.category === cat && (a.status === 'Won' || a.status === 'Lost')).length;
                                    const won = talent.auditions.filter(a => a.category === cat && a.status === 'Won').length;
                                    const rate = total > 0 ? Math.round((won / total) * 100) : 0;
                                    return { cat, total, won, rate };
                                });

                                return (
                                    <div key={talent.id} className={`${styles.talentCard} glass-panel`}>
                                        <div className={styles.cardHeader} style={{ borderBottom: 'none', paddingBottom: '0.5rem' }}>
                                            <div className={styles.avatar} style={{ backgroundColor: talent.avatarUrl }}>
                                                {talent.name.charAt(0)}
                                            </div>
                                            <div className={styles.talentInfo}>
                                                <Link
                                                    href={`/talents/${talent.id}`}
                                                    className={styles.talentName}
                                                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}
                                                >
                                                    {talent.name} <span style={{ fontSize: '0.8rem', opacity: 0.7, fontWeight: 'normal' }}>↗</span>
                                                </Link>
                                                <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '0.25rem', display: 'flex', gap: '1rem' }}>
                                                    <div>Total: <span style={{ color: '#e2e8f0', fontWeight: 'bold' }}>{talent.auditions.length}</span></div>
                                                    <div>書類通過数: <span style={{ color: '#22d3ee', fontWeight: 'bold' }}>{talent.auditions.filter(a => a.documentPassed).length}</span></div>
                                                </div>
                                            </div>
                                        </div>

                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
                                            {stats.map(s => {
                                                const hasData = s.total > 0;
                                                return (
                                                    <div key={s.cat} style={{
                                                        padding: '0.75rem',
                                                        background: hasData ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.1)',
                                                        borderRadius: '8px',
                                                        opacity: hasData ? 1 : 0.5
                                                    }}>
                                                        <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginBottom: '4px' }}>{s.cat}</div>
                                                        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginTop: 'auto' }}>
                                                            <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: hasData ? 'var(--accent-cyan)' : '#64748b' }}>
                                                                {s.rate}<span style={{ fontSize: '0.9rem', fontWeight: 'normal' }}>%</span>
                                                            </span>
                                                            <span style={{ fontSize: '1.1rem', fontWeight: '500', color: hasData ? '#e2e8f0' : '#64748b', marginLeft: 'auto' }}>
                                                                <span style={{ fontSize: '0.8rem', opacity: 0.7 }}>Total:</span> {s.total}
                                                            </span>
                                                        </div>
                                                        <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '2px', textAlign: 'right' }}>
                                                            (Won: <span style={{ color: s.won > 0 ? 'var(--accent-success)' : 'inherit' }}>{s.won}</span>)
                                                        </div>
                                                    </div>
                                                )
                                            })}
                                        </div>

                                        <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
                                            <Link href={`/talents/${talent.id}`} className={styles.actionButton}>
                                                進行中案件
                                            </Link>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </section>
                ) : (
                    <section className={styles.highlightSection}>
                        <div className={styles.highlightGrid}>
                            {highlights.length === 0 ? (
                                <div className={styles.emptyState}>No highlights available. Add a 'Highlights' sheet and populate it.</div>
                            ) : (
                                highlights.map(item => (
                                    <div key={item.id} className={`${styles.highlightCard} glass-panel`}>
                                        <div className={styles.highlightHeader}>
                                            <span className={styles.highlightDate}>{item.date}</span>
                                            <h3 className={styles.highlightTitle}>{item.title}</h3>
                                        </div>
                                        <div className={styles.highlightContent}>
                                            {item.content}
                                        </div>
                                        {item.link && (
                                            <div className={styles.highlightFooter}>
                                                <a href={item.link} target="_blank" rel="noopener noreferrer" className={styles.highlightLink}>
                                                    View Source ↗
                                                </a>
                                            </div>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    </section>
                )}
            </div>
        </main>
    );
}
