"use server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { isAuthenticated, login, logout } from "@/lib/studio/auth";
import { getBookingStore } from "@/lib/adapters/bookings";
import { getAvailabilityProvider } from "@/lib/adapters/availability";
import { getReminderQueue } from "@/lib/adapters/reminders";
import { updateConsultationStatus } from "@/lib/adapters/consultations";

export async function loginAction(formData: FormData) {
  const ok = await login(String(formData.get("passcode") ?? ""));
  redirect(ok ? "/studio" : "/studio?error=1");
}

export async function logoutAction() {
  await logout();
  redirect("/studio");
}

export async function cancelBookingAction(formData: FormData) {
  if (!(await isAuthenticated())) redirect("/studio");
  const ref = String(formData.get("reference") ?? "");
  const store = getBookingStore();
  const b = await store.get(ref);
  if (b && b.status !== "cancelled") {
    if (b.holdId) await getAvailabilityProvider().release(b.holdId);
    await store.update(ref, { status: "cancelled" });
    await getReminderQueue().cancel(ref);
  }
  revalidatePath("/studio");
}

export async function consultationStatusAction(formData: FormData) {
  if (!(await isAuthenticated())) redirect("/studio");
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "contacted") as "new" | "contacted" | "closed";
  await updateConsultationStatus(id, status);
  revalidatePath("/studio");
}
