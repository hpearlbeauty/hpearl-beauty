import type { Service } from "@/content/types";
import { servicesPage } from "@/content/servicesPage";
import { formatNGN } from "@/lib/format";

/** Full-width stacked pricing card (Figma /services): title + price, label, description, meta line. */
export function ServicePricingRow({ service, index }: { service: Service; index: number }) {
  const label = service.label ?? servicesPage.cardLabels[service.id];
  const tbd = service.priceNGN === null;
  return (
    <article
      id={service.id}
      data-reveal=""
      style={{ "--reveal-delay": `${index * 60}ms` } as React.CSSProperties}
      className="scroll-mt-28 rounded-card border border-border bg-bone px-6 py-7 lg:px-7 lg:py-8"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-8">
        <h2 className="t-h3 text-ink">{service.name}</h2>
        <p className={`t-lead shrink-0 font-semibold ${tbd ? "text-taupe" : "text-clay"}`}>
          {formatNGN(service.priceNGN)}
          {tbd && <span className="sr-only"> (price to be confirmed by the studio)</span>}
        </p>
      </div>
      {label && <p className="t-label mt-3 text-clay">{label}</p>}
      <p className="t-lead mt-4 max-w-[70ch] text-taupe">{service.description}</p>
      <p className="t-small mt-5 text-ink">
        <strong className="font-semibold">Duration:</strong> {service.durationLabel}
        <span aria-hidden="true" className="mx-2 text-taupe">•</span>
        <strong className="font-semibold">Who it&apos;s for:</strong> {service.audience}
      </p>
    </article>
  );
}
