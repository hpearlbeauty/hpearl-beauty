import Image from "next/image";
import { home } from "@/content/home";
import { Button, ArrowRight } from "@/components/ui/Button";
import { HeroMedia } from "./HeroMedia";

/**
 * Split editorial hero on the ink field — copy left, framed portrait right (Figma desktop).
 * Mobile: portrait first, then copy (Figma mobile). Load sequence per handoff §6.
 */
export function HeroEditorial() {
  const { hero } = home;
  return (
    <section className="bg-ink text-ivory" aria-labelledby="hero-heading">
      <div className="container-editorial grid gap-8 pb-14 pt-[calc(68px+20px)] lg:grid-cols-12 lg:items-center lg:gap-12 lg:pb-8 lg:pt-[calc(80px+24px)]">
        <div className="order-1 lg:order-2 lg:col-span-6 xl:col-span-6 xl:col-start-7">
          <div className="anim-media relative aspect-[346/330] overflow-hidden rounded-frame bg-espresso md:aspect-[4/3] lg:aspect-[505/460]">
            {hero.video ? (
              <HeroMedia src={hero.video.src} poster={hero.video.poster} alt={hero.image.alt} />
            ) : (
              <Image
                src={hero.image.src}
                alt={hero.image.alt}
                fill
                priority
                sizes="(min-width: 1024px) 45vw, 100vw"
                className="object-cover object-[50%_28%]"
              />
            )}
          </div>
        </div>

        <div className="order-2 lg:order-1 lg:col-span-6 lg:pr-4 xl:col-span-5 xl:pr-6">
          <p className="anim-eyebrow t-label text-champagne">{hero.eyebrow}</p>
          <h1 id="hero-heading" className="t-hero mt-6 text-ivory">
            {hero.headlineLines.map((line, i) => (
              <span key={line} className="hero-line" style={{ "--i": i } as React.CSSProperties}>
                <span>{line}</span>
              </span>
            ))}
          </h1>
          <p className="anim-after-headline t-lead mt-7 max-w-[44ch] text-ivory/75" style={{ "--i": 0 } as React.CSSProperties}>
            {hero.subcopy}
          </p>
          <div className="anim-after-headline mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-7" style={{ "--i": 1 } as React.CSSProperties}>
            <Button href="/book" variant="champagne" size="lg" className="w-full sm:w-auto">
              {hero.primaryCta}
            </Button>
            <Button href="#transformations" variant="link-light" className="t-body font-medium">
              {hero.secondaryCta} <ArrowRight />
            </Button>
          </div>
        </div>
      </div>
      {/* Sentinel used by the header + sticky bar to detect leaving the hero */}
      <div id="hero-end" aria-hidden="true" className="h-px w-full" />
    </section>
  );
}
