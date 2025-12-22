'use client';

import React from 'react';
import Link from 'next/link';
import { Talent } from '@/lib/types';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

interface Props {
    talents: Talent[];
}

export default function TalentsTable({ talents }: Props) {
    return (
        <div className="glass-panel" style={{ padding: '1rem' }}>
            <div style={{ display: 'none', md: 'block' } as any}>
                <table style={{ width: '100%', borderCollapse: 'collapse', color: '#e2e8f0', marginBottom: '1rem' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', textAlign: 'left' }}>
                            <th style={{ padding: '1rem', fontWeight: '500', color: '#94a3b8' }}>Name</th>
                            <th style={{ padding: '1rem', fontWeight: '500', color: '#94a3b8' }}>Instagram</th>
                            <th style={{ padding: '1rem', fontWeight: '500', color: '#94a3b8' }}>TikTok</th>
                            <th style={{ padding: '1rem', fontWeight: '500', color: '#94a3b8' }}>X</th>
                        </tr>
                    </thead>
                    <tbody>
                        {talents.map((talent) => {
                            const sortedSns = talent.sns && talent.sns.length > 0
                                ? [...talent.sns].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                                : [];
                            const latestSns = sortedSns.length > 0 ? sortedSns[sortedSns.length - 1] : null;
                            const formatNum = (num: number) => num ? num.toLocaleString() : '-';

                            return (
                                <tr key={talent.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                    <td style={{ padding: '1rem' }}>
                                        <Link href={`/talents/${talent.id}`} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#fff', textDecoration: 'none' }}>
                                            <span style={{
                                                width: '32px',
                                                height: '32px',
                                                borderRadius: '50%',
                                                background: talent.avatarUrl || '#6366f1',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontSize: '0.8rem'
                                            }}>
                                                {talent.name.charAt(0)}
                                            </span>
                                            <span style={{ fontWeight: 'bold' }}>{talent.name}</span>
                                        </Link>
                                    </td>

                                    {/* Instagram */}
                                    <td style={{ padding: '1rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                            <span style={{ fontFamily: 'monospace', minWidth: '60px' }}>{latestSns ? formatNum(latestSns.instagram) : '-'}</span>
                                            {sortedSns.length > 1 && (
                                                <div style={{ width: 60, height: 24 }}>
                                                    <ResponsiveContainer width="100%" height="100%">
                                                        <LineChart data={sortedSns}>
                                                            <Line type="monotone" dataKey="instagram" stroke="#E1306C" strokeWidth={2} dot={false} isAnimationActive={false} />
                                                        </LineChart>
                                                    </ResponsiveContainer>
                                                </div>
                                            )}
                                        </div>
                                    </td>

                                    {/* TikTok */}
                                    <td style={{ padding: '1rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                            <span style={{ fontFamily: 'monospace', minWidth: '60px' }}>{latestSns ? formatNum(latestSns.tiktok) : '-'}</span>
                                            {sortedSns.length > 1 && (
                                                <div style={{ width: 60, height: 24 }}>
                                                    <ResponsiveContainer width="100%" height="100%">
                                                        <LineChart data={sortedSns}>
                                                            <Line type="monotone" dataKey="tiktok" stroke="#00f2ea" strokeWidth={2} dot={false} isAnimationActive={false} />
                                                        </LineChart>
                                                    </ResponsiveContainer>
                                                </div>
                                            )}
                                        </div>
                                    </td>

                                    {/* X */}
                                    <td style={{ padding: '1rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                            <span style={{ fontFamily: 'monospace', minWidth: '60px' }}>{latestSns ? formatNum(latestSns.x) : '-'}</span>
                                            {sortedSns.length > 1 && (
                                                <div style={{ width: 60, height: 24 }}>
                                                    <ResponsiveContainer width="100%" height="100%">
                                                        <LineChart data={sortedSns}>
                                                            <Line type="monotone" dataKey="x" stroke="#1DA1F2" strokeWidth={2} dot={false} isAnimationActive={false} />
                                                        </LineChart>
                                                    </ResponsiveContainer>
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Mobile View remains similar but can be improved too */}
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
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                                <span style={{
                                    width: '36px',
                                    height: '36px',
                                    borderRadius: '50%',
                                    background: talent.avatarUrl || '#6366f1',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontWeight: 'bold'
                                }}>
                                    {talent.name.charAt(0)}
                                </span>
                                <span style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{talent.name}</span>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{ color: '#94a3b8', fontSize: '0.7rem' }}>Instagram</div>
                                    <div style={{ fontWeight: 'bold', color: '#E1306C' }}>{latestSns ? formatNum(latestSns.instagram) : '-'}</div>
                                </div>
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{ color: '#94a3b8', fontSize: '0.7rem' }}>TikTok</div>
                                    <div style={{ fontWeight: 'bold', color: '#00f2ea' }}>{latestSns ? formatNum(latestSns.tiktok) : '-'}</div>
                                </div>
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{ color: '#94a3b8', fontSize: '0.7rem' }}>X</div>
                                    <div style={{ fontWeight: 'bold', color: '#1DA1F2' }}>{latestSns ? formatNum(latestSns.x) : '-'}</div>
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}

