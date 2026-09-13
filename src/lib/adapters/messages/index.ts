import "server-only";
import { db, hasDatabase } from "@/lib/db/client";

export interface MessageEntry {
  bookingReference?: string | null;
  to: string;
  kind: string;
  body: string;
  provider: string;
  providerMessageId: string | null;
  status: string;
  error?: string | null;
}

/** Audit log of every outbound WhatsApp message (what was sent, to whom, and whether it succeeded). */
export async function logMessage(m: MessageEntry): Promise<void> {
  if (!hasDatabase()) {
    console.info(`[messages] ${m.kind} → ${m.to} [${m.provider}:${m.status}]${m.error ? ` ${m.error}` : ""}`);
    return;
  }
  await db()`
    insert into messages (booking_reference, to_phone, kind, body, provider, provider_message_id, status, error)
    values (${m.bookingReference ?? null}, ${m.to}, ${m.kind}, ${m.body}, ${m.provider}, ${m.providerMessageId}, ${m.status}, ${m.error ?? null})`;
}
