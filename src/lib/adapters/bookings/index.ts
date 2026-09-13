import "server-only";
import type { ServiceId } from "@/content/types";

export interface BookingRecord {
  reference: string;
  serviceId: ServiceId;
  date: string;
  time: string;
  customer: { name: string; phone: string; email: string };
  holdId: string | null;
  depositKobo: number | null;
  status: "pending_payment" | "confirmed" | "failed" | "cancelled";
  createdAt: string;
  confirmedAt?: string;
}

/** Persistence contract. In-memory now; swap for Postgres/Neon/Supabase later. */
export interface BookingStore {
  create(record: BookingRecord): Promise<BookingRecord>;
  get(reference: string): Promise<BookingRecord | null>;
  update(reference: string, patch: Partial<BookingRecord>): Promise<BookingRecord | null>;
}

const mem = new Map<string, BookingRecord>();

const memoryStore: BookingStore = {
  async create(r) { mem.set(r.reference, r); return r; },
  async get(ref) { return mem.get(ref) ?? null; },
  async update(ref, patch) {
    const cur = mem.get(ref);
    if (!cur) return null;
    const next = { ...cur, ...patch };
    mem.set(ref, next);
    return next;
  },
};

export function getBookingStore(): BookingStore {
  return memoryStore;
}
