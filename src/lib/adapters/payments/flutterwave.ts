import "server-only";
import type { PaymentProvider } from "./types";

const API = "https://api.flutterwave.com/v3";

function secret(): string {
  const key = process.env.FLUTTERWAVE_SECRET_KEY;
  if (!key) throw new Error("FLUTTERWAVE_SECRET_KEY is not set");
  return key;
}

export const flutterwave: PaymentProvider = {
  id: "flutterwave",

  async initialize(input) {
    const res = await fetch(`${API}/payments`, {
      method: "POST",
      headers: { Authorization: `Bearer ${secret()}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        tx_ref: input.reference,
        amount: input.amountKobo / 100, // Flutterwave takes major units
        currency: input.currency,
        redirect_url: input.callbackUrl,
        customer: { email: input.email, name: input.customerName, phonenumber: input.phone ?? "" },
        customizations: { title: "hpearl_beauty · 50% Deposit" },
        meta: input.metadata,
      }),
      cache: "no-store",
    });
    const json = await res.json();
    if (!res.ok || json.status !== "success") throw new Error(`Flutterwave initialize failed: ${json.message ?? res.statusText}`);
    return { provider: "flutterwave", reference: input.reference, authorizationUrl: json.data.link };
  },

  async verify(reference) {
    const res = await fetch(`${API}/transactions/verify_by_reference?tx_ref=${encodeURIComponent(reference)}`, {
      headers: { Authorization: `Bearer ${secret()}` },
      cache: "no-store",
    });
    const json = await res.json();
    if (!res.ok || json.status !== "success") throw new Error(`Flutterwave verify failed: ${json.message ?? res.statusText}`);
    const d = json.data;
    return {
      provider: "flutterwave",
      reference: d.tx_ref,
      status: d.status === "successful" ? "success" : d.status === "failed" ? "failed" : "pending",
      amountKobo: Math.round(Number(d.amount) * 100),
      currency: d.currency,
      paidAt: d.created_at ?? undefined,
      raw: d,
    };
  },

  verifyWebhook(_rawBody, headers) {
    const expected = process.env.FLUTTERWAVE_WEBHOOK_HASH;
    const got = headers.get("verif-hash");
    return Boolean(expected && got && expected === got);
  },

  parseWebhook(rawBody) {
    const body = JSON.parse(rawBody);
    const event: string = body.event ?? "";
    const reference: string | null = body.data?.tx_ref ?? null;
    const s = body.data?.status;
    const status = s === "successful" ? "success" : s === "failed" ? "failed" : "other";
    return { event, reference, status };
  },
};
