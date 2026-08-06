import { Benefits } from '@/components/homepage/Benefits/Benefits';
import { Capabilities } from '@/components/homepage/Capabilities/Capabilities';
import { Hero } from '@/components/homepage/Hero/Hero';
import { HomeFormSection } from '@/components/homepage/HomeForm/HomeFormSection';
import { LogoWall } from '@/components/homepage/LogoWall/LogoWall';
import { Monogram } from '@/components/homepage/Monogram/Monogram';
import { SectionIntro } from '@/components/homepage/SectionIntro/SectionIntro';
import { NotchSeparator } from '@/components/homepage/shared/NotchSeparator';
import { Statement } from '@/components/homepage/Statement/Statement';
import { Testimonial } from '@/components/homepage/Testimonial/Testimonial';
import { createMetadata } from '@/config/seo';
import { builtBy, howItWorks, investorLogos, logoWall } from '@/content/data/homepage';

export const metadata = createMetadata({
  title: 'Pre-Engineered Nail Foundation System',
  description:
    'PEN Foundation engineers driven-nail foundation systems as an alternative to poured concrete footings — less concrete, no cure time, engineered per site.',
  path: '/',
});

/**
 * Section order and the notch separators between them follow the reference's
 * measured topology. The separators are zero-height: each pulls a 48px coloured
 * lip up over the section above it, so it belongs to the section that follows.
 *
 * The investor wall reuses `LogoWall` with single-entry reels — those marks are
 * static, while the customer wall above cycles.
 *
 * No <SiteHeader>/<SiteFooter> here: the reference page rendered its own pair,
 * but the root layout already wraps every route in the one header and footer.
 * Rendering them again would double the site chrome and trip `arch:check`'s
 * singleton rule. `pt-nav` clears the fixed header pill.
 *
 * The WebGL film that previously stood as a placeholder here is unbuilt; its
 * geometry still lives in src/components/three — see
 * docs/decisions/0006-homepage-film.md.
 */
export default function HomePage() {
  return (
    <div className="home-clone flex min-h-screen flex-col bg-[var(--c-white)] pt-nav text-[var(--c-dark-green)]">
      <Hero />

      <NotchSeparator tone="white" />
      <LogoWall heading={logoWall.heading} cells={logoWall.cells} />

      <NotchSeparator tone="white" />
      <Statement />

      <Capabilities />

      <Monogram />

      <Benefits />

      <SectionIntro label={builtBy.label} heading={builtBy.heading} />

      <LogoWall cells={investorLogos.map((logo) => ({ reel: [logo] }))} className="pb-24" />

      <Testimonial />

      <SectionIntro
        label={howItWorks.label}
        heading={howItWorks.heading}
        linkLabel={howItWorks.linkLabel}
        linkHref={howItWorks.linkHref}
      />

      <HomeFormSection />
    </div>
  );
}
