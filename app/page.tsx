import React from 'react';
import { getTalents, getHighlights } from '@/lib/data';
import DashboardClient from './DashboardClient';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const talents = await getTalents();
  const highlights = await getHighlights();

  return (
    <DashboardClient talents={talents} highlights={highlights} />
  );
}
