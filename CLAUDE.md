# hpearl_beauty — project guide

Production website for hpearl_beauty, a semi-permanent brow studio + PMU academy in Ikeja, Lagos.

## Sources of truth (priority order)
1. **Visual:** Figma `design/FIGMA-LINK.txt` — PNG exports live in `design/figma/`.
2. **Motion/UI:** `docs/hpearl_beauty_ui_motion_handoff.md`
3. **Content/business logic:** `docs/product-content-brief.md`
4. **Photography:** `public/images/**` — hpearl-owned only. Third-party-watermarked shots are quarantined in `_source/excluded/` and must not be used, cropped, or retouched.

## Hard rules
- Never invent prices, testimonials, founder credentials, policies, medical claims, or metrics. Unknowns are `null` in `src/content/*` and render as labelled TBD. Figma ₦ values are mockup-only.
- Business copy comes from `src/content/*` only — never inline strings for services, address, WhatsApp scripts.
- No secrets in client code. Payment/WhatsApp keys are read only inside `import "server-only"` modules under `src/lib/adapters/`.
- Screening gate (`requiresConsultation`) is enforced client-side AND in `POST /api/bookings`.
- Motion: CSS + IntersectionObserver only. Easings/durations live in `src/lib/tokens.css`. Respect `prefers-reduced-motion`.
- Nothing below 14px except legal fine print. WCAG AA contrast.

## Stack
Next.js 16 (App Router) · React 19 · TypeScript · Tailwind v4 (`@theme` bound to `src/lib/tokens.css`) · `next/font` (Playfair Display + Inter) · pnpm.

## Layout
```
src/app            routes + API (availability, bookings, payments, webhooks)
src/components     layout/ ui/ home/ academy/ booking/
src/content        all copy + business data (brief §19 shape)
src/lib/booking    state machine, screening gate, deposit maths, confirmed-booking events
src/lib/adapters   availability | payments (paystack, flutterwave) | whatsapp | bookings
src/lib/motion     useReveal, useReducedMotion
src/lib/seo        JSON-LD builders
```

## Commands
`pnpm dev` · `pnpm build` · `pnpm typecheck` · `pnpm lint`

## Booking state
`screening -> consultation_required | datetime -> deposit -> confirmation` (see `src/lib/booking/machine.ts`). Persisted in the URL `?step=`.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
