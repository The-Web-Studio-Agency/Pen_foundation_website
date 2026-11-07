import { Applications } from './components/Applications';
import { FaqTabs } from './components/FaqTabs';
import { Highlights } from './components/Highlights';
import { MediaStatement } from './components/MediaStatement';
import { Opening } from './components/opening/Opening';
import { ProblemCollage } from './components/ProblemCollage';
import { Process } from './components/Process';
import { ProjectsCarousel } from './components/ProjectsCarousel';
import { SystemChapter } from './components/SystemChapter';
import { Validation } from './components/Validation';

/**
 * The homepage, top to bottom. The header, footer and reveal controller come
 * from the shared SiteChrome.
 *
 *   dark    opening (3D model → scroll-driven film, one pinned stage)
 *           → statement over the site film → highlights over the install film
 *   white   applications
 *   black   the system → anatomy → evidence → "hours, not weeks"
 *   paper   the problem collage → process → projects → validation
 *   white   FAQ
 */
export function HomePage() {
  return (
    <>
      <Opening />
      <MediaStatement />
      <Highlights />
      <Applications />
      <SystemChapter />
      <ProblemCollage />
      <Process />
      <ProjectsCarousel />
      <Validation />
      <FaqTabs />
    </>
  );
}
