import Image from "next/image";
import Link from "next/link";
import type { Service } from "@/content/types";
import { formatNGN } from "@/lib/format";
import { ArrowRight } from "@/components/ui/Button";

/** Editorial card on ivory with thin border — image, name, result, duration • skin fit, price, small CTA. */
export function ServiceCard({ service, index = 0 }: { service: Service; index?: number }) {
  const price = service.priceNGN === null ? formatNGN(null) : `From ${formatNGN(service.priceNGN)}`;
  return (
    <article
      data-reveal=""
      style={{ "--reveal-delay": `${index * 50}ms` } as React.CSSProperties}
      className="service-card flex h-full flex-col rounded-card border border-border bg-ivory p-5 lg:p-6"
    >
      <Link href={`/services#${service.id}`} className="hidden overflow-hidden rounded-[12px] md:block" tabIndex={-1} aria-hidden="true">
        <div className="relative aspect-[368/220] w-full">
          <Image src={service.image.src} alt="" fill sizes="(min-width: 1024px) 30vw, (min-width: 768px) 45vw, 100vw" className="object-cover object-[50%_30%]" />
        </div>
      </Link>
      <h3 className="t-h3 text-ink md:mt-6">{service.name}</h3>
      <p className="t-body mt-3 hidden text-taupe md:block">{service.description}</p>
      <p className="t-small mt-2 font-semibold text-clay md:mt-4">
        {service.durationLabel} <span aria-hidden="true" className="mx-1.5">•</span> {service.audienceShort}
      </p>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-t border-border pt-4 md:mt-5 md:pt-5">
        <p className={`t-body whitespace-nowrap font-semibold ${service.priceNGN === null ? "text-taupe" : "text-ink"}`}>
          {price}
          {service.priceNGN === null && <span className="sr-only"> (price to be confirmed)</span>}
        </p>
        <Link href={`/services#${service.id}`} className="t-small inline-flex items-center gap-1.5 whitespace-nowrap font-semibold text-ink underline-offset-[6px] hover:underline">
          View Details <ArrowRight className="card-arrow" />
        </Link>
      </div>
    </article>
  );
}
