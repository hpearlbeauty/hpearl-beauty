import Image from "next/image";
import { home } from "@/content/home";
import { Button, ArrowRight } from "@/components/ui/Button";
import { TextReveal } from "@/components/motion/TextReveal";
import { Parallax } from "@/components/motion/Parallax";
import { HeroMedia } from "./HeroMedia";

/**
 * Ink editorial hero. Oversized Cormorant headline with an italic accent word,
 * side label, ghosted word, and a portrait that drops below the hero's edge into
 * the ivory section (lg+). Load sequence: header fade → label → lines → copy/CTA.
 */
export function HeroEditorial() {
  const { hero } = home;
  return (
    <section className="grain relative overflow-hidden bg-ink text-ivory" aria-labelledby="hero-heading">
      <span className="ghost right-[-3%] top-[26%] hidden md:block lg:top-[22%]" aria-hidden="true">{hero.ghost}</span>

      <div className="container-editorial relative grid gap-8 pb-12 pt-[92px] md:gap-10 md:pb-16 lg:grid-cols-12 lg:gap-8 lg:pb-0 lg:pt-[120px]">
        {/* Side label (desktop) */}
        <div className="pointer-events-none absolute left-[calc(var(--gutter)_-_40px)] top-[136px] hidden xl:block">
          <p className="side-label t-label text-ivory/45">{hero.sideLabel}</p>
        </div>

        {/* Copy */}
        <div className="order-2 lg:order-1 lg:col-span-7 lg:pb-24 lg:pr-8 xl:col-span-7">
          <p className="anim-rise t-label text-champagne" style={{ "--i": 0 } as React.CSSProperties}>{hero.eyebrow}</p>
          <TextReveal as="h1" id="hero-heading" immediate delay={260} stagger={0.09} className="t-hero mt-8 text-ivory">
            {hero.headlineLead} <em className="font-normal text-champagne">{hero.headlineAccent}</em> {hero.headlineTail}
          </TextReveal>
          <p className="anim-rise t-lead mt-8 max-w-[42ch] text-ivory/75 md:mt-10" style={{ "--i": 5 } as React.CSSProperties}>
            {hero.subcopy}
          </p>
          <div className="anim-rise mt-7 flex items-center gap-4 md:mt-9 md:gap-7" style={{ "--i": 6 } as React.CSSProperties}>
            <Button href="/book" variant="champagne" size="lg" className="flex-1 whitespace-nowrap md:flex-none">
              <span className="md:hidden">{hero.primaryCtaShort}</span>
              <span className="hidden md:inline">{hero.primaryCta}</span>
            </Button>
            <Button href="#transformations" variant="link-light" className="t-small shrink-0 font-medium tracking-wide">
              <span className="md:hidden">{hero.secondaryCtaShort}</span>
              <span className="hidden md:inline">{hero.secondaryCta}</span> <ArrowRight />
            </Button>
          </div>
        </div>

        {/* Portrait */}
        <div className="order-1 lg:order-2 lg:col-span-5 lg:col-start-8 lg:self-end">
          <Parallax amount={6} className="anim-media relative z-10 aspect-[4/5] overflow-hidden rounded-frame bg-espresso md:aspect-[16/10] lg:-mb-28 lg:aspect-[4/5]">
            {hero.video ? (
              <HeroMedia src={hero.video.src} poster={hero.video.poster} alt={hero.image.alt} />
            ) : (
              <Image src={hero.image.src} alt={hero.image.alt} fill priority sizes="(min-width: 1024px) 40vw, 100vw" className="object-cover object-[50%_20%]" />
            )}
          </Parallax>
        </div>
      </div>

      <div id="hero-end" aria-hidden="true" className="h-px w-full" />
    </section>
  );
}
