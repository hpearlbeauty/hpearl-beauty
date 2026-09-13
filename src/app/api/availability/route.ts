import { NextResponse } from "next/server";
import { getAvailabilityProvider } from "@/lib/adapters/availability";
import { getService } from "@/content/services";
import type { ServiceId } from "@/content/types";

/** GET /api/availability?service=combo-brows&month=2026-10  |  &date=2026-10-14 */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const serviceId = searchParams.get("service") as ServiceId | null;
  const month = searchParams.get("month");
  const date = searchParams.get("date");

  if (!serviceId || !getService(serviceId)) return NextResponse.json({ error: "Unknown service" }, { status: 400 });
  const provider = getAvailabilityProvider();

  if (date) return NextResponse.json({ date, slots: await provider.getSlots(serviceId, date) });
  if (month) return NextResponse.json({ month, dates: await provider.getAvailableDates(serviceId, month) });
  return NextResponse.json({ error: "Provide month or date" }, { status: 400 });
}
