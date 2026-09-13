import "server-only";
import type { WhatsAppProvider } from "./types";

const API = "https://graph.facebook.com/v20.0";

async function post(body: unknown) {
  const token = process.env.WHATSAPP_API_TOKEN;
  const phoneId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  if (!token || !phoneId) return { ok: false, error: "WHATSAPP_API_TOKEN / WHATSAPP_PHONE_NUMBER_ID not set", id: null };
  const res = await fetch(`${API}/${phoneId}/messages`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify(body),
    cache: "no-store",
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) return { ok: false, error: json?.error?.message ?? res.statusText, id: null };
  return { ok: true, error: null, id: json?.messages?.[0]?.id ?? null };
}

/** Meta WhatsApp Cloud API. */
export const metaWhatsApp: WhatsAppProvider = {
  id: "meta",
  async sendText(to, body) {
    const r = await post({ messaging_product: "whatsapp", to, type: "text", text: { body } });
    return r.ok ? { provider: "meta", messageId: r.id, status: "sent" } : { provider: "meta", messageId: null, status: "failed", error: r.error ?? undefined };
  },
  async sendTemplate(to, m) {
    if (!m.template) return metaWhatsApp.sendText(to, m.fallbackText);
    const r = await post({
      messaging_product: "whatsapp",
      to,
      type: "template",
      template: {
        name: m.template,
        language: { code: m.language ?? "en" },
        components: m.bodyParams.length ? [{ type: "body", parameters: m.bodyParams.map((text) => ({ type: "text", text })) }] : [],
      },
    });
    return r.ok ? { provider: "meta", messageId: r.id, status: "sent" } : { provider: "meta", messageId: null, status: "failed", error: r.error ?? undefined };
  },
};
