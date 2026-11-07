import { createMetadata } from '@/config/seo';
import { TechnologyPage } from '@/designs/v2/pages/technology/TechnologyPage';

export const metadata = createMetadata({
  title: 'Technology',
  description:
    'The anatomy of the PEN foundation system: an M50 precast node and four battered GI nails, driven without excavation and governed by IS 2911 Part 4 — with the full specification, the load path and a project estimator.',
  path: '/technology',
});

/** /technology — see src/designs/v2/pages/technology/TechnologyPage.tsx for its sections. */
export default function Technology() {
  return <TechnologyPage />;
}
