import { services } from "@/content/services";
import { home } from "@/content/home";
import { Reveal, RevealScope } from "@/components/ui/Reveal";
import { ServiceCard } from "./ServiceCard";
import { FounderStory } from "./FounderStory";

export function ServicesGrid() {
  return (
    <RevealScope>
      <section className="bg-bone section-y" aria-labelledby="services-heading">
        <div className="container-editorial">
          <Reveal as="header">
            <h2 id="services-heading" className="t-h2 text-ink">{home.services.title}</h2>
          </Reveal>
          <ul className="mt-10 grid gap-5 md:grid-cols-2 lg:mt-12 lg:grid-cols-3 lg:gap-6" role="list">
            {services.map((s, i) => (
              <li key={s.id} className="md:last:col-span-2 lg:last:col-span-1">
                <ServiceCard service={s} index={i} />
              </li>
            ))}
          </ul>
          <FounderStory />
        </div>
      </section>
    </RevealScope>
  );
}
