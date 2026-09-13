import type { WhatsAppProvider } from "./types";

/** Development fallback: logs instead of sending. */
export const noopWhatsApp: WhatsAppProvider = {
  id: "none",
  async sendText(to, body) {
    console.info(`[whatsapp:noop] → ${to}\n${body}`);
    return { provider: "none", messageId: null, status: "skipped" };
  },
  async sendTemplate(to, m) {
    console.info(`[whatsapp:noop] template=${m.template ?? "(none)"} → ${to}\n${m.fallbackText}`);
    return { provider: "none", messageId: null, status: "skipped" };
  },
};
