import type { Metadata } from "next";
import { seo } from "@/content/seo";
import { services, additionalPricing } from "@/content/services";
import { servicesPage } from "@/content/servicesPage";
import { SiteShell } from "@/components/layout/SiteShell";
import { StickyBookBar } from "@/components/layout/StickyBookBar";
import { ServicePricingRow } from "@/components/services/ServicePricingRow";
import { Button } from "@/components/ui/Button";
import { Placeholder } from "@/components/ui/Placeholder";
import { Reveal, RevealScope } from "@/components/ui/Reveal";
import { JsonLd } from "@/lib/seo/JsonLdScript";
import { servicesJsonLd } from "@/lib/seo/jsonld";

export const metadata: Metadata = {
  title: { absolute: seo.services.title },
  description: seo.services.description,
  alternates: { canonical: "/services" },
};

export default function ServicesPage() {
  return (
    <SiteShell>
      <JsonLd data={servicesJsonLd()} />
      <RevealScope>
        <section className="bg-ivory pb-16 pt-14 lg:pb-24 lg:pt-20" aria-labelledby="services-title">
          <div className="container-editorial max-w-[1120px]">
            <header className="anim-eyebrow max-w-[820px]">
              <p className="t-label text-clay">{servicesPage.eyebrow}</p>
              <h1 id="services-title" className="t-h2 mt-6 text-ink lg:text-[48px] lg:leading-[1.1]">{servicesPage.title}</h1>
              <p className="t-lead mt-6 max-w-[72ch] text-taupe">{servicesPage.intro}</p>
            </header>
            <div id="hero-end" aria-hidden="true" />

            <div className="mt-10 space-y-6 lg:mt-12">
              {services.map((s, i) => (
                <ServicePricingRow key={s.id} service={s} index={i} />
              ))}
              {additionalPricing.touchUpNGN === null && (
                <Placeholder label="Touch-up session pricing pending" className="bg-bone">
                  Additional services are listed here once confirmed by hpearl_beauty.
                </Placeholder>
              )}
            </div>

            <Reveal className="mt-10">
              <Button href="/book" variant="ink" size="lg" className="w-full sm:w-auto">{servicesPage.cta}</Button>
            </Reveal>
          </div>
        </section>

        <section className="bg-bone section-y" aria-label="Brow procedure education">
          <div className="container-editorial max-w-[1120px]">
            <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
              {servicesPage.education.map((block, i) => (
                <Reveal key={block.id} as="article" delay={i * 60} className={`${i === 0 ? "lg:col-span-7" : "lg:col-span-5"} ${i === 2 ? "lg:col-span-7" : ""}`}>
                  <h2 className="t-h3 text-ink">{block.heading}</h2>
                  <div className="mt-5 space-y-4">
                    {block.body.map((p) => (
                      <p key={p} className="t-body max-w-[62ch] text-taupe">{p}</p>
                    ))}
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      </RevealScope>
      <StickyBookBar label="Start screening" />
    </SiteShell>
  );
}
