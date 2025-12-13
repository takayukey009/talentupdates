'use client';

import React from 'react';
import Link from 'next/link';
import { Talent } from '@/lib/types';
import { LineChart, Line, ResponsiveContainer } from 'recharts'; // Minimized imports

interface Props {
    talents: Talent[];
}

export default function TalentsTable({ talents }: Props) {
    return (
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
                        const sortedSns = talent.sns && talent.sns.length > 0
                            ? [...talent.sns].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                            : [];

                        const latestSns = sortedSns.length > 0 ? sortedSns[sortedSns.length - 1] : null;

                        const formatNum = (num: number) => num ? num.toLocaleString() : '-';

                        // Sparkline Data (last 5-10 points ideally, but we'll take all available for now)
                        const chartData = sortedSns;

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

                                {/* Instagram Column */}
                                <td style={{ padding: '1rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <span style={{ fontFamily: 'monospace', fontSize: '1rem', minWidth: '80px' }}>
                                            <span style={{ color: '#E1306C', marginRight: '0.5rem' }}>•</span>
                                            {latestSns ? formatNum(latestSns.instagram) : '-'}
                                        </span>
                                        {/* Sparkline */}
                                        {chartData.length > 1 && (
                                            <div style={{ width: 80, height: 30 }}>
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <LineChart data={chartData}>
                                                        <Line type="monotone" dataKey="instagram" stroke="#E1306C" strokeWidth={2} dot={false} isAnimationActive={false} />
                                                    </LineChart>
                                                </ResponsiveContainer>
                                            </div>
                                        )}
                                    </div>
                                </td>

                                {/* TikTok Column */}
                                <td style={{ padding: '1rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <span style={{ fontFamily: 'monospace', fontSize: '1rem', minWidth: '80px' }}>
                                            <span style={{ color: '#00f2ea', marginRight: '0.5rem' }}>•</span>
                                            {latestSns ? formatNum(latestSns.tiktok) : '-'}
                                        </span>
                                        {/* Sparkline */}
                                        {chartData.length > 1 && (
                                            <div style={{ width: 80, height: 30 }}>
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <LineChart data={chartData}>
                                                        <Line type="monotone" dataKey="tiktok" stroke="#00f2ea" strokeWidth={2} dot={false} isAnimationActive={false} />
                                                    </LineChart>
                                                </ResponsiveContainer>
                                            </div>
                                        )}
                                    </div>
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
    );
}
