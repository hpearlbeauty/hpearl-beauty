"use client";
import Image from "next/image";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import type { TransformationPair } from "@/content/types";
import { useMediaQuery } from "@/lib/motion/useMediaQuery";

/**
 * Before/after comparison.
 *  - md+ : editorial diptych (Figma) · two framed panels; dragging the divider expands one
 *          panel over the other 1:1 (each image stays anchored to its outer edge).
 *  - <md : single 4:3 frame; the before layer is clipped by the divider (classic reveal).
 * Pointer drag has no easing while down; on release the divider settles to centre in 180ms
 * only if within snap range. Keyboard: arrows (±2%, shift ±10%), Home/End. Tap toggles.
 * `before === null` renders a labelled placeholder · never a mismatched image.
 */
export function BeforeAfterSlider({ pair, priority = false, className = "" }: { pair: TransformationPair; priority?: boolean; className?: string }) {
  const diptych = useMediaQuery("(min-width: 768px)");
  const left = pair.before ?? pair.process ?? null;
  const leftLabel = pair.before ? "Before" : pair.process ? "Mapping" : "Before";
  const rightLabel = pair.before ? "After" : "Result";
  const [pos, setPos] = useState(50);
  const [settling, setSettling] = useState(false);
  const dragging = useRef(false);
  const moved = useRef(false);
  const frame = useRef<HTMLDivElement>(null);
  const descId = useId();

  const setFromClientX = useCallback((clientX: number) => {
    const el = frame.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setPos(Math.min(100, Math.max(0, ((clientX - r.left) / r.width) * 100)));
  }, []);

  const onPointerDown = (e: React.PointerEvent) => {
    dragging.current = true;
    moved.current = false;
    setSettling(false);
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    setFromClientX(e.clientX);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging.current) return;
    moved.current = true;
    setFromClientX(e.clientX);
  };
  const onPointerUp = () => {
    if (!dragging.current) return;
    dragging.current = false;
    setSettling(true);
    setPos((p) => {
      if (!moved.current) return p > 50 ? 22 : 78; // tap-toggle between the two sides
      return Math.abs(p - 50) < 4 ? 50 : p;
    });
  };
  useEffect(() => {
    if (!settling) return;
    const t = setTimeout(() => setSettling(false), 200);
    return () => clearTimeout(t);
  }, [settling]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    const step = e.shiftKey ? 10 : 2;
    const map: Record<string, () => void> = {
      ArrowLeft: () => setPos((p) => Math.max(0, p - step)),
      ArrowRight: () => setPos((p) => Math.min(100, p + step)),
      Home: () => setPos(0),
      End: () => setPos(100),
    };
    if (map[e.key]) { e.preventDefault(); setSettling(true); map[e.key](); }
  };

  const settle = settling ? "left 180ms var(--ease-micro), width 180ms var(--ease-micro), right 180ms var(--ease-micro), clip-path 180ms var(--ease-micro)" : "none";
  const gap = diptych ? 10 : 0; // px divider between panels (Figma gap)

  return (
    <div
      ref={frame}
      className={`relative aspect-[4/3] w-full touch-pan-y select-none md:aspect-[960/330] ${className}`}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      style={{ cursor: "ew-resize" }}
    >
      {diptych ? (
        <>
          <Panel side="before" width={`calc(${pos}% - ${gap / 2}px)`} img={left} priority={priority} transition={settle} />
          <Panel side="after" width={`calc(${100 - pos}% - ${gap / 2}px)`} img={pair.after} priority={priority} transition={settle} />
        </>
      ) : (
        <div className="absolute inset-0 overflow-hidden rounded-frame bg-sand">
          {pair.after ? (
            <Image src={pair.after.src} alt={pair.after.alt} fill priority={priority} sizes="100vw" className="object-cover object-[50%_25%]" draggable={false} />
          ) : (
            <PlaceholderPanel label="After photo: verified image pending" />
          )}
          {left ? (
            <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)`, transition: settle }} aria-hidden="true">
              <Image src={left.src} alt="" fill sizes="100vw" className="object-cover object-[50%_25%]" draggable={false} />
            </div>
          ) : (
            <div className="absolute inset-y-0 left-0 overflow-hidden" style={{ width: `${pos}%`, transition: settle }} aria-hidden="true">
              <PlaceholderPanel label="Before photo: verified matching pair pending" />
            </div>
          )}
        </div>
      )}

      <span className="t-label absolute left-4 top-4 rounded-[6px] bg-ink/70 px-2.5 py-1.5 text-ivory backdrop-blur-sm">{leftLabel}</span>
      <span className="t-label absolute right-4 top-4 rounded-[6px] bg-ink/70 px-2.5 py-1.5 text-ivory backdrop-blur-sm">{rightLabel}</span>

      {!diptych && <div className="absolute inset-y-0 w-px bg-ivory/90" style={{ left: `${pos}%`, transition: settle }} aria-hidden="true" />}

      <button
        type="button"
        role="slider"
        aria-label="Compare before and after"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(pos)}
        aria-valuetext={`${Math.round(pos)}% ${leftLabel.toLowerCase()}`}
        aria-describedby={descId}
        onKeyDown={onKeyDown}
        className="absolute top-1/2 grid size-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-ivory/80 bg-ink/80 text-ivory backdrop-blur-sm transition-transform duration-[160ms] ease-micro hover:scale-105 focus-visible:scale-105"
        style={{ left: `${pos}%`, transition: settling ? "left 180ms var(--ease-micro), transform 160ms var(--ease-micro)" : "transform 160ms var(--ease-micro)" }}
      >
        <svg width="18" height="12" viewBox="0 0 18 12" fill="none" aria-hidden="true">
          <path d="M5 1 1 6l4 5M13 1l4 5-4 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <span id={descId} className="sr-only">Drag or use arrow keys to reveal more of the before or after photo.</span>
    </div>
  );
}

function Panel({ side, width, img, priority, transition }: { side: "before" | "after"; width: string; img: TransformationPair["after"]; priority: boolean; transition: string }) {
  const anchor = side === "before" ? "left-0" : "right-0";
  const objectPos = side === "before" ? "object-[30%_25%]" : "object-[70%_20%]";
  return (
    <div className={`absolute inset-y-0 ${anchor} overflow-hidden rounded-frame bg-sand`} style={{ width, transition }} aria-hidden={side === "before"}>
      {img ? (
        <Image src={img.src} alt={side === "after" ? img.alt : ""} fill priority={priority} sizes="(min-width: 1024px) 45vw, 50vw" className={`object-cover ${objectPos}`} draggable={false} />
      ) : (
        <PlaceholderPanel label={side === "before" ? "Before photo: verified matching pair pending" : "After photo: verified image pending"} />
      )}
    </div>
  );
}

function PlaceholderPanel({ label }: { label: string }) {
  return (
    <div className="absolute inset-0 grid place-items-center bg-sand px-6 pt-8 text-center">
      <div className="max-w-[26ch]">
        <p className="t-label text-clay">TBD</p>
        <p className="t-small mt-2 font-medium text-cocoa">{label}</p>
      </div>
    </div>
  );
}
