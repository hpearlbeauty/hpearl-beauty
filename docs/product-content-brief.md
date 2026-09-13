# hpearl_beauty Product & Content Brief

> **Purpose:** This file is the content and business-logic source of truth for the hpearl_beauty website implementation.
>
> **Important:** Do **not** invent or infer prices, testimonials, founder credentials, policies, medical claims, or business facts that are not explicitly confirmed here. Any item marked **TBD** must remain a clearly labeled placeholder until the business provides the real value.

---

## 1. Brand Overview

**Brand name:** hpearl_beauty  
**Primary location:** Ikeja, Lagos, Nigeria  
**Founder / Brow Artist:** Olayemi Aluko  
**Business category:** Semi-permanent brow studio and PMU training academy

### Brand Positioning

hpearl_beauty should be positioned as a premium, appointment-only brow studio focused on precision, safety, tailored brow design, and a luxury one-on-one client experience.

### Core Visual / Verbal Tone

- Premium
- Editorial
- Feminine without being cliché
- Precise
- Warm
- Modern African luxury
- Professional and safety-conscious
- High-trust

Avoid generic “pink salon” language or overly casual beauty-copy clichés.

---

## 2. Primary Website Goals

1. Build trust quickly through strong real-client imagery and transformation proof.
2. Help visitors understand the differences between Combo Brows, Ombre Powder Brows, and Microblading.
3. Qualify clients before booking through a mandatory health and safety screening.
4. Convert qualified visitors into booked appointments secured by a 50% deposit.
5. Route clients who need manual review to WhatsApp consultation.
6. Promote and convert high-value academy/masterclass enquiries.
7. Support long-term retention through automated touch-up reminders.

---

## 3. Primary User Journey

```text
Discovery / Organic Search
        |
        v
Homepage Entry
        |
        v
Interactive Transformation / Service Discovery
        |
        v
Mandatory Health & Safety Screening
        |
        +--> Red Flag Triggered --> WhatsApp Manual Consultation
        |
        +--> Screening Passed
                 |
                 v
         Date & Time Selection
                 |
                 v
         50% Deposit Checkout
                 |
                 v
         Booking Confirmation + Prep Instructions
                 |
                 v
         28-Day Touch-Up Reminder
```

---

# 4. Homepage Content (`/`)

## Hero

**H1:**  
Flawless Semi-Permanent Brows Tailored to Your Face.

**Sub-headline:**  
Experience the art of precision brow mapping by Olayemi Aluko in Ikeja, Lagos.

**Primary CTA:**  
Book Your Consultation & Procedure

**Secondary CTA:**  
Explore Our Work

### Hero Creative Direction

- Full-screen or near-full-screen premium visual treatment
- Dark espresso / near-black hero surface
- Real hpearl_beauty client photography preferred
- Muted cinematic video can be used if approved
- Keep enough negative space for headline copy
- Transition into significantly lighter warm-ivory content immediately after the hero

---

## Transformation Zone

### Section Heading

**hpearl_beauty Before and After Transformations**

### Filter Labels

- All
- Combo Brows
- Ombre Brows
- Microblading

### Interaction

Use an interactive before/after slider where verified matching before/after pairs are available.

**Asset rule:** If a verified hpearl_beauty-owned before/after pair is not available, show a placeholder rather than inventing or mismatching images.

---

## Social Proof

Use only verified client feedback supplied by hpearl_beauty.

Potential formats:

- Verified Google reviews
- Verified Instagram DM screenshots
- Client message screenshots with permission

### Testimonials / Reviews

**TBD — verified testimonial copy has not yet been supplied.**

> Do not generate fictional testimonials, names, star ratings, Google reviews, or Instagram messages.

---

## Homepage SEO Supporting Headings

Required supporting headings to include naturally:

- Luxury Semi-Permanent Brows in Lagos
- Professional Eyebrow Studio in Ikeja
- hpearl_beauty Before and After Transformations

### Homepage Primary SEO Keyword

**Best microblading in Ikeja**

> Use naturally. Do not keyword-stuff.

---

# 5. Services & Pricing (`/services`)

## Services Page Primary SEO Keyword

**Combo brows Lagos price**

## Required Supporting Headings

- Microblading vs. Ombre Powder Brows
- Long-Lasting Semi-Permanent Eyebrow Procedures
- Custom Brow Mapping and Aftercare

