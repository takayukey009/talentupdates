import { createReader } from "@keystatic/core/reader";
import config from "../../keystatic.config";

export type TalentItem = {
  id: string;
  // The rest of the fields are dynamic based on keystatic.config.ts
  // We keep them as unknown to avoid tight coupling here
  [key: string]: unknown;
};

export async function getTalents(): Promise<TalentItem[]> {
  const reader = createReader(process.cwd(), config);
  const items = await reader.collections.talents.all();
  // items: Array<{ slug: string; entry: Record<string, any> }>
  return items.map(({ slug, entry }) => {
    const { id: _ignored, ...rest } = (entry ?? {}) as Record<string, unknown>;
    return { id: slug, ...rest } as TalentItem;
  });
}

export async function getTalentById(id: string): Promise<TalentItem | null> {
  const reader = createReader(process.cwd(), config);
  const item = await reader.collections.talents.read(id);
  if (!item) return null;
  const { id: _ignored, ...rest } = (item ?? {}) as Record<string, unknown>;
  return { id, ...rest } as TalentItem;
}
