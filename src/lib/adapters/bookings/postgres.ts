import "server-only";
import { db } from "@/lib/db/client";
import type { BookingRecord, BookingStore } from "./types";
import type { ServiceId } from "@/content/types";

type Row = Record<string, unknown>;

function toRecord(r: Row): BookingRecord {
  // `date` columns come back as a local-midnight Date; use to_char'd text when present, else local components.
  const raw = r.date_text ?? r.date;
  const d = raw instanceof Date ? `${raw.getFullYear()}-${String(raw.getMonth() + 1).padStart(2, "0")}-${String(raw.getDate()).padStart(2, "0")}` : String(raw);
  return {
    reference: String(r.reference),
    serviceId: String(r.service_id) as ServiceId,
    date: d,
    time: String(r.time),
    customer: { name: String(r.customer_name), phone: String(r.customer_phone), email: String(r.customer_email ?? "") },
    screening: Array.isArray(r.screening) ? (r.screening as string[]) : [],
    holdId: (r.hold_id as string | null) ?? null,
    depositKobo: r.deposit_kobo === null ? null : Number(r.deposit_kobo),
    status: r.status as BookingRecord["status"],
    paymentProvider: (r.payment_provider as string | null) ?? null,
    manageToken: String(r.manage_token),
    createdAt: new Date(r.created_at as string).toISOString(),
    confirmedAt: r.confirmed_at ? new Date(r.confirmed_at as string).toISOString() : null,
    paidAt: r.paid_at ? new Date(r.paid_at as string).toISOString() : null,
  };
}

async function upsertClient(c: BookingRecord["customer"]): Promise<string | null> {
  const sql = db();
  const rows = await sql`
    insert into clients (name, phone, email) values (${c.name}, ${c.phone}, ${c.email || null})
    on conflict (phone) do update set name = excluded.name, email = coalesce(excluded.email, clients.email)
    returning id`;
  return (rows[0]?.id as string) ?? null;
}

export const postgresBookingStore: BookingStore = {
  async create(r) {
    const sql = db();
    const clientId = await upsertClient(r.customer);
    await sql`
      insert into bookings (reference, client_id, service_id, date, time, customer_name, customer_phone, customer_email, screening, hold_id, deposit_kobo, status, payment_provider, manage_token, created_at)
      values (${r.reference}, ${clientId}, ${r.serviceId}, ${r.date}, ${r.time}, ${r.customer.name}, ${r.customer.phone}, ${r.customer.email || null}, ${JSON.stringify(r.screening)}::jsonb, ${r.holdId}, ${r.depositKobo}, ${r.status}, ${r.paymentProvider}, ${r.manageToken}, ${r.createdAt})`;
    return r;
  },
  async get(ref) {
    const rows = await db()`select *, to_char(date, 'YYYY-MM-DD') as date_text from bookings where reference = ${ref}`;
    return rows[0] ? toRecord(rows[0] as Row) : null;
  },
  async update(ref, patch) {
    const sql = db();
    const rows = await sql`
      update bookings set
        status = coalesce(${patch.status ?? null}, status),
        hold_id = coalesce(${patch.holdId ?? null}, hold_id),
        deposit_kobo = coalesce(${patch.depositKobo ?? null}, deposit_kobo),
        payment_provider = coalesce(${patch.paymentProvider ?? null}, payment_provider),
        confirmed_at = coalesce(${patch.confirmedAt ?? null}, confirmed_at),
        paid_at = coalesce(${patch.paidAt ?? null}, paid_at)
      where reference = ${ref} returning *, to_char(date, 'YYYY-MM-DD') as date_text`;
    return rows[0] ? toRecord(rows[0] as Row) : null;
  },
  async listPendingOlderThan(minutes) {
    const rows = await db()`select *, to_char(date, 'YYYY-MM-DD') as date_text from bookings where status = 'pending_payment' and created_at < now() - (${minutes} || ' minutes')::interval order by created_at`;
    return (rows as Row[]).map(toRecord);
  },
  async listUpcoming(fromDate, limit = 50) {
    const rows = await db()`select *, to_char(date, 'YYYY-MM-DD') as date_text from bookings where status = 'confirmed' and date >= ${fromDate} order by date, time limit ${limit}`;
    return (rows as Row[]).map(toRecord);
  },
  async listByStatus(status, limit = 50) {
    const rows = await db()`select *, to_char(date, 'YYYY-MM-DD') as date_text from bookings where status = ${status} order by created_at desc limit ${limit}`;
    return (rows as Row[]).map(toRecord);
  },
  async listForDate(date) {
    const rows = await db()`select *, to_char(date, 'YYYY-MM-DD') as date_text from bookings where date = ${date} and status = 'confirmed' order by time`;
    return (rows as Row[]).map(toRecord);
  },
};
