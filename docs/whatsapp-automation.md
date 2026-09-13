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

`vercel.json` runs `GET /api/cron/reminders` hourly. Vercel sends `Authorization: Bearer $CRON_SECRET`. Run it manually:

```
curl -H "Authorization: Bearer $CRON_SECRET" http://localhost:3737/api/cron/reminders
```

## Resume & confirmation links

`/book?step=deposit&ref=HPB-…` resumes an unpaid booking on any device; `/book?step=confirmation&ref=HPB-…` (the payment callback) renders the confirmation from the server record.
