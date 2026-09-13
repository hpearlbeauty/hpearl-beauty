import "server-only";
import type { PaymentProvider, PaymentProviderId } from "./types";
import { paystack } from "./paystack";
import { flutterwave } from "./flutterwave";

export type * from "./types";

/** Brief §6: final provider TBD · selected by NEXT_PUBLIC_PAYMENT_PROVIDER. */
export function getPaymentProvider(id?: PaymentProviderId): PaymentProvider {
  const provider = id ?? (process.env.NEXT_PUBLIC_PAYMENT_PROVIDER as PaymentProviderId | undefined) ?? "paystack";
  switch (provider) {
    case "paystack":
      return paystack;
    case "flutterwave":
      return flutterwave;
    default:
      throw new Error(`Unknown payment provider: ${provider}`);
  }
}

export function makeReference(prefix = "HPB"): string {
  const ts = Date.now().toString(36).toUpperCase();
  const rnd = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `${prefix}-${ts}-${rnd}`;
}
