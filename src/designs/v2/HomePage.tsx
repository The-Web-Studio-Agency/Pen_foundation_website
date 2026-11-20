import { Applications } from './components/Applications';
import { AskAi } from './components/AskAi';
import { FaqTabs } from './components/FaqTabs';
import { MediaStatement } from './components/MediaStatement';
import { Opening } from './components/opening/Opening';
import { ProblemCollage } from './components/ProblemCollage';
import { Process } from './components/Process';
import { ProjectEstimator } from './components/ProjectEstimator';
import { ProjectsCarousel } from './components/ProjectsCarousel';
import { Testimonials } from './components/Testimonials';
import { Validation } from './components/Validation';

/**
 * The homepage, top to bottom. The header, footer and reveal controller come
 * from the shared SiteChrome.
 *
 *   dark    opening (3D model → scroll-driven film, one pinned stage)
 *           → why PEN: statement, five highlights and the measured figure
 *             over the site film
 *   white   applications
 *   paper   the problem collage → process → projects → validation
 *   white   project calculator
 *   dark    testimonials (hidden while the list is empty)
 *   white   FAQ → ask AI (open Claude or ChatGPT with a question about PEN)
 */
export function HomePage() {
  return (
    <>
      <Opening />
      <MediaStatement />
      <Applications />
      <ProblemCollage />
      <Process />
      <ProjectsCarousel />
      <Validation />
      <ProjectEstimator />
      <Testimonials />
      <FaqTabs />
      <AskAi />
    </>
  );
}
