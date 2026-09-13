/** Naira formatting. `null` renders a labelled TBD — prices are never inferred. */
export const TBD_LABEL = "Price on request";

export function formatNGN(amount: number | null, opts: { tbdLabel?: string } = {}): string {
  if (amount === null || Number.isNaN(amount)) return opts.tbdLabel ?? TBD_LABEL;
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDateLong(isoDate: string, timeZone = "Africa/Lagos"): string {
  const d = new Date(`${isoDate}T12:00:00`);
  return new Intl.DateTimeFormat("en-NG", { weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone }).format(d);
}

export function formatTime(hhmm: string): string {
  const [h, m] = hhmm.split(":").map(Number);
  const suffix = h >= 12 ? "PM" : "AM";
  const hour = ((h + 11) % 12) + 1;
  return `${hour}:${String(m).padStart(2, "0")} ${suffix}`;
}

export function formatDateTimeLabel(isoDate: string, hhmm: string): string {
  return `${formatDateLong(isoDate)}, ${formatTime(hhmm)} WAT`;
}
