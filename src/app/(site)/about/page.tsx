import { createMetadata } from '@/config/seo';
import { AboutPage } from '@/designs/v2/pages/about/AboutPage';

export const metadata = createMetadata({
  title: 'About',
  description:
    'PEN Foundation was created to challenge one of construction’s oldest assumptions — the people, research, and engineering behind a modern foundation system.',
  path: '/about',
});

export default function Page() {
  return <AboutPage />;
}
