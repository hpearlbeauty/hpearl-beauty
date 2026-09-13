import "server-only";
import { db, hasDatabase } from "@/lib/db/client";

export interface ConsultationRequest {
  name: string;
  phone: string | null;
  flags: string[];
  source?: string;
}

const mem: (ConsultationRequest & { id: string; createdAt: string })[] = [];

/** Screening red-flag requests, so the owner has context before the WhatsApp conversation. */
export async function saveConsultationRequest(c: ConsultationRequest): Promise<{ id: string }> {
  if (!hasDatabase()) {
    const id = `con_${mem.length + 1}`;
    mem.push({ ...c, id, createdAt: new Date().toISOString() });
    console.info(`[consultations:memory] ${c.name} flags=${c.flags.join(",")}`);
    return { id };
  }
  const rows = await db()`
    insert into consultation_requests (name, phone, flags, source) values (${c.name}, ${c.phone}, ${JSON.stringify(c.flags)}::jsonb, ${c.source ?? "screening"})
    returning id`;
  return { id: String(rows[0].id) };
}

export interface ConsultationRow extends ConsultationRequest {
  id: string;
  status: "new" | "contacted" | "closed";
  createdAt: string;
}

export async function listConsultationRequests(limit = 50): Promise<ConsultationRow[]> {
  if (!hasDatabase()) return mem.map((m) => ({ ...m, status: "new" as const })).slice(-limit).reverse();
  const rows = await db()`select * from consultation_requests order by created_at desc limit ${limit}`;
  return (rows as Record<string, unknown>[]).map((r) => ({
    id: String(r.id), name: String(r.name), phone: (r.phone as string | null) ?? null, flags: (r.flags as string[]) ?? [],
    source: String(r.source), status: r.status as ConsultationRow["status"], createdAt: new Date(r.created_at as string).toISOString(),
  }));
}

export async function updateConsultationStatus(id: string, status: ConsultationRow["status"]): Promise<void> {
  if (!hasDatabase()) return;
  await db()`update consultation_requests set status = ${status} where id = ${id}`;
}
