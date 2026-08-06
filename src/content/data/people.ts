export interface PersonCard {
  name: string;
  title: string;
  /**
   * Optional. Only written where a documented background exists — an invented
   * biography attached to a real person's photograph is a misrepresentation,
   * not a placeholder. Cards without one render name and title only.
   */
  bio?: string;
  photoTone: 'color' | 'grayscale';
  initials: string;
  avatarColor: string;
  /** Optional headshot. Falls back to the initials avatar when absent. */
  photo?: string;
}

/**
 * PEN Foundation's founding team.
 *
 * This previously held three invented executives — "Alex Whitfield",
 * "Owen Faulkner", "Layla Hassan" — each attached to one of the real headshots
 * in /media/images/teammember. The names, titles and biographies were all
 * fictional while the faces were real, and the pairings were wrong besides.
 * Corrected against the archived PEN-branded About page and
 * docs/brand/source/homepage.odt.
 */
export const leadershipTeam: PersonCard[] = [
  {
    name: 'Jeesh Venmarath',
    title: 'Founder & CEO',
    initials: 'JV',
    avatarColor: '#057c86',
    photoTone: 'color',
    photo: '/media/images/teammember/jeesh.png',
    // Sourced from the About-page narrative in homepage.odt.
    bio: 'Twenty-five years of designing structures revealed the same pattern on every project: foundations consumed time, resources, and opportunity. Instead of accepting that as normal, he asked whether there was another way. That question eventually became PEN Foundation.',
  },
  {
    name: 'Kala CP',
    title: 'Co-Founder & CTO',
    initials: 'KC',
    avatarColor: '#023e49',
    photoTone: 'color',
    photo: '/media/images/teammember/kala.png',
    // TODO(content): no documented background available — supply a bio.
  },
  {
    name: 'Hemanth Chodisetti',
    title: 'Co-Founder & CGO',
    initials: 'HC',
    avatarColor: '#2b2119',
    photoTone: 'color',
    photo: '/media/images/teammember/hemanth.png',
    // TODO(content): no documented background available — supply a bio.
  },
];

/**
 * Advisors and board members.
 *
 * Deliberately empty. The previous six entries — "Nathaniel Grey",
 * "Serena Kwan", "Priyanka Rao", "Andrew Coleman", "Harold Whitman",
 * "Grace Ferreira" — were invented people with invented titles. PEN's
 * documented support comes from the institutions in content/data/partners.ts,
 * which is what the About page now shows. Populate this only with real,
 * confirmed names.
 */
export const investorsAndAdvisors: PersonCard[] = [];
