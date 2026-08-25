'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform, MotionValue } from 'framer-motion';

// 1. Updated Props interface
export interface ScrollTextProps {
  text: string;
  highlightColor?: string; // Color when revealed (default: cyan/emerald)
  dimColor?: string; // Color before reveal (default: 20% black)
  className?: string; // Custom styling for wrapper text (size, font, leading, etc.)
}

interface WordProps {
  children: string;
  progress: MotionValue<number>;
  range: [number, number];
  highlightColor?: string;
  dimColor?: string;
}

const Word: React.FC<WordProps> = ({ children, progress, range, highlightColor, dimColor }) => {
  const opacity = useTransform(progress, range, [0, 1]);

  return (
    <span className="relative mr-[0.25em] inline-block select-none">
      {/* Dynamic Background Dimmed Text */}
      <span style={{ color: dimColor }}>{children}</span>

      {/* Dynamic Foreground Highlight Text */}
      <motion.span style={{ opacity, color: highlightColor }} className="absolute top-0 left-0">
        {children}
      </motion.span>
    </span>
  );
};

export const ScrollAnimationText: React.FC<ScrollTextProps> = ({
  text,
  highlightColor ,
  dimColor , // Supports hex, rgb, rgba, or CSS variables
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const words = text.split(' ');

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 0.7', 'end 0.7'],
  });

  return (
    <div
      ref={containerRef}
      className="flex min-h-[50vh] w-full items-center justify-center px-6 py-20"
    >
      <h2 className={className}>
        {words.map((word, index) => {
          const step = 1 / words.length;
          const start = index * step;
          const end = Math.min(start + step * 1.5, 1);

          return (
            <Word
              key={index}
              progress={scrollYProgress}
              range={[start, end]}
              highlightColor={highlightColor}
              dimColor={dimColor}
            >
              {word}
            </Word>
          );
        })}
      </h2>
    </div>
  );
};

export default ScrollAnimationText;
