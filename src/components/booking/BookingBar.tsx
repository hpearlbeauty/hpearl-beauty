import Link from "next/link";
import { STEP_ORDER, type BookingStep } from "@/lib/booking";

/** Slim ink bar for steps 2–3 + confirmation (Figma), with a 3-segment progress line that morphs in 350ms. */
export function BookingBar({ step, label }: { step: BookingStep; label: string }) {
  const idx = Math.max(0, STEP_ORDER.indexOf(step));
  const pct = step === "confirmation" ? 100 : ((idx + 1) / 3) * 100;
  return (
    <div className="bg-ink text-ivory">
      <div className="container-editorial flex h-[72px] items-center justify-between">
        <Link href="/" className="shrink-0 text-[18px] font-semibold tracking-tight">hpearl_beauty</Link>
        <p className="t-label shrink-0 text-right text-champagne"><span className="hidden sm:inline">Booking <span aria-hidden="true" className="mx-2">•</span></span>{label}</p>
      </div>
      <div className="h-px w-full bg-ivory/10" aria-hidden="true">
        <div className="h-px bg-champagne transition-[width] duration-[350ms] ease-enter" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
