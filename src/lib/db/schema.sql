-- hpearl_beauty operational schema (Neon Postgres). Idempotent.
create extension if not exists pgcrypto;

create table if not exists clients (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null unique,
  email text,
  created_at timestamptz not null default now()
);

create table if not exists bookings (
  reference text primary key,
  client_id uuid references clients(id),
  service_id text not null,
  date date not null,
  time text not null,
  customer_name text not null,
  customer_phone text not null,
  customer_email text,
  screening jsonb not null default '[]'::jsonb,
  hold_id text,
  deposit_kobo integer,
  status text not null check (status in ('pending_payment','confirmed','failed','cancelled','expired')),
  payment_provider text,
  manage_token text not null,
  created_at timestamptz not null default now(),
  confirmed_at timestamptz,
  paid_at timestamptz
);
create index if not exists bookings_date_idx on bookings(date);
create index if not exists bookings_status_created_idx on bookings(status, created_at);

create table if not exists reminders (
  id uuid primary key default gen_random_uuid(),
  booking_reference text not null references bookings(reference) on delete cascade,
  kind text not null check (kind in ('deposit_pending','appointment_reminder_24h','touch_up_reminder_28d')),
  send_at timestamptz not null,
  status text not null default 'pending' check (status in ('pending','sent','cancelled','failed')),
  attempts integer not null default 0,
  last_error text,
  sent_at timestamptz,
  created_at timestamptz not null default now(),
  unique (booking_reference, kind)
);
create index if not exists reminders_due_idx on reminders(status, send_at);

create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  booking_reference text references bookings(reference) on delete set null,
  to_phone text not null,
  kind text not null,
  body text not null,
  provider text not null,
  provider_message_id text,
  status text not null,
  error text,
  created_at timestamptz not null default now()
);
create index if not exists messages_booking_idx on messages(booking_reference);

create table if not exists consultation_requests (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text,
  flags jsonb not null default '[]'::jsonb,
  source text not null default 'screening',
  status text not null default 'new' check (status in ('new','contacted','closed')),
  created_at timestamptz not null default now()
);
