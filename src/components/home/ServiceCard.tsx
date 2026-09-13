import Image from "next/image";
import Link from "next/link";
import type { Service } from "@/content/types";
import { formatNGN } from "@/lib/format";
import { ArrowRight } from "@/components/ui/Button";
import { Parallax } from "@/components/motion/Parallax";

/**
 * Editorial service column: framed image, index, serif name, result line and
 * a hairline spec list. No card fill; the rhythm comes from rules and whitespace.
 */
export function ServiceCard({ service, index = 0 }: { service: Service; index?: number }) {
  const price = service.priceNGN === null ? formatNGN(null) : `From ${formatNGN(service.priceNGN)}`;
  return (
    <article className="service-col flex h-full flex-col" data-reveal="" style={{ "--reveal-delay": `${index * 60}ms` } as React.CSSProperties}>
      <Link href={`/services#${service.id}`} tabIndex={-1} aria-hidden="true" className="frame block">
        <Parallax amount={4} scale={1.08} className="aspect-[4/3] w-full rounded-frame bg-sand md:aspect-[4/5]">
          <Image src={service.image.src} alt="" fill sizes="(min-width: 1024px) 30vw, (min-width: 768px) 45vw, 100vw" className="object-cover" />
        </Parallax>
      </Link>

      <div className="mt-7 flex items-baseline gap-4">
        <span className="t-index text-clay">0{index + 1}</span>
        <h3 className="t-h3 text-ink">{service.name}</h3>
      </div>
      <p className="t-body mt-4 max-w-[38ch] text-taupe">{service.description}</p>

      <dl className="t-small mt-6 divide-y divide-border border-y border-border">
        <div className="flex justify-between gap-4 py-3"><dt className="text-taupe">Duration</dt><dd className="font-medium text-ink">{service.durationLabel}</dd></div>
        <div className="flex justify-between gap-4 py-3"><dt className="text-taupe">Skin fit</dt><dd className="text-right font-medium text-ink">{service.audienceShort}</dd></div>
        <div className="flex justify-between gap-4 py-3">
          <dt className="text-taupe">Investment</dt>
          <dd className={`font-medium ${service.priceNGN === null ? "text-taupe" : "text-ink"}`}>{price}{service.priceNGN === null && <span className="sr-only"> (to be confirmed)</span>}</dd>
        </div>
      </dl>

      <Link href={`/services#${service.id}`} className="t-label mt-6 inline-flex items-center gap-2 text-ink">
        View Details <ArrowRight className="card-arrow" />
      </Link>
    </article>
  );
}
