import {
  hero,
  investorsIntro,
  leadersIntro,
  numberedFeatures,
  partnersIntro,
  storyValues,
} from '@/features/about';

import type { FaqTab } from '../../components/FaqSection';

/**
 * The About page FAQ. The questions are UI framing written for this page;
 * every answer is an existing About paragraph from features/about/content.ts,
 * verbatim, so the FAQ carries no claim the page does not already make.
 */

const feature = (number: string) => {
  const hit = numberedFeatures.find((item) => item.number === number);
  if (!hit) throw new Error(`About feature not found: ${number}`);
  return hit.body;
};

export const aboutFaq = {
  chip: 'FAQ',
  heading: 'Questions about PEN Foundation',
  cta: { label: 'Ask an engineer directly', href: '/contact#contact-form' },
  tabs: [
    {
      id: 'company',
      label: 'The company',
      entries: [
        { question: 'Why was PEN Foundation started?', answer: hero.body },
        { question: 'What inspired the design?', answer: feature('02') },
        { question: 'How does PEN Foundation think about innovation?', answer: storyValues.values },
      ],
    },
    {
      id: 'people',
      label: 'Research and people',
      entries: [
        { question: 'How has the system been developed and proven?', answer: feature('03') },
        { question: 'Who is behind PEN Foundation?', answer: leadersIntro.intro },
        { question: 'Who supports PEN Foundation?', answer: investorsIntro.intro },
        { question: 'Does PEN Foundation work with partners?', answer: partnersIntro.intro },
      ],
    },
  ] satisfies FaqTab[],
};
