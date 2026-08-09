'use client';

import { useRef, type ComponentType, type ElementType, type ReactNode, type Ref } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

import { cn } from '@/lib/utils';

const REST_COLOR = '#c2c2c2';
// Brand accent (--color-teal). Interpolated by Framer Motion, so it has to be
// site's lime. Framer Motion interpolates raw values, so this can't be a var().
const PEAK_COLOR = '#057c86';
const SETTLE_COLOR = '#012c32';

function ScrubbedWord({
  word,
  index,
  count,
  progress,
}: {
  word: string;
  index: number;
  count: number;
  progress: ReturnType<typeof useScroll>['scrollYProgress'];
}) {
  const start = index / count;
  const mid = (index + 0.6) / count;
  const end = (index + 1) / count;
  const color = useTransform(progress, [start, mid, end], [REST_COLOR, PEAK_COLOR, SETTLE_COLOR]);

  return (
    <>
      <motion.span style={{ color }}>{word}</motion.span>
      {index < count - 1 ? ' ' : ''}
    </>
  );
}

interface ScrollRevealTextProps {
  text: string;
  as?: ElementType;
  className?: string;
}

export function ScrollRevealText({ text, as = 'span', className }: ScrollRevealTextProps) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.9', 'start 0.35'],
  });

  const words = text.split(' ');

  // A bare ElementType can't carry ref/className/children through, so narrow it
  // to the props this component actually passes.
  const Tag = as as ComponentType<{
    ref?: Ref<HTMLElement>;
    className?: string;
    children?: ReactNode;
  }>;

  return (
    <Tag ref={ref} className={cn(className)}>
      {words.map((word, i) => (
        <ScrubbedWord
          key={`${word}-${i}`}
          word={word}
          index={i}
          count={words.length}
          progress={scrollYProgress}
        />
      ))}
    </Tag>
  );
}
