import "server-only";
import { getWhatsAppProvider, templateFor } from "@/lib/adapters/whatsapp";
import { logMessage } from "@/lib/adapters/messages";

export type OwnerEvent = "owner_new_booking" | "owner_consultation_request" | "owner_deposit_abandoned" | "owner_daily_digest";

/**
 * Sends an internal notification to the studio owner's WhatsApp.
 * Template (if registered) → else plain text. Never throws; failures are logged.
 */
export async function notifyOwner(event: OwnerEvent, text: string, bodyParams: string[] = [], bookingReference?: string | null) {
  const to = process.env.OWNER_WHATSAPP_NUMBER;
  if (!to) {
    console.info(`[notifyOwner] OWNER_WHATSAPP_NUMBER not set; would send ${event}:\n${text}`);
    return { status: "skipped" as const };
  }
  const wa = getWhatsAppProvider();
  const result = await wa.sendTemplate(to, { template: templateFor(event), bodyParams, fallbackText: text });
  await logMessage({ bookingReference: bookingReference ?? null, to, kind: event, body: text, provider: result.provider, providerMessageId: result.messageId, status: result.status, error: result.error ?? null });
  return result;
}
