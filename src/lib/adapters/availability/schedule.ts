/*
  Studio schedule used to generate bookable slots.
  PLACEHOLDER until hpearl_beauty confirms opening days/hours (brief §17 #17):
  override with STUDIO_HOURS, e.g. "1-6:10:00-18:00" (ISO weekday range : open-close).
*/
export interface DayHours { open: string; close: string }
export type WeekSchedule = Partial<Record<1 | 2 | 3 | 4 | 5 | 6 | 7, DayHours>>;

export const DEFAULT_SCHEDULE: WeekSchedule = { 1: { open: "10:00", close: "18:00" }, 2: { open: "10:00", close: "18:00" }, 3: { open: "10:00", close: "18:00" }, 4: { open: "10:00", close: "18:00" }, 5: { open: "10:00", close: "18:00" }, 6: { open: "10:00", close: "16:00" } };

export const SLOT_STEP_MINUTES = 30;
export const MIN_LEAD_HOURS = 24;
export const MAX_HORIZON_DAYS = 60;
export const LAGOS_OFFSET = "+01:00";

export function parseSchedule(raw = process.env.STUDIO_HOURS): WeekSchedule {
  if (!raw) return DEFAULT_SCHEDULE;
  const out: WeekSchedule = {};
  for (const part of raw.split(",")) {
    const m = part.trim().match(/^(\d)(?:-(\d))?:(\d{2}:\d{2})-(\d{2}:\d{2})$/);
    if (!m) continue;
    const from = Number(m[1]), to = Number(m[2] ?? m[1]);
    for (let d = from; d <= to; d++) out[d as keyof WeekSchedule] = { open: m[3], close: m[4] };
  }
  return Object.keys(out).length ? out : DEFAULT_SCHEDULE;
}

const toMin = (hhmm: string) => { const [h, m] = hhmm.split(":").map(Number); return h * 60 + m; };
const toHHMM = (min: number) => `${String(Math.floor(min / 60)).padStart(2, "0")}:${String(min % 60).padStart(2, "0")}`;
export const atLagos = (date: string, hhmm: string) => new Date(`${date}T${hhmm}:00${LAGOS_OFFSET}`);
/** ISO weekday (1 = Monday … 7 = Sunday) for a YYYY-MM-DD date. */
export const isoWeekday = (date: string) => ((atLagos(date, "12:00").getUTCDay() + 6) % 7) + 1;

export interface Busy { start: Date; end: Date }

/** All slot start times for a date that fit the service and don't overlap busy intervals. */
export function slotsForDate(date: string, durationMinutes: number, busy: Busy[], schedule = parseSchedule(), now = new Date()): { time: string; available: boolean }[] {
  const day = schedule[isoWeekday(date) as keyof WeekSchedule];
  if (!day) return [];
  const earliest = now.getTime() + MIN_LEAD_HOURS * 3600_000;
  const out: { time: string; available: boolean }[] = [];
  for (let t = toMin(day.open); t + durationMinutes <= toMin(day.close); t += SLOT_STEP_MINUTES) {
    const start = atLagos(date, toHHMM(t));
    const end = new Date(start.getTime() + durationMinutes * 60_000);
    const clash = busy.some((b) => b.start < end && b.end > start);
    out.push({ time: toHHMM(t), available: !clash && start.getTime() >= earliest });
  }
  return out;
}

/** YYYY-MM-DD strings for a month (YYYY-MM) within the booking horizon that have an opening day. */
export function candidateDates(month: string, schedule = parseSchedule(), now = new Date()): string[] {
  const [y, m] = month.split("-").map(Number);
  const days = new Date(Date.UTC(y, m, 0)).getUTCDate();
  const horizon = now.getTime() + MAX_HORIZON_DAYS * 86400_000;
  const out: string[] = [];
  for (let d = 1; d <= days; d++) {
    const iso = `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    if (!schedule[isoWeekday(iso) as keyof WeekSchedule]) continue;
    const endOfDay = atLagos(iso, "23:59").getTime();
    if (endOfDay < now.getTime() || atLagos(iso, "00:00").getTime() > horizon) continue;
    out.push(iso);
  }
  return out;
}
