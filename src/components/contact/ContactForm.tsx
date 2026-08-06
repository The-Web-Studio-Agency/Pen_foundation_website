'use client';

import { useState, type FormEvent } from 'react';

import { formFields, hero } from '@/content/data/contact';
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

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
  };

  return (
    <div
      className={cn(
        'flex w-full flex-col rounded-[1.0625rem] bg-[var(--c-dark-green)] p-7',
        'shadow-[inset_0_1px_#ffffff0f,0_2.5rem_5rem_#00000040]',
        'min-[1680px]:max-w-[40rem] min-[1680px]:p-16 lg:p-12 xl:max-w-[33.75rem] xl:justify-self-center',
      )}
    >
      {submitted ? (
        <div className="flex min-h-[22rem] flex-col items-center justify-center gap-4 text-center">
          <p className="title-h3 text-[var(--c-white)]">Thanks — got it.</p>
          <p className="text-white/70">
            This is a demonstration form, so nothing was sent. On the real thing you would hear back
            the same day.
          </p>
        </div>
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
              Submit
            </button>
          </div>
        </form>
      )}

      <div className="mt-10 flex flex-col items-center gap-2 text-center text-[var(--c-white)]">
        <p className="text-[1.4375rem] leading-[1.26] tracking-[-0.014375rem] text-white/70">
          {hero.phoneLabel}
        </p>
        <a
          href={`tel:${hero.phoneNumber.replace(/[^\d+]/g, '')}`}
          className="text-[1.5rem] leading-[1.26] tracking-[-0.014375rem] transition-colors duration-200 lg:text-[2rem] fine:hover:text-[var(--c-accent)]"
        >
          {hero.phoneNumber}
        </a>
      </div>
    </div>
  );
}
