import { home } from "@/content/home";
import { Button } from "@/components/ui/Button";
import { Reveal, RevealScope } from "@/components/ui/Reveal";

/** High-contrast editorial close before the footer (handoff §3). */
export function BookingCTA() {
  return (
    <RevealScope>
      <section className="bg-ivory section-y" aria-labelledby="cta-heading">
        <div className="container-editorial">
          <Reveal className="grid gap-8 border-t border-border pt-12 lg:grid-cols-12 lg:items-end lg:pt-16">
            <div className="lg:col-span-8">
              <h2 id="cta-heading" className="t-h2 text-ink">{home.cta.heading}</h2>
              <p className="font-display mt-5 text-[clamp(22px,2.4vw,32px)] italic leading-tight text-cocoa">{home.cta.lead}</p>
            </div>
            <div className="lg:col-span-4 lg:justify-self-end">
              <Button href="/book" variant="ink" size="lg" className="w-full lg:w-auto">{home.cta.button}</Button>
            </div>
          </Reveal>
        </div>
      </section>
    </RevealScope>
  );
}
