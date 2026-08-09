'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { useState, type FormEvent } from 'react';

import { PhoneIcon } from '@/components/shared/icons';
import { formFields, hero } from '@/content/data/contact';
import { fadeUp, staggerContainer } from '@/lib/motion';
import { cn } from '@/lib/utils';

/**
 * Dark form panel on the right of the hero. Fields are underline-only inputs on
 * a two-column grid that collapses to one below 768px.
 *
 * There is no backend here — submitting swaps the panel for a success message,
 * which is enough to exercise the states the original shows.
 */

const fieldClass = cn(
  'w-full appearance-none rounded-none border-0 border-b bg-transparent pb-2 outline-none',
  'text-base leading-[1.35] tracking-[0.0225rem] transition-colors duration-200',
  'md:pb-[0.5625rem] md:text-[1.0625rem] lg:pb-[0.6rem] lg:text-lg',
  'border-b-white/30 text-[var(--c-white)] placeholder:text-[var(--c-light-gray)]',
  'focus:border-b-[var(--c-white)] fine:hover:not-focus:border-b-white/70',
);

const labelClass = cn(
  'mb-2 text-lg leading-[1.35] tracking-[0.0225rem] text-[var(--c-white)]',
  'text-base md:text-[1.0625rem] lg:text-lg',
);

export interface ContactFormProps {
  /**
   * Merged last, so a caller can widen the card past the defaults below. The
   * caps here suit /contact, where the card is the narrow half of a two-column
   * split; the homepage runs it on its own and needs more room.
   */
  className?: string;
  /**
   * Overrides the submit button's text. Defaults to "Submit", which is right
   * on /contact — the page offers several ways to get in touch and the form is
   * only one of them.
   *
   * The homepage passes the conversion label instead: the form there is the
   * end of a single argument, and the last click should name what it gets you
   * rather than the mechanism. Styling is untouched either way.
   */
  submitLabel?: string;
}

