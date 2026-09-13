import type { Metadata } from "next";
import { seo } from "@/content/seo";
import { academy } from "@/content/academy";
import { founder } from "@/content/studio";
import { SiteShell } from "@/components/layout/SiteShell";
import { Button } from "@/components/ui/Button";
import { Placeholder } from "@/components/ui/Placeholder";
import { AcademyCurriculum } from "@/components/academy/AcademyCurriculum";
import { JsonLd } from "@/lib/seo/JsonLdScript";
import { academyCourseJsonLd } from "@/lib/seo/jsonld";
import { formatNGN } from "@/lib/format";

export const metadata: Metadata = {
  title: { absolute: seo.academy.title },
  description: seo.academy.description,
  alternates: { canonical: "/academy" },
};

/**
 * STRUCTURAL SHELL ONLY — visual treatment is finalised once academy-desktop.png is supplied.
 * Content architecture per brief §10; headings per brief §14.
 */
export default function AcademyPage() {
  const [h1, h2, h3] = seo.academy.supportingHeadings;
  return (
    <SiteShell>
      <JsonLd data={academyCourseJsonLd()} />
      {/* Light editorial hero (handoff §4) */}
      <section className="bg-ivory pb-16 pt-14 lg:pb-24 lg:pt-20" aria-labelledby="academy-title">
        <div className="container-editorial max-w-[900px]">
          <p className="t-label text-clay">{academy.eyebrow}</p>
          <h1 id="academy-title" className="t-hero mt-6 text-ink">{academy.headline}</h1>
          <p className="t-lead mt-6 max-w-[60ch] text-taupe">{academy.subcopy}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-5">
            <Button href="#reserve" variant="ink" size="lg">{academy.cta}</Button>
            <span className="t-small text-taupe">{academy.ctaNote}</span>
          </div>
        </div>
      </section>

      <section className="bg-bone section-y" aria-labelledby="academy-learn">
        <div className="container-editorial max-w-[900px]">
          <h2 id="academy-learn" className="t-h2 text-ink">{h1}</h2>
          <p className="t-body mt-5 max-w-[60ch] text-taupe">{founder.bio ?? founder.interimCopy}</p>
          <h3 className="t-h3 mt-14 text-ink">{h2}</h3>
          <AcademyCurriculum days={academy.curriculum} />
        </div>
      </section>

      <section className="bg-ivory section-y" aria-labelledby="academy-kit">
        <div className="container-editorial max-w-[900px]">
          <h2 id="academy-kit" className="t-h2 text-ink">{h3}</h2>
          <p className="t-body mt-5 max-w-[60ch] text-taupe">Your student kit may include: {academy.kitItemsConcept.join(", ")}.</p>
          {academy.kitItemsConfirmed === null && (
            <Placeholder label="Final kit contents pending" className="mt-5 max-w-[60ch]">Confirmed list to be supplied by hpearl_beauty.</Placeholder>
          )}
        </div>
      </section>

      <section id="reserve" className="bg-espresso section-y text-ivory" aria-labelledby="academy-reserve">
        <div className="container-editorial max-w-[900px]">
          <h2 id="academy-reserve" className="t-h2 text-ivory">{academy.cta}</h2>
          <dl className="t-body mt-6 grid gap-2 text-ivory/80 sm:grid-cols-2">
            <div><dt className="t-label text-champagne">Full tuition</dt><dd className="mt-1">{formatNGN(academy.tuitionNGN, { tbdLabel: "TBD" })}</dd></div>
            <div><dt className="t-label text-champagne">Required deposit</dt><dd className="mt-1">{formatNGN(academy.depositNGN, { tbdLabel: "TBD" })}</dd></div>
          </dl>
          <Placeholder tone="dark" label="Academy pricing and seat reservation pending" className="mt-6 max-w-[60ch]">
            Seat reservation opens once tuition and deposit are confirmed.
          </Placeholder>
        </div>
      </section>
    </SiteShell>
  );
}
