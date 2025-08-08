import Link from 'next/link';
import { getAllReports } from '@/lib/content';

export const dynamic = 'force-dynamic';

export default async function ReportsPage() {
  const reports = await getAllReports();

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">タレント近況報告</h1>

      {reports.length === 0 ? (
        <p className="text-gray-600">まだレポートがありません。</p>
      ) : (
        <ul className="space-y-4">
          {reports.map((r) => (
            <li key={r.slug} className="border rounded-lg p-4 hover:bg-gray-50 transition">
              <Link href={`/reports/${r.slug}`} className="block">
                <div className="flex items-center justify-between gap-4">
                  <h2 className="text-lg font-semibold line-clamp-1">{r.title}</h2>
                  <span className="text-sm text-gray-500 whitespace-nowrap">{r.date}</span>
                </div>
                <div className="mt-1 text-sm text-gray-700 flex items-center gap-2">
                  <span className="inline-flex items-center rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-700">{r.talent}</span>
                  {r.status ? (
                    <span className="inline-flex items-center rounded bg-blue-100 px-2 py-0.5 text-xs text-blue-700">{r.status}</span>
                  ) : null}
                </div>
                {r.summary ? (
                  <p className="mt-2 text-gray-600 line-clamp-2">{r.summary}</p>
                ) : null}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
