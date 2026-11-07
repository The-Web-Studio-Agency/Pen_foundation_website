/**
 * The PEN partner network — who is authorised to supply and install PEN.
 *
 * SOURCE: the client's partners page (partners-page.html, November 2026).
 * Copy is transcribed from it. Not to be confused with `partners.ts`, which
 * lists the institutions that support and fund PEN.
 *
 * The source carries bracketed placeholders ("[PHONE]", "[EMAIL]",
 * "[ADDRESS FROM BUSINESS CARD]", …) still to be filled. Rows whose value is
 * a placeholder are kept here as-is and left off the page until they are
 * replaced with the real detail.
 *
 * One change from the source: its trust strip says "GRIHA certified". The
 * certificate records a listing in the GRIHA Product Catalogue, and the rest
 * of the site says "GRIHA listed" for that reason (see `builtBy` in
 * homepage.ts), so this does too.
 */

export interface NetworkPartner {
  role: string;
  name: string;
  rows: { label: string; value: string; kind?: 'phone' | 'email' }[];
}

const CONTACT = '/contact#contact-form';

export const partnerNetwork = {
  hero: {
    kicker: 'PEN Foundation Partner Network',
    title: 'Buy PEN from people we trust',
    lead: 'PEN Foundation is installed and supplied only through authorised partners. Every partner is trained by C-DISC Technologies and works to our field installation standard. Check who is authorised before you buy.',
    trust: ['Validated by NIT Calicut and IIT Kanpur', 'GRIHA listed', 'Zero-excavation system'],
  },

  providers: {
    chip: 'Solution provider',
    heading: 'Authorised Solution Provider',
    lead: 'Our solution provider handles project engagement, site assessment and PEN deployment for your region.',
    items: [
      {
        role: 'Authorised Solution Provider',
        name: 'Aura Life Solutions',
        rows: [
          {
            label: 'Address',
            value:
              'No. 5, 6th Cross, 2nd Main,\nKuvempu Layout, Gubbi Cross,\nKothanur, Bangalore - 560077',
          },
          { label: 'Region', value: 'Bangalore and Karnataka' },
          { label: 'Phone', value: '[PHONE]', kind: 'phone' },
          { label: 'Email', value: '[EMAIL]', kind: 'email' },
        ],
      },
    ] satisfies NetworkPartner[],
  },

  resellers: {
    chip: 'Resellers',
    heading: 'Authorised Resellers',
    lead: 'Resellers supply PEN components and support your procurement locally.',
    items: [
      {
        role: 'Authorised Reseller',
        name: 'Master Marketers',
        rows: [
          { label: 'Contact', value: '[CONTACT PERSON, DESIGNATION]' },
          { label: 'Address', value: '[ADDRESS FROM BUSINESS CARD]' },
          { label: 'Region', value: '[REGION]' },
          { label: 'Phone', value: '[PHONE]', kind: 'phone' },
          { label: 'Email', value: '[EMAIL]', kind: 'email' },
        ],
      },
    ] satisfies NetworkPartner[],
  },

  installers: {
    chip: 'Installers',
    heading: 'Certified Installers',
    lead: 'Only installers who pass C-DISC training and a supervised site installation earn PEN certification.',
    soon: {
      heading: 'First certified installer cohort onboarding',
      body: 'Certified installers will be listed here by city. Want to be in the first batch?',
      cta: { label: 'Apply as installer', href: CONTACT },
    },
    steps: [
      { title: 'Apply', body: 'Share your team, equipment and past foundation work.' },
      { title: 'Train', body: 'Learn the PEN field installation guide with our engineers.' },
      {
        title: 'Install under supervision',
        body: 'Complete a live site installation reviewed by C-DISC.',
      },
      { title: 'Get certified', body: 'Listed on this page and eligible for PEN projects.' },
    ],
  },

  why: {
    chip: 'Why it matters',
    heading: 'Why use an authorised partner',
    items: [
      {
        title: 'Genuine PEN components',
        body: 'Material and dimensions follow the C-DISC specification.',
      },
      {
        title: 'Trained installation',
        body: 'Installers follow the PEN field installation guide on every site.',
      },
      {
        title: 'Direct engineering support',
        body: 'Partners escalate to the C-DISC engineering team when a site needs it.',
      },
    ],
  },

  join: {
    heading: 'Want to become a PEN partner?',
    body: 'We are building the network city by city. Tell us where you operate.',
    cta: { label: 'Become a partner', href: CONTACT },
  },
};
