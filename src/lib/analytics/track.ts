/**
 * Conversion events for paid traffic.
 *
 * The site ships no tracking script of its own. These helpers report to
 * whichever tags the marketing team installs, and do nothing when none is
 * present:
 *
 *   Google Tag Manager  `window.dataLayer.push({ event, ... })`
 *   Google Ads / GA4    `window.gtag('event', name, params)`
 *   Meta Pixel          `window.fbq('track', name)`
 *
 * Event names follow the platforms' standard lead events, so they can be
 * marked as conversions without custom mapping.
 */

type Params = Record<string, string | undefined>;

interface TrackingWindow {
  dataLayer?: Record<string, unknown>[];
  gtag?: (...args: unknown[]) => void;
  fbq?: (...args: unknown[]) => void;
}

function tags(): TrackingWindow | null {
  return typeof window === 'undefined' ? null : (window as unknown as TrackingWindow);
}

/** A submitted enquiry: GA4 `generate_lead`, Meta `Lead`. */
export function trackLead(params: Params) {
  const w = tags();
  if (!w) return;
  w.dataLayer?.push({ event: 'generate_lead', ...params });
  w.gtag?.('event', 'generate_lead', params);
  w.fbq?.('track', 'Lead', params);
}

/** A tap on a phone number: Meta `Contact`. */
export function trackCall(location: string) {
  const w = tags();
  if (!w) return;
  w.dataLayer?.push({ event: 'click_to_call', location });
  w.gtag?.('event', 'click_to_call', { location });
  w.fbq?.('track', 'Contact');
}

/** The ad parameters on the current address, for the enquiry message. */
export function campaignParams(): Params {
  if (typeof window === 'undefined') return {};
  const query = new URLSearchParams(window.location.search);
  const keys = [
    'utm_source',
    'utm_medium',
    'utm_campaign',
    'utm_term',
    'utm_content',
    'gclid',
    'fbclid',
  ];
  return Object.fromEntries(
    keys.flatMap((key) => (query.get(key) ? [[key, query.get(key)!]] : [])),
  );
}
