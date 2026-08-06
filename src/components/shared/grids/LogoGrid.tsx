import Image from 'next/image';

import { cn } from '@/lib/utils';
import { partners } from '@/content/data/partners';
import { GridBeam } from '@/components/shared/backgrounds/GridBeam';

/**
 * Supporter logo grid.
 *
 * Renders the logo when the entry has one and falls back to the previous text
 * treatment when it does not, so a partner without an asset degrades to a
 * legible name rather than a hole in the grid.
 */
export function LogoGrid({ className }: { className?: string }) {
  return (
    <section className={cn('dot-grid-bg relative overflow-hidden py-20', className)}>
      <GridBeam duration={13} delay={4} />
      <ul className="relative z-10 mx-auto grid max-w-6xl grid-cols-2 items-center gap-x-10 gap-y-12 px-6 sm:grid-cols-3 md:grid-cols-4">
        {partners.map((partner) => (
          <li key={partner.name} className="flex items-center justify-center">
            {partner.logo ? (
              <Image
                src={partner.logo}
                alt={partner.fullName ?? partner.name}
                width={200}
                height={96}
                sizes="(min-width: 768px) 200px, 40vw"
                className={cn(
                  'w-auto max-w-[160px] object-contain opacity-80 grayscale transition duration-300 hover:opacity-100 hover:grayscale-0',
                  partner.onDark ? 'h-12 rounded-md md:h-14' : 'h-16 md:h-20',
                )}
              />
            ) : (
              <span
                title={partner.fullName}
                className="flex items-center gap-2 text-[#9a9a9a] grayscale"
              >
                <span className="size-2.5 shrink-0 rounded-sm bg-current" />
                <span className="text-lg font-semibold tracking-tight whitespace-nowrap">
                  {partner.name}
                </span>
              </span>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
