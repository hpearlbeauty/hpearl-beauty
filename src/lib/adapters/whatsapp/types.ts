export type WhatsAppProviderId = "meta" | "twilio" | "termii" | "none";

export interface SendResult {
  provider: WhatsAppProviderId;
  messageId: string | null;
  status: "sent" | "queued" | "skipped" | "failed";
  error?: string;
}

/**
 * Business-initiated messages outside a 24h conversation window must use an
 * approved template. `template` is the registered name; `bodyParams` fill its
 * {{n}} placeholders in order. `fallbackText` is used when no template is configured
 * (sandbox / inside an open window).
 */
export interface TemplateMessage {
  template: string | null;
  language?: string;
  bodyParams: string[];
  fallbackText: string;
}

export interface WhatsAppProvider {
  id: WhatsAppProviderId;
  /** `to` in international format without "+", e.g. 2348012345678 */
  sendText(to: string, body: string): Promise<SendResult>;
  sendTemplate(to: string, message: TemplateMessage): Promise<SendResult>;
}
