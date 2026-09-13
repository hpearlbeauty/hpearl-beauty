"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { navigation } from "@/content/studio";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/ui/Logo";

/**
 * Site header. `overlay` = transparent over the dark homepage hero, becoming
 * warm-ivory/blurred once the hero scrolls out (250ms). Otherwise solid ivory.
 */
export function SiteHeader({ overlay = false }: { overlay?: boolean }) {
  const pathname = usePathname();
  const [pastHero, setPastHero] = useState(!overlay);
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const firstLinkRef = useRef<HTMLAnchorElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!overlay) return;
    const sentinel = document.getElementById("hero-end");
    if (!sentinel) return;
    const io = new IntersectionObserver(([e]) => setPastHero(e.boundingClientRect.top < 80), { rootMargin: "-80px 0px 0px 0px", threshold: [0, 1] });
    io.observe(sentinel);
    return () => io.disconnect();
  }, [overlay]);

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    if (open) firstLinkRef.current?.focus();
    else toggleRef.current?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const dark = overlay && !pastHero;
  const surface = dark
    ? "bg-transparent text-ivory border-transparent"
    : "bg-ivory/92 text-ink border-border backdrop-blur-md supports-[backdrop-filter]:bg-ivory/85";

  return (
    <>
      <header className={`site-header anim-header fixed inset-x-0 top-0 z-40 border-b ${surface}`}>
        <div className="container-editorial flex h-[68px] items-center justify-between lg:h-[80px]">
          <Logo tone={dark ? "light" : "dark"} />

          <nav aria-label="Primary" className="hidden items-center gap-8 lg:flex">
            {navigation.primary.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`t-label transition-opacity duration-[160ms] hover:opacity-100 ${active ? "opacity-100" : "opacity-70"}`}
                >
                  {item.label}
                </Link>
              );
            })}
            <Button href={navigation.cta.href} variant="champagne" className="ml-2 h-11 px-6 t-label">
              {navigation.cta.label}
            </Button>
          </nav>

          <button
            ref={toggleRef}
            type="button"
            className="t-label flex h-11 items-center gap-3 lg:hidden"
            aria-expanded={open}
            aria-controls={menuId}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? "Close" : "Menu"}
            <svg className="menu-icon" data-open={open} width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M8 2v12M2 8h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </header>

      {/* Mobile menu · full-height espresso sheet, opacity + slight translateY */}
      <div id={menuId} className="menu-sheet fixed inset-0 z-30 bg-espresso text-ivory lg:hidden" data-open={open} aria-hidden={!open}>
        <nav aria-label="Mobile" className="container-editorial flex h-full flex-col justify-center gap-2 pt-[68px] pb-[env(safe-area-inset-bottom)]">
          {navigation.primary.map((item, i) => (
            <Link
              key={item.href}
              ref={i === 0 ? firstLinkRef : undefined}
              href={item.href}
              tabIndex={open ? 0 : -1}
              onClick={() => setOpen(false)}
              className="menu-link font-display flex items-baseline justify-between border-b border-border-dark py-5 text-[44px] leading-none"
              style={{ "--i": i } as React.CSSProperties}
            >
              {item.label}
              {"comingSoon" in item && item.comingSoon ? <span className="t-label text-champagne">Soon</span> : null}
            </Link>
          ))}
          <div className="menu-link mt-8" style={{ "--i": navigation.primary.length } as React.CSSProperties}>
            <Button href={navigation.cta.href} variant="champagne" size="lg" className="w-full" tabIndex={open ? 0 : -1} onClick={() => setOpen(false)}>
              {navigation.cta.label}
            </Button>
          </div>
        </nav>
      </div>
    </>
  );
}
