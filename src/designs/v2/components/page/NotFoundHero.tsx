import { footerContact } from '@/config/navigation';
import { PageHero } from './PageHero';

/** The 404 body, shared by the global and the `(site)` not-found files. */
export function NotFoundHero() {
  return (
    <PageHero
      kicker="Error 404"
      title="This page is not in the ground."
      lead="The address you followed does not exist, or the page has moved since it was linked."
      actions={[
        { label: 'Back to the homepage', href: '/' },
        { label: 'Talk to an engineer', href: footerContact.promptHref, tone: 'ghost' },
      ]}
      tall
    />
  );
}
