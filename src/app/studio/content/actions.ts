"use server";
import { redirect } from "next/navigation";
import { revalidatePath, updateTag } from "next/cache";
import { randomBytes } from "node:crypto";
import { isAuthenticated } from "@/lib/studio/auth";
import { CONTENT_TAG, getSettingsFresh, saveSetting, type SiteSettings } from "@/lib/content/settings";
import { storeImage } from "@/lib/studio/upload";
import type { GalleryCategory } from "@/content/types";

async function guard() { if (!(await isAuthenticated())) redirect("/studio"); }
function done() { updateTag(CONTENT_TAG); revalidatePath("/studio/content"); }
const num = (v: FormDataEntryValue | null) => { const n = Number(String(v ?? "").replace(/[^\d.]/g, "")); return String(v ?? "").trim() === "" || Number.isNaN(n) ? null : Math.round(n); };
const str = (v: FormDataEntryValue | null) => { const s = String(v ?? "").trim(); return s === "" ? null : s; };

export async function savePricingAction(fd: FormData) {
  await guard();
  await saveSetting("pricing", {
    "combo-brows": num(fd.get("combo-brows")), "ombre-powder-brows": num(fd.get("ombre-powder-brows")), microblading: num(fd.get("microblading")),
    touchUp: num(fd.get("touchUp")), academyTuition: num(fd.get("academyTuition")), academyDeposit: num(fd.get("academyDeposit")),
  });
  done();
}

export async function saveHoursPoliciesAction(fd: FormData) {
  await guard();
  await saveSetting("hours", { display: str(fd.get("hoursDisplay")), schedule: str(fd.get("schedule")) });
  await saveSetting("policies", { cancellation: str(fd.get("cancellation")), depositRefund: str(fd.get("depositRefund")) });
  await saveSetting("socials", { instagram: str(fd.get("instagram")) });
  done();
}

export async function saveFounderClaimsAction(fd: FormData) {
  await guard();
  await saveSetting("founder", { bio: str(fd.get("bio")) });
  await saveSetting("claims", { longevityApproved: fd.get("longevityApproved") === "on", sixFigureApproved: fd.get("sixFigureApproved") === "on" });
  const kit = str(fd.get("kitItems"));
  await saveSetting("academy", { kitItems: kit ? kit.split("\n").map((s) => s.trim()).filter(Boolean) : null });
  done();
}

export async function saveAftercareAction(fd: FormData) {
  await guard();
  await saveSetting("aftercare", { approved: fd.get("approved") === "on", day1: str(fd.get("day1")), day3: str(fd.get("day3")), day7: str(fd.get("day7")) });
  done();
}

export async function addReviewAction(fd: FormData) {
  await guard();
  const quote = str(fd.get("quote")), author = str(fd.get("author"));
  if (!quote || !author) return;
  const s = await getSettingsFresh();
  const source = (str(fd.get("source")) ?? "google") as SiteSettings["reviews"][number]["source"];
  await saveSetting("reviews", [...s.reviews, { id: randomBytes(4).toString("hex"), quote, author, source }]);
  done();
}

export async function removeReviewAction(fd: FormData) {
  await guard();
  const s = await getSettingsFresh();
  await saveSetting("reviews", s.reviews.filter((r) => r.id !== String(fd.get("id"))));
  done();
}

export async function addGalleryPairAction(fd: FormData) {
  await guard();
  const before = fd.get("before"), after = fd.get("after");
  if (!(before instanceof File) || !(after instanceof File) || before.size === 0 || after.size === 0) return;
  const category = (str(fd.get("category")) ?? "combo-brows") as GalleryCategory;
  const [beforeUrl, afterUrl] = await Promise.all([storeImage(before, "gallery"), storeImage(after, "gallery")]);
  const s = await getSettingsFresh();
  await saveSetting("gallery", [{ id: randomBytes(4).toString("hex"), category, beforeUrl, afterUrl, caption: str(fd.get("caption")) ?? "" }, ...s.gallery]);
  done();
}

export async function removeGalleryPairAction(fd: FormData) {
  await guard();
  const s = await getSettingsFresh();
  await saveSetting("gallery", s.gallery.filter((g) => g.id !== String(fd.get("id"))));
  done();
}
