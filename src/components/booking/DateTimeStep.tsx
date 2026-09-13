"use client";
import { useEffect, useMemo, useState } from "react";
import { servicesPage } from "@/content/servicesPage";
import { bookingCopy, bookingFrames } from "@/content/booking";
import type { ServiceId } from "@/content/types";
import { canProceedFromDateTime } from "@/lib/booking";
import { formatTime } from "@/lib/format";
import { Button } from "@/components/ui/Button";
import { useBooking } from "./BookingContext";
import { BookingBar } from "./BookingBar";

type Slot = { time: string; available: boolean };

function monthKey(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}
function monthLabel(key: string) {
  const [y, m] = key.split("-").map(Number);
  return new Intl.DateTimeFormat("en-NG", { month: "long", year: "numeric" }).format(new Date(y, m - 1, 1));
}
function shiftMonth(key: string, by: number) {
  const [y, m] = key.split("-").map(Number);
  return monthKey(new Date(y, m - 1 + by, 1));
}

/** Step 2 · service selector left, available-date tiles + time chips right (Figma). */
export function DateTimeStep() {
  const { state, dispatch, services } = useBooking();
  const f = bookingFrames.datetime;
  const [month, setMonth] = useState(() => monthKey(new Date()));
  const [dir, setDir] = useState<1 | -1>(1);
  const [datesRes, setDatesRes] = useState<{ key: string; dates: string[] } | null>(null);
  const [slotsRes, setSlotsRes] = useState<{ key: string; slots: Slot[] } | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Results are keyed to their request so stale data never shows and no state is set synchronously in effects.
  const datesKey = state.serviceId ? `${state.serviceId}|${month}` : null;
  const slotsKey = state.serviceId && state.date ? `${state.serviceId}|${state.date}` : null;
  const dates = datesKey && datesRes?.key === datesKey ? datesRes.dates : null;
  const slots = slotsKey && slotsRes?.key === slotsKey ? slotsRes.slots : null;

  useEffect(() => {
    if (!datesKey) return;
    let live = true;
    fetch(`/api/availability?service=${state.serviceId}&month=${month}`)
      .then((r) => r.json())
      .then((j) => live && setDatesRes({ key: datesKey, dates: j.dates ?? [] }))
      .catch(() => live && setError("We couldn't load availability. Please try again."));
    return () => { live = false; };
  }, [datesKey, state.serviceId, month]);

  useEffect(() => {
    if (!slotsKey) return;
    let live = true;
    fetch(`/api/availability?service=${state.serviceId}&date=${state.date}`)
      .then((r) => r.json())
      .then((j) => live && setSlotsRes({ key: slotsKey, slots: j.slots ?? [] }))
      .catch(() => live && setError("We couldn't load times for that date."));
    return () => { live = false; };
  }, [slotsKey, state.serviceId, state.date]);

  const tiles = useMemo(
    () =>
      (dates ?? []).map((iso) => {
        const d = new Date(`${iso}T12:00:00`);
        return { iso, day: d.getDate(), weekday: new Intl.DateTimeFormat("en-NG", { weekday: "short" }).format(d) };
      }),
    [dates],
  );

  const changeMonth = (by: 1 | -1) => { setDir(by); setMonth((m) => shiftMonth(m, by)); };

  return (
    <div className="step-enter">
      <BookingBar step="datetime" label={f.stepLabel} />
      <div className="container-editorial pb-16 pt-12 lg:pb-24 lg:pt-14">
        <header>
          <h1 className="font-display text-[clamp(40px,4.4vw,64px)] leading-[1] text-ink">{f.heading}</h1>
          <p className="t-lead mt-3 text-taupe">{f.sub}</p>
        </header>

        <div className="mt-10 grid gap-8 lg:grid-cols-12 lg:gap-12">
          {/* 1 · service */}
          <section className="lg:col-span-7" aria-labelledby="pick-service">
            <p id="pick-service" className="t-label text-clay"><span aria-hidden="true">1 </span>{f.selectService}</p>
            <div role="radiogroup" aria-labelledby="pick-service" className="mt-4 space-y-3 rounded-frame bg-bone p-4 lg:p-7">
              {services.map((s) => {
                const selected = state.serviceId === s.id;
                return (
                  <button
                    key={s.id}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    onClick={() => dispatch({ type: "SELECT_SERVICE", serviceId: s.id as ServiceId })}
                    className={`block w-full rounded-card border px-5 py-4 text-left transition-[background-color,border-color] duration-[160ms] ease-micro ${
                      selected ? "border-clay bg-sand" : "border-border bg-bone hover:border-taupe/60"
                    }`}
                  >
                    <span className="t-lead block font-semibold text-ink">{s.name}</span>
                    <span className="t-small mt-1 block text-taupe">{servicesPage.shortDescriptions[s.id]}</span>
                    <span className="t-small mt-2 block font-semibold text-clay">{s.durationLabel}</span>
                  </button>
                );
              })}
            </div>
          </section>

          {/* 2 · date + time */}
          <section className="lg:col-span-5" aria-labelledby="pick-date">
            <p id="pick-date" className="t-label text-clay"><span aria-hidden="true">2 </span>{f.pickDate}</p>
            <div className="mt-4 rounded-frame bg-bone p-5 lg:p-7">
              <div className="flex items-center justify-between">
                <h2 className="font-sans text-[20px] font-semibold text-ink">{monthLabel(month)}</h2>
                <div className="flex gap-1">
                  <button type="button" aria-label="Previous month" onClick={() => changeMonth(-1)} className="grid size-11 place-items-center rounded-button hover:bg-sand/60">‹</button>
                  <button type="button" aria-label="Next month" onClick={() => changeMonth(1)} className="grid size-11 place-items-center rounded-button hover:bg-sand/60">›</button>
                </div>
              </div>
              <p className="t-small mt-1 text-taupe">{bookingCopy.datetime.timezoneCue}</p>

              {!state.serviceId ? (
                <p className="t-small mt-6 text-taupe">Select a service to see available dates.</p>
              ) : dates === null ? (
                <p className="t-small mt-6 text-taupe" aria-live="polite">Loading dates…</p>
              ) : tiles.length === 0 ? (
                <p className="t-small mt-6 text-taupe">No open dates this month.</p>
              ) : (
                <div key={month} className="month-enter mt-5 grid grid-cols-4 gap-3 sm:grid-cols-5 lg:grid-cols-3" style={{ "--dir": `${12 * dir}px` } as React.CSSProperties} role="group" aria-label="Available dates">
                  {tiles.map((t) => {
                    const selected = state.date === t.iso;
                    return (
                      <button
                        key={t.iso}
                        type="button"
                        aria-pressed={selected}
                        onClick={() => dispatch({ type: "SELECT_DATE", date: t.iso })}
                        className={`flex h-12 flex-col items-center justify-center rounded-control t-small font-semibold transition-[background-color,color] duration-[160ms] ease-micro ${
                          selected ? "bg-ink text-ivory" : "bg-ivory text-ink hover:bg-sand"
                        }`}
                      >
                        <span className="text-[11px] font-medium uppercase tracking-wider opacity-70">{t.weekday}</span>
                        <span className="text-[15px] leading-none">{t.day}</span>
                      </button>
                    );
                  })}
                </div>
              )}

              {state.date && (
                <div className="mt-7">
                  <p className="t-small font-semibold text-ink">{f.availableTimes}</p>
                  {slots === null ? (
                    <p className="t-small mt-3 text-taupe" aria-live="polite">Loading times…</p>
                  ) : (
                    <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="Available times">
                      {slots.map((s) => {
                        const selected = state.slot === s.time;
                        return (
                          <button
                            key={s.time}
                            type="button"
                            disabled={!s.available}
                            aria-pressed={selected}
                            onClick={() => dispatch({ type: "SELECT_SLOT", slot: s.time })}
                            className={`h-11 rounded-control px-4 t-small font-semibold transition-[background-color,color] duration-[160ms] ease-micro disabled:cursor-not-allowed disabled:opacity-40 ${
                              selected ? "bg-clay text-ivory" : "bg-ivory text-ink hover:bg-sand"
                            }`}
                          >
                            {formatTime(s.time)}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {error && <p className="t-small mt-4 text-clay" role="alert">{error}</p>}

              <Button variant="ink" size="lg" className="mt-8 w-full" disabled={!canProceedFromDateTime(state)} onClick={() => dispatch({ type: "SUBMIT_DATETIME" })}>
                {f.cta}
              </Button>
            </div>
          </section>
        </div>

        <button type="button" onClick={() => dispatch({ type: "GO_TO", step: "screening" })} className="t-small mt-8 text-taupe underline-offset-[6px] hover:underline">
          ← Back to health check
        </button>
      </div>
    </div>
  );
}
