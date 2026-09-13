import { isAuthenticated } from "@/lib/studio/auth";
import { getBookingStore } from "@/lib/adapters/bookings";
import { getService } from "@/content/services";

/** CSV export of confirmed + pending bookings (owner dashboard). */
export async function GET() {
  if (!(await isAuthenticated())) return new Response("Unauthorized", { status: 401 });
  const store = getBookingStore();
  const rows = [...(await store.listByStatus("confirmed", 1000)), ...(await store.listByStatus("pending_payment", 1000))];
  const esc = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const header = ["reference", "status", "service", "date", "time", "name", "phone", "email", "deposit_ngn", "created_at", "confirmed_at"];
  const lines = rows.map((b) => [b.reference, b.status, getService(b.serviceId)?.name ?? b.serviceId, b.date, b.time, b.customer.name, b.customer.phone, b.customer.email, b.depositKobo === null ? "" : b.depositKobo / 100, b.createdAt, b.confirmedAt ?? ""].map(esc).join(","));
  return new Response([header.join(","), ...lines].join("\n"), { headers: { "Content-Type": "text/csv; charset=utf-8", "Content-Disposition": `attachment; filename="hpearl-bookings-${new Date().toISOString().slice(0, 10)}.csv"` } });
}