---

## Service 1 — Combo Brows

**Display name:**  
Combo Brows

**Optional label:**  
The Signature Look

**Description:**  
The ultimate luxury blend. Combines realistic nano-strokes at the front with a soft gradient powder shading through the body and tail for an effortlessly full, defined look.

**Duration:**  
2.5 Hours

**Who it’s for:**  
All skin types, especially clients looking to fix sparse areas or asymmetrical brows.

**Price:**  
TBD

> Do not infer or invent the price.

---

## Service 2 — Ombre Powder Brows

**Display name:**  
Ombre Powder Brows

**Description:**  
A soft, misty, makeup-like finish that starts lighter at the front of the brow and deepens toward the tail. Creates a beautiful, gradient shadow effect.

**Duration:**  
2 Hours

**Who it’s for:**  
Oily skin types or clients who love a daily "freshly filled" makeup appearance.

**Price:**  
TBD

> Do not infer or invent the price.

---

## Service 3 — Microblading

**Display name:**  
Microblading

**Description:**  
Hyper-realistic, individual hair-like strokes drawn manually into the skin to mimic natural brow hairs.

**Duration:**  
2 Hours

**Who it’s for:**  
Normal-to-dry skin profiles looking for subtle, hyper-natural enhancements.

**Price:**  
TBD

> Do not infer or invent the price.

---

## Additional Service Pricing

- Touch-up session: **TBD**
- Any other PMU services: **TBD**

> Only display additional services when confirmed by hpearl_beauty.

---

# 6. Booking Flow (`/book`)

The booking flow must **not** send users directly to a calendar. Every client first passes through the health and safety screening.

---

## Step 1 — Health & Safety Screening

### Intro Copy

To ensure beautiful, safe results, please review our mandatory health check. Are you currently experiencing any of the following?

### Screening Options

- Pregnant or nursing
- History of Keloids or hypertrophic scarring
- Taking active blood thinners or Accutane treatments
- Previous permanent makeup/eyebrow tattoos from another studio

### Logic Gate

#### If ANY option is selected

Show:

> Based on your selection, we need a manual consultation. Let's talk over WhatsApp to evaluate your options safely.

**CTA:**  
Continue on WhatsApp

**Behavior:**  
Do not allow direct continuation to appointment/payment until manual consultation occurs.

#### If NO options are selected

Allow progression to Step 2.

---

## Step 2 — Date & Time Picker

### Requirements

- Clean minimalist calendar
- Real-time availability architecture
- Service selection visible in context
- User selects an available date and time
- Backend calendar provider: **TBD**

> Build the UI and integration layer so the provider can be swapped later.

---

## Step 3 — 50% Deposit Checkout

### On-Screen Copy

**Heading:**  
Secure Your Appointment.

**Body copy:**  
We operate strictly by appointment to maintain our high standard of dedicated, one-on-one luxury care. A 50% deposit is required to lock in your calendar slot. The remaining balance is paid at the studio.

### Payment Providers

Architecture should support either:

- Paystack
- Flutterwave

**Final provider:**  
TBD

### Payment Logic

- Required deposit: 50% of the selected service price
- Appointment is not considered locked until deposit succeeds
- Do not expose payment secrets in frontend code

---

## Booking Confirmation State

After a successful deposit:

- Confirm booking success
- Display selected service
- Display date/time
- Display studio location
- Display pre-appointment instructions
- Trigger WhatsApp confirmation when backend automation is available

---

# 7. Studio Location

**Studio Location:**  
No 3, Olaribiro Street, off Adegbeyemi Street, Alade Bus Stop, Allen, Ikeja, Lagos.

> Use this exact address unless hpearl_beauty provides an updated location.

---

# 8. Pre-Appointment Instructions

Current confirmed copy:

Please avoid alcohol, caffeine, and aspirin for 24 hours before your appointment to ensure optimal pigment retention.

> Do not add additional medical or medication restrictions unless they are explicitly approved by hpearl_beauty.

---

# 9. Automated WhatsApp Copy

## Script A — Successful Booking Confirmation

**Trigger:**  
Client passes screening and successfully pays the 50% deposit.

**Message:**

Hello **{Client Name}**, your brow transformation is locked in! ✨

We have successfully received your 50% deposit for your **{Service Name}** session on **{Date & Time}**.

