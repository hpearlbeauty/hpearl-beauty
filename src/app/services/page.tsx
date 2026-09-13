import type { Metadata } from "next";
import Image from "next/image";
import { seo } from "@/content/seo";
import { servicesPage } from "@/content/servicesPage";
import { SiteShell } from "@/components/layout/SiteShell";
import { StickyBookBar } from "@/components/layout/StickyBookBar";
import { ServicePricingRow } from "@/components/services/ServicePricingRow";
import { Button } from "@/components/ui/Button";
import { Placeholder } from "@/components/ui/Placeholder";
import { TextReveal } from "@/components/motion/TextReveal";
import { FadeUp } from "@/components/motion/FadeUp";
import { Parallax } from "@/components/motion/Parallax";
import { JsonLd } from "@/lib/seo/JsonLdScript";
import { formatNGN } from "@/lib/format";
import { servicesJsonLd } from "@/lib/seo/jsonld";
import { getSiteContent } from "@/lib/content/resolve";

export const metadata: Metadata = {
  title: { absolute: seo.services.title },
  description: seo.services.description,
  alternates: { canonical: "/services" },
};

export default async function ServicesPage() {
  const { services, touchUpNGN } = await getSiteContent();
  return (
    <SiteShell>
      <JsonLd data={servicesJsonLd()} />
      <section className="relative overflow-hidden bg-ivory pb-8 pt-16 lg:pt-24" aria-labelledby="services-title">
        <span className="ghost right-[-6%] top-[-4%] hidden text-ink lg:block" aria-hidden="true">Finish</span>
        <div className="container-editorial relative">
          <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-8">
              <p className="anim-rise t-label text-clay" style={{ "--i": 0 } as React.CSSProperties}>{servicesPage.eyebrow}</p>
              <TextReveal as="h1" id="services-title" immediate delay={200} className="t-hero mt-8 max-w-[16ch] text-ink">
                {servicesPage.title}
              </TextReveal>
              <p className="anim-rise t-lead mt-8 max-w-[62ch] text-taupe" style={{ "--i": 4 } as React.CSSProperties}>{servicesPage.intro}</p>
            </div>
            <div className="lg:col-span-3 lg:col-start-10">
              <Parallax amount={6} className="anim-media aspect-[3/4] rounded-frame bg-sand">
                <Image src={servicesPage.heroImage.src} alt={servicesPage.heroImage.alt} fill priority sizes="(min-width: 1024px) 25vw, 100vw" className="object-cover" />
              </Parallax>
            </div>
          </div>
          <div id="hero-end" aria-hidden="true" />

          <div className="mt-16 lg:mt-24">
            {services.map((s, i) => <ServicePricingRow key={s.id} service={s} index={i} />)}
            <div className="border-t border-border pt-8">
              {touchUpNGN === null ? (
                <Placeholder label="Touch-up session pricing pending" className="max-w-[560px]">Additional services are listed here once confirmed by hpearl_beauty.</Placeholder>
              ) : (
                <p className="t-body text-ink"><span className="text-taupe">Touch-up session</span> <span className="ml-3 font-medium">{formatNGN(touchUpNGN)}</span></p>
              )}
            </div>
          </div>

          <FadeUp className="mt-12 pb-8">
            <Button href="/book" variant="ink" size="lg" className="w-full sm:w-auto">{servicesPage.cta}</Button>
          </FadeUp>
        </div>
      </section>

      <section className="bg-bone section-y" aria-label="Brow procedure education">
        <div className="container-editorial">
          <div className="grid gap-14 lg:grid-cols-12 lg:gap-x-10 lg:gap-y-20">
            {servicesPage.education.map((block, i) => (
              <FadeUp key={block.id} as="article" delay={i * 0.06} className={`border-t border-border pt-6 ${i === 0 ? "lg:col-span-7" : i === 1 ? "lg:col-span-5" : "lg:col-span-7"}`}>
                <span className="t-index text-clay">0{i + 1}</span>
                <h2 className="t-h3 mt-3 text-ink">{block.heading}</h2>
                <div className="mt-6 space-y-4">
                  {block.body.map((p) => <p key={p} className="t-body max-w-[60ch] text-taupe">{p}</p>)}
                </div>
              </FadeUp>
            ))}
            <FadeUp className="lg:col-span-5 lg:col-start-8">
              <Parallax amount={5} className="aspect-[4/5] rounded-frame bg-sand">
                <Image src={servicesPage.educationImages[0].src} alt={servicesPage.educationImages[0].alt} fill sizes="(min-width: 1024px) 40vw, 100vw" className="object-cover" />
              </Parallax>
            </FadeUp>
          </div>
        </div>
      </section>
      <StickyBookBar label="Start screening" />
    </SiteShell>
  );
}
