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


export default function ContactPage() {
  return (
    <div className="pt-nav">
      {/* The header's "Demo" action deep-links to this anchor. */}
      <div id="contact-form" className="scroll-mt-nav">
        <HeroFormSection />
      </div>

      <PromoBannerCard />
      <ContactWaysSection />
    </div>
  );
}
