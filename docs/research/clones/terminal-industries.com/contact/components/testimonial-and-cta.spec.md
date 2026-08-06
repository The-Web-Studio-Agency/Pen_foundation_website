# TestimonialStrip + FinalCTA + ContactPageFooter Specification

## Overview
- **Target files:** `src/components/contact/TestimonialStrip.tsx`,
  `src/components/contact/FinalCTA.tsx`, `src/components/contact/ContactPageFooter.tsx`
- **Interaction model:** scroll-reveal fades only; button hover.
- **Section bg:** continues the dark block from ResourcesSection (`bg-pen-dark` / `bg-pen-deep`)
  through testimonial → CTA → footer, no divider between these three (matches reference: one
  continuous dark block from the wavy divider all the way to the page end).

## TestimonialStrip content
- No 5-star Gartner badge (that's Terminal's proprietary award — omit entirely rather than fake
  a rating source). Instead: a simple quote mark + centered testimonial text + generic role
  attribution (NOT a fabricated named client/company, per "no fabricated testimonials" instruction):
  - Quote: "The engineering was ready before our excavator even left the yard. That kind of speed
    changes how you plan a build."
  - Attribution: "— Site Engineer, Residential Project" (role-based, not a specific invented person/company)
  - Small "Read more stories" link → `/projects`
- Styling: centered, max-w-3xl, quote in `font-serif text-2xl md:text-3xl text-white leading-snug`,
  attribution `font-mono text-[11px] tracking-[0.2em] uppercase text-white/50 mt-6`.

## FinalCTA content
- Reuses PEN's REAL existing tagline from `src/app/about/sections/Footer.tsx`:
  **"Let's build on solid ground."**
- Sub-line: "Tell us about your site and we'll size the system before we ever break ground."
- Single CTA button: "START YOUR PROJECT" → scrolls back to the contact form (`#top` anchor on
  the page, or `href="#contact-form"` if the form section gets an id).
- Reference heading measured: `fontSize:85.98px lineHeight:81.68px letterSpacing:-3.6px
  fontWeight:400 color:white`. PEN: reuse `Statement size="xl"` (`clamp(3rem,8.5vw,9rem)`),
  `text-white`, same tracking-tight/leading-tight spirit already baked into that component.
- Button styling: reuse the same muted/dark treatment as `ContactForm.tsx`'s disabled-submit look
  but ACTIVE here — `bg-white/10 hover:bg-white/20 text-white border border-white/20`, mono
  uppercase tracked label, transition-colors 300ms.
- Wavy top divider is on ResourcesSection, not repeated here (one continuous dark block).

## ContactPageFooter content (page-scoped — does NOT touch the shared global
`src/components/layout/Footer.tsx`, which is an unrelated stub used by other routes)
- 3 columns, `text-white`:
  1. **Explore** — Engineering (`/engineering`), Applications (`/applications`), Projects (`/projects`)
  2. **Company** — About (`/about`), Research (`/research`), Gallery (`/gallery`)
  3. **Reach us** — "Have a project in mind?" + `mailto:info@cdisc.in` (real, from
     `src/app/about/sections/Footer.tsx`). No phone number, no social icons — none exist anywhere
     in the codebase; inventing them would violate "no fabricated content."
- Bottom row: "© {year} C-DISC Technologies Pvt Ltd" + "Kozhikode, Kerala" (real, reused verbatim
  from the existing about-page footer for consistency across the site).
- Column headers: `font-mono text-[10px] tracking-[0.3em] uppercase text-white/40`, links
  `text-white/80 hover:text-white transition-colors`.

## Responsive
- Desktop: testimonial centered narrow column; CTA centered; footer 3-col.
- Tablet: same, footer 3-col tightens.
- Mobile: testimonial text smaller (`text-xl`); CTA heading drops to `Statement`'s clamp min;
  footer stacks to 1-col with `gap-10`.
