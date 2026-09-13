import { NextResponse } from "next/server";
import { randomBytes } from "node:crypto";
import { getSiteContent } from "@/lib/content/resolve";
import { screeningQuestions } from "@/content/booking";
import { requiresConsultation } from "@/lib/booking/screening";
import { computeDeposit, toKobo } from "@/lib/booking/pricing";
import { getAvailabilityProvider } from "@/lib/adapters/availability";
import { getBookingStore } from "@/lib/adapters/bookings";
import { makeReference } from "@/lib/adapters/payments";
import { onBookingCreated } from "@/lib/booking/events";
import { siteConfig } from "@/lib/config";

/**
 * POST /api/bookings — creates a pending booking + slot hold and schedules the
 * abandoned-deposit nudge. The screening gate is re-checked server-side.
 */
export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });

  const { serviceId, date, time, customer, screening = [] } = body;
  const validIds = new Set(screeningQuestions.map((q) => q.id as string));
  if (!Array.isArray(screening) || !screening.every((id: unknown) => typeof id === "string" && validIds.has(id)))
    return NextResponse.json({ error: "Invalid screening payload" }, { status: 400 });
  if (requiresConsultation(screening)) return NextResponse.json({ error: "consultation_required" }, { status: 422 });

  const { services } = await getSiteContent();
  const service = services.find((s) => s.id === serviceId);
  if (!service) return NextResponse.json({ error: "Unknown service" }, { status: 400 });
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(date)) || !/^\d{2}:\d{2}$/.test(String(time))) return NextResponse.json({ error: "Invalid date or time" }, { status: 400 });
  const name = String(customer?.name ?? "").trim();
  const phone = String(customer?.phone ?? "").replace(/[^\d]/g, "");
  const email = String(customer?.email ?? "").trim();
  if (!name || phone.length < 10 || !email) return NextResponse.json({ error: "Missing or invalid customer details" }, { status: 400 });

  const reference = makeReference();
  const { depositNGN } = computeDeposit(service.priceNGN);
  const hold = await getAvailabilityProvider().hold({ serviceId: service.id, date, time, reference });

  const record = await getBookingStore().create({
    reference,
    serviceId: service.id,
    date,
    time,
    customer: { name, phone, email },
    screening,
    holdId: hold.holdId,
    depositKobo: depositNGN === null ? null : toKobo(depositNGN),
    status: "pending_payment",
    paymentProvider: siteConfig.paymentProvider,
    manageToken: randomBytes(16).toString("hex"),
    createdAt: new Date().toISOString(),
  });
  await onBookingCreated(record);

  return NextResponse.json({ reference: record.reference, holdExpiresAt: hold.expiresAt, depositKobo: record.depositKobo });
}
