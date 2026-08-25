'use client';

import React, { useRef, useId, useState, useEffect, useCallback } from 'react';
import { motion, useScroll, useTransform, MotionValue, AnimatePresence } from 'framer-motion';

// --- Types ---
interface FeatureItem {
  id: string;
  number: string;
  title: string;
  description: string;
  videoSrc?: string;
}

interface StickyScrollFeatureProps {
  features?: FeatureItem[];
  defaultVideoSrc?: string;
  highlightColor?: string;
}

interface SvgVideoContainerProps {
  videoSrc: string;
  className?: string;
}

// --- SVG Masked Video Component ---
export const SvgVideoContainer: React.FC<SvgVideoContainerProps> = ({
  videoSrc,
  className = '',
}) => {
  const rawId = useId();
  const clipId = `terminal-svg-clip-${rawId.replace(/:/g, '')}`;

  return (
    <svg
      viewBox="-0.5 -0.5 697 700.5"
      className={`h-auto w-full md:min-h-[800px] ${className}`}
      shapeRendering="geometricPrecision"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <clipPath id={clipId} clipPathUnits="userSpaceOnUse">
          <path d="M 11.5,-0.5 L 684.5,-0.5 A 12,12 0 0 1 696.5,11.5 L 696.5,688 A 12,12 0 0 1 684.5,700 L 11.5,700 A 12,12 0 0 1 -0.5,688 L -0.5,316.03 A 21.66,21.66 0 0 1 5.22,301.97 L 24.78,279.29 A 21.53,21.53 0 0 0 30,265.23 L 30,142.43 A 21.53,21.53 0 0 0 24.78,128.37 L 5.22,105.69 A 21.7,21.7 0 0 1 -0.04,91.63 L -0.5,11.5 A 12,12 0 0 1 11.5,-0.5 Z" />
        </clipPath>
      </defs>

      <g clipPath={`url(#${clipId})`}>
        <foreignObject x="0" y="0" width="697" height="700">
          <AnimatePresence mode="wait">
            <motion.video
              key={videoSrc}
              src={videoSrc}
              autoPlay
              loop
              muted
              playsInline
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </AnimatePresence>
        </foreignObject>
      </g>
    </svg>
  );
};

// --- Single Word Reveal Component ---
interface WordProps {
  children: string;
  progress: MotionValue<number>;
  range: [number, number];
  highlightColor: string;
  isTitle?: boolean;
}

const Word: React.FC<WordProps> = ({
  children,
  progress,
  range,
  highlightColor,
  isTitle = false,
}) => {
  const opacity = useTransform(progress, range, [0, 1]);

  return (
    <span className="relative mr-[0.28em] inline-block select-none">
      <span className="text-[#9aa5a5] opacity-25">{children}</span>
      <motion.span
        style={{ opacity, color: highlightColor }}
        className={`absolute top-0 left-0 ${isTitle ? 'font-bold' : 'font-medium'}`}
      >
        {children}
      </motion.span>
    </span>
  );
};

// --- Single Text Block Section ---
// Shared between the desktop (vertical scroll) and mobile (horizontal swipe)
// layouts. `orientation` controls which axis drives the word-reveal progress,
// and `scrollContainerRef` lets the horizontal (mobile) variant measure
// progress relative to the swipeable track instead of the page.
//
// NOTE: `onVisible` here is used ONLY to drive the word-reveal text
// animation's own container ref. Active-slide detection for mobile (which
// video/tab is "current") is now handled separately in MobileFeatureSlider
// via IntersectionObserver, decoupled from this progress value. Previously
// both concerns shared the same 0.1–0.9 window, which caused flicker when
// two adjacent 88%-wide slides were partially visible at once.
interface TextSectionProps {
  item: FeatureItem;
  highlightColor: string;
  onVisible?: () => void;
  orientation?: 'vertical' | 'horizontal';
  scrollContainerRef?: React.RefObject<HTMLDivElement | null>;
  containerRef?: React.RefObject<HTMLDivElement | null>;
  className?: string;
}

