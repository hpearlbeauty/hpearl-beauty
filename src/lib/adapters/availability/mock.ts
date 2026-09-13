import { getService } from "@/content/services";
import type { AvailabilityProvider, Slot } from "./types";
import { atLagos, candidateDates, parseSchedule, slotsForDate, type Busy } from "./schedule";

/*
  Deterministic in-memory availability built on the same schedule engine as the
  Google provider, so the UI behaves identically. Holds block later slots for the process.
*/
const holds = new Map<string, Busy & { expiresAt: number }>();

function seeded(s: string) { let h = 0; for (const c of s) h = (h * 31 + c.charCodeAt(0)) >>> 0; return h; }

/** A few pseudo-random "existing appointments" per day so the calendar looks real. */
function fakeBusy(date: string): Busy[] {
  const seed = seeded(date);
  const out: Busy[] = [];
  if (seed % 3 === 0) out.push({ start: atLagos(date, "10:00"), end: atLagos(date, "12:30") });
  if (seed % 5 === 0) out.push({ start: atLagos(date, "14:00"), end: atLagos(date, "16:00") });
  for (const h of holds.values()) if (h.expiresAt > Date.now()) out.push(h);
  return out;
}

export const mockAvailability: AvailabilityProvider = {
  async getAvailableDates(serviceId, month, schedule) {
    const service = getService(serviceId);
    if (!service) return [];
    const sched = parseSchedule(schedule);
    return candidateDates(month, sched).filter((d) => slotsForDate(d, service.durationMinutes, fakeBusy(d), sched).some((s) => s.available));
  },
  async getSlots(serviceId, date, schedule): Promise<Slot[]> {
    const service = getService(serviceId);
    return service ? slotsForDate(date, service.durationMinutes, fakeBusy(date), parseSchedule(schedule)) : [];
  },
  async hold({ serviceId, date, time, reference }) {
    const service = getService(serviceId);
    const start = atLagos(date, time);
    const holdId = `hold_${reference}`;
    const expiresAt = Date.now() + 24 * 3600_000;
    holds.set(holdId, { start, end: new Date(start.getTime() + (service?.durationMinutes ?? 120) * 60_000), expiresAt });
    return { holdId, expiresAt: new Date(expiresAt).toISOString() };
  },
  async confirm({ holdId }) { const h = holds.get(holdId); if (h) h.expiresAt = Infinity; },
  async release(holdId) { holds.delete(holdId); },
};
