"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { bookingFrames } from "@/content/booking";
import { getService } from "@/content/services";
import { prepInstructions, studio } from "@/content/studio";
import { bookingConfirmationMessage } from "@/content/whatsapp";
import { formatDateLong, formatDateTimeLabel, formatTime } from "@/lib/format";
import { whatsappLink } from "@/lib/config";
import { Button } from "@/components/ui/Button";
import { useBooking } from "./BookingContext";
import { BookingBar } from "./BookingBar";

/** Editorial success state: ink band + bone detail card (Figma). */
export function BookingConfirmation() {
  const { state } = useBooking();
  const params = useSearchParams();
  const f = bookingFrames.confirmation;
  const [waStatus, setWaStatus] = useState<"pending" | "sent" | "skipped" | "failed">("pending");

  useEffect(() => {
    const ref = params.get("ref") ?? state.reference;
    if (!ref) return;
    fetch(`/api/payments/verify?ref=${encodeURIComponent(ref)}`)
      .then((r) => r.json())
      .then((j) => setWaStatus(j.whatsapp === "sent" ? "sent" : j.whatsapp === "failed" ? "failed" : j.whatsapp === "skipped" ? "skipped" : "pending"))
      .catch(() => setWaStatus("pending"));
  }, [params, state.reference]);

  const service = state.serviceId ? getService(state.serviceId) : null;
  if (!service || !state.date || !state.slot) return null;

  const message = bookingConfirmationMessage({ clientName: state.customer.name || "there", serviceName: service.name, dateTimeLabel: formatDateTimeLabel(state.date, state.slot) });
  const start = new Date(`${state.date}T${state.slot}:00+01:00`);
  const end = new Date(start.getTime() + service.durationMinutes * 60000);
  const fmt = (d: Date) => d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  const gcal = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(`${service.name} · hpearl_beauty`)}&dates=${fmt(start)}/${fmt(end)}&location=${encodeURIComponent(studio.address)}&details=${encodeURIComponent(prepInstructions)}`;

  return (
    <div className="step-enter">
      <BookingBar step="confirmation" label={f.stepLabel} />
      <section className="bg-ink pb-14 pt-10 text-ivory lg:pb-16 lg:pt-12" aria-labelledby="confirm-heading">
        <div className="container-editorial">
          <p className="t-label text-clay">{f.stepLabel}</p>
          <h1 id="confirm-heading" className="font-display mt-5 text-[clamp(40px,4.6vw,68px)] leading-[1] text-ivory">{f.heading}</h1>
          <p className="t-lead mt-3 text-ivory/80">{f.sub}</p>
        </div>
      </section>

      <div className="container-editorial pb-16 pt-12 lg:pb-24">
        <div className="rounded-frame bg-bone p-7 lg:p-8">
          <div className="flex items-start gap-5">
            <span className="grid size-[52px] shrink-0 place-items-center rounded-full bg-clay" aria-hidden="true">
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><path className="check-stroke" d="M5 11.5 9.2 15.5 17 7.5" stroke="#F6F0E7" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </span>
            <div>
              <h2 className="t-h3 text-ink">{service.name}</h2>
              <p className="t-body mt-1.5 text-taupe">
                {formatDateLong(state.date)} <span aria-hidden="true" className="mx-1.5">•</span> {formatTime(state.slot)} <span aria-hidden="true" className="mx-1.5">•</span> {service.durationLabel}
              </p>
            </div>
          </div>

          <dl className="mt-9 space-y-7">
            <div>
              <dt className="t-small font-semibold text-clay">{f.studio}</dt>
              <dd className="t-body mt-1.5 text-ink">{studio.address}</dd>
            </div>
            <div>
              <dt className="t-small font-semibold text-clay">{f.before}</dt>
              <dd className="t-body mt-1.5 text-ink">{prepInstructions}</dd>
            </div>
            <div>
              <dt className="t-small font-semibold text-clay">WhatsApp confirmation</dt>
              <dd className="t-body mt-1.5 text-ink" aria-live="polite">
                {waStatus === "sent" ? "Sent to your WhatsApp number." : waStatus === "failed" ? "We couldn't send the message automatically. Use the button below." : waStatus === "skipped" ? "Automatic messages are not switched on yet. Use the button below to save your details." : "Your WhatsApp confirmation will arrive shortly."}
              </dd>
            </div>
          </dl>

          <div className="mt-9 grid gap-3 sm:grid-cols-[1fr_auto]">
            <Button href={whatsappLink(message)} target="_blank" rel="noopener" variant="ink" size="lg" className="w-full">{f.whatsapp}</Button>
            <Button href={gcal} target="_blank" rel="noopener" variant="outline" size="lg">{f.calendar}</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
