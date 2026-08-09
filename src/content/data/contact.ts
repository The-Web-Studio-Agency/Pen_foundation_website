import { siteConfig } from '@/config/site';
import type { ContactWay, FormFieldDef, HeroContent, PromoBanner } from '@/types/contact';

/**
 * Content for the /contact route.
 *
 * Imagery and the resource/FAQ copy are placeholder: the layout, lengths and
 * interaction patterns mirror the reference page so it reads at the same
 * visual weight without reusing anything proprietary.
 *
 * The clone's `navItems` and `footer` exports are deliberately absent — header
 * and footer links live in `@/config/navigation`, which `arch:check` enforces
 * as the single navigation source.
 */

export const hero: HeroContent = {
  titleLines: ['Demo, phone call, webinar, social', 'connection, you decide how to connect'],

  infoHeading: 'Connect directly with the PEN Foundation engineering team',

  infoBody:
    "Whether you're planning a residential, commercial, industrial, or infrastructure project, our engineers are ready to discuss your project requirements, evaluate applications, and help determine how PEN Foundation can support your construction goals.",

  bullets: [
    'Engineering Consultation',
    'Project Evaluation',
    'Technical Documentation',
    'Product Presentation',
  ],

  trustLabel:
    'Trusted by architects, structural engineers, developers, contractors, and construction professionals.',

  phoneLabel: 'Prefer speaking with an engineer?',

  // The real number, from the company brochure and `siteConfig.phone`. This
  // was a placeholder, which meant the one non-form conversion path on both
  // /contact and the homepage dialled nowhere.
  phoneNumber: siteConfig.phone,
};
/**
 * Name and phone are the only required fields — everything else is optional,
 * so a visitor can send an enquiry with just a way to call them back. The
 * required pair leads the form so the two starred fields sit on one row.
 *
 * Shared by /contact and the homepage's closing form; both show the same
 * fields and the same requiredness.
 */
export const formFields: FormFieldDef[] = [
  {
    name: 'name',
    label: 'Full Name',
    placeholder: 'John Doe',
    type: 'text',
    required: true,
    span: 'half',
  },
  {
    name: 'phone',
    label: 'Phone number',
    placeholder: '+91 98765 43210',
    type: 'tel',
    required: true,
    span: 'half',
  },
  {
    name: 'role',
    label: 'Role or position',
    placeholder: 'Project manager',
    type: 'text',
    span: 'half',
  },
  {
    name: 'email',
    label: 'Email',
    placeholder: 'name@email.com',
    type: 'email',
    span: 'half',
  },
  {
    name: 'company',
    label: 'Company name',
    placeholder: 'Acme',
    type: 'text',
    span: 'full',
  },
  {
    name: 'topic',
    label: 'How Can We Help?',
    placeholder: 'Select options',
    type: 'select',
    span: 'full',
    options: [
      'Request a structural consultation',
      'Check if PEN works for my plot',
      'Calculate my MW commissioning advantage',
      'Plan an eco-resort foundation',
      'Request technical documentation',
      'Something else',
    ],
  },
];

/** Placeholder customer wordmarks shown under the hero copy. */
// export const trustedLogos = ['Northwind', 'Globex', 'Initech', 'Umbrella', 'Vandelay', 'Soylent'];

export const promoBanner: PromoBanner = {
  eyebrow: 'Download datasheet',
  title: 'Not ready for a call? Download a brief overview of PEN Foundation.',
  emailLabel: 'Work Email *',
  emailPlaceholder: 'name@email.com',
  submitLabel: 'Download Now',
  image: {
    src: '/media/images/certificates/certificate_griha.png',
    alt: 'GRIHA Council certificate listing the PEN pre-engineered nail foundation in the GRIHA Product Catalogue under criterion 30, valid 12 June 2025 to 11 June 2027',
  },
};

export const contactWays: ContactWay[] = [
  {
    id: 'survey',
    variant: 'link',
    theme: 'dark',
    title: 'Download the NIT Calicut field test report',
    href: '#',
    icon: 'survey',
    notch: { edge: 'left', center: '50%' },
  },
  {
    id: 'chat',
    variant: 'action',
    theme: 'light',
    title: 'Chat with our assistant',
    description:
      'Get instant answers about integrations, edge cases, and more — no forms required.',
    icon: 'sparkle',
    notch: { edge: 'bottom', center: 'calc(30% + 138px)' },
  },
  {
    id: 'roi',
    variant: 'link',
    theme: 'light',
    title: 'Calculate your ROI',
    description:
      'Enter your plot size, soil type, and structure to estimate load capacity and installation time.',
    href: '#',
    icon: 'calculator',
    notch: { edge: 'bottom', center: 'calc(30% + 138px)' },
  },
  {
    id: 'subscribe',
    variant: 'subscribe',
    theme: 'light',
    title: 'Subscribe to our newsletter',
    notch: { edge: 'bottom', center: 'calc(30% + 138px)' },
    subscribe: {
      label: 'Work Email *',
      placeholder: 'name@email.com',
      submitLabel: 'Submit',
    },
  },
];
