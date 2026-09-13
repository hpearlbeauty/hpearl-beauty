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

export interface MessageRow extends MessageEntry { id: string; createdAt: string }

export async function listMessages(limit = 50): Promise<MessageRow[]> {
  if (!hasDatabase()) return [];
  const rows = await db()`select * from messages order by created_at desc limit ${limit}`;
  return (rows as Record<string, unknown>[]).map((r) => ({
    id: String(r.id), bookingReference: (r.booking_reference as string | null) ?? null, to: String(r.to_phone), kind: String(r.kind), body: String(r.body),
    provider: String(r.provider), providerMessageId: (r.provider_message_id as string | null) ?? null, status: String(r.status), error: (r.error as string | null) ?? null,
    createdAt: new Date(r.created_at as string).toISOString(),
  }));
}
