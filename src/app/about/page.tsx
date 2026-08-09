import {
  Hero,
  NumberedFeatures,
  StoryValues,
  PersonGrid,
  leadersIntro,
  investorsIntro,
} from '@/features/about';
import { createMetadata } from '@/config/seo';
import { SectionHeading } from '@/components/typography';
import { ValuesSection } from '@/components/values';
import { LogoGrid } from '@/components/shared/grids/LogoGrid';
import { leadershipTeam } from '@/content/data/people';

export const metadata = createMetadata({
  title: 'About',
  description:
    'PEN Foundation was created to challenge one of construction’s oldest assumptions — the people, research, and engineering behind a modern foundation system.',
  path: '/about',
});

export default function AboutPage() {
  return (
    <div className="about-clone">
      <Hero />
      <NumberedFeatures />
      <StoryValues />
      <ValuesSection />

      <section className="py-24">
        <SectionHeading
          eyebrow={leadersIntro.eyebrow}
          heading={leadersIntro.heading}
          intro={leadersIntro.intro}
          className="mb-16"
        />
        <PersonGrid people={leadershipTeam} />
      </section>

      <section className="pt-24">
        <SectionHeading
          eyebrow={investorsIntro.eyebrow}
          heading={investorsIntro.heading}
          intro={investorsIntro.intro}
          className="mb-16"
        />
      </section>
      <LogoGrid />

      {/* The "Our Network" and advisory-board sections were removed with the
          placeholder data that filled them: the first duplicated the supporter
          grid above, and the second listed six invented advisors. Their copy is
          still in features/about/content.ts — restore the sections once real
          partner and advisor data exists. */}

      {/* No closing CTA here any more: the shared SiteFooter opens with one on
          every route, and the old <FooterCta /> banner rendered a near-identical
          dark CTA directly above it. Its copy now lives in config/navigation.ts
          as `footerCta`. The "Future of Foundations" careers CTA that followed
          it was removed on request. */}
    </div>
  );
}
