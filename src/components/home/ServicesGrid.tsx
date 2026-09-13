import { services } from "@/content/services";
import { home } from "@/content/home";
import { RevealScope } from "@/components/ui/Reveal";
import { EditorialSectionHeader } from "@/components/ui/EditorialSectionHeader";
import { ServiceCard } from "./ServiceCard";

/** Three staggered columns on bone; the middle column drops for editorial asymmetry. */
export function ServicesGrid() {
  return (
    <RevealScope>
      <section className="bg-bone section-y" aria-labelledby="services-heading">
        <div className="container-editorial">
          <EditorialSectionHeader index="02" eyebrow={home.services.eyebrow} id="services-heading" title={home.services.title} supporting={home.services.supporting} />
          <ul className="mt-14 grid gap-12 md:grid-cols-2 lg:mt-20 lg:grid-cols-3 lg:gap-10" role="list">
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
