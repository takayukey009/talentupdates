'use client';

import React, { useState } from 'react';
import styles from '../../page.module.css';
import { Talent, getStatusColor } from '@/lib/types';

interface Props {
    talent: Talent;
}

export default function TalentDetailList({ talent }: Props) {
    const [showHistory, setShowHistory] = useState(false);

    const visibleAuditions = talent.auditions.filter(a =>
        showHistory ? true : !a.isArchived
    );

    return (
        <div className="glass-panel" style={{ padding: '2rem', position: 'relative' }}>
            <div style={{ position: 'absolute', top: '2rem', right: '2rem' }}>
                <button
                    className={`${styles.toggleButton} ${showHistory ? styles.active : ''}`}
                    onClick={() => setShowHistory(!showHistory)}
                >
                    {showHistory ? 'Showing History' : 'Show History'}
                </button>
            </div>

            <h3>Audition History</h3>
            <br />

            <div className={styles.auditionList}>
                {visibleAuditions.length === 0 ? (
                    <div className={styles.emptyState}>No activity to show</div>
                ) : (
                    visibleAuditions.map(audition => (
                        <div
                            key={audition.id}
                            className={`${styles.auditionItem} ${audition.isArchived ? styles.archivedItem : ''}`}
                        >
                            <div className={styles.auditionHeader}>
                                <span className={styles.categoryBadge} data-cat={audition.category}>{audition.category}</span>
                                <span className={styles.date}>{audition.date || '--'}</span>
                            </div>
                            <div className={styles.projectTitle}>
                                {audition.projectTitle}
                                {audition.client && <span style={{ fontSize: '0.8rem', color: '#64748b', marginLeft: '0.5rem', fontWeight: 'normal' }}>({audition.client})</span>}
                                {audition.isArchived && <span className={styles.archiveBadge}>History</span>}
                            </div>
                            <div style={{ fontSize: '0.8rem', color: '#cbd5e1', marginBottom: '0.5rem', display: 'flex', gap: '1rem' }}>
                                {audition.shootDate && <span>Shoot: {audition.shootDate}</span>}
                                {audition.manager && <span>Manager: {audition.manager}</span>}
                            </div>
                            <div className={styles.statusBadge} style={{ borderColor: getStatusColor(audition.status), color: getStatusColor(audition.status) }}>
                                <span className={styles.statusDot} style={{ backgroundColor: getStatusColor(audition.status) }}></span>
                                {audition.status}
                            </div>
                            {audition.notes && <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.5rem' }}>{audition.notes}</div>}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
