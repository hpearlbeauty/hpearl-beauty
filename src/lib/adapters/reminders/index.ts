import "server-only";
import { db, hasDatabase } from "@/lib/db/client";
import type { ReminderKind, ReminderQueue, ReminderRow } from "./types";

export type * from "./types";

const mem = new Map<string, ReminderRow>();
let seq = 0;

const memoryQueue: ReminderQueue = {
  async schedule(ref, kind, sendAt) {
    const existing = [...mem.values()].find((r) => r.bookingReference === ref && r.kind === kind);
    const row: ReminderRow = { id: existing?.id ?? `rem_${++seq}`, bookingReference: ref, kind, sendAt: sendAt.toISOString(), status: "pending", attempts: 0 };
    mem.set(row.id, row);
    console.info(`[reminders:memory] ${kind} for ${ref} at ${row.sendAt}`);
    return row;
  },
  async cancel(ref, kind) {
    for (const r of mem.values()) if (r.bookingReference === ref && (!kind || r.kind === kind) && r.status === "pending") r.status = "cancelled";
  },
  async due(now, limit = 50) {
    return [...mem.values()].filter((r) => r.status === "pending" && new Date(r.sendAt) <= now).slice(0, limit);
  },
  async markSent(id) { const r = mem.get(id); if (r) r.status = "sent"; },
  async markFailed(id) { const r = mem.get(id); if (r) { r.attempts += 1; if (r.attempts >= 3) r.status = "failed"; } },
};

const toRow = (r: Record<string, unknown>): ReminderRow => ({
  id: String(r.id),
  bookingReference: String(r.booking_reference),
  kind: r.kind as ReminderKind,
  sendAt: new Date(r.send_at as string).toISOString(),
  status: r.status as ReminderRow["status"],
  attempts: Number(r.attempts),
});

const postgresQueue: ReminderQueue = {
  async schedule(ref, kind, sendAt) {
    const rows = await db()`
      insert into reminders (booking_reference, kind, send_at) values (${ref}, ${kind}, ${sendAt.toISOString()})
      on conflict (booking_reference, kind) do update set send_at = excluded.send_at, status = 'pending', attempts = 0, last_error = null
      returning *`;
    return toRow(rows[0] as Record<string, unknown>);
  },
  async cancel(ref, kind) {
    if (kind) await db()`update reminders set status = 'cancelled' where booking_reference = ${ref} and kind = ${kind} and status = 'pending'`;
    else await db()`update reminders set status = 'cancelled' where booking_reference = ${ref} and status = 'pending'`;
  },
  async due(now, limit = 50) {
    const rows = await db()`select * from reminders where status = 'pending' and send_at <= ${now.toISOString()} order by send_at limit ${limit}`;
    return (rows as Record<string, unknown>[]).map(toRow);
  },
  async markSent(id) {
    await db()`update reminders set status = 'sent', sent_at = now(), attempts = attempts + 1 where id = ${id}`;
  },
  async markFailed(id, error) {
    await db()`update reminders set attempts = attempts + 1, last_error = ${error}, status = case when attempts + 1 >= 3 then 'failed' else 'pending' end where id = ${id}`;
  },
};

export function getReminderQueue(): ReminderQueue {
  return hasDatabase() ? postgresQueue : memoryQueue;
}
