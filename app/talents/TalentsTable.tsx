'use client';

import React from 'react';
import Link from 'next/link';
import { Talent } from '@/lib/types';

interface Props {
    talents: Talent[];
}

export default function TalentsTable({ talents }: Props) {
    return (
        <div className="glass-panel" style={{ padding: '1rem' }}>
            {/* Mobile Card Layout */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {talents.map((talent) => {
                    const sortedSns = talent.sns && talent.sns.length > 0
                        ? [...talent.sns].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                        : [];
                    const latestSns = sortedSns.length > 0 ? sortedSns[sortedSns.length - 1] : null;
                    const formatNum = (num: number) => num ? num.toLocaleString() : '-';

                    return (
                        <Link
                            key={talent.id}
                            href={`/talents/${talent.id}`}
                            style={{
                                display: 'block',
                                background: 'rgba(255,255,255,0.03)',
                                borderRadius: '12px',
                                padding: '1rem',
                                border: '1px solid rgba(255,255,255,0.05)',
                                textDecoration: 'none',
                                color: '#e2e8f0'
                            }}
                        >
                            {/* Header: Name */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                                <span style={{
                                    width: '36px',
                                    height: '36px',
                                    borderRadius: '50%',
                                    background: talent.avatarUrl || '#6366f1',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '0.9rem',
                                    fontWeight: 'bold'
                                }}>
                                    {talent.name.charAt(0)}
                                </span>
                                <span style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{talent.name}</span>
                            </div>

                            {/* Stats Row */}
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(3, 1fr)',
                                gap: '0.5rem',
                                fontSize: '0.85rem'
                            }}>
                                {/* Instagram */}
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{ color: '#94a3b8', marginBottom: '0.25rem' }}>Instagram</div>
                                    <div style={{ fontWeight: 'bold', color: '#E1306C' }}>
                                        {latestSns ? formatNum(latestSns.instagram) : '-'}
                                    </div>
                                </div>
                                {/* TikTok */}
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{ color: '#94a3b8', marginBottom: '0.25rem' }}>TikTok</div>
                                    <div style={{ fontWeight: 'bold', color: '#00f2ea' }}>
                                        {latestSns ? formatNum(latestSns.tiktok) : '-'}
                                    </div>
                                </div>
                                {/* X/Twitter */}
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{ color: '#94a3b8', marginBottom: '0.25rem' }}>X</div>
                                    <div style={{ fontWeight: 'bold', color: '#1DA1F2' }}>
                                        {latestSns ? formatNum(latestSns.x) : '-'}
                                    </div>
                                </div>
                            </div>

                            {/* Date */}
                            {latestSns && (
                                <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: '#64748b', textAlign: 'right' }}>
                                    {latestSns.date}
                                </div>
                            )}
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}

