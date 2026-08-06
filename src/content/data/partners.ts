export interface Partner {
  /** Short name — the text treatment and the image alt both use this. */
  name: string;
  /** Longer form, shown as a tooltip where space is tight. */
  fullName?: string;
  /** Logo under /public/media/logos/supported-by. Falls back to the name. */
  logo?: string;
  /**
   * The supplied asset is artwork on a dark background rather than a
   * transparent mark, so it renders as a chip instead of sitting directly on
   * the section. Replace the asset with a light/transparent version and drop
   * this flag — it is a workaround, not a design choice.
   */
  onDark?: boolean;
}

/**
 * The single supporter/partner list.
 *
 * About rendered generic placeholders ("Academic Institution", "Research
 * Partner") while /contact hardcoded a different set of real names in a
 * component. Same concept, two sources, and only one was true. Adding the
 * supplied logos to a third list would have repeated the mistake, so the logo
 * is a field on the one list instead.
 */
export const partners: Partner[] = [
  {
    name: 'IKEA Foundation',
    logo: '/media/logos/supported-by/ikea-foundation.webp',
  },
  {
    name: 'VISA Foundation',
    logo: '/media/logos/supported-by/visa-foundation.webp',
  },
  {
    name: 'Startup India',
    logo: '/media/logos/supported-by/startup-india.webp',
  },
  {
    name: 'Make in India',
    logo: '/media/logos/supported-by/make-in-india.webp',
  },
  {
    name: 'MSME',
    fullName: 'Ministry of Micro, Small & Medium Enterprises, Govt. of India',
    logo: '/media/logos/supported-by/msme.webp',
  },
  {
    name: 'Kerala Startup Mission',
    fullName: 'Kerala Startup Mission (KSUM)',
    logo: '/media/logos/supported-by/kerala-startup-mission.webp',
  },
  {
    name: 'VIT',
    fullName: 'Vellore Institute of Technology',
    logo: '/media/logos/supported-by/vit.webp',
  },
  {
    name: 'TBI NIT Calicut',
    fullName: 'Technology Business Incubator, NIT Calicut',
    logo: '/media/logos/supported-by/tbi-nit-calicut.webp',
  },
  {
    name: 'HDFC Parivartan',
    fullName: 'HDFC Bank Parivartan',
    logo: '/media/logos/supported-by/hdfc-parivartan.webp',
  },
  {
    name: 'Villgro',
    logo: '/media/logos/supported-by/villgro.webp',
  },
  {
    name: 'Sankalp Forum',
    fullName: 'Sankalp Forum — an Intellecap initiative',
    logo: '/media/logos/supported-by/sankalp-forum.webp',
  },
  {
    name: 'GreenR',
    fullName: 'GreenR — a TechnoServe India initiative',
    logo: '/media/logos/supported-by/greenr.webp',
    onDark: true,
  },
  {
    name: 'Construction Innovation Hub',
    logo: '/media/logos/supported-by/construction-innovation-hub.webp',
  },
  {
    name: 'Bridge Bharat',
    logo: '/media/logos/supported-by/bridge-bharat.webp',
  },
  {
    name: 'ZEMCH Network',
    fullName: 'Zero Energy Mass Custom Home Network',
    logo: '/media/logos/supported-by/zemch-network.webp',
  },
  {
    name: 'RealtyNXT',
    logo: '/media/logos/supported-by/realty-nxt.webp',
  },
];
