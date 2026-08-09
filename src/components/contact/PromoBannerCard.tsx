'use client';

import Image from 'next/image';
import { useState, type FormEvent } from 'react';

import { promoBanner } from '@/content/data/contact';
import { cn } from '@/lib/utils';

/**
 * Wide light card: copy plus a one-field email capture on the left, datasheet
 * artwork bleeding into the bottom-right corner. The two halves only sit
 * side-by-side from 1024px; the field and button share a row from 1280px.
 */
export function PromoBannerCard() {
  const [submitted, setSubmitted] = useState(false);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
  };

  return (
    <section className="px-5 py-6 lg:px-[4.375rem]">
      <div
        className={cn(
          'relative mx-auto grid max-w-[120rem] grid-cols-1 overflow-hidden rounded-3xl',
          'bg-[var(--c-dirty-white)] lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-stretch lg:rounded-[2rem]',
        )}
      >
        <div
          className={cn(
            'p-[clamp(1.75rem,6vw,3rem)_clamp(1.25rem,5vw,2.5rem)]',
            'lg:p-[3.5rem_2rem_3.5rem_3rem]',
            'xl:p-[4.5rem_2.5rem_4.5rem_4.5rem]',
            'min-[1440px]:p-[5.5rem_3rem_5.5rem_6.5rem]',
          )}
        >
          <p className="text-[clamp(0.875rem,1.6vw,1.25rem)] leading-[1.1] text-[var(--c-dark-gray)] lg:leading-[0.95]">
            {promoBanner.eyebrow}
          </p>
          <h2 className="title-h2 mt-4 mb-4 font-normal text-[var(--c-dark-green)]">
            {promoBanner.title}
          </h2>

          {submitted ? (
            <p className="mt-8 text-base leading-[1.4] text-[var(--c-dark-green)]">
              Thanks — this is a demonstration form, so no download was sent.
            </p>
          ) : (
            <form onSubmit={onSubmit} className="mt-5 flex flex-col gap-3 lg:mt-6">
              <div className="flex flex-col items-stretch gap-3 xl:flex-row xl:items-end xl:gap-11">
                <div className="flex min-w-0 flex-auto flex-col">
                  <label
                    htmlFor="promo-email"
                    className="pb-2 text-[clamp(0.9375rem,1.4vw,1.125rem)] leading-[1.35] tracking-[0.36px] opacity-80"
                  >
                    {promoBanner.emailLabel}
                  </label>
                  <input
                    id="promo-email"
                    name="email"
                    type="email"
                    required
                    placeholder={promoBanner.emailPlaceholder}
                    className={cn(
                      'w-full appearance-none rounded-none border-0 border-b border-b-[var(--c-dark-green-20)]',
                      'min-h-11 bg-transparent pt-2.5 pb-2.5 text-[clamp(1rem,1.4vw,1.125rem)] leading-[1.35] tracking-[0.36px]',
                      'text-[var(--c-dark-green)] outline-none placeholder:text-[var(--c-light-gray)]',
                      'transition-colors duration-200 focus-visible:border-b-[var(--c-dark-green)]',
                    )}
                  />
                </div>
                <button
                  type="submit"
                  className={cn(
                    'flex h-12 w-full shrink-0 items-center justify-center gap-3 self-stretch rounded',
                    'border border-[#eaecf0] bg-[var(--c-dark-green)] text-[var(--c-white)]',
                    'font-mono text-[0.8125rem] font-semibold tracking-[clamp(1px,0.5vw,2.34px)] uppercase',
                    'px-[clamp(1rem,4vw,2rem)] py-3 transition-colors duration-200',
                    'fine:hover:border-[var(--c-accent)] fine:hover:bg-[var(--c-accent)] fine:hover:text-white',
                    'xl:w-auto xl:self-auto',
                  )}
                >
                  {promoBanner.submitLabel}
                </button>
              </div>
            </form>
          )}
        </div>

        <div className="relative min-h-[clamp(11.25rem,38vw,20rem)] lg:min-h-0">
          <Image
            src={promoBanner.image.src}
            alt={promoBanner.image.alt}
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-contain object-right-bottom"
          />
        </div>
      </div>
    </section>
  );
}
