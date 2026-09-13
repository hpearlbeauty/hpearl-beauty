import { NextResponse } from "next/server";
import { getBookingStore } from "@/lib/adapters/bookings";
import { getPaymentProvider } from "@/lib/adapters/payments";
import { onBookingConfirmed } from "@/lib/booking/events";

/** flutterwave webhook: signature-verified, re-verified with the provider, idempotent on booking status. */
export async function POST(req: Request) {
  const raw = await req.text();
  const provider = getPaymentProvider("flutterwave");
  if (!provider.verifyWebhook(raw, req.headers)) return NextResponse.json({ error: "Invalid signature" }, { status: 401 });

  const { reference, status } = provider.parseWebhook(raw);
  if (!reference || status === "other") return NextResponse.json({ received: true });

  const store = getBookingStore();
  const booking = await store.get(reference);
  if (!booking || booking.status === "confirmed") return NextResponse.json({ received: true });

  if (status === "success") {
    const verified = await provider.verify(reference);
    if (verified.status === "success" && verified.amountKobo >= (booking.depositKobo ?? Infinity)) {
      const updated = await store.update(reference, { status: "confirmed", confirmedAt: new Date().toISOString(), paidAt: verified.paidAt ?? new Date().toISOString() });
      await onBookingConfirmed(updated ?? booking);
    }
  } else {
    await store.update(reference, { status: "failed" });
  }
  return NextResponse.json({ received: true });
}
