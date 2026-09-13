import { home } from "@/content/home";
import { Button } from "@/components/ui/Button";
import { TextReveal } from "@/components/motion/TextReveal";
import { FadeUp } from "@/components/motion/FadeUp";

/** Editorial close: hairline, tracked label, oversized italic statement, single CTA. */
export function BookingCTA() {
  const c = home.cta;
  return (
    <section className="relative overflow-hidden bg-ivory section-y" aria-labelledby="cta-heading">
      <span className="ghost right-[-2%] top-[8%] hidden text-ink md:block" aria-hidden="true">{c.ghost}</span>
      <div className="container-editorial relative">
        <div className="hairline pt-6">
          <FadeUp as="p" className="t-label text-clay">{c.eyebrow}</FadeUp>
          <TextReveal as="h2" id="cta-heading" className="t-h2 mt-8 max-w-[18ch] text-ink">
            {c.heading}
          </TextReveal>
          <div className="mt-10 grid gap-8 lg:grid-cols-12 lg:items-end">
            <FadeUp as="p" className="font-display text-[clamp(26px,3vw,44px)] italic leading-[1.05] text-cocoa lg:col-span-8">{c.lead}</FadeUp>
            <FadeUp delay={0.1} className="lg:col-span-4 lg:justify-self-end">
              <Button href="/book" variant="ink" size="lg" className="w-full lg:w-auto">{c.button}</Button>
            </FadeUp>
          </div>
        </div>
      </div>
    </section>
  );
}
