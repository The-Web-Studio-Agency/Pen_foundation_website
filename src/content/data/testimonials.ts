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
 * HOW TO REPLACE THE SAMPLES
 *   Every entry marked `placeholder: true` is invented sample text, there
 *   only to show the design with a full wall. Each one carries a "Sample"
 *   tag on the page. Overwrite its quote, name and role with an approved
 *   testimonial and delete the `placeholder: true` line; delete any you do
 *   not need. Do not publish the site with placeholders left in.
 *
 * LAYOUT
 *   The first entry without `placeholder` is the featured quote, set large
 *   at the top (falling back to the first entry). Every other entry is a card
 *   on the two drifting rows below it, alternating between the rows. The
 *   section hides itself while the list is empty.
 *
 * SOURCES
 *   Karan J Fraanc — the Devagiri Library case study supplied by the client
 *   (November 2026), which quotes him from SSMB. Kept with that attribution.
 *   The five video testimonials received so far are to be transcribed and
 *   added here once their wording and names are confirmed.
 */

import { cms } from '@/lib/cms/store';

export interface Testimonial {
  quote: string;
  name: string;
  role: string;
  highlight?: string;
  photo?: string;
  project?: { label: string; href?: string };
  source?: string;
  /** Invented sample text: shown with a "Sample" tag until replaced. */
  placeholder?: boolean;
}

const _testimonialsSectionDefault = {
  chip: 'Testimonials',
  heading: 'From the people who build on PEN',
};
/** Editable in the admin (/web-admin). */
export const testimonialsSection = cms('home.testimonialsHeading', _testimonialsSectionDefault);

const _testimonialsDefault: Testimonial[] = [
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

  /* ---- SAMPLES: invented for layout only. Replace or delete. ------------ */
  {
    quote:
      'We wanted to keep the trees and the slope as they were. The foundation went in without digging up the site.',
    name: 'Anjali Menon',
    role: 'Project Architect',
    placeholder: true,
  },
  {
    quote:
      'The installation crew was quick and tidy. There was no concrete to wait for, so the rest of the programme stayed on track.',
    name: 'Rahul Nair',
    role: 'Site Engineer',
    placeholder: true,
  },
  {
    quote:
      'The engineering team reviewed our loads and soil data before anything reached site. That gave us confidence from the start.',
    name: 'Meera Iyer',
    role: 'Structural Consultant',
    placeholder: true,
  },
  {
    quote:
      'For a remote plot with limited labour, a factory made foundation was the practical choice.',
    name: 'Suresh Pillai',
    role: 'Homeowner',
    placeholder: true,
  },
  {
    quote:
      'Our steel frames bolt straight onto the nodes, which keeps our modular schedule simple.',
    name: 'Vikram Rao',
    role: 'Modular Builder',
    placeholder: true,
  },
  {
    quote: 'Less wet work meant less mess on a site our neighbours could see every day.',
    name: 'Farah Khan',
    role: 'Developer',
    placeholder: true,
  },
];
/** Editable in the admin (/web-admin). */
export const testimonials = cms('home.testimonials', _testimonialsDefault);
