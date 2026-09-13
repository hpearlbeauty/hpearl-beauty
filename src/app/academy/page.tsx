import type { Metadata } from "next";
import Image from "next/image";
import { seo } from "@/content/seo";
import { academy } from "@/content/academy";
import { founder } from "@/content/studio";
import { SiteShell } from "@/components/layout/SiteShell";
import { Button } from "@/components/ui/Button";
import { Placeholder } from "@/components/ui/Placeholder";
import { EditorialSectionHeader } from "@/components/ui/EditorialSectionHeader";
import { TextReveal } from "@/components/motion/TextReveal";
import { FadeUp } from "@/components/motion/FadeUp";
import { Parallax } from "@/components/motion/Parallax";
import { AcademyCurriculum } from "@/components/academy/AcademyCurriculum";
import { JsonLd } from "@/lib/seo/JsonLdScript";
import { academyCourseJsonLd } from "@/lib/seo/jsonld";
import { formatNGN } from "@/lib/format";
import { getSiteContent } from "@/lib/content/resolve";

export const metadata: Metadata = {
  title: { absolute: seo.academy.title },
  description: seo.academy.description,
  alternates: { canonical: "/academy" },
};

/**
 * STRUCTURAL SHELL. Final visual treatment lands once academy-desktop.png is supplied.
 * Content architecture per brief §10; headings per brief §14.
 */
export default async function AcademyPage() {
  const [h1, h2, h3] = seo.academy.supportingHeadings;
  const content = await getSiteContent();
  const a = content.academy;
  return (
    <SiteShell>
      <JsonLd data={academyCourseJsonLd()} />
      <section className="relative overflow-hidden bg-ivory pb-16 pt-16 lg:pb-24 lg:pt-24" aria-labelledby="academy-title">
        <span className="ghost right-[-4%] top-[-2%] hidden text-ink lg:block" aria-hidden="true">Academy</span>
        <div className="container-editorial relative grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <p className="anim-rise t-label text-clay" style={{ "--i": 0 } as React.CSSProperties}>{academy.eyebrow}</p>
            <TextReveal as="h1" id="academy-title" immediate delay={200} className="t-hero mt-8 text-ink">{a.headline}</TextReveal>
            <p className="anim-rise t-lead mt-8 max-w-[58ch] text-taupe" style={{ "--i": 4 } as React.CSSProperties}>{academy.subcopy}</p>
            <div className="anim-rise mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6" style={{ "--i": 5 } as React.CSSProperties}>
              <Button href="#reserve" variant="ink" size="lg">{academy.cta}</Button>
              <span className="t-small text-taupe">{academy.ctaNote}</span>
            </div>
          </div>
          <div className="lg:col-span-4 lg:self-end">
            <Parallax amount={6} className="anim-media aspect-[4/5] rounded-frame bg-sand">
              <Image src={academy.heroImage.src} alt={academy.heroImage.alt} fill priority sizes="(min-width: 1024px) 32vw, 100vw" className="object-cover" />
            </Parallax>
          </div>
        </div>
      </section>

      <section className="bg-bone section-y" aria-labelledby="academy-learn">
        <div className="container-editorial">
          <EditorialSectionHeader index="01" eyebrow="The programme" id="academy-learn" title={h1} supporting={content.founderBio ?? founder.interimCopy} />
          <div className="mt-14 grid gap-10 lg:grid-cols-12">
            <h3 className="t-h3 text-ink lg:col-span-4">{h2}</h3>
            <div className="lg:col-span-8"><AcademyCurriculum days={academy.curriculum} /></div>
          </div>
        </div>
      </section>

      <section className="bg-ivory section-y" aria-labelledby="academy-kit">
        <div className="container-editorial">
          <EditorialSectionHeader index="02" eyebrow="Student kit" id="academy-kit" title={h3} />
          <div className="mt-12 grid gap-10 lg:grid-cols-12">
            <FadeUp className="lg:col-span-7">
              <Parallax amount={5} className="aspect-[16/10] rounded-frame bg-sand">
                <Image src={academy.kitImage.src} alt={academy.kitImage.alt} fill sizes="(min-width: 1024px) 55vw, 100vw" className="object-cover" />
              </Parallax>
              <p className="t-small mt-3 text-taupe">{academy.kitImage.caption}</p>
            </FadeUp>
            <FadeUp delay={0.1} className="lg:col-span-4 lg:col-start-9">
              <p className="t-lead text-ink">{a.kitItems ? "Your student kit includes:" : "Your student kit may include:"}</p>
              <ul className="t-body mt-5 divide-y divide-border border-y border-border text-ink">
                {(a.kitItems ?? academy.kitItemsConcept).map((k) => <li key={k} className="py-3">{k}</li>)}
              </ul>
              {a.kitItems === null && <Placeholder label="Final kit contents pending" className="mt-6">Confirmed list to be supplied by hpearl_beauty.</Placeholder>}
            </FadeUp>
          </div>
        </div>
      </section>

      <section id="reserve" className="grain bg-espresso section-y text-ivory" aria-labelledby="academy-reserve">
        <div className="container-editorial">
          <EditorialSectionHeader tone="dark" index="03" eyebrow="Reserve" id="academy-reserve" title={academy.cta} />
          <dl className="t-body mt-10 grid gap-2 border-y border-border-dark py-6 text-ivory/80 sm:grid-cols-2">
            <div><dt className="t-label text-champagne">Full tuition</dt><dd className="mt-2 font-display text-3xl">{formatNGN(a.tuitionNGN, { tbdLabel: "TBD" })}</dd></div>
            <div><dt className="t-label text-champagne">Required deposit</dt><dd className="mt-2 font-display text-3xl">{formatNGN(a.depositNGN, { tbdLabel: "TBD" })}</dd></div>
          </dl>
          {(a.tuitionNGN === null || a.depositNGN === null) && <Placeholder tone="dark" label="Academy pricing and seat reservation pending" className="mt-6 max-w-[60ch]">Seat reservation opens once tuition and deposit are confirmed.</Placeholder>}
        </div>
      </section>
    </SiteShell>
  );
}
