import { createMetadata } from '@/config/seo';
import { BlogsPage } from '@/designs/v2/pages/blogs/BlogsPage';

export const metadata = createMetadata({
  title: 'Blogs',
  description:
    'Working papers on load paths, soil behaviour and what changes when a foundation is driven instead of poured.',
  path: '/blogs',
});

export default function Page() {
  return <BlogsPage />;
}
