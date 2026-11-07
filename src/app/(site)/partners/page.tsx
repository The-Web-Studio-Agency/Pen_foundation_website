import { createMetadata } from '@/config/seo';
import { PartnersPage } from '@/designs/v2/pages/partners/PartnersPage';

export const metadata = createMetadata({
  title: 'Partners',
  description:
    'PEN Foundation is installed and supplied only through authorised partners trained by C-DISC Technologies. Find the authorised solution provider and resellers, or apply to become a certified installer.',
  path: '/partners',
});

export default function Page() {
  return <PartnersPage />;
}
