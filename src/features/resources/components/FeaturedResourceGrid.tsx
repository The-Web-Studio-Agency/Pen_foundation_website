import { ResourceCard } from './ResourceCard';
import { cn } from '@/lib/utils';
import type { FeaturedGrid } from '@/types/contact';

/**
 * Centred headline over a 1 / 2 / 3-column card grid. The second instance on
 * the page puts its title above the supporting line rather than below the
 * eyebrow, which `titleFirst` handles.
 */
export function FeaturedResourceGrid({ grid, id }: { grid: FeaturedGrid; id?: string }) {
  const eyebrow = grid.eyebrow ? (
    <p className="body-3 m-0 text-balance text-[var(--c-dark-gray)]">{grid.eyebrow}</p>
  ) : null;

  const body = grid.body ? (
    <p className="body-3 m-0 text-balance text-[var(--c-dark-gray)]">{grid.body}</p>
  ) : null;

  const title = (
    <h2 className="title-h2 m-0 font-normal text-balance text-[var(--c-dark-green)]">
      {grid.title}
    </h2>
  );

  return (
    <section
      id={id}
      className={cn(
        'px-5 py-15 lg:px-[4.375rem] lg:py-[5.625rem]',
        // Matches the id-bearing sections further down the page: the fixed
        // header would otherwise cover the heading an anchor jumps to.
        id && 'scroll-mt-nav',
        !grid.eyebrow && 'text-left',
      )}
    >
      <div
        className={cn(
          'mb-10 flex flex-col gap-4 lg:mb-16',
          grid.eyebrow ? 'text-center' : 'text-left',
        )}
      >
        {grid.titleFirst ? (
          <>
            {title}
            {body}
          </>
        ) : (
          <>
            {eyebrow}
            {title}
            {body}
          </>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-[1.875rem]">
        {grid.cards.map((card) => (
          <ResourceCard key={card.title} card={card} />
        ))}
      </div>
    </section>
  );
}
