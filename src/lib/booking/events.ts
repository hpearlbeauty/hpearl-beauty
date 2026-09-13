import "server-only";
import { getMessageScheduler, getWhatsAppProvider } from "@/lib/adapters/whatsapp";
import { getAvailabilityProvider } from "@/lib/adapters/availability";
import { bookingConfirmationMessage, touchUpReminderMessage, TOUCH_UP_REMINDER_DAYS } from "@/content/whatsapp";
import { getService } from "@/content/services";
import { formatDateTimeLabel } from "@/lib/format";
import { siteConfig } from "@/lib/config";
import type { ServiceId } from "@/content/types";

export interface ConfirmedBooking {
  reference: string;
  holdId: string | null;
  serviceId: ServiceId;
  date: string;
  time: string;
  customer: { name: string; phone: string; email: string };
}

/**
 * Runs once the deposit is verified (payment webhook or verify callback).
 * Triggers, in order: calendar confirm → Script A (confirmation + prep + address
 * + service/date/time) → schedule Script B at +28 days.
 */
export async function onBookingConfirmed(b: ConfirmedBooking) {
  const service = getService(b.serviceId);
  if (!service) throw new Error(`Unknown service ${b.serviceId}`);

  if (b.holdId) await getAvailabilityProvider().confirm({ holdId: b.holdId, reference: b.reference });

  const wa = getWhatsAppProvider();
  const confirmation = await wa.sendText(
    b.customer.phone,
    bookingConfirmationMessage({ clientName: b.customer.name, serviceName: service.name, dateTimeLabel: formatDateTimeLabel(b.date, b.time) }),
  );

  const sendAt = new Date(`${b.date}T${b.time}:00+01:00`);
  sendAt.setDate(sendAt.getDate() + TOUCH_UP_REMINDER_DAYS);
  const reminder = await getMessageScheduler().schedule({
    id: `${b.reference}-touchup`,
    to: b.customer.phone,
    body: touchUpReminderMessage({ clientName: b.customer.name, bookingUrl: `${siteConfig.url}/book` }),
    sendAt: sendAt.toISOString(),
    kind: "touch_up_reminder",
    bookingReference: b.reference,
  });

  return { confirmation, reminderJobId: reminder.jobId };
}
