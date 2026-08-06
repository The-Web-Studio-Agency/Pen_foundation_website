/**
 * Shapes for the /contact route's content module.
 *
 * Ported from the clone repo, minus its nav and footer types: this project's
 * header and footer are site chrome rendered by the root layout, and they read
 * from `@/config/navigation`. Keeping the clone's `NavItem`/`FooterContent`
 * here would have re-created the second navigation source that
 * `arch:check`'s singleton rule exists to prevent.
 */

export interface HeroContent {
  /** Rendered as two lines so the character reveal breaks where the original does. */
  titleLines: [string, string];
  infoHeading: string;
  infoBody: string;
  bullets: string[];
  trustLabel: string;
  phoneLabel: string;
  phoneNumber: string;
}

export type FieldType = 'text' | 'tel' | 'email' | 'select';

export interface FormFieldDef {
  name: string;
  label: string;
  placeholder: string;
  type: FieldType;
  required?: boolean;
  /** Half-width on the two-column grid, or full-width across it. */
  span: 'half' | 'full';
  options?: string[];
}

export interface PromoBanner {
  eyebrow: string;
  title: string;
  emailLabel: string;
  emailPlaceholder: string;
  submitLabel: string;
  image: { src: string; alt: string };
}

export type ContactWayVariant = 'link' | 'action' | 'subscribe';

export interface ContactWay {
  id: string;
  variant: ContactWayVariant;
  theme: 'dark' | 'light';
  title: string;
  description?: string;
  href?: string;
  icon?: string;
  /** Which edge the decorative notch is cut from, at >=1024px. */
  notch: { edge: 'left' | 'bottom'; center: string };
  subscribe?: {
    label: string;
    placeholder: string;
    submitLabel: string;
  };
}

export interface ResourceCard {
  category: string;
  title: string;
  excerpt?: string;
  href: string;
  image: { src: string; alt: string };
  actionLabel: string;
}

export interface FeaturedGrid {
  eyebrow?: string;
  title: string;
  body?: string;
  /** The second grid puts the title above the supporting line. */
  titleFirst?: boolean;
  cards: ResourceCard[];
}

export interface CarouselSection {
  eyebrow: string;
  title: string;
  cards: ResourceCard[];
}

export interface FaqEntry {
  question: string;
  answer: string;
}

export interface FaqTab {
  id: string;
  label: string;
  entries: FaqEntry[];
}

export interface Testimonial {
  logo: { src: string; alt: string };
  rating: number;
  headline: string;
  body: string;
  ctaLabel: string;
  ctaHref: string;
}
