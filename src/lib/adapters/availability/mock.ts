import type { AvailabilityProvider, Slot } from "./types";

/*
  Deterministic in-memory availability so the flow can be built and tested
  independently of the real calendar backend (studio hours are TBD — brief §17 #17).
  Replace via AVAILABILITY_PROVIDER=api in lib/adapters/availability/index.ts.
*/
const BASE_SLOTS = ["10:00", "12:30", "15:00"];
const holds = new Map<string, { expiresAt: number }>();

function seeded(dateStr: string) {
  let h = 0;
  for (const c of dateStr) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return h;
}

export const mockAvailability: AvailabilityProvider = {
  async getAvailableDates(_serviceId, month) {
    const [y, m] = month.split("-").map(Number);
    const days = new Date(y, m, 0).getDate();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const out: string[] = [];
    for (let d = 1; d <= days; d++) {
      const date = new Date(y, m - 1, d);
      if (date <= today) continue;
      if (date.getDay() === 0) continue; // closed Sundays in the mock only
      const iso = `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      if (seeded(iso) % 4 !== 0) out.push(iso);
    }
    return out;
  },
  async getSlots(_serviceId, date): Promise<Slot[]> {
    const seed = seeded(date);
    return BASE_SLOTS.map((time, i) => ({ time, available: (seed >> i) % 3 !== 0 }));
  },
  async hold({ date, time, reference }) {
    const holdId = `hold_${date}_${time}_${reference}`;
    const expiresAt = Date.now() + 15 * 60 * 1000;
    holds.set(holdId, { expiresAt });
    return { holdId, expiresAt: new Date(expiresAt).toISOString() };
  },
  async confirm({ holdId }) {
    holds.delete(holdId);
  },
  async release(holdId) {
    holds.delete(holdId);
  },
};
