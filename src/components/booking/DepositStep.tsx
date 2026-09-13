"use client";
import { useState } from "react";
import { bookingFrames } from "@/content/booking";
import { getService } from "@/content/services";
import { studio } from "@/content/studio";
import { canProceedFromDeposit, computeDeposit } from "@/lib/booking";
import { formatDateLong, formatNGN, formatTime } from "@/lib/format";
import { siteConfig, whatsappLink } from "@/lib/config";
import { Button } from "@/components/ui/Button";
import { useBooking } from "./BookingContext";
import { BookingBar } from "./BookingBar";

/** Step 3 · appointment summary (bone card) + secure checkout (ink card), Figma. */
export function DepositStep() {
  const { state, dispatch } = useBooking();
  const f = bookingFrames.deposit;
  const service = state.serviceId ? getService(state.serviceId) : null;
  const deposit = computeDeposit(service?.priceNGN ?? null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [priceTbd, setPriceTbd] = useState(service?.priceNGN === null);

  if (!service || !state.date || !state.slot) return null;
  const dateLabel = formatDateLong(state.date);
  const timeLabel = formatTime(state.slot);

  const requestMessage = `Hello hpearl_beauty, I'd like to book ${service.name} on ${dateLabel} at ${timeLabel}. Name: ${state.customer.name}. Please confirm the deposit amount.`;

  async function pay(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      let reference = state.reference;
      if (!reference) {
        const create = await fetch("/api/bookings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ serviceId: service!.id, date: state.date, time: state.slot, customer: state.customer, screening: state.screening }),
        });
        const created = await create.json();
        if (!create.ok) throw new Error(created.error ?? "Could not create booking");
        reference = created.reference as string;
        dispatch({ type: "PAYMENT_INITIALISED", reference });
      }

      const init = await fetch("/api/payments/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reference }),
      });
      const j = await init.json();
      if (init.status === 409 && j.error === "price_tbd") { setPriceTbd(true); return; }
      if (!init.ok) throw new Error(j.error ?? "Could not start payment");
      window.location.assign(j.authorizationUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  const field = "mt-1.5 h-12 w-full rounded-control border border-ivory/20 bg-ink px-4 t-body text-ivory placeholder:text-ivory/40 focus:border-champagne focus:outline-none";

  return (
    <div className="step-enter">
      <BookingBar step="deposit" label={f.stepLabel} />
      <div className="container-editorial pb-16 pt-12 lg:pb-24 lg:pt-14">
        <header>
          <h1 className="font-display text-[clamp(40px,4.4vw,64px)] leading-[1] text-ink">{f.heading}</h1>
          <p className="t-lead mt-3 text-taupe">{f.sub}</p>
        </header>

        <div className="mt-10 grid gap-8 lg:grid-cols-12 lg:gap-8">
          <section className="lg:col-span-6" aria-labelledby="summary-label">
            <p id="summary-label" className="t-label text-clay">{f.summaryLabel}</p>
            <div className="mt-3 rounded-frame bg-bone p-7 lg:p-8">
              <h2 className="t-h3 text-ink">{service.name}</h2>
              <p className="t-body mt-3 text-taupe">{dateLabel} <span aria-hidden="true" className="mx-1.5">•</span> {timeLabel}</p>
              <p className="t-body mt-1 text-taupe">{service.durationLabel} <span aria-hidden="true" className="mx-1.5">•</span> {studio.timezoneLabel.split(" ·")[0]}</p>
              <dl className="mt-7 space-y-4 border-t border-sand pt-6">
                <div className="flex items-baseline justify-between gap-6">
                  <dt className="t-small text-taupe">{f.servicePrice}</dt>
                  <dd className="t-body font-semibold text-ink">{formatNGN(deposit.totalNGN)}</dd>
                </div>
                <div className="flex items-baseline justify-between gap-6">
                  <dt className="t-small text-taupe">{f.depositDue}</dt>
                  <dd className="t-body font-semibold text-clay">{deposit.depositNGN === null ? f.depositOfConfirmed : formatNGN(deposit.depositNGN)}</dd>
                </div>
                {deposit.balanceNGN !== null && (
                  <div className="flex items-baseline justify-between gap-6">
                    <dt className="t-small text-taupe">Balance at studio</dt>
                    <dd className="t-body font-semibold text-ink">{formatNGN(deposit.balanceNGN)}</dd>
                  </div>
                )}
              </dl>
              <p className="t-small mt-6 text-taupe">{f.note}</p>
            </div>
          </section>

          <section className="lg:col-span-6" aria-labelledby="checkout-label">
            <p id="checkout-label" className="t-label text-clay">{f.checkoutLabel}</p>
            <form onSubmit={pay} className="mt-3 rounded-frame bg-ink p-7 text-ivory lg:p-8">
              <h2 className="font-display text-[clamp(30px,2.6vw,38px)] leading-[1.05] text-ivory">{f.checkoutHeading}</h2>
              <p className="t-body mt-3 text-ivory/75">{f.checkoutBody}</p>

              <fieldset className="mt-7 grid gap-4 sm:grid-cols-2">
                <legend className="t-label mb-1 text-champagne">Your details</legend>
                <label className="t-small block sm:col-span-2">Full name
                  <input required autoComplete="name" className={field} value={state.customer.name} onChange={(e) => dispatch({ type: "SET_CUSTOMER", customer: { name: e.target.value } })} />
                </label>
                <label className="t-small block">WhatsApp number
                  <input required type="tel" inputMode="tel" autoComplete="tel" placeholder="234…" className={field} value={state.customer.phone} onChange={(e) => dispatch({ type: "SET_CUSTOMER", customer: { phone: e.target.value } })} />
                </label>
                <label className="t-small block">Email
                  <input required type="email" autoComplete="email" className={field} value={state.customer.email} onChange={(e) => dispatch({ type: "SET_CUSTOMER", customer: { email: e.target.value } })} />
                </label>
              </fieldset>

              {priceTbd ? (
                <div className="mt-7 rounded-control border border-champagne/40 px-5 py-4" role="status">
                  <p className="t-label text-champagne">TBD</p>
                  <p className="t-body mt-2 text-ivory/85">{f.priceTbdNotice}</p>
                  <Button href={whatsappLink(requestMessage)} target="_blank" rel="noopener" variant="champagne" size="lg" className="mt-5 w-full">
                    {f.priceTbdCta}
                  </Button>
                </div>
              ) : (
                <Button type="submit" variant="champagne" size="lg" className="mt-7 w-full" disabled={busy || !canProceedFromDeposit(state)}>
                  {busy ? "Opening secure checkout…" : f.cta}
                </Button>
              )}
              {error && <p className="t-small mt-4 text-champagne" role="alert">{error}</p>}
              <p className="t-small mt-4 font-semibold text-champagne">{f.providers} <span className="font-normal text-ivory/50">· {siteConfig.paymentProvider === "paystack" ? "Paystack" : "Flutterwave"} selected</span></p>
              <p className="t-small mt-3 text-ivory/70">{f.terms}</p>
            </form>
          </section>
        </div>

        <button type="button" onClick={() => dispatch({ type: "GO_TO", step: "datetime" })} className="t-small mt-8 text-taupe underline-offset-[6px] hover:underline">
          ← Change date or service
        </button>
      </div>
    </div>
  );
}
