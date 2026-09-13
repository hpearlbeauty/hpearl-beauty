import "server-only";
import type { MessageScheduler, WhatsAppProvider, WhatsAppProviderId } from "./types";
import { metaWhatsApp } from "./meta";
import { noopScheduler, noopWhatsApp } from "./noop";

export type * from "./types";

export function getWhatsAppProvider(): WhatsAppProvider {
  const id = (process.env.WHATSAPP_PROVIDER ?? "none") as WhatsAppProviderId;
  switch (id) {
    case "meta":
      return metaWhatsApp;
    // case "twilio": / case "termii": — add when the provider is chosen (brief §17 #14)
    case "none":
    default:
      return noopWhatsApp;
  }
}

export function getMessageScheduler(): MessageScheduler {
  return noopScheduler;
}
