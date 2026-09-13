import "server-only";
import { hasDatabase } from "@/lib/db/client";
import { memoryBookingStore } from "./memory";
import { postgresBookingStore } from "./postgres";
import type { BookingStore } from "./types";

export type * from "./types";

/** Postgres (Neon) when DATABASE_URL is set, in-memory otherwise. */
export function getBookingStore(): BookingStore {
  return hasDatabase() ? postgresBookingStore : memoryBookingStore;
}
