import React from 'react';
import { getTalents } from '@/lib/data';
import styles from '../page.module.css';
import TalentsTable from './TalentsTable';
import MobileLayout from '../MobileLayout';

export const dynamic = 'force-dynamic';

export default async function TalentsPage() {
    const talents = await getTalents();

    return (
        <MobileLayout>
            <header className={styles.header}>
                <h1 className={styles.pageTitle}>Talents List</h1>
                <div className={styles.userProfile}>Manager</div>
            </header>

            <section>
                <TalentsTable talents={talents} />
            </section>
        </MobileLayout>
    );
}

