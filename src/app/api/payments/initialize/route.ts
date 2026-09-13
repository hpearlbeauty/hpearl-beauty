import { NextResponse } from "next/server";
import { getBookingStore } from "@/lib/adapters/bookings";
import { getPaymentProvider } from "@/lib/adapters/payments";
import { siteConfig } from "@/lib/config";

/** POST /api/payments/initialize { reference } → { authorizationUrl } */
export async function POST(req: Request) {
  const { reference } = await req.json().catch(() => ({}));
  const booking = reference ? await getBookingStore().get(reference) : null;
  if (!booking) return NextResponse.json({ error: "Booking not found" }, { status: 404 });
  if (booking.depositKobo === null)
    return NextResponse.json({ error: "price_tbd", message: "Service price not yet confirmed; deposit cannot be collected." }, { status: 409 });

  const provider = getPaymentProvider();
  const result = await provider.initialize({
    reference: booking.reference,
    amountKobo: booking.depositKobo,
    currency: "NGN",
    email: booking.customer.email,
    customerName: booking.customer.name,
    phone: booking.customer.phone,
    callbackUrl: `${siteConfig.url}/book?step=confirmation&ref=${encodeURIComponent(booking.reference)}`,
    metadata: { serviceId: booking.serviceId, date: booking.date, time: booking.time, deposit: "50%" },
  });
  return NextResponse.json(result);
}
