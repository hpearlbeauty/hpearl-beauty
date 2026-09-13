# hpearl_beauty — UI + Motion Handoff for Claude Code

## 1. Design Direction
Foundation: **Editorial Atelier**.
Borrowed qualities: warmer cocoa/champagne accents from Modern African Luxury; highly legible service and booking information from Clinical Precision × Beauty House.

Core feel: premium beauty house, editorial, feminine, precise, modern, Lagos-local, warm, restrained, high trust.
Avoid: generic pink salon styling, over-glossy gold, excessive gradients, glassmorphism, floating-card overload, small low-contrast copy, bouncy app-like motion.

## 2. Visual Tokens

### Color
- Ink / Near Black: `#17120F`
- Espresso: `#2B1912`
- Deep Cocoa: `#3A241A`
- Warm Ivory: `#F6F0E7`
- Bone: `#FBF8F4`
- Soft Sand: `#E8D8C7`
- Clay: `#A65C43`
- Champagne: `#CBA477`
- Muted Taupe: `#8B7B70`
- Border Light: `#DED2C5`

### Typography
- Display / Editorial: **Playfair Display**
- UI / Body / Booking: **Inter**

Recommended sizes:
- Hero desktop: 64–72px / 0.98–1.05 line height
- Hero mobile: 38–46px
- H2 desktop: 42–48px
- H2 mobile: 30–34px
- H3: 26–32px
- Body large: 18px / 28–30px
- Body: 16px / 24–26px
- Smallest supported copy: 14px / 20px
- Labels: 13–14px semi-bold with slight tracking

Do not ship anything below 14px except legal fine print.

### Radius
- Image/editorial frame: 20–24px
- Cards: 14–18px
- Buttons: 10–12px
- Form controls: 12–14px

### Spacing
Use an 8px base grid. Primary section rhythm: 96–144px desktop, 64–88px mobile.

## 3. Homepage Structure

### Header
Desktop: transparent/dark over hero, 72–84px tall.
- Left: `hpearl_beauty`
- Center/right: Home, Services, Academy, About, Shop
- CTA: Book Now

Mobile: wordmark + Menu. Menu opens as full-height espresso sheet with large editorial links.

### Hero
Desktop split composition: copy left, portrait/video right. Dark espresso/near-black field.
Copy:
- Eyebrow: `PRECISION BROW ARTISTRY · IKEJA, LAGOS`
- H1: `Flawless Semi-Permanent Brows Tailored to Your Face.`
- Supporting copy at least 16px
- Primary CTA: `Book Your Consultation`
- Secondary inline action: `Explore Our Work`

Hero must not continue as a dark page. Immediately transition into a generous warm-ivory section to prevent visual heaviness.

### Transformation Section
Warm ivory background.
- H2: `Real Transformations`
- Category chips: All / Combo Brows / Ombre Brows / Microblading
- Before/after interaction: draggable slider on desktop; tap-toggle or horizontal drag on mobile.
- Use real client work as the primary trust signal.

### Service Cards
High legibility is non-negotiable.
Each card includes:
- Service name
- One-sentence result description
- Duration
- Best for / skin type
- Starting price
- Small CTA: `View Details`

Cards should feel editorial, not SaaS-dashboard-like. Prefer subtle warm border + mostly flat surface.

### Founder / Trust Section
Dark cocoa band or split editorial portrait section.
Copy should establish artistry, mapping precision, safety and local authority.

### Social Proof
Use real review quotes and Instagram/social screenshots sparingly. Consider horizontal testimonial marquee only if accessibility/reduced motion is handled.

### Booking CTA
High-contrast editorial close before footer.
Headline example: `Your best brows should still look like you.`
CTA: `Book Your Brow Session`

## 4. Academy Page

### Hero
Light editorial hero rather than repeating the dark homepage hero.
- Eyebrow label: `HPEARL BEAUTY ACADEMY`
- H1: `Learn Brow Artistry. Build a Business Around Your Skill.`
- Subcopy centered on hands-on mastery and direct guidance.
- CTA: `Reserve Your Academy Seat`

### Curriculum
Accordion, not a dense three-column list on mobile.
- Day 1 — Color Theory, Facial Mapping, Skin Anatomy
- Day 2 — Latex Practice, Needle Depth, Machine Control
- Day 3 — Live Model Performance + Guided Execution

### Student Kit
Large editorial still life / kit image.
Include: mapping string, PMU machine, practice latex, measurement tools, pigment-related accessories where appropriate.

### Conversion Close
Deposit-required seat reservation, cohort scarcity messaging only if true.

## 5. Booking Flow

### Step 1 — Health & Safety
Split desktop layout:
- Left: dark editorial reassurance panel
- Right: very legible form

Checkboxes:
- Pregnant or nursing
- History of keloids or hypertrophic scarring
- Taking active blood thinners or Accutane treatments
- Previous PMU / eyebrow tattoo from another studio

Logic:
- Any selected = replace primary button with `Talk to us on WhatsApp`
- None selected = `Continue to Date & Time`

Never hide this logic behind subtle copy; the CTA should visibly change.

### Step 2 — Date & Time
Desktop layout: month calendar left, available slots right.
Mobile: date strip or compact calendar followed by slot chips.
Selected slot uses cocoa fill + ivory text.
Include timezone/location cue: `Ikeja, Lagos · WAT`.

### Step 3 — Deposit
Order summary + payment explanation.
Prominent copy:
`A 50% deposit locks your appointment. The remaining balance is paid at the studio.`

Order summary fields:
- Service
- Date
- Time
- Deposit due now
- Balance at studio

CTA: `Pay 50% Deposit Securely`
Payment provider logo(s) shown quietly below CTA.

