import "server-only";
import type { WhatsAppProvider } from "./types";

/** Meta WhatsApp Cloud API. */
export const metaWhatsApp: WhatsAppProvider = {
  id: "meta",
  async sendText(to, body) {
    const token = process.env.WHATSAPP_API_TOKEN;
    const phoneId = process.env.WHATSAPP_PHONE_NUMBER_ID;
    if (!token || !phoneId) return { provider: "meta", messageId: null, status: "failed", error: "WHATSAPP_API_TOKEN / WHATSAPP_PHONE_NUMBER_ID not set" };

    const res = await fetch(`https://graph.facebook.com/v20.0/${phoneId}/messages`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ messaging_product: "whatsapp", to, type: "text", text: { body } }),
      cache: "no-store",
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) return { provider: "meta", messageId: null, status: "failed", error: json?.error?.message ?? res.statusText };
    return { provider: "meta", messageId: json?.messages?.[0]?.id ?? null, status: "sent" };
  },
};
