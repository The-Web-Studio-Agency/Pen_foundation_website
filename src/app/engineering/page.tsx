import { EngineeringBody } from '@/features/engineering';
import { createMetadata } from '@/config/seo';

export const metadata = createMetadata({
  title: 'Engineering',
  description:
    'The anatomy of the PEN foundation system: precast node, galvanised sleeves, and driven helical nails — 20% of the concrete, no excavation, two-hour installation.',
  path: '/x',
});

export default function EngineeringPage() {
  return <EngineeringBody />;
}