### Confirmation
Editorial success state, not a generic green success screen.
- `Your brow session is locked in.`
- Date/time summary
- Studio address
- Pre-appointment prep
- WhatsApp confirmation status
- Add-to-calendar button

## 6. Motion Principles

Motion character: **slow, tactile, fashion-editorial, controlled**.
Avoid springy/bouncy motion.

Preferred web easing:
- Entrance: `cubic-bezier(0.22, 1, 0.36, 1)`
- Exit: `cubic-bezier(0.4, 0, 1, 1)`
- Micro interaction: `cubic-bezier(0.2, 0.8, 0.2, 1)`

### Hero Motion
Use a muted 5s Higgsfield-generated editorial video loop if quality passes review.
- Slow push-in only
- Minimal facial/head movement
- No morphing
- Preserve brows exactly
- Text remains static relative to viewport; video moves independently
- Add subtle dark overlay for readability

Autoplay only when allowed; always muted; `playsInline`; poster image fallback.
On `prefers-reduced-motion`, show poster image only.

### Page Load
Sequence:
1. Header opacity 0 → 1 in 450ms
2. Eyebrow label rises 12px + fades in at 150ms delay
3. H1 animates line-by-line, 60–90ms stagger per line
4. Body and CTAs fade/translate 10px after headline completes
5. Hero image/video scales from 1.025 → 1 over 900ms

Do not animate every element on initial load.

### Scroll Reveals
- Section heading: y 24 → 0, opacity 0 → 1, 650ms
- Editorial images: clip-path/mask reveal or scale 1.03 → 1, 800–1000ms
- Cards: 40–60ms stagger, max 3 items per row

Once revealed, do not repeatedly animate on re-entry.

### Navigation
Desktop header becomes warm-ivory / blurred-solid only after leaving hero.
Transition 250ms.
Mobile menu:
- Full-screen sheet from opacity + slight translateY, not slide-from-side drawer
- Links enter sequentially, 45ms stagger
- Close icon rotates no more than 45deg

### Buttons
Hover desktop:
- background shifts one tonal step
- text remains fixed
- optional 1–2px lift max
- 160–200ms
No large magnetic cursor effect.

### Transformation Slider
Dragging should be direct 1:1, no easing while pointer is down.
On release only, handle settles in 180ms if snapped.
Handle gets subtle scale 1 → 1.05 on hover/focus.

### Service Cards
Hover:
- image scale 1 → 1.025 over 500ms
- border warms slightly
- arrow shifts 4px
No card translation above 2px.

### Accordion
Height + opacity transition 280–340ms.
Icon rotates 45deg or switches plus/minus.
Avoid huge content jump by using measured height.

### Booking Progress
Progress indicator morphs between steps in 350ms.
Step content swaps with horizontal distance under 24px.
Do not use carousel-like large slides.

### Checkbox State
Checkbox fill 140ms.
CTA state change after red flag:
- button content cross-fade 180ms
- optional soft clay outline around consultation notice
No flashing red warning state.

### Date / Time Selection
Slot selection: 160ms color transition.
Calendar month change: 250ms crossfade + 12px horizontal shift.

### Payment Success
Use a restrained check stroke or thin-line emblem animation under 800ms.
Avoid confetti.

## 7. Mobile Behavior

- Preserve editorial image impact, but stack content in a clear reading order.
- Hero image first or immediately after wordmark can work; keep CTA visible without excessive scrolling.
- Sticky booking CTA may appear after hero, but should be a slim bottom bar, not a large floating pill.
- Service details remain fully readable; do not hide duration/skin type behind hover.
- Booking controls are full width with minimum 48px touch height.

## 8. Accessibility

- WCAG AA contrast minimum for text/UI.
- Focus-visible outline: 2px champagne/clay with 2px offset.
- 44px minimum interaction target, target 48px for booking controls.
- `prefers-reduced-motion` disables hero autoplay and non-essential transitions.
- Before/after slider must support keyboard arrows and accessible labels.
- Accordion buttons expose `aria-expanded`.
- Form errors remain text-based, never color-only.

## 9. Performance

- Hero video: WebM + MP4 fallback, 720p is enough for most desktop usage; target < 3–4 MB after compression if possible.
- Poster AVIF/WebP.
- Lazy-load all below-the-fold imagery.
- Use responsive `srcset` and fixed aspect-ratio containers to prevent CLS.
- Avoid JS-driven scroll animation when CSS/IntersectionObserver is sufficient.
- Keep motion library optional; Framer Motion is acceptable if already in the stack, otherwise CSS + IntersectionObserver is enough.

## 10. Claude Code Build Guidance

Suggested component map:
- `SiteHeader`
- `HeroEditorial`
- `TransformationGallery`
- `BeforeAfterSlider`
- `ServiceCard`
- `FounderStory`
- `ReviewStrip`
- `BookingCTA`
- `AcademyCurriculum`
- `StudentKitShowcase`
- `BookingShell`
- `HealthScreeningStep`
- `DateTimeStep`
- `DepositStep`
- `BookingConfirmation`
- `Footer`

State model for booking:
`screening -> consultation_required | datetime -> deposit -> confirmation`

Keep scheduling/payment/provider integrations behind adapters so the visual flow can be built and tested independently.

## 11. Current Figma Source of Truth

Working design file:
`https://www.figma.com/design/uP9XSpC9wMCLK42Xt3PLL8`

Current visual direction is the canonical target. Do not reinterpret this as a generic salon UI during implementation.

## 12. Higgsfield Hero Asset

A 5-second muted editorial hero animation has been commissioned from the selected real-client portrait.
Generation job id: `f03ef1e6-4978-47d9-8e13-623e0b15a8d8`

Use only if visual QA confirms facial/brow fidelity. If it does not pass, use the original still image and retain the same CSS motion plan (subtle scale/parallax) rather than accepting a compromised face or brow result.
