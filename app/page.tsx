import React from 'react';
import styles from './page.module.css';
import { getTalents } from '@/lib/data';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

// Server Component
export default async function Home() {
  const talents = await getTalents();

  return (
    <main className={styles.main}>
      <aside className={styles.sidebar}>
        <div className={styles.logo}>STARBOARD</div>
        <nav className={styles.nav}>
          <div className={`${styles.navItem} ${styles.active}`}>Dashboard</div>
          <div className={styles.navItem}>Talents</div>
          <div className={styles.navItem}>Auditions</div>
          <div className={styles.navItem}>Settings</div>
        </nav>
      </aside>

      <div className={styles.content}>
        <header className={styles.header}>
          <h1 className={styles.pageTitle}>Dashboard Overview</h1>
          <div className={styles.userProfile}>Manager</div>
        </header>

        <section>
          <div className={styles.dashboardGrid}>
            {talents.map(talent => {
              // Calculate Stats
              // Requested categories: Drama, Movie, Commercial (広告), Stage (舞台), Music (音楽), Event (イベント), Other (その他)
              const categories = ['Drama', 'Movie', 'Commercial', 'Stage', 'Music', 'Event', 'Other'];
              const stats = categories.map(cat => {
                // @ts-ignore
                const total = talent.auditions.filter(a => a.category === cat && (a.status === 'Won' || a.status === 'Lost')).length;
                // @ts-ignore
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
                    </div>
                  </div>

                  {/* Summary Stats Grid */}
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
                    <Link href={`/talents/${talent.id}`} style={{
                      display: 'inline-block',
                      padding: '0.5rem 1.5rem',
                      fontSize: '0.9rem',
                      color: '#fff',
                      border: '1px solid rgba(255,255,255,0.2)',
                      borderRadius: '20px',
                      transition: 'all 0.2s'
                    }}>
                      View Details
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
}
