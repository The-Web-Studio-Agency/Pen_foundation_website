'use client';

import Link from 'next/link';
import { useState, type FormEvent } from 'react';

import { ArrowUpRightIcon, contactWayIcons } from '@/components/shared/icons';
import { contactWays } from '@/content/data/contact';
import { cn, notchClipPath } from '@/lib/utils';
import type { ContactWay } from '@/types/contact';

/**
 * Four cards on a 2x2 grid (single column below 1024px). Each one has the
 * site's signature notch cut out of an edge — a rounded, trapezoidal bite that
 * only appears at 1024px and up, where the cards are wide enough to carry it.
 */

function CardShell({
  way,
  children,
  className,
}: {
  way: ContactWay;
  children: React.ReactNode;
  className?: string;
}) {
  const dark = way.theme === 'dark';
  return (
    <div
      style={
        {
          '--card-clip-path': notchClipPath({
            edge: way.notch.edge,
            center: way.notch.center,
          }),
        } as React.CSSProperties
      }
      className={cn(
        'relative flex h-full flex-col overflow-hidden rounded-[1.25rem] p-7',
        'md:px-10 md:py-9',
        'lg:min-h-[13.875rem] lg:px-[3.5625rem] lg:py-[2.8125rem] lg:[clip-path:var(--card-clip-path)]',
        dark
          ? 'bg-[var(--c-dark-green)] text-[var(--c-white)]'
          : 'bg-[var(--c-dirty-white)] text-[var(--c-dark-green)]',
        className,
      )}
    >
      {children}
    </div>
  );
}

function CardArrow({ dark }: { dark: boolean }) {
  return (
    <span
      className={cn(
        'absolute top-5 right-5 inline-flex size-12 items-center justify-center rounded-lg backdrop-blur-[50px]',
        'md:top-7 md:right-7 md:size-13 lg:top-[1.875rem] lg:right-[1.875rem] lg:size-[3.625rem]',
        dark ? 'bg-white/15' : 'bg-white/30',
      )}
    >
      <ArrowUpRightIcon className="size-5 lg:size-6" />
    </span>
  );
}

function CardHeading({ way }: { way: ContactWay }) {
  const Icon = way.icon ? contactWayIcons[way.icon as keyof typeof contactWayIcons] : null;

  return (
    <div className="flex items-start gap-3">
      {Icon ? (
        <span className="mt-1 size-7 shrink-0 md:mt-[0.3125rem] md:size-8 lg:mt-1.5 lg:size-9">
          <Icon className="size-full" />
        </span>
      ) : null}
      <h3
        className={cn(
          'm-0 font-normal tracking-[-0.3px]',
          'text-[1.375rem] leading-[1.2] md:text-[1.625rem] md:leading-[1.3] lg:text-[1.875rem] lg:leading-[1.46]',
        )}
      >
        {way.title}
      </h3>
    </div>
  );
}

function CardDescription({ way }: { way: ContactWay }) {
  if (!way.description) return null;
  return (
    <p
      className={cn(
        'm-0 tracking-[-0.2px] lg:leading-[1.35]',
        'text-base leading-[1.35] md:text-lg lg:text-xl',
        way.theme === 'dark' ? 'text-white/75' : 'text-[var(--c-dark-gray)]/80',
      )}
    >
      {way.description}
    </p>
  );
}

function SubscribeCard({ way }: { way: ContactWay }) {
  const [submitted, setSubmitted] = useState(false);
  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
  };

  return (
    <CardShell way={way}>
      <div className="relative flex flex-auto flex-col gap-4 md:gap-5 lg:gap-6">
        <CardHeading way={way} />
        {submitted ? (
          <p className="m-0 text-[0.9375rem] leading-[1.4] opacity-85">
            Thanks — this is a demonstration form, so nothing was sent.
          </p>
        ) : (
          <form onSubmit={onSubmit} className="flex flex-col gap-2">
            <label
              htmlFor="subscribe-email"
              className="text-sm leading-[1.35] tracking-[0.28px] opacity-70"
            >
              {way.subscribe?.label}
            </label>
            <div className="flex items-end gap-3">
              <input
                id="subscribe-email"
                name="email"
                type="email"
                required
                placeholder={way.subscribe?.placeholder}
                className={cn(
                  'w-auto min-w-40 flex-auto rounded-none border-0 border-b border-b-[var(--c-dark-green-20)]',
                  'min-h-11 bg-transparent pt-2.5 pb-2 text-base leading-[1.35] tracking-[0.3px] text-inherit outline-none',
                  'placeholder:text-current placeholder:opacity-50',
                  'focus-visible:border-b-[var(--c-dark-green)]',
                )}
              />
              <button
                type="submit"
                className={cn(
                  'inline-flex h-10 max-w-[13.75rem] flex-auto items-center justify-center rounded',
                  'border border-[var(--c-dark-green)] bg-[var(--c-dark-green)] px-5 py-2',
                  'font-mono text-[0.6875rem] font-semibold tracking-[1.8px] text-[var(--c-white)] uppercase',
                  'transition-colors duration-200',
                  'fine:hover:border-[var(--c-accent)] fine:hover:bg-[var(--c-accent)] fine:hover:text-white',
                )}
              >
                {way.subscribe?.submitLabel}
              </button>
            </div>
          </form>
        )}
      </div>
    </CardShell>
  );
}

function WayCard({ way }: { way: ContactWay }) {
  if (way.variant === 'subscribe') return <SubscribeCard way={way} />;

  const dark = way.theme === 'dark';
  const body = (
    <CardShell way={way}>
      <CardArrow dark={dark} />
      <div className="relative flex flex-auto flex-col gap-4 pr-14 md:gap-5 md:pr-18 lg:gap-6 lg:pr-20">
        <CardHeading way={way} />
        <CardDescription way={way} />
      </div>
    </CardShell>
  );

  if (way.variant === 'action') {
    return (
      <button
        type="button"
        aria-label={way.title}
        className="block w-full cursor-pointer border-0 bg-transparent p-0 text-left text-inherit"
      >
        {body}
      </button>
    );
  }

  return (
    <Link href={way.href ?? '#'} className="block text-inherit no-underline">
      {body}
    </Link>
  );
}

export function ContactWaysSection() {
  return (
    <section className="site-gutter py-12 md:pt-[4.375rem] md:pb-[5.625rem]">
      {/* Was capped at 93.75rem, which is narrower than the gutter leaves free
          on a wide screen — so this section alone pulled in to 210px while its
          neighbours sat at 70px. The cap now matches the banner above it. */}
      <div className="mx-auto max-w-[120rem]">
        <header className="mb-8 text-center md:mb-15">
          <p className="m-0 text-xl leading-[0.95] text-[var(--c-light-gray)]">
            Other ways to connect
          </p>
          <h2
            className={cn(
              'mt-6 mb-0 font-normal tracking-[-0.46px] text-[var(--c-dark-green)]',
              'text-[2.25rem] leading-[1.2] md:text-[2.5rem] lg:text-[2.875rem]',
            )}
          >
            We are here to help
          </h2>
        </header>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {contactWays.map((way) => (
            <WayCard key={way.id} way={way} />
          ))}
        </div>
      </div>
    </section>
  );
}
