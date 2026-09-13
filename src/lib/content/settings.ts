import "server-only";
import { unstable_cache } from "next/cache";
import { db, hasDatabase } from "@/lib/db/client";
import type { GalleryCategory } from "@/content/types";

/*
  Owner-editable settings, stored as JSON documents in `site_settings` and merged
  over the code defaults in src/content. Read through a tagged cache so public
  pages stay static and re-render on demand when the owner saves.
*/
export const CONTENT_TAG = "site-content";

export interface Review { id: string; quote: string; author: string; source: "google" | "instagram" | "whatsapp" }
export interface GalleryPairSetting { id: string; category: GalleryCategory; beforeUrl: string; afterUrl: string; caption: string }

export interface SiteSettings {
  pricing: { "combo-brows": number | null; "ombre-powder-brows": number | null; microblading: number | null; touchUp: number | null; academyTuition: number | null; academyDeposit: number | null };
  hours: { display: string | null; schedule: string | null };
  policies: { cancellation: string | null; depositRefund: string | null };
  founder: { bio: string | null };
  claims: { longevityApproved: boolean; sixFigureApproved: boolean };
  reviews: Review[];
  gallery: GalleryPairSetting[];
  aftercare: { approved: boolean; day1: string | null; day3: string | null; day7: string | null };
  academy: { kitItems: string[] | null };
  socials: { instagram: string | null };
}

export const DEFAULT_SETTINGS: SiteSettings = {
  pricing: { "combo-brows": null, "ombre-powder-brows": null, microblading: null, touchUp: null, academyTuition: null, academyDeposit: null },
  hours: { display: null, schedule: null },
  policies: { cancellation: null, depositRefund: null },
  founder: { bio: null },
  claims: { longevityApproved: false, sixFigureApproved: false },
  reviews: [],
  gallery: [],
  aftercare: { approved: false, day1: null, day3: null, day7: null },
  academy: { kitItems: null },
  socials: { instagram: null },
};

type Key = keyof SiteSettings;
const mem = new Map<Key, unknown>();

async function readAll(): Promise<SiteSettings> {
  const out: SiteSettings = structuredClone(DEFAULT_SETTINGS);
  if (!hasDatabase()) {
    for (const [k, v] of mem) Object.assign(out, { [k]: v });
    return out;
  }
  const rows = await db()`select key, value from site_settings`;
  for (const r of rows as { key: Key; value: unknown }[]) {
    if (r.key in out) (out as unknown as Record<string, unknown>)[r.key] = { ...(DEFAULT_SETTINGS[r.key] as object), ...(r.value as object) };
  }
  // arrays are replaced, not merged
  for (const r of rows as { key: Key; value: unknown }[]) if (Array.isArray(r.value)) (out as unknown as Record<string, unknown>)[r.key] = r.value;
  return out;
}

/** Cached read; invalidated with updateTag(CONTENT_TAG) after a save. */
export const getSettings = unstable_cache(readAll, ["site-settings"], { tags: [CONTENT_TAG] });

/** Uncached read for the editor itself (read-your-writes). */
export const getSettingsFresh = readAll;

export async function saveSetting<K extends Key>(key: K, value: SiteSettings[K]): Promise<void> {
  if (!hasDatabase()) { mem.set(key, value); return; }
  await db()`insert into site_settings (key, value) values (${key}, ${JSON.stringify(value)}::jsonb) on conflict (key) do update set value = excluded.value, updated_at = now()`;
}
