import { storyValues } from '../content';
import { ScrollRevealText } from '@/components/motion/ScrollRevealText';

// Layout mirrors the reference about page's "our story, our values" section:
// a full-viewport band with its content optically centred, an oversized
// weight-400 display heading, then a 1096px two-column body at 18px/1.4.
// The reference flows five paragraphs through a CSS multi-column; this section
// has exactly two blocks, so a 2-col grid gives the identical 520px columns
// without multicol's balancing splitting a block across both.

export function StoryValues() {
  return (
    <section className="flex min-h-screen flex-col items-center justify-center py-24 lg:py-32">
      <div className="mx-auto w-full max-w-[1700px] px-6 lg:px-[70px]">
        <header className="mx-auto mb-[54px] max-w-[1190px] text-center">
          <ScrollRevealText as="h2" text={storyValues.heading} className="title-si" />
        </header>

        <div className="mx-auto grid max-w-[1096px] gap-x-14 gap-y-12 text-left md:grid-cols-2">
          <div>
            <p className="mb-3 text-sm text-[#8a8a8a]">Our Story</p>
            <ScrollRevealText
              as="p"
              text={storyValues.story}
              className="text-[1.125rem] leading-[1.4] tracking-[0.0225rem]"
            />
          </div>
          <div>
            <p className="mb-3 text-sm text-[#8a8a8a]">Our Values</p>
            <ScrollRevealText
              as="p"
              text={storyValues.values}
              className="text-[1.125rem] leading-[1.4] tracking-[0.0225rem]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
