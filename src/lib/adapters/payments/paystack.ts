import "server-only";
import { createHmac } from "node:crypto";
import type { PaymentProvider } from "./types";

const API = "https://api.paystack.co";

function secret(): string {
  const key = process.env.PAYSTACK_SECRET_KEY;
  if (!key) throw new Error("PAYSTACK_SECRET_KEY is not set");
  return key;
}

export const paystack: PaymentProvider = {
  id: "paystack",

  async initialize(input) {
    const res = await fetch(`${API}/transaction/initialize`, {
      method: "POST",
      headers: { Authorization: `Bearer ${secret()}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        reference: input.reference,
        amount: input.amountKobo,
        currency: input.currency,
        email: input.email,
        callback_url: input.callbackUrl,
        metadata: { ...input.metadata, customer_name: input.customerName, phone: input.phone ?? "" },
      }),
      cache: "no-store",
    });
    const json = await res.json();
    if (!res.ok || !json.status) throw new Error(`Paystack initialize failed: ${json.message ?? res.statusText}`);
    return { provider: "paystack", reference: json.data.reference, authorizationUrl: json.data.authorization_url };
  },

  async verify(reference) {
    const res = await fetch(`${API}/transaction/verify/${encodeURIComponent(reference)}`, {
      headers: { Authorization: `Bearer ${secret()}` },
      cache: "no-store",
    });
    const json = await res.json();
    if (!res.ok || !json.status) throw new Error(`Paystack verify failed: ${json.message ?? res.statusText}`);
    const d = json.data;
    return {
      provider: "paystack",
      reference: d.reference,
      status: d.status === "success" ? "success" : d.status === "failed" ? "failed" : "pending",
      amountKobo: d.amount,
      currency: d.currency,
      paidAt: d.paid_at ?? undefined,
      raw: d,
    };
  },

  verifyWebhook(rawBody, headers) {
    const signature = headers.get("x-paystack-signature");
    if (!signature) return false;
    const hash = createHmac("sha512", secret()).update(rawBody).digest("hex");
    return hash === signature;
  },

  parseWebhook(rawBody) {
    const body = JSON.parse(rawBody);
    const event: string = body.event ?? "";
    const reference: string | null = body.data?.reference ?? null;
    const status = event === "charge.success" ? "success" : event.startsWith("charge.") ? "failed" : "other";
    return { event, reference, status };
  },
};
