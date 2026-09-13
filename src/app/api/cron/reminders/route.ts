import { NextResponse } from "next/server";
import { getBookingStore } from "@/lib/adapters/bookings";
import { getReminderQueue } from "@/lib/adapters/reminders";
import { messageClient } from "@/lib/notifications/client";
import { notifyOwner } from "@/lib/notifications/owner";
import { appointmentReminderMessage, depositPendingMessage, ownerMessages, touchUpReminderMessage } from "@/content/whatsapp";
import { getService } from "@/content/services";
import { formatDateLong, formatDateTimeLabel, formatTime } from "@/lib/format";
import { expireStaleHolds, resumePaymentUrl } from "@/lib/booking/events";
import { siteConfig } from "@/lib/config";

export const dynamic = "force-dynamic";

/**
 * GET /api/cron/reminders — drains due reminders, expires stale holds, and sends the
 * owner's daily digest at 07:00 WAT. Scheduled hourly (vercel.json). Protected by CRON_SECRET
 * (Vercel sends `Authorization: Bearer <CRON_SECRET>` automatically).
 */
export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (secret && req.headers.get("authorization") !== `Bearer ${secret}`) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const store = getBookingStore();
  const q = getReminderQueue();
  const now = new Date();
  const results: Record<string, number> = { sent: 0, skipped: 0, failed: 0, expired: 0 };

  for (const r of await q.due(now, 100)) {
    const b = await store.get(r.bookingReference);
    const service = b ? getService(b.serviceId) : null;
    if (!b || !service) { await q.markFailed(r.id, "booking missing"); results.failed++; continue; }
    try {
      if (r.kind === "deposit_pending") {
        if (b.status !== "pending_payment") { await q.cancel(b.reference, r.kind); results.skipped++; continue; }
        const when = formatDateTimeLabel(b.date, b.time);
        await messageClient(r.kind, b.customer.phone, depositPendingMessage({ clientName: b.customer.name, serviceName: service.name, dateTimeLabel: when, resumeUrl: resumePaymentUrl(b.reference) }), [b.customer.name, service.name, when, resumePaymentUrl(b.reference)], b.reference);
        await notifyOwner("owner_deposit_abandoned", ownerMessages.depositAbandoned({ clientName: b.customer.name, phone: b.customer.phone, serviceName: service.name, dateTimeLabel: when, reference: b.reference }), [b.customer.name, service.name, when, b.reference], b.reference);
      } else if (r.kind === "appointment_reminder_24h") {
        if (b.status !== "confirmed") { await q.cancel(b.reference, r.kind); results.skipped++; continue; }
        await messageClient(r.kind, b.customer.phone, appointmentReminderMessage({ clientName: b.customer.name, serviceName: service.name, timeLabel: formatTime(b.time) }), [b.customer.name, service.name, formatTime(b.time)], b.reference);
      } else if (r.kind === "touch_up_reminder_28d") {
        if (b.status !== "confirmed") { await q.cancel(b.reference, r.kind); results.skipped++; continue; }
        await messageClient(r.kind, b.customer.phone, touchUpReminderMessage({ clientName: b.customer.name, bookingUrl: `${siteConfig.url}/book` }), [b.customer.name, `${siteConfig.url}/book`], b.reference);
      }
      await q.markSent(r.id);
      results.sent++;
    } catch (err) {
      await q.markFailed(r.id, err instanceof Error ? err.message : String(err));
      results.failed++;
    }
  }

  results.expired = await expireStaleHolds();

  // Daily digest at 07:00 WAT (this route runs hourly).
  const lagosHour = Number(new Intl.DateTimeFormat("en-GB", { hour: "2-digit", hour12: false, timeZone: "Africa/Lagos" }).format(now));
  if (lagosHour === 7) {
    const today = new Intl.DateTimeFormat("en-CA", { timeZone: "Africa/Lagos" }).format(now); // YYYY-MM-DD
    const todays = await store.listForDate(today);
    const lines = todays.map((b) => `${formatTime(b.time)} · ${getService(b.serviceId)?.name ?? b.serviceId} · ${b.customer.name} (${b.customer.phone})`);
    await notifyOwner("owner_daily_digest", ownerMessages.dailyDigest({ dateLabel: formatDateLong(today), lines }), [formatDateLong(today), String(todays.length)]);
  }

  return NextResponse.json({ ok: true, at: now.toISOString(), ...results });
}
