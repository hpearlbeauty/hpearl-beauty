import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { timingSafeEqual } from "node:crypto";
import { getBookingStore } from "@/lib/adapters/bookings";
import { getService } from "@/content/services";
import { prepInstructions, studio, policies } from "@/content/studio";
import { formatDateLong, formatTime } from "@/lib/format";
import { siteConfig, whatsappLink } from "@/lib/config";
import { BookingBar } from "@/components/booking/BookingBar";
import { Button } from "@/components/ui/Button";
import { Placeholder } from "@/components/ui/Placeholder";

export const metadata: Metadata = { title: "Your booking", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

const STATUS_COPY: Record<string, { label: string; tone: string }> = {
  pending_payment: { label: "Awaiting deposit", tone: "text-clay" },
  confirmed: { label: "Confirmed", tone: "text-ink" },
  failed: { label: "Payment failed", tone: "text-clay" },
  cancelled: { label: "Cancelled", tone: "text-taupe" },
  expired: { label: "Expired (deposit not received)", tone: "text-taupe" },
};

/** Manage-my-booking page. Access requires the per-booking token from the confirmation link. */
export default async function ManageBookingPage({ params, searchParams }: { params: Promise<{ reference: string }>; searchParams: Promise<{ t?: string }> }) {
  const { reference } = await params;
  const { t } = await searchParams;
  const b = await getBookingStore().get(reference);
  if (!b || !t) notFound();
  const a = Buffer.from(t), c = Buffer.from(b.manageToken);
  if (a.length !== c.length || !timingSafeEqual(a, c)) notFound();
  const service = getService(b.serviceId);
  if (!service) notFound();

  const status = STATUS_COPY[b.status] ?? STATUS_COPY.confirmed;
  const start = new Date(`${b.date}T${b.time}:00+01:00`);
  const end = new Date(start.getTime() + service.durationMinutes * 60000);
  const fmt = (d: Date) => d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  const gcal = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(`${service.name} · hpearl_beauty`)}&dates=${fmt(start)}/${fmt(end)}&location=${encodeURIComponent(studio.address)}&details=${encodeURIComponent(prepInstructions)}`;
  const waChange = whatsappLink(`Hello hpearl_beauty, I'd like to reschedule or cancel my ${service.name} appointment on ${formatDateLong(b.date)} at ${formatTime(b.time)} (ref ${b.reference}).`);

  return (
    <main id="main" className="min-h-dvh bg-ivory">
      <BookingBar step={b.status === "confirmed" ? "confirmation" : "deposit"} label="Your booking" />
      <div className="container-editorial max-w-[820px] pb-20 pt-12">
        <p className="t-label text-clay">Reference {b.reference}</p>
        <h1 className="font-display mt-4 text-[clamp(38px,4.4vw,60px)] leading-[1] text-ink">{service.name}</h1>
        <p className={`t-lead mt-3 font-medium ${status.tone}`}>{status.label}</p>

        <dl className="t-body mt-10 divide-y divide-border border-y border-border text-ink">
          <div className="grid grid-cols-[140px_1fr] gap-4 py-4"><dt className="text-taupe">Date</dt><dd>{formatDateLong(b.date)}</dd></div>
          <div className="grid grid-cols-[140px_1fr] gap-4 py-4"><dt className="text-taupe">Time</dt><dd>{formatTime(b.time)} WAT · {service.durationLabel}</dd></div>
          <div className="grid grid-cols-[140px_1fr] gap-4 py-4"><dt className="text-taupe">Studio</dt><dd>{studio.address}</dd></div>
          <div className="grid grid-cols-[140px_1fr] gap-4 py-4"><dt className="text-taupe">Name</dt><dd>{b.customer.name}</dd></div>
          <div className="grid grid-cols-[140px_1fr] gap-4 py-4"><dt className="text-taupe">Before you come</dt><dd>{prepInstructions}</dd></div>
        </dl>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          {b.status === "pending_payment" && <Button href={`/book?step=deposit&ref=${encodeURIComponent(b.reference)}`} variant="champagne" size="lg">Complete your deposit</Button>}
          {b.status === "confirmed" && <Button href={gcal} target="_blank" rel="noopener" variant="ink" size="lg">Add to calendar</Button>}
          <Button href={waChange} target="_blank" rel="noopener" variant="outline" size="lg">Reschedule or cancel on WhatsApp</Button>
        </div>

        {!policies.cancellation && (
          <Placeholder label="Cancellation and deposit policy pending" className="mt-8">Reschedule and refund rules will appear here once hpearl_beauty confirms them. Until then, changes are handled on WhatsApp.</Placeholder>
        )}
        <p className="t-small mt-8 text-taupe">Questions? <a className="underline underline-offset-4" href={siteConfig.whatsappNumber ? whatsappLink(`Hello, about booking ${b.reference}`) : "/"}>Message the studio</a>.</p>
      </div>
    </main>
  );
}
