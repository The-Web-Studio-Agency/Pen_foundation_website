import { Applications } from '@/components/homepage/Applications/Applications';
import { CalculatorSection } from '@/components/homepage/Calculator/CalculatorSection';
import { Capabilities } from '@/components/homepage/Capabilities/Capabilities';
import { Faq } from '@/components/homepage/Faq/Faq';
import { Hero } from '@/components/homepage/Hero/Hero';
import { HomeFormSection } from '@/components/homepage/HomeForm/HomeFormSection';
import { InAction } from '@/components/homepage/InAction/InAction';
import { LogoWall } from '@/components/homepage/LogoWall/LogoWall';
import { ProcessSteps } from '@/components/homepage/Process/ProcessSteps';
import { Proof } from '@/components/homepage/Proof/Proof';
import { SectionIntro } from '@/components/homepage/SectionIntro/SectionIntro';
import { NotchSeparator } from '@/components/homepage/shared/NotchSeparator';
import { Statement } from '@/components/homepage/Statement/Statement';
import { WhatIsPen } from '@/components/homepage/WhatIsPen/WhatIsPen';
import { WhyPen } from '@/components/homepage/WhyPen/WhyPen';
import { createMetadata } from '@/config/seo';
import { builtBy, howItWorks, logoWall, validationLogos } from '@/content/data/homepage';

export const metadata = createMetadata({
  title: 'Pre-Engineered Nail Foundation System',
  description:
    'PEN Foundation is a patented pre-engineered nail foundation: installed in about two hours, load-bearing immediately, zero excavation. Field-validated at NIT Calicut to IS 2911 Part 4.',
  path: '/',
});

/**
 * The homepage is one argument, told in five movements:
 *
 *   UNDERSTAND  hero → supporters → statement → why → capabilities → the system
 *   TRUST       how it works → applications → projects → validation
 *   QUANTIFY    the estimator
 *   ENQUIRE     the form → FAQ
 *
 * Every section ends on a call to action and none of them is a dead end. The
 * ladder escalates rather than repeating: it starts by pointing further down
 * the page, and only asks for the enquiry once the argument has been made.
 *
 * Section order and the notch separators between the first three follow the
 * reference's measured topology. The separators are zero-height: each pulls a
 * 48px coloured lip up over the section above it, so it belongs to the section
 * that follows.
 *
 * The investor wall reuses `LogoWall` with single-entry reels — those marks are
 * static, while the supporter wall above cycles.
 *
 * No <SiteHeader>/<SiteFooter> here: the reference page rendered its own pair,
 * but the root layout already wraps every route in the one header and footer.
 * Rendering them again would double the site chrome and trip `arch:check`'s
 * singleton rule.
 *
 * No `pt-nav` here, unlike every other route. The hero's pinned stage is a full
 * viewport tall and is designed to run underneath the fixed header — the
 * translucent pill floats over it, exactly as on the reference. Adding the nav
 * offset pushed the whole page down and put a white band above the hero.
 *
 * The WebGL film that previously stood as a placeholder here is unbuilt; its
 * geometry still lives in src/components/three — see
 * docs/decisions/0006-homepage-film.md.
 */
export default function HomePage() {
  return (
    <div className="home-clone flex min-h-screen flex-col bg-[var(--c-white)] text-[var(--c-dark-green)]">
      {/* ================================================== UNDERSTAND ==== */}

      {/* LOCKED — approved as-is. Do not edit Hero or its content. */}
      <Hero />

      {/* Supporters sit straight under the hero so the claim is vouched for
          before the page starts arguing it. */}
      <NotchSeparator tone="white" />
      <LogoWall heading={logoWall.heading} note={logoWall.note} cells={logoWall.cells} />

      {/* No separator above the statement: it is a dark band and `section.svg`
          shapes its own top and bottom edges into the notch profile, so it
          carries the transition on both sides itself. */}
      <Statement />

      {/* The problem, then the advantages it costs you — WhyPen's lead ends on
          a colon and Capabilities is the list it promises. */}
      <WhyPen />

      <Capabilities />

      {/* Only now does the page say what the thing actually is: the mechanism,
          the parts with their real specifications, and the comparison against
          the footing it replaces. */}
      <WhatIsPen />

      {/* The argument in three pictures, before it turns into process: the
          product, the excavation it replaces, and the structure it carries. */}
      <InAction />

      {/* ======================================================= TRUST ==== */}

      <ProcessSteps content={howItWorks} />

      <Applications />

      <Proof />

      {/* Who validated it. The evidence table that used to sit under this wall
          is gone; the FAQ's "What testing has been done?" entry carries the
          methodology now, so the chapter is the heading and the marks. */}
      <SectionIntro id="validation" heading={builtBy.heading} className="min-h-svh" />

      <LogoWall
        cells={validationLogos.map((logo) => ({ reel: [logo] }))}
        // Three marks, kept at the same cell size as the supporter wall above
        // rather than stretched to a third of the page each.
        perRow={7}
      />

      {/* ==================================================== QUANTIFY ==== */}

      <CalculatorSection />

      {/* ===================================================== ENQUIRE ==== */}

      <HomeFormSection />

      {/* Below the form, not above it. The page has already made its case by
          here, so the ask goes first and the FAQ sits under it as the backstop
          for whoever is not ready — its own CTA scrolls back up to the form. */}
      <Faq />
    </div>
  );
}
