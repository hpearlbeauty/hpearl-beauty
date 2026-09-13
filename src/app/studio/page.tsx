import { getBookingStore } from "@/lib/adapters/bookings";
import { getReminderQueue } from "@/lib/adapters/reminders";
import { listConsultationRequests } from "@/lib/adapters/consultations";
import { listMessages } from "@/lib/adapters/messages";
import { getService } from "@/content/services";
import { formatDateLong, formatNGN, formatTime } from "@/lib/format";
import { hasDatabase } from "@/lib/db/client";
import { Placeholder } from "@/components/ui/Placeholder";
import { cancelBookingAction, consultationStatusAction } from "./actions";

const todayLagos = () => new Intl.DateTimeFormat("en-CA", { timeZone: "Africa/Lagos" }).format(new Date());

export default async function StudioPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;
  const store = getBookingStore();
  const today = todayLagos();
  const now = new Date();
  const [upcoming, pending, consultations, messages, touchUps] = await Promise.all([
    store.listUpcoming(today, 40),
    store.listByStatus("pending_payment", 20),
    listConsultationRequests(30),
    listMessages(30),
    getReminderQueue().upcoming("touch_up_reminder_28d", now, new Date(now.getTime() + 7 * 86400_000)),
  ]);
  const todays = upcoming.filter((b) => b.date === today);

  return (
    <div className="space-y-14">
      {error && <p className="t-small text-clay">Incorrect passcode.</p>}
      <header className="flex flex-wrap items-end justify-between gap-4 border-b border-border pb-6">
        <div>
          <p className="t-label text-clay">{formatDateLong(today)}</p>
          <h1 className="font-display mt-3 text-[clamp(38px,4vw,56px)] leading-[1]">Today at the studio</h1>
        </div>
        <a href="/api/studio/export" className="t-small underline underline-offset-4">Export bookings (CSV)</a>
      </header>
      {!hasDatabase() && <Placeholder label="Running on the in-memory store">Set DATABASE_URL to persist bookings between restarts.</Placeholder>}

      <Section title="Today" count={todays.length} empty="No appointments today.">
        {todays.map((b) => <BookingRow key={b.reference} b={b} />)}
      </Section>

      <Section title="Upcoming" count={upcoming.length} empty="Nothing booked yet.">
        {upcoming.filter((b) => b.date !== today).map((b) => <BookingRow key={b.reference} b={b} showDate />)}
      </Section>

      <Section title="Awaiting deposit" count={pending.length} empty="No unpaid holds.">
        {pending.map((b) => <BookingRow key={b.reference} b={b} showDate pendingNote />)}
      </Section>

      <Section title="Consultation requests" count={consultations.filter((c) => c.status === "new").length} empty="No consultation requests.">
        {consultations.map((c) => (
          <li key={c.id} className="grid gap-2 py-4 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <p className="t-body font-medium">{c.name} {c.phone && <span className="text-taupe">· {c.phone}</span>} <span className={`t-label ml-2 ${c.status === "new" ? "text-clay" : "text-taupe"}`}>{c.status}</span></p>
              <p className="t-small text-taupe">{c.flags.join(" · ")} · {new Date(c.createdAt).toLocaleString("en-NG", { timeZone: "Africa/Lagos" })}</p>
            </div>
            <div className="flex gap-2">
              {c.phone && <a className="t-small underline underline-offset-4" href={`https://wa.me/${c.phone}`} target="_blank" rel="noopener">Open WhatsApp</a>}
              {c.status === "new" && (
                <form action={consultationStatusAction}><input type="hidden" name="id" value={c.id} /><input type="hidden" name="status" value="contacted" /><button className="t-small underline underline-offset-4">Mark contacted</button></form>
              )}
            </div>
          </li>
        ))}
      </Section>

      <Section title="Touch-ups due this week" count={touchUps.length} empty="No touch-up reminders due in the next 7 days.">
        {touchUps.map((r) => <li key={r.id} className="t-body py-3">{r.bookingReference} · reminder {new Date(r.sendAt).toLocaleString("en-NG", { timeZone: "Africa/Lagos" })}</li>)}
      </Section>

      <Section title="Recent messages" count={messages.length} empty="No messages logged yet.">
        {messages.map((m) => (
          <li key={m.id} className="grid gap-1 py-3 md:grid-cols-[180px_120px_1fr_90px] md:items-baseline">
            <span className="t-small text-taupe">{new Date(m.createdAt).toLocaleString("en-NG", { timeZone: "Africa/Lagos" })}</span>
            <span className="t-small">{m.kind}</span>
            <span className="t-small text-taupe">→ {m.to}{m.bookingReference ? ` · ${m.bookingReference}` : ""}{m.error ? ` · ${m.error}` : ""}</span>
            <span className={`t-label ${m.status === "sent" ? "text-ink" : m.status === "failed" ? "text-clay" : "text-taupe"}`}>{m.status}</span>
          </li>
        ))}
      </Section>
    </div>
  );
}

function Section({ title, count, empty, children }: { title: string; count: number; empty: string; children: React.ReactNode[] }) {
  return (
    <section>
      <div className="flex items-baseline gap-3 border-b border-border pb-3">
        <h2 className="font-display text-[30px] leading-none">{title}</h2>
        <span className="t-label text-clay">{count}</span>
      </div>
      {children.length ? <ul className="divide-y divide-border">{children}</ul> : <p className="t-small py-4 text-taupe">{empty}</p>}
    </section>
  );
}

function BookingRow({ b, showDate = false, pendingNote = false }: { b: Awaited<ReturnType<ReturnType<typeof getBookingStore>["get"]>> & object; showDate?: boolean; pendingNote?: boolean }) {
  const s = getService(b.serviceId);
  return (
    <li className="grid gap-2 py-4 md:grid-cols-[110px_1fr_auto] md:items-center">
      <span className="t-body font-medium">{showDate ? `${b.date.slice(5)} · ` : ""}{formatTime(b.time)}</span>
      <div>
        <p className="t-body">{s?.name ?? b.serviceId} · {b.customer.name} <span className="text-taupe">· {b.customer.phone}</span></p>
        <p className="t-small text-taupe">{b.reference} · deposit {b.depositKobo === null ? "TBD" : formatNGN(b.depositKobo / 100)}{pendingNote ? ` · created ${new Date(b.createdAt).toLocaleString("en-NG", { timeZone: "Africa/Lagos" })}` : ""}</p>
      </div>
      <div className="flex gap-3">
        <a className="t-small underline underline-offset-4" href={`https://wa.me/${b.customer.phone}`} target="_blank" rel="noopener">WhatsApp</a>
        <form action={cancelBookingAction}><input type="hidden" name="reference" value={b.reference} /><button className="t-small text-clay underline underline-offset-4">Cancel</button></form>
      </div>
    </li>
  );
}