const TextSection: React.FC<TextSectionProps> = ({
  item,
  highlightColor,
  onVisible,
  orientation = 'vertical',
  scrollContainerRef,
  containerRef: forwardedRef,
  className = '',
}) => {
  const internalRef = useRef<HTMLDivElement>(null);
  const containerRef = forwardedRef ?? internalRef;

  const titleWords = item.title.split(' ');
  const descWords = item.description.split(' ');
  const totalWords = titleWords.length + descWords.length;

  const { scrollYProgress, scrollXProgress } = useScroll(
    orientation === 'horizontal'
      ? {
          target: containerRef,
          container: scrollContainerRef,
          axis: 'x',
          offset: ['start 0.85', 'start 0.15'],
        }
      : {
          target: containerRef,
          offset: ['start 0.6', 'end 0.7'],
        },
  );

  const progress = orientation === 'horizontal' ? scrollXProgress : scrollYProgress;

  // Desktop only: switch the sticky video when this section scrolls into focus.
  // (On mobile this is now handled by IntersectionObserver in the parent,
  // so `onVisible` is optional and simply not passed for mobile slides.)
  useEffect(() => {
    if (!onVisible) return;
    return progress.on('change', (latest) => {
      if (latest > 0.1 && latest < 0.9) {
        onVisible();
      }
    });
  }, [progress, onVisible]);

  return (
    <div
      ref={containerRef}
      className={`flex flex-col px-6 py-12 md:min-h-[55vh] md:px-12 ${className}`}
    >
      <span className="mb-4 font-mono text-xs text-[#9aa5a5]">{item.number}</span>

      <h3 className="mb-6 xl:title-si title-h2 leading-normal font-medium">
        {titleWords.map((word, index) => {
          const step = 1 / totalWords;
          const start = index * step;
          const end = start + step;

          return (
            <Word
              key={`title-${index}`}
              progress={progress}
              range={[start, end]}
              highlightColor={highlightColor}
              isTitle
            >
              {word}
            </Word>
          );
        })}
      </h3>

      <p className=" max-w-2xl body-1 text-[var(--c-dark-green)]/70  leading-relaxed font-medium tracking-tight ">
        {descWords.map((word, index) => {
          const globalIndex = titleWords.length + index;
          const step = 1 / totalWords;
          const start = globalIndex * step;
          const end = start + step;

          return (
            <Word
              key={`desc-${index}`}
              progress={progress}
              range={[start, end]}
              highlightColor={highlightColor}
            >
              {word}
            </Word>
          );
        })}
      </p>
    </div>
  );
};

// --- Chevron Icons (inline, no external icon dependency) ---
const ChevronLeftIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <path
      d="M15 18l-6-6 6-6"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ChevronRightIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <path
      d="M9 6l6 6-6 6"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// --- Mobile: swipeable slider version ---
interface MobileFeatureSliderProps {
  features: FeatureItem[];
  defaultVideoSrc: string;
  highlightColor: string;
}

const MobileFeatureSlider: React.FC<MobileFeatureSliderProps> = ({
  features,
  defaultVideoSrc,
  highlightColor,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeVideoSrc, setActiveVideoSrc] = useState<string>(
    features[0]?.videoSrc || defaultVideoSrc,
  );

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);

  // FIX: scroll the container directly instead of scrollIntoView.
  // scrollIntoView + CSS scroll-snap can fight each other mid-animation
  // (the browser's snap correction interrupts the JS-driven smooth scroll),
  // which produced the stutter/overshoot on the prev/next buttons.
  const scrollToIndex = useCallback((index: number) => {
    const target = slideRefs.current[index];
    const container = scrollContainerRef.current;
    if (!target || !container) return;
    container.scrollTo({
      left: target.offsetLeft,
      behavior: 'smooth',
    });
  }, []);

  const handleVisible = useCallback(
    (index: number) => {
      setActiveIndex(index);
      setActiveVideoSrc(features[index]?.videoSrc || defaultVideoSrc);
    },
    [features, defaultVideoSrc],
  );

  // FIX: active-slide detection now uses IntersectionObserver against the
  // scroll container, decoupled from the word-reveal scrollXProgress used
  // inside TextSection. The old approach shared the same 0.1–0.9 progress
  // window for both the text animation AND "which slide is active", which
  // meant two 88%-wide overlapping slides could both report "visible" at
  // once during a swipe, causing the active tab/video/indicator to flicker
  // or land on the wrong slide.
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Pick the entry with the greatest intersection ratio among those
        // currently intersecting, rather than just the first match, so a
        // fast swipe settles on the correct slide.
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visible) {
          const index = slideRefs.current.findIndex((el) => el === visible.target);
          if (index !== -1) handleVisible(index);
        }
      },
      { root: container, threshold: [0.5, 0.6, 0.7, 0.8, 0.9] },
    );

    slideRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, [handleVisible, features.length]);

  const isFirst = activeIndex === 0;
  const isLast = activeIndex === features.length - 1;

  return (
    <div className="w-full md:hidden">
      {/* Video */}
      <div className="relative w-full p-6 pb-0">
        <SvgVideoContainer videoSrc={activeVideoSrc} />

        {/* Prev / Next controls */}
        <div className="absolute right-9 bottom-9 flex items-center gap-2">
          <button
            type="button"
            aria-label="Previous feature"
            disabled={isFirst}
            onClick={() => scrollToIndex(activeIndex - 1)}
            className={`flex h-11 w-11 items-center justify-center rounded-lg transition-colors ${
              isFirst
                ? 'cursor-not-allowed bg-white/40 text-gray-300'
                : 'bg-white text-gray-800 hover:bg-gray-100'
            }`}
          >
            <ChevronLeftIcon className="h-5 w-5" />
          </button>
          <button
            type="button"
            aria-label="Next feature"
            disabled={isLast}
            onClick={() => scrollToIndex(activeIndex + 1)}
            className={`flex h-11 w-11 items-center justify-center rounded-lg transition-colors ${
              isLast
                ? 'cursor-not-allowed bg-white/40 text-gray-300'
                : 'bg-white text-gray-800 hover:bg-gray-100'
            }`}
          >
            <ChevronRightIcon className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Number tabs */}
      <div className="flex gap-4 px-6 pt-4 font-mono text-xs">
        {features.map((item, index) => (
          <button
            key={item.id}
            type="button"
            onClick={() => scrollToIndex(index)}
            className={`transition-colors ${
              index === activeIndex ? 'font-bold text-gray-900' : 'text-[#9aa5a5]'
            }`}
          >
            {item.number}
          </button>
        ))}
      </div>

      {/* Swipeable text cards */}
      {/* FIX: replaced the arbitrary-variant Tailwind scrollbar-hiding
          classes (version-sensitive, easy to get purged) with a plain
          `.no-scrollbar` CSS class — see stylesheet snippet below. */}
      <div
        ref={scrollContainerRef}
        className="no-scrollbar flex snap-x snap-mandatory overflow-x-auto scroll-smooth"
      >
        {features.map((item, index) => (
          <div
            key={item.id}
            ref={(el) => {
              slideRefs.current[index] = el;
            }}
            className="w-[88%] flex-shrink-0 snap-start"
          >
            <TextSection
              item={item}
              highlightColor={highlightColor}
              orientation="horizontal"
              scrollContainerRef={scrollContainerRef}
              className="!min-h-0 !py-6"
            />
          </div>
        ))}
      </div>

      {/* Sliding progress indicator */}
      <div className="px-6 pb-8">
        <div className="relative h-[2px] w-full bg-gray-200">
          <motion.div
            className="absolute top-0 left-0 h-[2px] bg-gray-900"
            style={{ width: `${100 / features.length}%` }}
            animate={{ x: `${activeIndex * 100}%` }}
            transition={{ type: 'spring', stiffness: 300, damping: 32 }}
          />
        </div>
      </div>
    </div>
  );
};

