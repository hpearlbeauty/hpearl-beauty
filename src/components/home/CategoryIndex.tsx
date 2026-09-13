import { categories } from "@/content/categories";
import { whatsappLink } from "@/lib/config";
import { FadeUp } from "@/components/motion/FadeUp";
import { ArrowRight } from "@/components/ui/Button";

/**
 * Typographic category index: number, name, one-line status. Bookable categories link
 * to their service list; the rest open a WhatsApp enquiry until their menus are confirmed.
 */
export function CategoryIndex({ counts, tone = "light" }: { counts: Partial<Record<string, number>>; tone?: "light" | "dark" }) {
  const dark = tone === "dark";
  return (
    <ul className={`grid divide-y border-y md:grid-cols-2 md:divide-y-0 lg:grid-cols-4 ${dark ? "divide-border-dark border-border-dark" : "divide-border border-border"}`} role="list">
      {categories.map((c, i) => {
        const n = counts[c.id] ?? 0;
        const href = c.bookable ? "/services#eyebrow" : whatsappLink(c.enquiryMessage);
        return (
          <FadeUp as="li" key={c.id} delay={i * 0.05} className={`md:border-b lg:border-b-0 lg:border-r lg:last:border-r-0 ${dark ? "border-border-dark" : "border-border"}`}>
            <a href={href} target={c.bookable ? undefined : "_blank"} rel={c.bookable ? undefined : "noopener"} className="group flex h-full flex-col justify-between gap-6 px-1 py-6 lg:px-6 lg:py-7">
              <div>
                <span className={`t-index ${dark ? "text-champagne" : "text-clay"}`}>0{i + 1}</span>
                <h3 className={`t-h3 mt-2 ${dark ? "text-ivory" : "text-ink"}`}>{c.name}</h3>
                <p className={`t-small mt-2 ${dark ? "text-ivory/60" : "text-taupe"}`}>{c.bookable ? `${n} treatment${n === 1 ? "" : "s"} · book online` : c.tagline}</p>
              </div>
              <span className={`t-label inline-flex items-center gap-2 ${dark ? "text-ivory" : "text-ink"}`}>
                {c.bookable ? "View treatments" : "Enquire on WhatsApp"} <ArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
              </span>
            </a>
          </FadeUp>
        );
      })}
    </ul>
  );
}
