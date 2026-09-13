import type { MessageScheduler, WhatsAppProvider } from "./types";

/** Development fallback: logs instead of sending. */
export const noopWhatsApp: WhatsAppProvider = {
  id: "none",
  async sendText(to, body) {
    console.info(`[whatsapp:noop] → ${to}\n${body}`);
    return { provider: "none", messageId: null, status: "skipped" };
  },
};

export const noopScheduler: MessageScheduler = {
  async schedule(msg) {
    console.info(`[scheduler:noop] ${msg.kind} for ${msg.to} at ${msg.sendAt}`);
    return { jobId: `noop_${msg.id}` };
  },
  async cancel() {},
};
