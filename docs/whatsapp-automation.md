# WhatsApp automation & booking data

## What happens automatically

| Trigger | Client receives | Owner receives | Where |
|---|---|---|---|
| Screening red flag, "Continue on WhatsApp" | opens WhatsApp with name + flags pre-filled | `owner_consultation_request` alert | `POST /api/consultations` |
| Booking created (unpaid) | nothing yet | nothing yet | `POST /api/bookings` → `deposit_pending` reminder queued (+2h) |
| Deposit verified | Script A (confirmation, address, prep) | `owner_new_booking` | payment webhook / verify → `onBookingConfirmed` |
| 2h after unpaid booking | `deposit_pending` nudge with resume link | `owner_deposit_abandoned` | cron |
| Day before, 09:00 WAT | `appointment_reminder_24h` | | cron |
| 28 days after session, 10:00 WAT | Script B touch-up reminder | | cron |
| Every day 07:00 WAT | | `owner_daily_digest` | cron |
| 24h unpaid | hold released, booking `expired` | | cron |

Every outbound message is written to `messages` (to, kind, body, provider id, status, error).

## Provider setup

`WHATSAPP_PROVIDER=meta` uses the WhatsApp Cloud API (`WHATSAPP_API_TOKEN`, `WHATSAPP_PHONE_NUMBER_ID`).
`OWNER_WHATSAPP_NUMBER` is where alerts go. Client numbers are stored as digits only, international format.

**Templates.** Meta requires approved templates for business-initiated messages outside a 24h window. Register one per kind
and put its name in `WHATSAPP_TEMPLATE_<KIND>`. Body placeholders are filled in this order:

| Kind | {{1}} | {{2}} | {{3}} | {{4}} |
|---|---|---|---|---|
| booking_confirmation | client name | service | date & time | |
| appointment_reminder_24h | client name | service | time | |
| touch_up_reminder_28d | client name | booking URL | | |
| deposit_pending | client name | service | date & time | resume URL |
| owner_new_booking | client name | service | date & time | reference |
| owner_consultation_request | name | flags | | |
| owner_deposit_abandoned | client name | service | date & time | reference |
| owner_daily_digest | date | count | | |

With no template configured, the plain-text versions in `src/content/whatsapp.ts` are sent (works in sandbox and inside an open window).

**Copy status.** Script A and Script B are verbatim from the brief. `appointment_reminder_24h` and `deposit_pending` are new client-facing copy and need the owner's approval before launch. Owner alerts are internal.

## Database

Neon Postgres project `hpearl-beauty` (eu-central-1). Schema in `src/lib/db/schema.sql`; apply with `pnpm db:migrate`.
Tables: `clients`, `bookings`, `reminders`, `messages`, `consultation_requests`. With `DATABASE_URL` unset, every adapter falls back to memory.

## Cron

`vercel.json` runs `GET /api/cron/reminders` daily at 06:00 UTC (07:00 WAT), the most a Vercel Hobby plan allows; that run also sends the owner digest. `.github/workflows/reminders.yml` calls the same endpoint hourly (repo secret `CRON_SECRET`, repo variable `SITE_URL`) so reminders leave on time. Upgrading Vercel to Pro lets you switch the schedule back to `0 * * * *` and drop the workflow. Run it manually:

```
curl -H "Authorization: Bearer $CRON_SECRET" http://localhost:3737/api/cron/reminders
```

## Resume & confirmation links

`/book?step=deposit&ref=HPB-…` resumes an unpaid booking on any device; `/book?step=confirmation&ref=HPB-…` (the payment callback) renders the confirmation from the server record.

## Availability (Google Calendar)

Set `AVAILABILITY_PROVIDER=google` plus `GOOGLE_SERVICE_ACCOUNT_EMAIL`, `GOOGLE_PRIVATE_KEY`, `GOOGLE_CALENDAR_ID`
(share the studio calendar with the service account, "Make changes to events"). Slots are computed from
`STUDIO_HOURS` (placeholder default until the studio confirms hours) minus the calendar's busy periods,
with a 24h minimum lead time and a 60-day horizon (`src/lib/adapters/availability/schedule.ts`).
A hold creates a tentative event; payment confirms it; expiry deletes it. The mock provider uses the same engine.

## Manage-my-booking

`/booking/<reference>?t=<token>`: status, details, add-to-calendar, resume deposit, reschedule/cancel via WhatsApp.
The link is returned by `GET /api/bookings/<reference>`, shown on the confirmation page, and included in the
24h reminder. Policy text is a placeholder until confirmed (brief §17 #15–16).

## Owner dashboard

`/studio`, protected by `STUDIO_PASSCODE` (+ `STUDIO_SESSION_SECRET`). Shows today, upcoming, awaiting-deposit,
consultation requests (mark contacted, open WhatsApp), touch-ups due this week, the message log, cancel
(releases the calendar hold and reminders) and a CSV export at `/api/studio/export`.

## Content editor (`/studio/content`)

Owner-editable, stored in `site_settings` and merged over the code defaults by `src/lib/content/resolve.ts`:
prices (drive "Price on request" and the 50% deposit), hours (display text + booking schedule), policies,
Instagram, founder bio, the two unverified claims (off until ticked), academy kit list, verified reviews,
verified before/after pairs (uploads to Vercel Blob with `BLOB_READ_WRITE_TOKEN`, local `public/uploads` in dev),
and the aftercare messages. Saving calls `updateTag("site-content")`, so static pages re-render on the next request.

## Aftercare drip

On confirmation, `aftercare_day1/3/7` reminders are queued for 10:00 WAT. The cron sends them only when the editor's
aftercare section is marked approved and the day's text is present; otherwise they are cancelled quietly.
