import type { BookingRecord, BookingStore } from "./types";

const mem = new Map<string, BookingRecord>();

/** Dev fallback when DATABASE_URL is unset. State lives for the process only. */
export const memoryBookingStore: BookingStore = {
  async create(r) { mem.set(r.reference, r); return r; },
  async get(ref) { return mem.get(ref) ?? null; },
  async update(ref, patch) {
    const cur = mem.get(ref);
    if (!cur) return null;
    const next = { ...cur, ...patch };
    mem.set(ref, next);
    return next;
  },
  async listPendingOlderThan(minutes) {
    const cutoff = Date.now() - minutes * 60_000;
    return [...mem.values()].filter((b) => b.status === "pending_payment" && new Date(b.createdAt).getTime() < cutoff);
  },
  async listForDate(date) { return [...mem.values()].filter((b) => b.date === date && b.status === "confirmed"); },
  async listUpcoming(fromDate, limit = 50) { return [...mem.values()].filter((b) => b.status === "confirmed" && b.date >= fromDate).sort((a, b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`)).slice(0, limit); },
  async listByStatus(status, limit = 50) { return [...mem.values()].filter((b) => b.status === status).sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, limit); },
};
