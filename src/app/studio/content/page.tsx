import Image from "next/image";
import { getSettingsFresh } from "@/lib/content/settings";
import { services } from "@/content/services";
import { galleryFilters } from "@/content/gallery";
import { addGalleryPairAction, addReviewAction, removeGalleryPairAction, removeReviewAction, saveAftercareAction, saveFounderClaimsAction, saveHoursPoliciesAction, savePricingAction } from "./actions";

export const dynamic = "force-dynamic";

const input = "mt-1.5 h-12 w-full rounded-control border border-border bg-bone px-4 t-body text-ink focus:border-clay focus:outline-none";
const area = "mt-1.5 w-full rounded-control border border-border bg-bone px-4 py-3 t-body text-ink focus:border-clay focus:outline-none";
const btn = "inline-flex h-11 items-center justify-center rounded-button bg-ink px-5 text-[14px] font-semibold text-ivory hover:bg-espresso";

/** Owner content editor. Every field maps to a TBD in the brief; empty = keep the labelled placeholder. */
export default async function StudioContentPage() {
  const s = await getSettingsFresh();
  return (
    <div className="space-y-16">
      <header className="border-b border-border pb-6">
        <p className="t-label text-clay">Content</p>
        <h1 className="font-display mt-3 text-[clamp(38px,4vw,56px)] leading-[1]">What the website shows</h1>
        <p className="t-body mt-3 max-w-[60ch] text-taupe">Leave a field empty to keep the website&apos;s &ldquo;pending&rdquo; placeholder. Changes go live as soon as you save.</p>
      </header>

      <Block title="Prices" hint="Whole naira, no symbol. The website shows 'Price on request' until a price is set; the 50% deposit is calculated from it.">
        <form action={savePricingAction} className="grid gap-5 md:grid-cols-3">
          {services.map((svc) => (
            <label key={svc.id} className="t-small block">{svc.name} (₦)<input name={svc.id} inputMode="numeric" defaultValue={s.pricing[svc.id] ?? ""} className={input} /></label>
          ))}
          <label className="t-small block">Touch-up session (₦)<input name="touchUp" inputMode="numeric" defaultValue={s.pricing.touchUp ?? ""} className={input} /></label>
          <label className="t-small block">Academy tuition (₦)<input name="academyTuition" inputMode="numeric" defaultValue={s.pricing.academyTuition ?? ""} className={input} /></label>
          <label className="t-small block">Academy deposit (₦)<input name="academyDeposit" inputMode="numeric" defaultValue={s.pricing.academyDeposit ?? ""} className={input} /></label>
          <div className="md:col-span-3"><button className={btn}>Save prices</button></div>
        </form>
      </Block>

      <Block title="Hours, policies & socials" hint="Opening hours drive the booking calendar. Format: weekday range (1 = Monday … 7 = Sunday), colon, open-close. Example: 1-5:10:00-18:00,6:10:00-16:00">
        <form action={saveHoursPoliciesAction} className="grid gap-5 md:grid-cols-2">
          <label className="t-small block">Hours as shown on the website<input name="hoursDisplay" defaultValue={s.hours.display ?? ""} placeholder="Mon to Sat, 10am to 6pm" className={input} /></label>
          <label className="t-small block">Booking schedule<input name="schedule" defaultValue={s.hours.schedule ?? ""} placeholder="1-5:10:00-18:00,6:10:00-16:00" className={input} /></label>
          <label className="t-small block md:col-span-2">Reschedule / cancellation policy<textarea name="cancellation" rows={3} defaultValue={s.policies.cancellation ?? ""} className={area} /></label>
          <label className="t-small block md:col-span-2">Deposit refund policy<textarea name="depositRefund" rows={2} defaultValue={s.policies.depositRefund ?? ""} className={area} /></label>
          <label className="t-small block">Instagram handle<input name="instagram" defaultValue={s.socials.instagram ?? ""} placeholder="hpearl_beauty" className={input} /></label>
          <div className="md:col-span-2"><button className={btn}>Save</button></div>
        </form>
      </Block>

      <Block title="Founder, claims & academy kit" hint="Claims stay off the website until you tick them.">
        <form action={saveFounderClaimsAction} className="grid gap-5">
          <label className="t-small block">Founder biography<textarea name="bio" rows={4} defaultValue={s.founder.bio ?? ""} className={area} /></label>
          <label className="t-small flex items-center gap-3"><input type="checkbox" name="longevityApproved" defaultChecked={s.claims.longevityApproved} className="size-4 accent-[#A65C43]" /> Use &ldquo;last up to 2 years&rdquo; in the touch-up reminder</label>
          <label className="t-small flex items-center gap-3"><input type="checkbox" name="sixFigureApproved" defaultChecked={s.claims.sixFigureApproved} className="size-4 accent-[#A65C43]" /> Use the &ldquo;Six-Figure Business&rdquo; academy headline</label>
          <label className="t-small block">Academy kit contents (one per line)<textarea name="kitItems" rows={4} defaultValue={s.academy.kitItems?.join("\n") ?? ""} className={area} /></label>
          <div><button className={btn}>Save</button></div>
        </form>
      </Block>

      <Block title="Aftercare messages" hint="Sent on WhatsApp 1, 3 and 7 days after each session at 10am, only once approved. Each starts with 'Hi {name},'. Keep to aftercare you have approved; no medical claims.">
        <form action={saveAftercareAction} className="grid gap-5">
          <label className="t-small flex items-center gap-3"><input type="checkbox" name="approved" defaultChecked={s.aftercare.approved} className="size-4 accent-[#A65C43]" /> Approved: send these messages</label>
          <label className="t-small block">Day 1<textarea name="day1" rows={3} defaultValue={s.aftercare.day1 ?? ""} className={area} /></label>
          <label className="t-small block">Day 3<textarea name="day3" rows={3} defaultValue={s.aftercare.day3 ?? ""} className={area} /></label>
          <label className="t-small block">Day 7<textarea name="day7" rows={3} defaultValue={s.aftercare.day7 ?? ""} className={area} /></label>
          <div><button className={btn}>Save aftercare</button></div>
        </form>
      </Block>

      <Block title="Verified reviews" hint="Only real client feedback. These replace the 'reviews pending' placeholder on the homepage.">
        <ul className="divide-y divide-border">
          {s.reviews.map((r) => (
            <li key={r.id} className="flex items-start justify-between gap-6 py-3">
              <p className="t-body">&ldquo;{r.quote}&rdquo; <span className="t-small text-taupe">{r.author} · {r.source}</span></p>
              <form action={removeReviewAction}><input type="hidden" name="id" value={r.id} /><button className="t-small text-clay underline underline-offset-4">Remove</button></form>
            </li>
          ))}
        </ul>
        <form action={addReviewAction} className="mt-5 grid gap-4 md:grid-cols-[1fr_200px_140px_auto] md:items-end">
          <label className="t-small block">Quote<textarea name="quote" rows={2} required className={area} /></label>
          <label className="t-small block">Client name<input name="author" required className={input} /></label>
          <label className="t-small block">Source<select name="source" className={input}><option value="google">Google</option><option value="instagram">Instagram</option><option value="whatsapp">WhatsApp</option></select></label>
          <button className={btn}>Add</button>
        </form>
      </Block>

      <Block title="Before & after pairs" hint="Upload a matching before and after of the same client. Verified pairs switch the homepage to a true before/after slider.">
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {s.gallery.map((g) => (
            <li key={g.id} className="rounded-card border border-border bg-bone p-3">
              <div className="grid grid-cols-2 gap-2">
                <div className="relative aspect-[4/5] overflow-hidden rounded-[10px]"><Image src={g.beforeUrl} alt="Before" fill sizes="200px" className="object-cover" unoptimized /></div>
                <div className="relative aspect-[4/5] overflow-hidden rounded-[10px]"><Image src={g.afterUrl} alt="After" fill sizes="200px" className="object-cover" unoptimized /></div>
              </div>
              <p className="t-small mt-2 text-taupe">{galleryFilters.find((f) => f.id === g.category)?.label} {g.caption && `· ${g.caption}`}</p>
              <form action={removeGalleryPairAction} className="mt-2"><input type="hidden" name="id" value={g.id} /><button className="t-small text-clay underline underline-offset-4">Remove</button></form>
            </li>
          ))}
        </ul>
        <form action={addGalleryPairAction} className="mt-6 grid gap-4 md:grid-cols-4 md:items-end">
          <label className="t-small block">Before photo<input type="file" name="before" accept="image/*" required className="mt-1.5 block w-full t-small" /></label>
          <label className="t-small block">After photo<input type="file" name="after" accept="image/*" required className="mt-1.5 block w-full t-small" /></label>
          <label className="t-small block">Service<select name="category" className={input}>{galleryFilters.filter((f) => f.id !== "all").map((f) => <option key={f.id} value={f.id}>{f.label}</option>)}</select></label>
          <label className="t-small block">Caption<input name="caption" placeholder="Optional" className={input} /></label>
          <div className="md:col-span-4"><button className={btn}>Upload pair</button></div>
        </form>
      </Block>
    </div>
  );
}

function Block({ title, hint, children }: { title: string; hint: string; children: React.ReactNode }) {
  return (
    <section className="grid gap-6 lg:grid-cols-12">
      <div className="lg:col-span-4">
        <h2 className="font-display text-[30px] leading-none">{title}</h2>
        <p className="t-small mt-3 max-w-[38ch] text-taupe">{hint}</p>
      </div>
      <div className="lg:col-span-8">{children}</div>
    </section>
  );
}