// --- Main Split Screen Component ---
export const StickyScrollFeature: React.FC<StickyScrollFeatureProps> = ({
  features = DEFAULT_FEATURES,
  defaultVideoSrc = 'https://a.storyblok.com/f/337048/x/f0f51ea10f/vid_3-1_prerender_1.mp4',
  highlightColor = '#84cc16',
}) => {
  const [activeVideoSrc, setActiveVideoSrc] = useState<string>(
    features[0]?.videoSrc || defaultVideoSrc,
  );

  return (
    <section className="relative w-full bg-white">
      {/* Mobile: swipeable slider (video + tabs + horizontal cards) */}
      <MobileFeatureSlider
        features={features}
        defaultVideoSrc={defaultVideoSrc}
        highlightColor={highlightColor}
      />

      {/* Desktop: original sticky scroll layout, unchanged */}
      <div className="mx-auto hidden max-w-full md:flex md:flex-row md:items-stretch">
        {/* LEFT COLUMN: Scrolling Text Content */}
        <div className="z-10 flex h-auto w-full flex-col md:h-auto md:w-1/2">
          {features.map((item) => (
            <TextSection
              key={item.id}
              item={item}
              highlightColor={highlightColor}
              onVisible={() => setActiveVideoSrc(item.videoSrc || defaultVideoSrc)}
            />
          ))}
        </div>

        {/* RIGHT COLUMN: Fixed visual section */}
        <div className="relative w-full md:w-1/2">
          <div className="sticky top-0 flex w-full items-center justify-center p-0 md:h-screen md:p-6">
            <SvgVideoContainer videoSrc={activeVideoSrc} />
          </div>
        </div>
      </div>
    </section>
  );
};

// --- Sample Data with unique video URLs per item ---
const DEFAULT_FEATURES: FeatureItem[] = [
  {
    id: '1',
    number: '01',
    title: 'Orchestrate Yard Execution',
    description:
      'Computer vision automates check-in, location, and validation gate to dock – up to 50% more throughput and 85% faster gate processing.',
    videoSrc: 'https://a.storyblok.com/f/337048/x/f0f51ea10f/vid_3-1_prerender_1.mp4',
  },
  {
    id: '2',
    number: '02',
    title: 'Build System You Need',
    description:
      'Start with the applications your need most and then expand as your needs grow or as your operations become more complex. Live in 5 days, low IT lift, no third-party devices to support.',
    videoSrc: 'https://a.storyblok.com/f/337048/x/f0f51ea10f/vid_3-1_prerender_1.mp4',
  },
  {
    id: '3',
    number: '03',
    title: 'Eliminates Unnecessary Labor',
    description:
      'Automated workflows eliminate the need for labor at the gate, dispatch, yard checks, and makes the dock more efficient.',
    videoSrc: 'https://a.storyblok.com/f/337048/x/f0f51ea10f/vid_3-1_prerender_1.mp4',
  },
  {
    id: '4',
    number: '04',
    title: 'Fast Payback',
    description:
      'All-inclusive, priced as a service. Measurable payback in months, without upfront capital expenditure.',
    videoSrc: 'https://a.storyblok.com/f/337048/x/f0f51ea10f/vid_3-1_prerender_1.mp4',
  },
];

export default StickyScrollFeature;

