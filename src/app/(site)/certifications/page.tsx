import { createMetadata } from '@/config/seo';
import { CertificationsPage } from '@/designs/v2/pages/certifications/CertificationsPage';

export const metadata = createMetadata({
  title: 'Certifications',
  description:
    'The PEN pre-engineered nail foundation is listed in the GRIHA Product Catalogue, certified by the GRIHA Council for use in GRIHA-registered projects.',
  path: '/certifications',
});

export default function Page() {
  return <CertificationsPage />;
}
