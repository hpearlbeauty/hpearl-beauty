import { NextResponse } from "next/server";
import { getBookingStore } from "@/lib/adapters/bookings";

/** GET /api/bookings/:reference — public view used to resume a deposit or render a confirmation on any device. */
export async function GET(_req: Request, { params }: { params: Promise<{ reference: string }> }) {
  const { reference } = await params;
  const b = await getBookingStore().get(reference);
  if (!b) return NextResponse.json({ error: "Booking not found" }, { status: 404 });
  return NextResponse.json({
    reference: b.reference,
    serviceId: b.serviceId,
    date: b.date,
    time: b.time,
    status: b.status,
    customer: { name: b.customer.name, phone: b.customer.phone, email: b.customer.email },
  });
}
