import { createMetadata } from '@/config/seo';
import { ContactPage } from '@/designs/v2/pages/contact/ContactPage';

export const metadata = createMetadata({
  title: 'Contact',
  description:
    'Demo, phone call, webinar, social connection — you decide how to get in touch with the PEN Foundation engineering team.',
  path: '/contact',
});

export default function Page() {
  return <ContactPage />;
}