📍 **Studio Location:** No 3, Olaribiro Street, off Adegbeyemi Street, Alade Bus Stop, Allen, Ikeja, Lagos.

💡 **Pre-Appointment Instructions:** Please avoid alcohol, caffeine, and aspirin for 24 hours before your appointment to ensure optimal pigment retention.

We look forward to creating your dream brows!

---

## Script B — 28-Day Touch-Up Reminder

**Trigger:**  
Automatically sent exactly 28 days after the initial appointment.

**Message:**

Hi **{Client Name}**, it’s been 4 weeks since your signature brow session at hpearl_beauty! 🤍

Your brows should be fully healed by now. To perfect your look, lock in the shape, and ensure your brows last up to 2 years, it is time for your mandatory **4–6 week touch-up session**.

Tap this link to claim a priority touch-up time slot automatically: **[hpearlbeauty.com]**

### Important Claim Note

The phrase **“last up to 2 years”** appears in the supplied source copy but has not been independently verified in this brief.

> Keep it only if hpearl_beauty confirms they want this claim used publicly. Otherwise change to a safer approved statement before launch.

---

# 10. Academy (`/academy`)

## Academy Primary SEO Keyword

**Microblading training Lagos**

## Required Supporting Headings

- Learn Brow Artistry From Olayemi Aluko
- Professional PMU Masterclass Nigeria
- Hands-On Beauty Academy and Kits

---

## Academy Hero

**Headline:**  
Turn Your Passion for Beauty Into a Six-Figure Business.

### Claim Note

The “Six-Figure Business” claim is part of the supplied concept copy but has not been substantiated in the provided source material.

> Confirm before public launch. If not approved, replace with a non-earnings claim such as “Build Professional Brow Artistry Skills.”

---

## Curriculum

### Day 1

Color Theory, Facial Mapping, and Skin Anatomy.

### Day 2

Hands-on Practice on Artificial Latex and Needle Depth Control.

### Day 3

Live Model Performance under direct guidance from Olayemi Aluko.

---

## Student Kit Showcase

Potential included items listed in the original concept:

- Custom mapping strings
- PMU machines
- Practice latex sheets

**Final included kit contents:**  
TBD

> Do not promise specific kit items until hpearl_beauty confirms the final list.

---

## Academy CTA

**CTA:**  
Reserve Your Academy Seat (Deposit Required)

### Intended Behavior

- Student pays required academy deposit
- Seat is reserved
- Immediate WhatsApp delivery of preparation syllabus/manual can be triggered

### Academy Pricing

- Full tuition: **TBD**
- Required deposit: **TBD**

> Do not infer or invent academy pricing.

---

# 11. Founder Copy

## Confirmed Founder Information

**Name:** Olayemi Aluko  
**Role:** Brow artist / founder context implied by the supplied website concept  
**Location:** Ikeja, Lagos

### Founder Bio

**TBD — a verified founder biography has not yet been supplied.**

> Do not invent years of experience, certifications, client counts, awards, training history, or credentials.

### Safe Temporary Founder Copy

Use only if a founder section is needed before the final bio is supplied:

> Olayemi Aluko brings a detail-led approach to semi-permanent brow artistry, with each treatment shaped around the client’s natural features and desired finish.

This temporary sentence is general marketing copy, not a credential claim.

---

# 12. Testimonials & Social Proof

## Verified Testimonials

**TBD**

## Rules

Do not create:

- Fake names
- Fake client photos
- Fake star ratings
- Fake Google reviews
- Fake Instagram DMs
- Fake booking counts
- Fake “X clients served” metrics

Use placeholders until verified material is supplied.

---

# 13. Photography & Asset Rules

## Production Asset Rule

Use only images that are clearly approved for hpearl_beauty.

### Exclude

Any photo carrying another studio’s watermark, logo, username, or visible branding, including references such as:

- Brows by Ella
- Lash by Extees
- Nini vlog

### Do Not

- Crop out third-party watermarks
- Retouch them away
- Blur them
- Cover them with UI
- Present third-party-branded work as hpearl_beauty work

### Missing Before / After Pairs

Use clearly labeled placeholders until verified matching pairs are supplied.

---

# 14. SEO Strategy

## Homepage (`/`)

**Primary keyword:**  
Best microblading in Ikeja

**Required supporting headings:**

