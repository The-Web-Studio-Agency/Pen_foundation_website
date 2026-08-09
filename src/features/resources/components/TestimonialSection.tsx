import Image from 'next/image';
import Link from 'next/link';

import { StarIcon } from '@/components/shared/icons';
import { testimonial } from '../content';
import { cn } from '@/lib/utils';

/**
 * Centred review block: platform logo, a vertical rule that only appears at
 * 1024px, the star rating, then the quote and a wide outlined CTA.
 */
export function TestimonialSection() {
  return (
    <section className="bg-[var(--c-white)] px-5 py-20 lg:px-[4.375rem] lg:py-30">
      <div className="flex flex-col items-center gap-10 lg:gap-16">
        <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10 lg:flex-nowrap lg:gap-16">
          <Image
            src={testimonial.logo.src}
            alt={testimonial.logo.alt}
            width={320}
            height={86}
            className="block h-auto max-h-15 w-auto max-w-[13.75rem] object-contain lg:max-h-[5.375rem] lg:max-w-[15.375rem]"
          />
          <span aria-hidden className="hidden h-12 w-px bg-[#012c3233] lg:block lg:h-[3.8125rem]" />
          <div className="flex items-center gap-3 lg:gap-4">
            <span
              className="inline-flex gap-0.5 text-[#ffc83d]"
              aria-label={`${testimonial.rating} out of 5`}
            >
              {Array.from({ length: 5 }, (_, index) => (
                <StarIcon key={index} className="size-6 lg:size-[1.875rem]" aria-hidden />
              ))}
            </span>
            <span className="title-h3 text-[var(--c-dark-green)]">
              {testimonial.rating.toFixed(1)}
            </span>
          </div>
        </div>

        <div className="flex w-full max-w-[65.625rem] flex-col items-center gap-4 text-center">
          <h2
            className={cn(
              'title-h2 m-0 font-medium text-balance text-[var(--c-dark-green)]',
              'leading-[1.2] lg:leading-[1.46]',
            )}
          >
            {testimonial.headline}
          </h2>
          <p className="title-h2 m-0 leading-[1.2] font-normal text-balance text-[var(--c-dark-green)]">
            {testimonial.body}
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href={testimonial.ctaHref}
            className={cn(
              'label-3 inline-flex min-h-[3.625rem] min-w-[17.5rem] items-center justify-center rounded-lg',
              'bg-[var(--c-dark-green-05)] px-8 py-3 text-center uppercase no-underline',
              'text-[var(--c-dark-green)] transition-colors duration-200',
              'lg:min-w-100 fine:hover:bg-[var(--c-dark-green-15)]',
            )}
          >
            {testimonial.ctaLabel}
          </Link>
        </div>
      </div>
    </section>
  );
}
