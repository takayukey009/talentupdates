'use client';

import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Talent } from '@/lib/types';
import styles from '../../page.module.css';

interface Props {
    talent: Talent;
}

export default function SnsChart({ talent }: Props) {
    const data = talent.sns || [];

    if (data.length === 0) {
        return (
            <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>
                <h3>SNS Analysis</h3>
                <p>No tracking data available yet.</p>
            </div>
        );
    }

    // Sort by date just in case
    const sortedData = [...data].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return (
        <div className="glass-panel" style={{ padding: '1.5rem', marginTop: '2rem' }}>
            <h3 style={{ marginBottom: '1rem', color: '#e2e8f0' }}>SNS Follower Trends</h3>
            <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={sortedData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                        <XAxis
                            dataKey="date"
                            stroke="#94a3b8"
                            fontSize={12}
                            tickFormatter={(value) => {
                                // Shorten date if needed, e.g. "12/13"
                                return value.split('/').slice(1).join('/');
                            }}
                        />
                        <YAxis stroke="#94a3b8" fontSize={12} />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f1f5f9' }}
                            itemStyle={{ color: '#f1f5f9' }}
                        />
                        <Legend />
                        <Line type="monotone" dataKey="instagram" stroke="#E1306C" strokeWidth={2} name="Instagram" dot={{ r: 4 }} activeDot={{ r: 6 }} />
                        <Line type="monotone" dataKey="tiktok" stroke="#00f2ea" strokeWidth={2} name="TikTok" dot={{ r: 4 }} activeDot={{ r: 6 }} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
