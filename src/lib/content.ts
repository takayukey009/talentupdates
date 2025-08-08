import fs from 'node:fs/promises';
import path from 'node:path';
import matter from 'gray-matter';

export type ReportFrontmatter = {
  slug: string;
  title: string;
  date: string; // ISO date string
  talent: string;
  status?: string;
  summary?: string;
};

export type Report = ReportFrontmatter & {
  content: string;
};

const CONTENT_DIR = path.join(process.cwd(), 'content', 'reports');

export async function getReportSlugs(): Promise<string[]> {
  const entries = await fs.readdir(CONTENT_DIR, { withFileTypes: true });
  return entries
    .filter((e) => e.isFile() && e.name.endsWith('.md'))
    .map((e) => e.name.replace(/\.md$/, ''));
}

export async function getReportBySlug(slug: string): Promise<Report> {
  const filepath = path.join(CONTENT_DIR, `${slug}.md`);
  const raw = await fs.readFile(filepath, 'utf8');
  const { data, content } = matter(raw);
  const fm = data as Partial<ReportFrontmatter>;
  return {
    slug: fm.slug ?? slug,
    title: fm.title ?? slug,
    date: fm.date ?? '',
    talent: fm.talent ?? '',
    status: fm.status,
    summary: fm.summary,
    content,
  };
}

export async function getAllReports(): Promise<Report[]> {
  const slugs = await getReportSlugs();
  const reports = await Promise.all(slugs.map((s) => getReportBySlug(s)));
  // sort by date desc if available
  return reports.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
}
