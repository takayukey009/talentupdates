import { config, collection, fields } from '@keystatic/core';

export default config({
  storage: {
    kind: 'github',
    // Commits edits directly to your GitHub repository
    repo: { owner: 'takayukey009', name: 'talentupdates' },
  },
  ui: {
    brand: {
      name: 'タレント近況報告',
    },
  },
  collections: {
    reports: collection({
      label: 'Reports',
      slugField: 'slug',
      path: 'content/reports/*',
      format: {
        contentField: 'body',
      },
      schema: {
        slug: fields.text({ label: 'Slug' }),
        title: fields.text({ label: 'タイトル' }),
        date: fields.date({ label: '日付' }),
        talent: fields.text({ label: 'タレント名' }),
        status: fields.select({
          label: 'ステータス',
          options: [
            { label: '公開', value: '公開' },
            { label: '下書き', value: '下書き' },
          ],
          defaultValue: '公開',
        }),
        summary: fields.text({ label: 'サマリー', multiline: true }),
        body: fields.markdoc({ label: '本文 (Markdoc)' }),
      },
    }),
    talents: collection({
      label: 'Talents',
      path: 'content/talents/*',
      slugField: 'id',
      format: { data: 'json' },
      schema: {
        id: fields.slug({ name: { label: 'ID（英数）' } }),
        name: fields.text({ label: '氏名' }),
        reading: fields.text({ label: 'よみ' }),
        note: fields.text({ label: '備考', multiline: true }),

        decided: fields.array(
          fields.object({
            title: fields.text({ label: 'タイトル' }),
            role: fields.text({ label: '役名' }),
            date: fields.text({ label: '日付' }),
            period: fields.text({ label: '期間' }),
            release: fields.text({ label: '公開' }),
            note: fields.text({ label: '備考' }),
          }),
          { label: '決定案件', itemLabel: (item) => item.fields.title.value?.toString() ?? 'item' }
        ),

        auditions: fields.object({
          passed: fields.array(fields.text({ label: '合格' }), { label: '合格' }),
          inProgress: fields.array(fields.text({ label: '進行中' }), { label: '進行中' }),
          rejected: fields.array(fields.text({ label: '見送り' }), { label: '見送り' }),
        }),

        lessons: fields.array(fields.text({ label: 'レッスン' }), { label: 'レッスン' }),
        snsProgress: fields.array(fields.text({ label: 'SNS進捗' }), { label: 'SNS進捗' }),
        recentUpdates: fields.array(fields.text({ label: '近況' }), { label: '近況' }),

        awaitingRelease: fields.array(
          fields.object({
            title: fields.text({ label: 'タイトル' }),
            role: fields.text({ label: '役名' }),
            platform: fields.text({ label: '配信' }),
            expectedRelease: fields.text({ label: '公開予定' }),
            date: fields.text({ label: '撮影日' }),
            note: fields.text({ label: '備考' }),
          }),
          { label: '公開待ち', itemLabel: (item) => item.fields.title.value?.toString() ?? 'item' }
        ),
      },
    }),
  },
});
