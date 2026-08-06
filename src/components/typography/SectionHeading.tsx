import { cn } from '@/lib/utils';
import { ScrollRevealText } from '@/components/motion/ScrollRevealText';

interface SectionHeadingProps {
  eyebrow: string;
  heading: string;
  intro?: string;
  className?: string;
}

export function SectionHeading({ eyebrow, heading, intro, className }: SectionHeadingProps) {
  return (
    <div className={cn('mx-auto max-w-3xl text-center', className)}>
      <p className="mb-4 text-sm text-[#c2c2c2]">{eyebrow}</p>
      <ScrollRevealText
        as="h2"
        text={heading}
        className="text-[32px] leading-[1.1] font-semibold text-balance md:text-5xl"
      />
      {intro ? (
        <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-[#c2c2c2]">{intro}</p>
      ) : null}
    </div>
  );
}
