import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

type Variant = "ink" | "champagne" | "outline" | "outline-light" | "link" | "link-light";
type Size = "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 font-semibold rounded-button transition-[background-color,border-color,color,transform] duration-[180ms] ease-micro select-none disabled:opacity-50 disabled:pointer-events-none";

const sizes: Record<Size, string> = {
  md: "min-h-12 px-6 py-2.5 text-[15px] leading-tight text-center",
  lg: "min-h-[52px] px-7 py-3 text-base leading-tight text-center",
};

const variants: Record<Variant, string> = {
  ink: "bg-ink text-ivory hover:bg-espresso hover:-translate-y-px",
  champagne: "bg-champagne text-ink hover:bg-[#c29a6b] hover:-translate-y-px",
  outline: "border border-border text-ink bg-transparent hover:bg-sand/40",
  "outline-light": "border border-border-dark text-ivory bg-transparent hover:bg-ivory/8",
  link: "h-auto px-0 rounded-none text-ink underline-offset-[6px] hover:underline",
  "link-light": "h-auto px-0 rounded-none text-ivory underline-offset-[6px] hover:underline",
};

type Common = { variant?: Variant; size?: Size; className?: string; children: ReactNode };
type AsLink = Common & { href: string } & Omit<ComponentPropsWithoutRef<typeof Link>, "href" | "className">;
type AsButton = Common & { href?: undefined } & Omit<ComponentPropsWithoutRef<"button">, "className">;

export function Button(props: AsLink | AsButton) {
  const { variant = "ink", size = "md", className = "", children, ...rest } = props;
  const cls = `${base} ${variant.startsWith("link") ? "" : sizes[size]} ${variants[variant]} ${className}`;
  if ("href" in rest && rest.href !== undefined) {
    return (
      <Link className={cls} {...(rest as AsLink)}>
        {children}
      </Link>
    );
  }
  return (
    <button type="button" className={cls} {...(rest as AsButton)}>
      {children}
    </button>
  );
}

export function ArrowRight({ className = "" }: { className?: string }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M2.5 8h11M9 3.5 13.5 8 9 12.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
