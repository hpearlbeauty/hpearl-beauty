export type WhatsAppProviderId = "meta" | "twilio" | "termii" | "none";

export interface SendResult {
  provider: WhatsAppProviderId;
  messageId: string | null;
  status: "sent" | "queued" | "skipped" | "failed";
  error?: string;
}

/** Outbound WhatsApp contract. Credentials come from env only (WHATSAPP_*). */
export interface WhatsAppProvider {
  id: WhatsAppProviderId;
  /** `to` in international format without "+", e.g. 2348012345678 */
  sendText(to: string, body: string): Promise<SendResult>;
}

export interface ScheduledMessage {
  id: string;
  to: string;
  body: string;
  /** ISO timestamp when it should be sent. */
  sendAt: string;
  kind: "touch_up_reminder";
  bookingReference: string;
}

/**
 * Delayed-send contract for the 28-day touch-up reminder. The real implementation
 * belongs in the backend (cron, queue, or provider-side scheduling); the app only
 * produces the job descriptor.
 */
export interface MessageScheduler {
  schedule(msg: ScheduledMessage): Promise<{ jobId: string }>;
  cancel(jobId: string): Promise<void>;
}
