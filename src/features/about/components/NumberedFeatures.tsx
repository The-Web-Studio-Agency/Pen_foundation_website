import Image from 'next/image';

import { cn } from '@/lib/utils';
import { numberedFeatures } from '../content';
import { ScrollRevealText } from '@/components/motion/ScrollRevealText';
import { GridBeam } from '@/components/shared/backgrounds/GridBeam';

const GRADIENTS = [
  'linear-gradient(135deg, #0a3a3a 0%, #012c32 60%, #1a2f1a 100%)',
  'linear-gradient(135deg, #1a2f1a 0%, #012c32 55%, #0a3a3a 100%)',
  'linear-gradient(135deg, #012c32 0%, #0f2a2a 50%, #223a1a 100%)',
];

export function NumberedFeatures() {
  return (
    <section className="dot-grid-bg relative overflow-hidden py-24 lg:py-32">
      <GridBeam duration={14} delay={2} />
      {/* Wider than the page's max-w-6xl sections on purpose: the media column
          has to run out close to the viewport edge for the editorial split. */}
      <div className="relative z-10 mx-auto flex max-w-[1700px] flex-col gap-24 px-6 lg:gap-32 lg:px-12">
        {numberedFeatures.map((feature, i) => {
          const imageLeft = feature.imageSide === 'left';

          return (
            <div
              key={feature.number}
              className={cn(
                'grid items-center gap-12 lg:min-h-[780px] lg:gap-x-[72px] xl:min-h-[860px]',
                imageLeft
                  ? 'lg:grid-cols-[minmax(0,62fr)_minmax(0,38fr)]'
                  : 'lg:grid-cols-[minmax(0,38fr)_minmax(0,62fr)]',
              )}
            >
              <div className={cn(imageLeft && 'lg:order-2')}>
                <p className="mb-6 font-mono text-sm text-[#8a8a8a]">{feature.number}</p>
                <ScrollRevealText
                  as="h3"
                  text={feature.title}
                  className="max-w-[520px] text-3xl leading-tight font-semibold md:text-4xl"
                />
                <p className="mt-6 max-w-md text-lg leading-relaxed text-[#8a8a8a]">
                  {feature.body}
                </p>
              </div>
              {/* Sits a touch above the text block's optical centre. */}
              <div
                className={cn(
                  'bleed flex lg:-translate-y-8',
                  imageLeft ? 'bleed-l lg:order-1' : 'bleed-r',
                )}
              >
                {/* No max-w: the panel has to absorb the reclaimed gutter to
                    actually reach the edge. */}
                <div
                  className={cn(
                    'notch-mask relative aspect-[5/4] w-full overflow-hidden lg:aspect-auto lg:h-[700px] xl:h-[780px] 2xl:h-[840px]',
                    imageLeft ? 'notch-bleed-l' : 'notch-mask-right notch-bleed-r',
                  )}
                  style={{ background: GRADIENTS[i % GRADIENTS.length] }}
                >
                  {feature.image && (
                    <Image
                      src={feature.image}
                      alt={feature.imageAlt ?? ''}
                      fill
                      sizes="(min-width: 1024px) 1200px, 100vw"
                      priority={i === 0}
                      className="object-cover"
                    />
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
