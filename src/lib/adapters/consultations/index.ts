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
