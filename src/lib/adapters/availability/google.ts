import "server-only";
import { getGoogleAccessToken } from "@/lib/google/auth";
import { getService } from "@/content/services";
import { studio } from "@/content/studio";
import type { AvailabilityProvider, Slot } from "./types";
import { atLagos, candidateDates, parseSchedule, slotsForDate, type Busy } from "./schedule";

const API = "https://www.googleapis.com/calendar/v3";
const calendarId = () => process.env.GOOGLE_CALENDAR_ID ?? "primary";

async function gfetch(path: string, init: RequestInit = {}) {
  const token = await getGoogleAccessToken();
  const res = await fetch(`${API}${path}`, { ...init, headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json", ...(init.headers ?? {}) }, cache: "no-store" });
  if (res.status === 204) return null;
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(`Google Calendar ${res.status}: ${json?.error?.message ?? res.statusText}`);
  return json;
}

async function busyBetween(start: Date, end: Date): Promise<Busy[]> {
  const json = await gfetch("/freeBusy", { method: "POST", body: JSON.stringify({ timeMin: start.toISOString(), timeMax: end.toISOString(), timeZone: studio.timezone, items: [{ id: calendarId() }] }) });
  const periods = json?.calendars?.[calendarId()]?.busy ?? [];
  return periods.map((p: { start: string; end: string }) => ({ start: new Date(p.start), end: new Date(p.end) }));
}

/**
 * Google Calendar-backed availability: FreeBusy for slots; a tentative event
 * for holds (event id = holdId), confirmed on payment, deleted on release.
 */
export const googleAvailability: AvailabilityProvider = {
  async getAvailableDates(serviceId, month, schedule) {
    const service = getService(serviceId);
    if (!service) return [];
    const sched = parseSchedule(schedule);
    const dates = candidateDates(month, sched);
    if (dates.length === 0) return [];
    const busy = await busyBetween(atLagos(dates[0], "00:00"), atLagos(dates[dates.length - 1], "23:59"));
    return dates.filter((d) => slotsForDate(d, service.durationMinutes, busy, sched).some((s) => s.available));
  },
  async getSlots(serviceId, date, schedule): Promise<Slot[]> {
    const service = getService(serviceId);
    if (!service) return [];
    const busy = await busyBetween(atLagos(date, "00:00"), atLagos(date, "23:59"));
    return slotsForDate(date, service.durationMinutes, busy, parseSchedule(schedule));
  },
  async hold({ serviceId, date, time, reference }) {
    const service = getService(serviceId);
    const start = atLagos(date, time);
    const end = new Date(start.getTime() + (service?.durationMinutes ?? 120) * 60_000);
    const ev = await gfetch(`/calendars/${encodeURIComponent(calendarId())}/events`, {
      method: "POST",
      body: JSON.stringify({
        summary: `HOLD · ${service?.name ?? serviceId} · ${reference}`,
        description: "Awaiting 50% deposit. Created by the website.",
        start: { dateTime: start.toISOString(), timeZone: studio.timezone },
        end: { dateTime: end.toISOString(), timeZone: studio.timezone },
        status: "tentative",
        extendedProperties: { private: { reference, kind: "hold" } },
      }),
    });
    return { holdId: ev.id as string, expiresAt: new Date(Date.now() + 24 * 3600_000).toISOString() };
  },
  async confirm({ holdId, reference }) {
    await gfetch(`/calendars/${encodeURIComponent(calendarId())}/events/${encodeURIComponent(holdId)}`, {
      method: "PATCH",
      body: JSON.stringify({ status: "confirmed", summary: `Booked · ${reference}`, description: "Deposit received. Created by the website.", extendedProperties: { private: { reference, kind: "booking" } } }),
    });
  },
  async release(holdId) {
    await gfetch(`/calendars/${encodeURIComponent(calendarId())}/events/${encodeURIComponent(holdId)}`, { method: "DELETE" }).catch(() => null);
  },
};
