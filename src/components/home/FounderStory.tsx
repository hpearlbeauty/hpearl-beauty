import { founder } from "@/content/studio";
import { home } from "@/content/home";
import { testimonials } from "@/content/testimonials";
import { Reveal } from "@/components/ui/Reveal";
import { Placeholder } from "@/components/ui/Placeholder";

/**
 * Espresso band beneath the service cards (Figma). The mockup's quote and
 * "2,000+ clients / 5★ / 2+ years" metrics are unverified (brief §11–12), so the band
 * carries the founder's interim copy and a labelled reviews placeholder instead.
 */
export function FounderStory() {
  return (
    <Reveal as="aside" className="mt-8 grid gap-8 rounded-frame bg-espresso px-7 py-10 text-ivory lg:mt-10 lg:grid-cols-12 lg:items-center lg:gap-12 lg:px-10 lg:py-12" aria-labelledby="founder-heading">
      <div className="lg:col-span-7">
        <p className="t-label text-champagne">{founder.name} · {founder.role}</p>
        <h3 id="founder-heading" className="t-h3 mt-4 text-ivory">{home.founder.heading}</h3>
        <p className="t-lead mt-4 max-w-[52ch] text-ivory/80">{founder.bio ?? founder.interimCopy}</p>
      </div>
      <div className="lg:col-span-5">
        {testimonials.length === 0 ? (
          <Placeholder tone="dark" label="Verified client reviews pending">
            Reviews, ratings and client counts appear here once hpearl_beauty supplies verified material.
          </Placeholder>
        ) : (
          <ul className="space-y-4">
            {testimonials.slice(0, 2).map((t) => (
              <li key={t.id} className="t-body text-ivory/85">“{t.quote}” <span className="t-small text-champagne">— {t.author}</span></li>
            ))}
          </ul>
        )}
      </div>
    </Reveal>
  );
}