- Luxury Semi-Permanent Brows in Lagos
- Professional Eyebrow Studio in Ikeja
- hpearl_beauty Before and After Transformations

---

## Services (`/services`)

**Primary keyword:**  
Combo brows Lagos price

**Required supporting headings:**

- Microblading vs. Ombre Powder Brows
- Long-Lasting Semi-Permanent Eyebrow Procedures
- Custom Brow Mapping and Aftercare

---

## Academy (`/academy`)

**Primary keyword:**  
Microblading training Lagos

**Required supporting headings:**

- Learn Brow Artistry From Olayemi Aluko
- Professional PMU Masterclass Nigeria
- Hands-On Beauty Academy and Kits

---

## SEO Rules

- Use keywords naturally
- Avoid repetitive keyword stuffing
- Keep location relevance strong for Ikeja and Lagos
- Use structured page titles and meta descriptions
- Use meaningful alt text for real portfolio imagery
- Do not make unverified superiority claims such as “#1 brow studio in Nigeria” unless independently substantiated and approved

---

# 15. Navigation

Recommended primary navigation:

- Home
- Services
- Book
- Academy
- About / Founder (optional if content is supplied)
- Contact

Future-ready:

- Shop

Primary persistent CTA:

**Book Now** or **Book Your Consultation & Procedure**

---

# 16. Future `/shop` Page

The original concept mentions adding aftercare-product e-commerce later.

## Status

**Not yet fully specified.**

Do not implement product claims, products, prices, inventory, delivery rules, or payment logic for `/shop` until hpearl_beauty supplies those details.

The architecture may remain future-ready for:

- Aftercare products
- Product detail pages
- Cart
- Checkout
- Order confirmation

---

# 17. Content Still Required From hpearl_beauty

The following items remain **TBD** and should be requested before production launch:

1. Combo Brows price
2. Ombre Powder Brows price
3. Microblading price
4. Touch-up price
5. Academy tuition
6. Academy deposit
7. Final list of academy kit contents
8. Verified founder biography
9. Verified founder credentials/certifications, if they should appear
10. Verified testimonials / Google reviews / Instagram client feedback
11. Verified before-and-after image pairs
12. Final booking-calendar provider
13. Final payment provider: Paystack or Flutterwave
14. Official WhatsApp business number / API provider
15. Booking cancellation / rescheduling policy
16. Deposit refundability policy
17. Studio opening days / hours
18. Final domain / booking URLs
19. Final social-media handles
20. Privacy policy and terms content

---

# 18. Developer Guardrails

For engineering and Claude Code:

- Treat this file as the **business/content source of truth**.
- Treat the Figma file as the **visual source of truth**.
- Treat `hpearl_beauty_ui_motion_handoff.md` as the **interaction and motion source of truth**.
- Do not replace confirmed copy with invented copy without explicit approval.
- Do not use Figma mockup prices as real prices.
- Do not turn placeholder testimonials into realistic-looking fictional testimonials.
- Do not make medical claims beyond the approved source copy.
- Keep all TBD business data centralized so it can be replaced in one place.

---

# 19. Suggested Structured Content Object

Engineering may centralize site content in a CMS or content configuration. Suggested fields:

```text
brand
founder
location
services[]
  name
  description
  duration
  audience
  price
booking
  depositPercentage
  healthQuestions[]
  paymentProvider
  calendarProvider
academy
  headline
  curriculum[]
  kitItems[]
  tuition
  deposit
testimonials[]
seo
whatsapp
policies
```

Any unknown values must remain `null`, empty, or explicitly `TBD` rather than being guessed.

---

## Final Source-of-Truth Note

This document was prepared from the hpearl_beauty concept blueprint supplied for the website project. It intentionally preserves the confirmed copy and structure while isolating missing business facts as **TBD**.

Before launch, hpearl_beauty should review and approve all pricing, testimonial content, founder claims, medical/pre-appointment wording, academy claims, policies, and contact information.


---

# Addendum (13 Sep 2026): service categories

Confirmed by hpearl_beauty via the website owner: the studio offers four categories, **Eyebrow, Makeup, Lash, Body Waxing**.
Only the Eyebrow menu (Combo Brows, Ombre Powder Brows, Microblading) is specified. Makeup, Lash and Body Waxing
services, durations and prices are **TBD** and must not be invented; the site shows a labelled placeholder and a
WhatsApp enquiry for these until supplied.
