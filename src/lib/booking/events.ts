import "server-only";
import { getAvailabilityProvider } from "@/lib/adapters/availability";
import { getBookingStore, type BookingRecord } from "@/lib/adapters/bookings";
import { getReminderQueue } from "@/lib/adapters/reminders";
import { saveConsultationRequest } from "@/lib/adapters/consultations";
import { messageClient } from "@/lib/notifications/client";
import { notifyOwner } from "@/lib/notifications/owner";
import { bookingConfirmationMessage, ownerMessages, TOUCH_UP_REMINDER_DAYS } from "@/content/whatsapp";
import { getService } from "@/content/services";
import { screeningQuestions } from "@/content/booking";
import { formatDateTimeLabel, formatNGN } from "@/lib/format";
import { siteConfig } from "@/lib/config";

const LAGOS_OFFSET = "+01:00";
/** Local (WAT) wall-clock → Date. */
const atLagos = (date: string, hhmm: string) => new Date(`${date}T${hhmm}:00${LAGOS_OFFSET}`);

export const DEPOSIT_NUDGE_MINUTES = 120;
export const HOLD_EXPIRY_MINUTES = 24 * 60;

/** Called after a pending booking + hold are created: schedules the abandoned-deposit nudge. */
export async function onBookingCreated(b: BookingRecord) {
  await getReminderQueue().schedule(b.reference, "deposit_pending", new Date(Date.now() + DEPOSIT_NUDGE_MINUTES * 60_000));
}

/**
 * Runs once the deposit is verified (webhook or verify callback), exactly once per booking.
 * Order: confirm calendar hold → Script A to client → owner notification →
 * schedule 24h reminder + 28-day touch-up → cancel the deposit nudge.
 */
export async function onBookingConfirmed(b: BookingRecord) {
  const service = getService(b.serviceId);
  if (!service) throw new Error(`Unknown service ${b.serviceId}`);
  const when = formatDateTimeLabel(b.date, b.time);

  if (b.holdId) await getAvailabilityProvider().confirm({ holdId: b.holdId, reference: b.reference });

  const confirmation = await messageClient(
    "booking_confirmation",
    b.customer.phone,
    bookingConfirmationMessage({ clientName: b.customer.name, serviceName: service.name, dateTimeLabel: when }),
    [b.customer.name, service.name, when],
    b.reference,
  );

  await notifyOwner(
    "owner_new_booking",
    ownerMessages.newBooking({ clientName: b.customer.name, phone: b.customer.phone, serviceName: service.name, dateTimeLabel: when, reference: b.reference, depositLabel: b.depositKobo === null ? "TBD" : formatNGN(b.depositKobo / 100) }),
    [b.customer.name, service.name, when, b.reference],
    b.reference,
  );

  const q = getReminderQueue();
  await q.cancel(b.reference, "deposit_pending");
  const dayBefore = atLagos(b.date, "09:00");
  dayBefore.setDate(dayBefore.getDate() - 1);
  if (dayBefore > new Date()) await q.schedule(b.reference, "appointment_reminder_24h", dayBefore);
  const touchUp = atLagos(b.date, "10:00");
  touchUp.setDate(touchUp.getDate() + TOUCH_UP_REMINDER_DAYS);
  await q.schedule(b.reference, "touch_up_reminder_28d", touchUp);
  // Aftercare drip (day 1 / 3 / 7 at 10:00 WAT). Sent only if the owner has approved copy in the editor.
  for (const [kind, days] of [["aftercare_day1", 1], ["aftercare_day3", 3], ["aftercare_day7", 7]] as const) {
    const at = atLagos(b.date, "10:00");
    at.setDate(at.getDate() + days);
    await q.schedule(b.reference, kind, at);
  }

  return { whatsapp: confirmation.status };
}

/** Screening red flag: persist the request and alert the owner before the WhatsApp chat starts. */
export async function onConsultationRequest(input: { name: string; phone: string | null; flags: string[] }) {
  const labels = input.flags.map((id) => screeningQuestions.find((q) => q.id === id)?.label ?? id);
  const saved = await saveConsultationRequest({ name: input.name, phone: input.phone, flags: labels });
  await notifyOwner("owner_consultation_request", ownerMessages.consultationRequest({ name: input.name, phone: input.phone, flags: labels }), [input.name, labels.join("; ")]);
  return saved;
}

/** Release holds for bookings that never paid. Called by the cron. */
export async function expireStaleHolds() {
  const store = getBookingStore();
  const stale = await store.listPendingOlderThan(HOLD_EXPIRY_MINUTES);
  for (const b of stale) {
    if (b.holdId) await getAvailabilityProvider().release(b.holdId);
    await store.update(b.reference, { status: "expired" });
    await getReminderQueue().cancel(b.reference);
  }
  return stale.length;
}

export const resumePaymentUrl = (reference: string) => `${siteConfig.url}/book?step=deposit&ref=${encodeURIComponent(reference)}`;
