/* /services copy. Figma-only layout copy is marked; service facts come from services.ts. */
export const servicesPage = {
  eyebrow: "Services & Pricing",
  title: "Choose the finish that fits your skin and style.",
  intro:
    "Every treatment starts with custom mapping. The difference is mainly how much visible hair-stroke detail versus soft shading you want, and what your skin type retains best.",
  cta: "Start with the safety screening",
  /** Editorial imagery (licensed stock, docs/image-credits.md). */
  heroImage: { src: "/images/editorial/close-up-eye.jpg", alt: "Editorial close-up of an eye and brow in warm directional light" },
  educationImages: [
    { src: "/images/editorial/process-pen-mapping.jpg", alt: "Brow mapping with a measuring pen, editorial image" },
    { src: "/images/editorial/tint-brush.jpg", alt: "Editorial image of a brow artist applying tint with a fine brush while the client smiles" },
  ],
  /** Figma sub-labels per card. Only "The Signature Look" is in the brief; the others are design copy. */
  cardLabels: {
    "combo-brows": "The Signature Look",
    "ombre-powder-brows": "Soft Makeup Finish",
    microblading: "Hyper-Natural Strokes",
  } as Record<string, string>,
  /** Figma one-line descriptors used in the booking service selector. */
  shortDescriptions: {
    "combo-brows": "Nano strokes + soft shading",
    "ombre-powder-brows": "Soft gradient makeup finish",
    microblading: "Fine natural hair strokes",
  } as Record<string, string>,
  /* Brief §5 required supporting headings · copy restricted to confirmed facts. */
  education: [
    {
      id: "microblading-vs-ombre",
      heading: "Microblading vs. Ombre Powder Brows",
      body: [
        "Microblading places individual hair-like strokes into the skin to mimic natural brow hairs, and suits normal-to-dry skin profiles looking for a subtle, hyper-natural enhancement.",
        "Ombre powder brows build a soft, misty, makeup-like gradient that starts lighter at the front and deepens toward the tail, a strong fit for oily skin or anyone who loves a daily \"freshly filled\" look.",
        "Combo brows blend the two: realistic nano-strokes at the front with soft powder shading through the body and tail, for all skin types and especially sparse or asymmetrical brows.",
      ],
    },
    {
      id: "semi-permanent-procedures",
      heading: "Long-Lasting Semi-Permanent Eyebrow Procedures",
      body: [
        "All three treatments are semi-permanent procedures performed by appointment at our Ikeja studio. Sessions run 2 to 2.5 hours depending on the technique.",
        "A 4–6 week touch-up session completes the process, perfecting the shape once your brows have fully healed. Touch-up pricing will be confirmed by the studio.",
      ],
    },
    {
      id: "mapping-and-aftercare",
      heading: "Custom Brow Mapping and Aftercare",
      body: [
        "Each session begins with brow mapping tailored to your facial features, skin and desired finish, so the result looks refined, natural and unmistakably yours.",
        "Before your appointment, please avoid alcohol, caffeine, and aspirin for 24 hours to ensure optimal pigment retention. Full aftercare guidance is provided at the studio.",
      ],
    },
  ],
} as const;
