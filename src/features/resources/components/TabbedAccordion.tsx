'use client';

import { useState } from 'react';

import { RevealText } from '@/components/motion';
import { PlusIcon } from '@/components/shared/icons';
import { faqIntro, faqTabs } from '../content';
import { cn } from '@/lib/utils';
import type { FaqEntry } from '@/types/contact';

/**
 * INTERACTION MODEL: click-driven. Verified on the live page by clicking each
 * tab — the accordion list is swapped wholesale (5 / 6 / 6 / 6 entries), it is
 * not scroll-linked.
 *
 * The accordion itself animates height with a 0fr → 1fr grid row rather than
 * max-height, so entries of any length open at the same speed.
 */

function AccordionItem({ entry, isLast }: { entry: FaqEntry; isLast: boolean }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className="flex w-full cursor-pointer items-center justify-between gap-[1.125rem] py-6 text-left lg:py-8"
      >
        <span
          className={cn(
            'm-0 flex-1 font-normal text-[var(--c-dark-green)]',
            'text-[min(1.5rem,6.154vw)] leading-[146%] tracking-[min(-0.0225rem,-0.092vw)]',
            'lg:text-[min(1.563vw,40px)] lg:tracking-[min(-0.016vw,-0.4px)]',
          )}
        >
          {entry.question}
        </span>
        <PlusIcon
          className={cn(
            'size-6 shrink-0 text-[var(--c-light-gray)]',
            'transition-transform duration-300 ease-soft',
            open && 'rotate-45',
          )}
        />
      </button>

      <div
        className={cn(
          'grid transition-[grid-template-rows] duration-[350ms] ease-expo lg:px-8',
          open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
        )}
      >
        <div
          className={cn(
            'min-h-0 overflow-hidden transition-[opacity,transform,padding] duration-300 ease-soft',
            open
              ? 'translate-y-0 pt-2 pb-6 opacity-100 delay-[50ms] lg:pt-0 lg:pb-8'
              : '-translate-y-1 opacity-0',
          )}
        >
          <p className="body-4 m-0 text-[var(--c-gray)]">{entry.answer}</p>
        </div>
      </div>

      {!isLast ? (
        <span
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-px bg-[linear-gradient(90deg,#057c8600,#057c86bf,#057c8600)]"
        />
      ) : null}
    </div>
  );
}

export function TabbedAccordion() {
  const [activeId, setActiveId] = useState(faqTabs[0].id);
  const activeTab = faqTabs.find((tab) => tab.id === activeId) ?? faqTabs[0];

  return (
    <section className="overflow-x-hidden py-[5.625rem]">
      <div
        className={cn(
          'grid grid-cols-1 gap-16 px-5',
          'lg:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)] lg:items-start lg:px-[4.375rem]',
          'min-[1440px]:gap-31',
        )}
      >
        <div className="flex flex-col gap-6 lg:gap-12">
          <RevealText as="h2" text={faqIntro.title} className="title-h2 block font-normal" />
          <p className="body-1 m-0 text-[var(--c-dark-green)]">{faqIntro.body}</p>
        </div>

        <div className="flex min-w-0 flex-col gap-6 lg:col-start-2 lg:gap-8">
          <div
            role="tablist"
            aria-label="FAQ categories"
            className="no-scrollbar flex gap-3 overflow-x-auto overflow-y-hidden"
          >
            {faqTabs.map((tab) => {
              const active = tab.id === activeId;
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setActiveId(tab.id)}
                  className={cn(
                    'inline-flex h-[3.625rem] cursor-pointer items-center justify-center rounded-lg border px-[1.125rem] py-3',
                    'font-mono text-[0.8125rem] leading-[0.81] font-semibold tracking-[0.14625rem] whitespace-nowrap uppercase',
                    'backdrop-blur-[5.5px] transition-[background-color,color,border-color] duration-300 ease-soft',
                    active
                      ? 'border-transparent bg-[var(--c-dark-green-05)] text-[var(--c-dark-green)]'
                      : 'border-[var(--c-light-gray)] bg-transparent text-[var(--c-light-gray)] fine:hover:opacity-80',
                  )}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          <div className="flex flex-col">
            {activeTab.entries.map((entry, index) => (
              <AccordionItem
                key={`${activeTab.id}-${entry.question}`}
                entry={entry}
                isLast={index === activeTab.entries.length - 1}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
