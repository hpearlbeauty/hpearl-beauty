import { NextResponse } from "next/server";
import { getBookingStore } from "@/lib/adapters/bookings";
import { getPaymentProvider } from "@/lib/adapters/payments";
import { onBookingConfirmed } from "@/lib/booking/events";

/** GET /api/payments/verify?ref=… — client-side callback path; webhook is the authoritative path. */
export async function GET(req: Request) {
  const ref = new URL(req.url).searchParams.get("ref");
  const store = getBookingStore();
  const booking = ref ? await store.get(ref) : null;
  if (!booking) return NextResponse.json({ error: "Booking not found" }, { status: 404 });
  if (booking.status === "confirmed") return NextResponse.json({ status: "success", booking });

  const result = await getPaymentProvider().verify(booking.reference);
  if (result.status === "success" && result.amountKobo >= (booking.depositKobo ?? Infinity)) {
    const updated = await store.update(booking.reference, { status: "confirmed", confirmedAt: new Date().toISOString() });
    await onBookingConfirmed({ ...booking, reference: booking.reference });
    return NextResponse.json({ status: "success", booking: updated });
  }
  return NextResponse.json({ status: result.status, booking });
}
