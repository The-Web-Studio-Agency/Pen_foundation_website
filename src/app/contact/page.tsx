import { ContactWaysSection } from '@/components/contact/ContactWaysSection';
import { HeroFormSection } from '@/components/contact/HeroFormSection';
import { PromoBannerCard } from '@/components/contact/PromoBannerCard';
import { createMetadata } from '@/config/seo';

export const metadata = createMetadata({
  title: 'Contact',
  description:
    'Demo, phone call, webinar, social connection — you decide how to get in touch with the PEN Foundation engineering team.',
  path: '/contact',
});

/**
 * The page now ends at "Other ways to connect". The resource grids, comparison
 * carousel, FAQ and testimonial that used to follow live at /resources — they
 * were a library bolted onto a contact flow, and splitting them keeps this
 * route single-purpose.
 *
 * No header or footer is rendered here: the root layout already wraps every
 * route in the one SiteHeader and SiteFooter. The clone shipped its own pair,
 * which would have doubled the site chrome and tripped `arch:check`'s
 * singleton rule.
 *
 * `contact-clone` opts the page out of the site-wide Fraunces heading rule —
 * this is a sans-serif design, the same arrangement `/about` uses. `pt-nav`
 * clears the fixed header pill.
 */
export default function ContactPage() {
  return (
    <div className="contact-clone pt-nav">
      {/* The header's "Demo" action deep-links to this anchor. */}
      <div id="contact-form" className="scroll-mt-nav">
        <HeroFormSection />
      </div>

      <PromoBannerCard />
      <ContactWaysSection />
    </div>
  );
}
