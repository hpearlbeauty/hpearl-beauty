import Image from "next/image";
import type { Service } from "@/content/types";
import { servicesPage } from "@/content/servicesPage";
import { formatNGN } from "@/lib/format";
import { FadeUp } from "@/components/motion/FadeUp";

/** Hairline pricing row: index, serif name, label, description, spec list, image on the right (lg). */
export function ServicePricingRow({ service, index }: { service: Service; index: number }) {
  const label = service.label ?? servicesPage.cardLabels[service.id];
  const tbd = service.priceNGN === null;
  return (
    <FadeUp as="article" className="grid gap-8 border-t border-border py-12 lg:grid-cols-12 lg:gap-10 lg:py-16">
      <div className="lg:col-span-7">
        <div className="flex items-baseline gap-5">
          <span className="t-index text-clay">0{index + 1}</span>
          <h2 id={service.id} className="t-h2 scroll-mt-28 text-ink">{service.name}</h2>
        </div>
        {label && <p className="t-label mt-4 text-clay">{label}</p>}
        <p className="t-lead mt-6 max-w-[58ch] text-taupe">{service.description}</p>
        <dl className="t-small mt-8 max-w-[560px] divide-y divide-border border-y border-border">
          <div className="grid grid-cols-[130px_1fr] gap-4 py-3"><dt className="text-taupe">Duration</dt><dd className="font-medium text-ink">{service.durationLabel}</dd></div>
          <div className="grid grid-cols-[130px_1fr] gap-4 py-3"><dt className="text-taupe">Who it&apos;s for</dt><dd className="font-medium text-ink">{service.audience}</dd></div>
          <div className="grid grid-cols-[130px_1fr] gap-4 py-3">
            <dt className="text-taupe">Investment</dt>
            <dd className={`font-medium ${tbd ? "text-taupe" : "text-ink"}`}>{formatNGN(service.priceNGN)}{tbd && <span className="sr-only"> (price to be confirmed by the studio)</span>}</dd>
          </div>
        </dl>
      </div>
      <div className="lg:col-span-4 lg:col-start-9">
        <div className="relative aspect-[4/5] overflow-hidden rounded-frame bg-sand">
          <Image src={service.image.src} alt={service.image.alt} fill sizes="(min-width: 1024px) 30vw, 100vw" className="object-cover object-[50%_22%]" />
        </div>
      </div>
    </FadeUp>
  );
}
