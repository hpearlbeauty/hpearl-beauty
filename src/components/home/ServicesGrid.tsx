import { home } from "@/content/home";
import { RevealScope } from "@/components/ui/Reveal";
import { EditorialSectionHeader } from "@/components/ui/EditorialSectionHeader";
import { ServiceCard } from "./ServiceCard";
import { CategoryIndex } from "./CategoryIndex";

/** Three staggered columns on bone; the middle column drops for editorial asymmetry. */
import type { Service } from "@/content/types";

export function ServicesGrid({ services }: { services: Service[] }) {
  return (
    <RevealScope>
      <section className="bg-bone section-y" aria-labelledby="services-heading">
        <div className="container-editorial">
          <EditorialSectionHeader index="02" eyebrow={home.services.eyebrow} id="services-heading" title={home.services.title} supporting={home.services.supporting} />
          <div className="mt-12 lg:mt-16">
            <CategoryIndex counts={{ eyebrow: services.length }} />
          </div>
          <h3 id="eyebrow" className="t-label mt-16 scroll-mt-28 text-clay lg:mt-24">{home.services.browsTitle}</h3>
          <ul className="mt-8 grid gap-12 md:grid-cols-2 lg:grid-cols-3 lg:gap-10" role="list">
            {services.map((s, i) => (
              <li key={s.id} className={`${i === 1 ? "lg:translate-y-14" : ""} md:last:col-span-2 lg:last:col-span-1`}>
                <ServiceCard service={s} index={i} />
              </li>
            ))}
          </ul>
        </div>
      </section>
    </RevealScope>
  );
}
