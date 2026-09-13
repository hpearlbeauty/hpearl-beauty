import "server-only";
import { neon, type NeonQueryFunction } from "@neondatabase/serverless";

let cached: NeonQueryFunction<false, false> | null = null;

/** True when a Postgres URL is configured; adapters fall back to memory otherwise. */
export function hasDatabase(): boolean {
  return Boolean(process.env.DATABASE_URL);
}

export function db(): NeonQueryFunction<false, false> {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is not set");
  if (!cached) cached = neon(process.env.DATABASE_URL);
  return cached;
}
