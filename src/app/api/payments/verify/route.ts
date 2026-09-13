import { NextResponse } from "next/server";
import { getBookingStore } from "@/lib/adapters/bookings";
import { getPaymentProvider } from "@/lib/adapters/payments";
import { onBookingConfirmed } from "@/lib/booking/events";

const publicView = (b: NonNullable<Awaited<ReturnType<ReturnType<typeof getBookingStore>["get"]>>>) => ({
  reference: b.reference,
  serviceId: b.serviceId,
  date: b.date,
  time: b.time,
  status: b.status,
  customer: { name: b.customer.name },
});

/** GET /api/payments/verify?ref=… — client-side callback path; the webhook remains the authoritative path. */
export async function GET(req: Request) {
  const ref = new URL(req.url).searchParams.get("ref");
  const store = getBookingStore();
  const booking = ref ? await store.get(ref) : null;
  if (!booking) return NextResponse.json({ error: "Booking not found" }, { status: 404 });
  if (booking.status === "confirmed") return NextResponse.json({ status: "success", whatsapp: "sent", booking: publicView(booking) });

  let result;
  try {
    result = await getPaymentProvider(booking.paymentProvider as "paystack" | "flutterwave" | undefined).verify(booking.reference);
  } catch (err) {
    return NextResponse.json({ status: "pending", error: err instanceof Error ? err.message : "verify failed", booking: publicView(booking) });
  }
  if (result.status === "success" && result.amountKobo >= (booking.depositKobo ?? Infinity)) {
    const updated = await store.update(booking.reference, { status: "confirmed", confirmedAt: new Date().toISOString(), paidAt: result.paidAt ?? new Date().toISOString() });
    const { whatsapp } = await onBookingConfirmed(updated ?? booking);
    return NextResponse.json({ status: "success", whatsapp, booking: publicView(updated ?? booking) });
  }
  return NextResponse.json({ status: result.status, booking: publicView(booking) });
}
