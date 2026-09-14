# hpearl_beauty — progress log

_Last updated: 14 Sep 2026. Repo: https://github.com/hpearlbeauty/hpearl-beauty · Live: https://hpearl-beauty.vercel.app · Local: `pnpm dev -p 3737`_

## Status at a glance

| Area | State |
|---|---|
| Homepage, Services, Booking flow (4 steps), Academy shell, Shop placeholder | Built, responsive at 390 / 768 / 1024 / 1440 |
| Editorial design system (Cormorant Garamond + Instrument Sans, GSAP + Lenis motion, brow-arch logo) | Done |
| Service categories: Eyebrow (3 treatments), Makeup, Lash, Body Waxing | Structure done; only Eyebrow menu is confirmed |
| Neon Postgres (`hpearl-beauty`, eu-central-1) | Live: clients, bookings, reminders, messages, consultation_requests, site_settings |
| Booking automation (owner alerts, Script A/B, 24h reminder, deposit nudge, aftercare drip, daily digest) | Built; runs in log-only mode until a WhatsApp provider is connected |
| Owner dashboard `/studio` + content editor `/studio/content` | Done (passcode login) |
| Manage-my-booking page `/booking/<ref>?t=…` | Done |
| Google Calendar availability | Built; not connected (`AVAILABILITY_PROVIDER=mock`) |
| Payments (Paystack / Flutterwave) | Built; not connected (no keys; prices TBD) |
| GitHub → Vercel deploy | Live on Vercel Hobby; daily Vercel cron + hourly GitHub Actions ping |

## Content honesty rules in force
- No prices, testimonials, founder credentials, policies or medical claims are invented. TBDs render as labelled placeholders.
- All photography is licensed Pexels editorial imagery featuring Black women (`docs/image-credits.md`). Nothing is presented as a client result. Studio-supplied photos are archived in `_source/` and unused at the owner's request.
- Transformation module shows same-model "Process → Finish" editorial pairs; it switches to true Before → After automatically when verified pairs are uploaded in `/studio/content`.
- Two claims from the concept ("last up to 2 years", "Six-Figure Business") stay off until ticked in the editor.

## Environment (Vercel)
Set: `DATABASE_URL`, `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_WHATSAPP_NUMBER`=2347030847377, `OWNER_WHATSAPP_NUMBER`, `STUDIO_PASSCODE`, `STUDIO_SESSION_SECRET`, `CRON_SECRET`, `WHATSAPP_PROVIDER=none`, `AVAILABILITY_PROVIDER=mock`, `NEXT_PUBLIC_PAYMENT_PROVIDER`.
Still to add when ready: `BLOB_READ_WRITE_TOKEN` (editor uploads), payment keys, WhatsApp provider keys + template names, Google Calendar service account. Full list in `.env.example`.
GitHub repo: secret `CRON_SECRET`, variable `SITE_URL` (update if the domain changes).

## Waiting on the studio (hpearl_beauty)
1. Prices: Combo, Ombre, Microblading, touch-up, academy tuition + deposit → enter in `/studio/content`
2. Makeup, Lash and Body Waxing menus (services, durations, prices)
3. Verified before/after pairs (same client) → upload in `/studio/content`
4. Verified reviews → add in `/studio/content`
5. Founder bio; approval of the two claims above
6. Opening hours and cancellation / deposit-refund policy → `/studio/content`
7. Aftercare copy (day 1 / 3 / 7) + approval of the 24h reminder and deposit-nudge messages
8. Payment provider choice (Paystack or Flutterwave) + keys
9. WhatsApp provider choice (Meta Cloud API or Termii) + Meta template approval
10. Google Calendar to share with the service account (optional, for real availability)
11. Studio photography to replace editorial stock; academy Figma frame for the final academy visual pass
12. Privacy policy / terms content; Instagram handle; final domain

## Next steps (suggested order)
1. Connect Vercel Blob so the editor can accept before/after uploads in production.
2. Enter prices once confirmed; connect Paystack/Flutterwave test keys and run a test deposit end to end.
3. Connect the WhatsApp provider (start with sandbox), register templates, flip `WHATSAPP_PROVIDER`.
4. Google Calendar availability; confirm `STUDIO_HOURS`.
5. Category menus for Makeup / Lash / Body Waxing, then make them bookable.
6. Custom domain; then the academy visual pass when its Figma frame arrives.

## Key docs
`CLAUDE.md` (project guide) · `docs/product-content-brief.md` (content source of truth, with categories addendum) · `docs/hpearl_beauty_ui_motion_handoff.md` · `docs/whatsapp-automation.md` (automation, templates, cron, editor, calendar) · `docs/image-credits.md` · `design/review/` (screenshots)

## Session history (13 Sep 2026)
Foundation scaffold → Figma-faithful build → editorial redesign (type, motion, logo) → licensed imagery → Neon persistence + WhatsApp automation + cron → Google Calendar adapter, manage-booking page, owner dashboard → content editor + aftercare drip → GitHub repo + Vercel deploy (Hobby cron workaround) → mobile CTA refinements → service categories → same-model, Black-model imagery pass.
