import { ResearchBody } from '@/features/research';
import { createMetadata } from '@/config/seo';

export const metadata = createMetadata({
  title: 'Research',
  description:
    'Engineering studies, field testing, and technical writing on driven-nail foundations, soil interaction, and the carbon cost of concrete.',
  path: '/research',
});

export default function ResearchPage() {
  return <ResearchBody />;
}
