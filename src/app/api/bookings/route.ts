import { NextResponse } from "next/server";
import { getService } from "@/content/services";
import { screeningQuestions } from "@/content/booking";
import { requiresConsultation } from "@/lib/booking/screening";
import { computeDeposit, toKobo } from "@/lib/booking/pricing";
import { getAvailabilityProvider } from "@/lib/adapters/availability";
import { getBookingStore } from "@/lib/adapters/bookings";
import { makeReference } from "@/lib/adapters/payments";

/**
 * POST /api/bookings · creates a pending booking + slot hold.
 * The screening gate is re-checked server-side so it can't be bypassed client-side.
 */
export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });

  const { serviceId, date, time, customer, screening = [] } = body;
  const validIds = new Set(screeningQuestions.map((q) => q.id));
  if (!Array.isArray(screening) || !screening.every((id: string) => validIds.has(id as never)))
    return NextResponse.json({ error: "Invalid screening payload" }, { status: 400 });
  if (requiresConsultation(screening)) return NextResponse.json({ error: "consultation_required" }, { status: 422 });

  const service = getService(serviceId);
  if (!service) return NextResponse.json({ error: "Unknown service" }, { status: 400 });
  if (!date || !time || !customer?.name || !customer?.phone || !customer?.email)
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });

  const reference = makeReference();
  const { depositNGN } = computeDeposit(service.priceNGN);
  const hold = await getAvailabilityProvider().hold({ serviceId: service.id, date, time, reference });

  const record = await getBookingStore().create({
    reference,
    serviceId: service.id,
    date,
    time,
    customer,
    holdId: hold.holdId,
    depositKobo: depositNGN === null ? null : toKobo(depositNGN),
    status: "pending_payment",
    createdAt: new Date().toISOString(),
  });

  return NextResponse.json({ reference: record.reference, holdExpiresAt: hold.expiresAt, depositKobo: record.depositKobo });
}
