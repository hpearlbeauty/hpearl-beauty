import "server-only";
import { getWhatsAppProvider, templateFor } from "@/lib/adapters/whatsapp";
import { logMessage } from "@/lib/adapters/messages";

export type ClientEvent = "booking_confirmation" | "appointment_reminder_24h" | "touch_up_reminder_28d" | "deposit_pending";

/** Sends a client-facing WhatsApp message (template if registered, else text) and logs it. */
export async function messageClient(event: ClientEvent, to: string, text: string, bodyParams: string[] = [], bookingReference?: string | null) {
  const wa = getWhatsAppProvider();
  const result = await wa.sendTemplate(to, { template: templateFor(event), bodyParams, fallbackText: text });
  await logMessage({ bookingReference: bookingReference ?? null, to, kind: event, body: text, provider: result.provider, providerMessageId: result.messageId, status: result.status, error: result.error ?? null });
  return result;
}
