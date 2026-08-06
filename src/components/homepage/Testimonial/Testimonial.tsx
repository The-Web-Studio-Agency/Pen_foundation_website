import { testimonial } from '@/content/data/homepage';

/**
 * The full-bleed quote, measured at 900px tall.
 *
 * The reference lays the quote over a darkened landscape photograph rather than
 * using the lime-ruled quote card that also ships in its bundle — verified
 * against `static-desktop-18-y14400.jpg`. The scrim below is what keeps the
 * white type legible over placeholder artwork of unknown density.
 */
export function Testimonial() {
  return (
    <section className="relative flex h-[900px] w-full items-center justify-center overflow-hidden">
      {/* eslint-disable-next-line @next/next/no-img-element -- SVG placeholder;
          the image optimiser refuses SVG without dangerouslyAllowSVG. */}
      <img
        src={testimonial.image.src}
        alt=""
        aria-hidden
        className="absolute inset-0 size-full object-cover"
      />
      <div aria-hidden className="absolute inset-0 bg-[var(--c-dark-green)]/55" />

      <figure className="site-gutter relative z-[1] mx-auto flex max-w-[53.25rem] flex-col items-center text-center text-[var(--c-white)]">
        <blockquote className="text-[2rem] leading-[120%] font-[450] tracking-[-0.32px]">
          {testimonial.quote}
        </blockquote>
        <figcaption className="mt-14 flex flex-col gap-4">
          <span className="body-1 block">{testimonial.name}</span>
          <span className="body-1 block">{testimonial.role}</span>
          <span className="body-1 block">{testimonial.company}</span>
        </figcaption>
      </figure>
    </section>
  );
}
