/**
 * Written testimonials for the homepage.
 *
 * HOW TO ADD ONE
 *   Add an entry to `testimonials` below, in the words the person approved.
 *   `quote`, `name` and `role` are required; the rest is optional:
 *     - `highlight`  a short phrase from the quote, shown large above it
 *     - `photo`      a square headshot in public/media/testimonials/
 *                    (initials are shown without one)
 *     - `project`    the project they're speaking about, linked if it has a page
 *     - `source`     where the words were published, if not given to PEN directly
 *
 * The section hides itself while the list is empty, and the arrows and the
 * person list only appear once there are two or more entries.
 *
 * SOURCES
 *   Karan J Fraanc — the Devagiri Library case study supplied by the client
 *   (November 2026), which quotes him from SSMB. Kept with that attribution.
 *   The five video testimonials received so far are to be transcribed and
 *   added here once their wording and names are confirmed.
 */

export interface Testimonial {
  quote: string;
  name: string;
  role: string;
  highlight?: string;
  photo?: string;
  project?: { label: string; href?: string };
  source?: string;
}

export const testimonialsSection = {
  chip: 'Testimonials',
  heading: 'From the people who build on PEN',
};

export const testimonials: Testimonial[] = [
  {
    highlight: 'Swift completion in under a year.',
    quote:
      'The planning of every aspect combined with effective site management enabled swift completion in under a year.',
    name: 'Karan J Fraanc',
    role: 'Elansa Design Studio',
    project: {
      label: 'Devagiri Library Book Tower',
      href: '/projects/devagiri-library-book-tower',
    },
    source: 'Quoted in SSMB',
  },
];
