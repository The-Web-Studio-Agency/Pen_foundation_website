import { createMetadata } from '@/config/seo';
import { HomePage } from '@/designs/v2';

export const metadata = createMetadata({
  title: 'Pre-Engineered Nail Foundation System',
  description:
    'PEN Foundation is a patented pre-engineered nail foundation: installed in about two hours, load-bearing immediately, zero excavation. Field-validated at NIT Calicut to IS 2911 Part 4.',
  path: '/',
});

/** The homepage — see src/designs/v2/HomePage.tsx for its sections. */
export default function Home() {
  return <HomePage />;
}
