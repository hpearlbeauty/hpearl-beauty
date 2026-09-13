import "server-only";
import type { WhatsAppProvider, WhatsAppProviderId } from "./types";
import { metaWhatsApp } from "./meta";
import { noopWhatsApp } from "./noop";

export type * from "./types";

export function getWhatsAppProvider(): WhatsAppProvider {
  const id = (process.env.WHATSAPP_PROVIDER ?? "none") as WhatsAppProviderId;
  switch (id) {
    case "meta":
      return metaWhatsApp;
    // case "twilio": / case "termii": add when the provider is chosen (brief §17 #14)
    case "none":
    default:
      return noopWhatsApp;
  }
}

/** Registered template name for a message kind, from env (WHATSAPP_TEMPLATE_<KIND>). */
export function templateFor(kind: string): string | null {
  return process.env[`WHATSAPP_TEMPLATE_${kind.toUpperCase()}`] ?? null;
}
