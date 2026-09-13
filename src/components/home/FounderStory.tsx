import Image from "next/image";
import { founder, studio } from "@/content/studio";
import { home } from "@/content/home";
import { EditorialSectionHeader } from "@/components/ui/EditorialSectionHeader";
import { Placeholder } from "@/components/ui/Placeholder";
import { FadeUp } from "@/components/motion/FadeUp";
import { Parallax } from "@/components/motion/Parallax";

/**
 * Full-bleed espresso chapter. Portrait left, statement right, hairline spec list.
 * No unverified metrics or quotes (brief §11–12): reviews render as a labelled placeholder.
 */
import type { Testimonial } from "@/content/types";

export function FounderStory({ testimonials, bio }: { testimonials: Testimonial[]; bio: string | null }) {
  const f = home.founder;
  return (
    <section className="grain relative overflow-hidden bg-espresso text-ivory section-y" aria-labelledby="founder-heading">
      <span className="ghost right-[-2%] top-[4%] hidden md:block" aria-hidden="true">{f.ghost}</span>
      <div className="container-editorial relative">
        <EditorialSectionHeader tone="dark" index="03" eyebrow={f.eyebrow} id="founder-heading" title={f.heading} />

        <div className="mt-14 grid gap-12 lg:mt-20 lg:grid-cols-12 lg:gap-10">
          <FadeUp className="lg:col-span-5">
            <Parallax amount={7} className="aspect-[4/5] rounded-frame bg-cocoa">
              <Image src={f.image.src} alt={f.image.alt} fill sizes="(min-width: 1024px) 40vw, 100vw" className="object-cover object-[35%_30%]" />
            </Parallax>
            <p className="t-small mt-3 text-ivory/50">{f.image.caption}</p>
          </FadeUp>

          <div className="lg:col-span-6 lg:col-start-7">
            <FadeUp as="p" className="font-display text-[clamp(26px,2.6vw,36px)] leading-[1.15] text-ivory">
              {bio ?? founder.interimCopy}
            </FadeUp>
            <FadeUp delay={0.1}>
              <dl className="t-small mt-10 divide-y divide-border-dark border-y border-border-dark">
                <div className="grid grid-cols-[120px_1fr] gap-4 py-4"><dt className="t-label text-champagne">Artist</dt><dd className="text-ivory">{founder.name}, {founder.role}</dd></div>
                <div className="grid grid-cols-[120px_1fr] gap-4 py-4"><dt className="t-label text-champagne">Studio</dt><dd className="text-ivory">{studio.addressLines.join(", ")}</dd></div>
                <div className="grid grid-cols-[120px_1fr] gap-4 py-4"><dt className="t-label text-champagne">Approach</dt><dd className="text-ivory">{f.approach}</dd></div>
              </dl>
            </FadeUp>
            <FadeUp delay={0.2} className="mt-8">
              {testimonials.length === 0 ? (
                <Placeholder tone="dark" label="Verified client reviews pending">Reviews and client feedback appear here once hpearl_beauty supplies verified material.</Placeholder>
              ) : (
                <ul className="space-y-4">{testimonials.slice(0, 2).map((t) => <li key={t.id} className="t-body text-ivory/85">“{t.quote}” <span className="t-small text-champagne">{t.author}</span></li>)}</ul>
              )}
            </FadeUp>
          </div>
        </div>
      </div>
    </section>
  );
}
