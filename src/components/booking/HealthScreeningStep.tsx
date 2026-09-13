"use client";
import Link from "next/link";
import { bookingCopy, bookingFrames, screeningQuestions } from "@/content/booking";
import { requiresConsultation } from "@/lib/booking/screening";
import { whatsappLink } from "@/lib/config";
import { Button } from "@/components/ui/Button";
import { CheckboxCard } from "@/components/ui/CheckboxCard";
import { useBooking } from "./BookingContext";

/**
 * Step 1 — split layout: espresso reassurance panel left, legible form right.
 * The CTA visibly changes (180ms cross-fade) the moment any flag is ticked.
 */
export function HealthScreeningStep() {
  const { state, dispatch } = useBooking();
  const flagged = requiresConsultation(state.screening);
  const f = bookingFrames.screening;

  return (
    <div className="step-enter grid min-h-dvh lg:grid-cols-12">
      <aside className="flex flex-col bg-espresso px-6 py-8 text-ivory lg:col-span-4 lg:px-12 lg:py-12" aria-labelledby="screening-panel-heading">
        <Link href="/" className="font-display text-2xl">hpearl_beauty</Link>
        <div className="mt-10 lg:mt-12">
          <h2 id="screening-panel-heading" className="t-h2 text-ivory">{f.panel.heading}</h2>
          <p className="t-body mt-6 max-w-[36ch] text-ivory/75">{f.panel.body}</p>
          <p className="t-small mt-6 font-semibold text-champagne">{f.panel.note}</p>
        </div>
      </aside>

      <section className="bg-bone px-6 py-10 lg:col-span-8 lg:px-14 lg:py-14" aria-labelledby="screening-heading">
        <div className="mx-auto max-w-[640px]">
          <p className="t-label text-clay">{f.stepLabel}</p>
          <h1 id="screening-heading" className="t-h2 mt-4 text-ink">{f.heading}</h1>
          <p className="t-body mt-5 text-taupe">{bookingCopy.screening.intro}</p>

          <fieldset className="mt-8 space-y-4">
            <legend className="sr-only">Health and safety screening</legend>
            {screeningQuestions.map((q) => (
              <CheckboxCard
                key={q.id}
                id={`screen-${q.id}`}
                label={q.label}
                checked={state.screening.includes(q.id)}
                onChange={() => dispatch({ type: "TOGGLE_SCREENING", id: q.id })}
              />
            ))}
          </fieldset>

          <div className="mt-8" aria-live="polite">
            {flagged ? (
              <div key="flagged" className="cta-swap">
                <div className="rounded-control border border-clay/60 bg-ivory px-5 py-4">
                  <p className="t-body text-ink">{bookingCopy.screening.flagged.notice}</p>
                </div>
                <Button
                  href={whatsappLink(bookingCopy.screening.flagged.whatsappMessage)}
                  variant="ink"
                  size="lg"
                  className="mt-5 w-full sm:w-auto"
                  target="_blank"
                  rel="noopener"
                  onClick={() => dispatch({ type: "SUBMIT_SCREENING" })}
                >
                  {bookingCopy.screening.flagged.ctaLabel}
                </Button>
              </div>
            ) : (
              <div key="clear" className="cta-swap">
                <Button variant="ink" size="lg" className="w-full sm:w-auto" onClick={() => dispatch({ type: "SUBMIT_SCREENING" })}>
                  {bookingCopy.screening.continueLabel}
                </Button>
              </div>
            )}
          </div>
          <p className="t-small mt-6 text-taupe">{f.helper}</p>
        </div>
      </section>
    </div>
  );
}