export function ContactForm({ className, submitLabel = 'Submit' }: ContactFormProps) {
  const prefersReducedMotion = useReducedMotion();
  const [submitted, setSubmitted] = useState(false);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
  };

  return (
    <div
      className={cn(
        'flex w-full flex-col rounded-[1.0625rem] bg-[var(--c-dark-green)] p-7',
        'shadow-[inset_0_1px_#ffffff0f,0_2.5rem_5rem_#012c3240]',
        'min-[1680px]:max-w-[40rem] min-[1680px]:p-16 lg:p-12 xl:max-w-[33.75rem] xl:justify-self-center',
        className,
      )}
    >
      {submitted ? (
        /* Left-aligned on the same axis as the fields it replaces, so the card
           does not reflow its optical centre on submit. No tick in a circle:
           it would claim a delivery that did not happen. The state opens on the
           acknowledgement itself, and the closing line below is what says the
           submission stopped at the browser. */
        <motion.div
          variants={staggerContainer()}
          initial={prefersReducedMotion ? 'show' : 'hidden'}
          animate="show"
          className="flex min-h-[22rem] flex-col justify-center"
        >
          <motion.p variants={fadeUp} className="title-h3 text-[var(--c-white)]">
            Thanks — that&rsquo;s everything an engineer needs.
          </motion.p>

          <motion.p variants={fadeUp} className="mt-4 max-w-[42ch] text-lg text-white/60">
            On the live site this reaches the engineering team and you get a call back the same day.
            Here it stops at the browser.
          </motion.p>

          <motion.div variants={fadeUp} className="mt-10">
            <button
              type="button"
              onClick={() => setSubmitted(false)}
              className={cn(
                'inline-flex h-13 items-center justify-center rounded-lg border border-white/25 px-8',
                'font-mono text-[0.8125rem] leading-[0.81] font-semibold tracking-[0.14625rem] uppercase',
                'text-[var(--c-white)] transition-colors duration-[250ms] ease-linear',
                'fine:hover:border-[var(--c-accent)] fine:hover:bg-[var(--c-accent)]',
                'active:scale-[0.98] motion-reduce:active:scale-100',
                'focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-[var(--c-accent)]',
              )}
            >
              Send another
            </button>
          </motion.div>
        </motion.div>
      ) : (
        <form onSubmit={onSubmit} noValidate={false}>
          <div className="grid grid-cols-1 gap-x-10 gap-y-[2.3125rem] md:grid-cols-2">
            {formFields.map((field) => (
              <div
                key={field.name}
                className={cn('flex min-w-0 flex-col', field.span === 'full' && 'md:col-span-2')}
              >
                <label htmlFor={field.name} className={labelClass}>
                  {field.label}
                  {field.required ? (
                    <span aria-hidden className="text-[var(--c-accent)]">
                      {' '}
                      *
                    </span>
                  ) : null}
                </label>
                {field.type === 'select' ? (
                  <select
                    id={field.name}
                    name={field.name}
                    required={field.required}
                    defaultValue=""
                    className={cn(
                      fieldClass,
                      'cursor-pointer bg-[right_0.5rem_center] bg-no-repeat pr-8',
                      "[background-image:url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='none' viewBox='0 0 24 24'%3E%3Cpath stroke='%23c2c2c2' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M12 4v16m0 0-6-6m6 6 6-6'/%3E%3C/svg%3E\")]",
                      '[background-size:1rem]',
                      '[&>option]:bg-[var(--c-dark-green)] [&>option]:text-[var(--c-white)]',
                    )}
                  >
                    <option value="" disabled>
                      {field.placeholder}
                    </option>
                    {field.options?.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    id={field.name}
                    name={field.name}
                    type={field.type}
                    required={field.required}
                    placeholder={field.placeholder}
                    className={fieldClass}
                  />
                )}
              </div>
            ))}
          </div>

          <div className="mt-auto flex flex-col items-center gap-[2.375rem] pt-[2.375rem] lg:items-stretch">
            <button
              type="submit"
              className={cn(
                'flex h-15 w-full items-center justify-center rounded-lg border-0 px-2.5',
                'font-mono text-[0.8125rem] leading-[0.81] font-semibold tracking-[0.14625rem] uppercase',
                'bg-white/30 text-[var(--c-white)] backdrop-blur-[5.5px]',
                'transition-all duration-[250ms] ease-linear',
                'fine:hover:bg-white/45 fine:hover:backdrop-blur-[8px]',
                'active:scale-[0.98]',
                'focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-[var(--c-accent)]',
              )}
            >
              {submitLabel}
            </button>
          </div>
        </form>
      )}

      {/* The alternate path, so it reads as a tier below the form rather than
          a second call to action: a hairline rule, a mono label, and the number
          carrying the only weight. Both ends sit on the card's content edges —
          the form above is left-aligned, so centring this row broke the axis. */}
      <div
        className={cn(
          'mt-10 flex flex-col gap-4 border-t border-white/12 pt-8',
          'sm:flex-row sm:items-center sm:justify-between sm:gap-8',
        )}
      >
        <p className="label-4 text-[var(--c-light-gray)] uppercase">{hero.phoneLabel}</p>
        <a
          href={`tel:${hero.phoneNumber.replace(/[^\d+]/g, '')}`}
          className={cn(
            'group inline-flex items-center gap-3 text-[var(--c-white)] no-underline',
            'transition-colors duration-200 fine:hover:text-[var(--c-accent)]',
            'focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--c-accent)]',
          )}
        >
          <PhoneIcon
            aria-hidden
            className={cn(
              'size-4 shrink-0 text-[var(--c-accent)]',
              'transition-colors duration-200 fine:group-hover:text-[var(--c-white)]',
            )}
          />
          <span className="text-[1.5rem] leading-none tracking-[-0.014375rem] whitespace-nowrap lg:text-[1.75rem]">
            {hero.phoneNumber}
          </span>
        </a>
      </div>
    </div>
  );
}
