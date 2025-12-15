'use client';

import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Talent, SNSData } from '@/lib/types';

interface Props {
    talent: Talent;
}

export default function SnsChart({ talent }: Props) {
    const data = talent.sns || [];

    if (data.length === 0) {
        return (
            <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>
                <h3 style={{ marginBottom: '0.5rem' }}>SNS Analytics</h3>
                <p style={{ fontSize: '0.9rem' }}>No tracking data available yet.</p>
            </div>
        );
    }

    // Sort by date ascending for the chart
    const sortedData = [...data].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    // Get latest two records for diffs
    const latest = sortedData[sortedData.length - 1];
    const previous = sortedData.length > 1 ? sortedData[sortedData.length - 2] : null;

    const calculateDiff = (current: number, prev: number | undefined) => {
        if (prev === undefined) return null;
        const diff = current - prev;
        return diff > 0 ? `+${diff.toLocaleString()}` : diff === 0 ? '0' : diff.toLocaleString();
    };

    const platforms = [
        { key: 'x', label: 'X (Twitter)', color: '#1DA1F2', current: latest.x, prev: previous?.x },
        { key: 'instagram', label: 'Instagram', color: '#E1306C', current: latest.instagram, prev: previous?.instagram },
        { key: 'tiktok', label: 'TikTok', color: '#00f2ea', current: latest.tiktok, prev: previous?.tiktok },
    ];

    return (
        <div className="glass-panel" style={{ padding: '1.5rem', marginTop: '2rem' }}>
            <h3 style={{ marginBottom: '1.5rem', color: '#e2e8f0', fontSize: '1.2rem' }}>SNS Follower Trends</h3>

            {/* Summary Cards */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
                gap: '1rem',
                marginBottom: '2rem'
            }}>
                {platforms.map(p => {
                    const diff = calculateDiff(p.current, p.prev);
                    return (
                        <div key={p.key} style={{
                            background: 'rgba(255,255,255,0.03)',
                            borderRadius: '12px',
                            padding: '1rem',
                            border: '1px solid rgba(255,255,255,0.05)'
                        }}>
                            <div style={{ color: '#94a3b8', fontSize: '0.8rem', marginBottom: '0.5rem' }}>{p.label}</div>
                            <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#f8fafc' }}>
                                {p.current.toLocaleString()}
                            </div>
                            {diff && (
                                <div style={{
                                    fontSize: '0.8rem',
                                    marginTop: '0.25rem',
                                    color: diff.startsWith('+') ? '#4ade80' : diff === '0' ? '#94a3b8' : '#f87171'
                                }}>
                                    {diff}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Chart */}
            <div style={{ width: '100%', height: 300, fontSize: '0.8rem' }}>
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={sortedData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                        <XAxis
                            dataKey="date"
                            stroke="#94a3b8"
                            tickFormatter={(val) => {
                                const d = new Date(val);
                                return `${d.getMonth() + 1}/${d.getDate()}`;
                            }}
                        />
                        <YAxis stroke="#94a3b8" />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f1f5f9', borderRadius: '8px' }}
                            itemStyle={{ fontSize: '0.9rem' }}
                            labelStyle={{ marginBottom: '0.5rem', color: '#94a3b8' }}
                        />
                        <Legend wrapperStyle={{ paddingTop: '10px' }} />
                        <Line type="monotone" dataKey="x" name="X (Twitter)" stroke="#1DA1F2" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
                        <Line type="monotone" dataKey="instagram" name="Instagram" stroke="#E1306C" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
                        <Line type="monotone" dataKey="tiktok" name="TikTok" stroke="#00f2ea" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
