"use client";

import { useState } from "react";

export type DecidedItem = {
  title?: string;
  role?: string;
  period?: string;
  date?: string;
  release?: string;
  note?: string;
};

export type AwaitingReleaseItem = {
  title?: string;
  role?: string;
  platform?: string;
  expectedRelease?: string;
  date?: string;
  note?: string;
};

export type Auditions = {
  passed?: string[];
  inProgress?: string[];
  rejected?: string[];
};

export type UITalent = {
  id: string;
  name?: string;
  reading?: string;
  note?: string;
  decided?: DecidedItem[];
  auditions?: Auditions;
  lessons?: string[];
  snsProgress?: string[];
  recentUpdates?: string[];
  awaitingRelease?: AwaitingReleaseItem[];
};

export type TalentReportProps = { talents: UITalent[] };

export default function TalentReport({ talents }: TalentReportProps) {
  const [active, setActive] = useState<string>(talents[0]?.id ?? "");

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6 min-h-screen bg-neutral-50 text-slate-900">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">タレント近況報告</h1>
        <p className="text-slate-600">{talents.length}名のタレント活動状況まとめ</p>
      </div>

      {/* Tabs header */}
      <div className="w-full grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
        {talents.map((t) => (
          <button
            key={t.id}
            onClick={() => setActive(t.id)}
            className={`text-xs rounded border px-2 py-1 transition ${
              active === t.id
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white hover:bg-gray-100 text-slate-800 border-gray-200"
            }`}
          >
            {(t.name || t.id).toString().split(" ")[0]}
          </button>
        ))}
      </div>

      {/* Active content */}
      {talents.map((t) => (
        <div key={t.id} hidden={active !== t.id} className="space-y-6">
          {/* Basic card */}
          <div className="rounded-lg border bg-white">
            <div className="p-4 border-b">
              <div className="text-lg font-semibold flex items-center gap-2">
                <span>⭐</span>
                {t.name || t.id}
                {t.reading ? (
                  <span className="text-sm text-gray-500">（{t.reading}）</span>
                ) : null}
              </div>
              {t.note ? <p className="text-sm text-slate-600 mt-1">{t.note}</p> : null}
            </div>
          </div>

          {/* Recent updates */}
          {!!t.recentUpdates?.length && (
            <Card title="近況報告" badge={t.recentUpdates.length} icon="🟠">
              <ul className="space-y-2">
                {t.recentUpdates.map((u, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-orange-500 rounded-full mt-2 inline-block" />
                    <span className="text-sm">{String(u)}</span>
                  </li>
                ))}
              </ul>
            </Card>
          )}

          <div className={`grid gap-6 ${t.id === "taniguchi" ? "" : "md:grid-cols-2"}`}>
            {/* Decided (hide for taniguchi) */}
            {t.id !== "taniguchi" && !!t.decided?.length && (
              <Card title="決定案件" badge={t.decided.length} icon="📷" badgeTone="secondary">
                <ul className="space-y-3">
                  {t.decided.map((d: DecidedItem, i: number) => (
                    <li key={i} className="border-l-4 border-green-500 pl-4 space-y-1">
                      <div className="font-semibold text-sm">{d.title}</div>
                      <Meta label="役名" value={d.role} />
                      <Meta label="期間" value={d.period} />
                      <Meta label="日程" value={d.date} />
                      <Meta label="公開" value={d.release} />
                      <Meta label="備考" value={d.note} />
                    </li>
                  ))}
                </ul>
              </Card>
            )}

            {/* Awaiting release */}
            {!!t.awaitingRelease?.length && (
              <Card title="公開待ち" badge={t.awaitingRelease.length} icon="⏳" badgeTone="secondary">
                <ul className="space-y-3">
                  {t.awaitingRelease.map((a: AwaitingReleaseItem, i: number) => (
                    <li key={i} className="border-l-4 border-purple-500 pl-4 space-y-1">
                      <div className="font-semibold text-sm">{a.title}</div>
                      <Meta label="役名" value={a.role} />
                      <Meta label="配信" value={a.platform} />
                      <Meta label="公開予定" value={a.expectedRelease} />
                      <Meta label="日付" value={a.date} />
                      <Meta label="備考" value={a.note} />
                    </li>
                  ))}
                </ul>
              </Card>
            )}

            {/* Auditions */}
            <Card title="オーディション状況" icon="👥">
              <div className="divide-y">
                {!!t.auditions?.passed?.length && (
                  <AccordionItem title={`合格 (${t.auditions.passed.length})`}>
                    <ul className="space-y-1">
                      {t.auditions.passed.map((x: string, i: number) => (
                        <li key={i} className="text-sm text-blue-700">• {String(x)}</li>
                      ))}
                    </ul>
                  </AccordionItem>
                )}

                {!!t.auditions?.inProgress?.length && (
                  <AccordionItem title={`進行中 (${t.auditions.inProgress.length})`}>
                    <ul className="space-y-1">
                      {t.auditions.inProgress.map((x: string, i: number) => (
                        <li key={i} className="text-sm text-yellow-700">• {String(x)}</li>
                      ))}
                    </ul>
                  </AccordionItem>
                )}

                {!!t.auditions?.rejected?.length && (
                  <AccordionItem title={`見送り・辞退 (${t.auditions.rejected.length})`}>
                    <ul className="space-y-1">
                      {t.auditions.rejected.map((x: string, i: number) => (
                        <li key={i} className="text-sm text-red-700">• {String(x)}</li>
                      ))}
                    </ul>
                  </AccordionItem>
                )}
              </div>
            </Card>
          </div>

          {/* Lessons */}
          {!!t.lessons?.length && (
            <Card title="レッスン・ワークショップ" icon="🎤">
              <ul className="space-y-2">
                {t.lessons.map((l: string, i: number) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-purple-500 rounded-full mt-2 inline-block" />
                    <span className="text-sm">{String(l)}</span>
                  </li>
                ))}
              </ul>
            </Card>
          )}

          {/* SNS */}
          {!!t.snsProgress?.length && (
            <Card title="SNS進捗" icon="👥">
              <ul className="space-y-2">
                {t.snsProgress.map((s: string, i: number) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-pink-500 rounded-full mt-2 inline-block" />
                    <span className="text-sm">{String(s)}</span>
                  </li>
                ))}
              </ul>
            </Card>
          )}

          {/* Summary */}
          <div className="rounded-lg border bg-white">
            <div className="p-4 border-b">
              <div className="font-semibold">サマリー</div>
            </div>
            <div className="p-4 grid grid-cols-2 md:grid-cols-4 gap-4">
              <Summary label="決定案件" value={t.decided?.length || 0} color="text-green-600" />
              <Summary label="進行中" value={t.auditions?.inProgress?.length || 0} color="text-yellow-600" />
              <Summary label="オーディション合格" value={t.auditions?.passed?.length || 0} color="text-blue-600" />
              <Summary label="公開待ち" value={t.awaitingRelease?.length || 0} color="text-purple-600" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function Summary({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="text-center">
      <div className={`text-2xl font-bold ${color}`}>{value}</div>
      <div className="text-sm text-gray-500">{label}</div>
    </div>
  );
}

function Card({ title, children, badge, icon, badgeTone = "default" }: { title: string; children: React.ReactNode; badge?: number; icon?: string; badgeTone?: "default" | "secondary" }) {
  return (
    <div className="rounded-lg border bg-white">
      <div className="p-4 border-b flex items-center gap-2">
        <span className="text-base">{icon}</span>
        <div className="font-semibold">{title}</div>
        {typeof badge === "number" ? (
          <span
            className={`ml-2 text-xs rounded px-2 py-0.5 border ${
              badgeTone === "secondary" ? "bg-gray-100" : "bg-white"
            }`}
          >
            {badge}
          </span>
        ) : null}
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}

function Meta({ label, value }: { label: string; value?: string | number | boolean }) {
  if (!value) return null;
  return <div className="text-xs text-gray-600">{label}: {String(value)}</div>;
}

function AccordionItem({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full text-left py-2 flex items-center justify-between"
      >
        <span className="text-sm font-medium">{title}</span>
        <span className="text-xs text-gray-500">{open ? "▲" : "▼"}</span>
      </button>
      {open ? <div className="pt-2 pb-3">{children}</div> : null}
    </div>
  );
}
