import { notFound } from 'next/navigation';
import { getReportBySlug } from '@/lib/content';
import { renderMarkdocToHtml } from '@/lib/markdoc';

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function ReportDetailPage(props: Props) {
  const { slug } = await props.params;
  if (!slug) return notFound();

  let report;
  try {
    report = await getReportBySlug(slug);
  } catch {
    return notFound();
  }

  const html = renderMarkdocToHtml(report.content);

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <div className="mb-4 text-sm text-gray-500">{report.date}</div>
      <h1 className="text-2xl font-bold">{report.title}</h1>
      <div className="mt-2 text-sm text-gray-700 flex items-center gap-2">
        {report.talent && (
          <span className="inline-flex items-center rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-700">{report.talent}</span>
        )}
        {report.status && (
          <span className="inline-flex items-center rounded bg-blue-100 px-2 py-0.5 text-xs text-blue-700">{report.status}</span>
        )}
      </div>

      {report.summary && (
        <p className="mt-4 text-gray-600">{report.summary}</p>
      )}

      <article
        className="mt-8 leading-7 space-y-4"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </main>
  );
}
