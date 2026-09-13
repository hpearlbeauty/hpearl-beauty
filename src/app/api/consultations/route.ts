import { NextResponse } from "next/server";
import { screeningQuestions } from "@/content/booking";
import { onConsultationRequest } from "@/lib/booking/events";

/** POST /api/consultations { name, phone?, flags[] } — records a screening red-flag request and alerts the owner. */
export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const name = typeof body?.name === "string" ? body.name.trim() : "";
  const phone = typeof body?.phone === "string" && body.phone.trim() ? body.phone.replace(/[^\d]/g, "") : null;
  const valid = new Set(screeningQuestions.map((q) => q.id as string));
  const flags: string[] = Array.isArray(body?.flags) ? body.flags.filter((f: unknown) => typeof f === "string" && valid.has(f)) : [];
  if (!name || flags.length === 0) return NextResponse.json({ error: "name and at least one flag are required" }, { status: 400 });
  const saved = await onConsultationRequest({ name, phone, flags });
  return NextResponse.json({ ok: true, id: saved.id });
}
