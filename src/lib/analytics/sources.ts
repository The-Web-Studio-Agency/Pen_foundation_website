/**
 * Where a visit came from, from the landing address's tags, the referring
 * site and, for in-app browsers that send no referrer, the browser itself.
 *
 *   channel   the broad kind: Search, Social, AI, Paid, Email, Referral, Direct
 *   source    the named site or app: Google, Instagram, ChatGPT, …
 *
 * Order of evidence: ad click IDs, then utm_ tags, then the referrer, then
 * the in-app browser, else Direct (typed in, bookmarks, most messaging apps).
 */

export const CHANNELS = ['Search', 'Social', 'AI', 'Paid', 'Email', 'Referral', 'Direct'] as const;
export type Channel = (typeof CHANNELS)[number];

export interface Attribution {
  channel: Channel;
  source: string;
  campaign?: string;
}

/** Host patterns, AI first so gemini.google.com is not read as Google Search. */
const HOSTS: [RegExp, string, Channel][] = [
  [/(^|\.)(chatgpt\.com|openai\.com)$/, 'ChatGPT', 'AI'],
  [/(^|\.)perplexity\.ai$/, 'Perplexity', 'AI'],
  [/(^|\.)(claude\.ai|anthropic\.com)$/, 'Claude', 'AI'],
  [/^(gemini|bard)\.google\.com$/, 'Gemini', 'AI'],
  [/(^|\.)copilot\.(microsoft\.com|cloud\.microsoft)$/, 'Copilot', 'AI'],
  [/(^|\.)deepseek\.com$/, 'DeepSeek', 'AI'],
  [/(^|\.)(grok\.com|x\.ai)$/, 'Grok', 'AI'],
  [/(^|\.)meta\.ai$/, 'Meta AI', 'AI'],
  [/(^|\.)(you\.com|phind\.com|poe\.com|mistral\.ai|chat\.mistral\.ai)$/, 'Other AI', 'AI'],

  [/(^|\.)mail\.google\.com$/, 'Gmail', 'Email'],
  [/(^|\.)(outlook\.(live|office|office365)\.com|mail\.yahoo\.com)$/, 'Email', 'Email'],

  [/(^|\.)google(\.[a-z]{2,3}){1,2}$/, 'Google', 'Search'],
  [/(^|\.)bing\.com$/, 'Bing', 'Search'],
  [/(^|\.)duckduckgo\.com$/, 'DuckDuckGo', 'Search'],
  [/(^|\.)search\.yahoo\.com$|(^|\.)yahoo\.com$/, 'Yahoo', 'Search'],
  [/(^|\.)yandex\.[a-z]+$/, 'Yandex', 'Search'],
  [/(^|\.)baidu\.com$/, 'Baidu', 'Search'],
  [/(^|\.)ecosia\.org$/, 'Ecosia', 'Search'],
  [/^search\.brave\.com$/, 'Brave Search', 'Search'],

  [/(^|\.)instagram\.com$/, 'Instagram', 'Social'],
  [/(^|\.)(facebook\.com|fb\.com|fb\.me|messenger\.com)$/, 'Facebook', 'Social'],
  [/(^|\.)(youtube\.com|youtu\.be)$/, 'YouTube', 'Social'],
  [/(^|\.)(linkedin\.com|lnkd\.in)$/, 'LinkedIn', 'Social'],
  [/(^|\.)(t\.co|twitter\.com|x\.com)$/, 'X (Twitter)', 'Social'],
  [/(^|\.)(whatsapp\.com|wa\.me)$/, 'WhatsApp', 'Social'],
  [/(^|\.)threads\.(net|com)$/, 'Threads', 'Social'],
  [/(^|\.)pinterest\.[a-z.]+$|(^|\.)pin\.it$/, 'Pinterest', 'Social'],
  [/(^|\.)reddit\.com$/, 'Reddit', 'Social'],
  [/(^|\.)quora\.com$/, 'Quora', 'Social'],
  [/(^|\.)(t\.me|telegram\.org)$/, 'Telegram', 'Social'],
];

/** Android apps report themselves as android-app://<package>. */
const APPS: Record<string, [string, Channel]> = {
  'com.google.android.googlequicksearchbox': ['Google', 'Search'],
  'com.google.android.gm': ['Gmail', 'Email'],
  'com.instagram.android': ['Instagram', 'Social'],
  'com.facebook.katana': ['Facebook', 'Social'],
  'com.linkedin.android': ['LinkedIn', 'Social'],
  'com.google.android.youtube': ['YouTube', 'Social'],
  'com.whatsapp': ['WhatsApp', 'Social'],
  'org.telegram.messenger': ['Telegram', 'Social'],
  'com.openai.chatgpt': ['ChatGPT', 'AI'],
};

/** utm_source shorthands people actually type. */
const UTM_NAMES: Record<string, [string, Channel]> = {
  ig: ['Instagram', 'Social'],
  insta: ['Instagram', 'Social'],
  instagram: ['Instagram', 'Social'],
  fb: ['Facebook', 'Social'],
  facebook: ['Facebook', 'Social'],
  meta: ['Facebook', 'Social'],
  yt: ['YouTube', 'Social'],
  youtube: ['YouTube', 'Social'],
  linkedin: ['LinkedIn', 'Social'],
  li: ['LinkedIn', 'Social'],
  twitter: ['X (Twitter)', 'Social'],
  x: ['X (Twitter)', 'Social'],
  whatsapp: ['WhatsApp', 'Social'],
  wa: ['WhatsApp', 'Social'],
  google: ['Google', 'Search'],
  bing: ['Bing', 'Search'],
  chatgpt: ['ChatGPT', 'AI'],
  openai: ['ChatGPT', 'AI'],
  perplexity: ['Perplexity', 'AI'],
  claude: ['Claude', 'AI'],
  gemini: ['Gemini', 'AI'],
  copilot: ['Copilot', 'AI'],
  newsletter: ['Newsletter', 'Email'],
  email: ['Email', 'Email'],
};

const PAID_MEDIUMS =
  /^(cpc|ppc|paid|paid[_-]?social|paidsocial|ads?|display|cpm|cpv|banner|retargeting)$/i;
const EMAIL_MEDIUMS = /^(e-?mail|newsletter)$/i;

function byHost(host: string): [string, Channel] | null {
  const h = host.toLowerCase().replace(/^www\./, '');
  for (const [pattern, source, channel] of HOSTS) if (pattern.test(h)) return [source, channel];
  return null;
}

function hostOf(url: string): string {
  try {
    return new URL(url).hostname.toLowerCase();
  } catch {
    return '';
  }
}

export function classify({
  referrer,
  search,
  userAgent,
  ownHost,
}: {
  referrer: string;
  search: string;
  userAgent: string;
  ownHost: string;
}): Attribution {
  const q = new URLSearchParams(search);
  const campaign = q.get('utm_campaign')?.slice(0, 120) || undefined;
  const medium = q.get('utm_medium') ?? '';
  const utmSource = (q.get('utm_source') ?? '').trim();

  // Ad clicks.
  if (q.get('gclid') || q.get('gbraid') || q.get('wbraid')) {
    return { channel: 'Paid', source: 'Google Ads', campaign };
  }
  if (q.get('msclkid')) return { channel: 'Paid', source: 'Microsoft Ads', campaign };

  // Tagged links.
  if (utmSource) {
    const named =
      UTM_NAMES[utmSource.toLowerCase()] ??
      byHost(utmSource.replace(/^https?:\/\//, '').split('/')[0]);
    const source = named?.[0] ?? utmSource.slice(0, 60);
    let channel: Channel = named?.[1] ?? 'Referral';
    if (PAID_MEDIUMS.test(medium)) channel = 'Paid';
    else if (EMAIL_MEDIUMS.test(medium)) channel = 'Email';
    const paidSource =
      channel === 'Paid' && (source === 'Facebook' || source === 'Instagram')
        ? `${source} Ads`
        : channel === 'Paid' && source === 'Google'
          ? 'Google Ads'
          : source;
    return { channel, source: paidSource, campaign };
  }

  // The referring site or app.
  if (referrer.startsWith('android-app://')) {
    const pkg = referrer.slice('android-app://'.length).split('/')[0];
    const app = APPS[pkg];
    return app
      ? { channel: app[1], source: app[0], campaign }
      : { channel: 'Referral', source: pkg.slice(0, 60), campaign };
  }
  const host = hostOf(referrer);
  const own = ownHost.toLowerCase().replace(/^www\./, '');
  if (host && host.replace(/^www\./, '') !== own) {
    const named = byHost(host);
    if (named) return { channel: named[1], source: named[0], campaign };
    return { channel: 'Referral', source: host.replace(/^www\./, '').slice(0, 80), campaign };
  }

  // In-app browsers often send no referrer, but name themselves.
  if (/Instagram/i.test(userAgent)) return { channel: 'Social', source: 'Instagram', campaign };
  if (/FBAN|FBAV|FB_IAB|FBIOS/i.test(userAgent)) {
    return { channel: 'Social', source: 'Facebook', campaign };
  }
  if (/LinkedInApp/i.test(userAgent)) return { channel: 'Social', source: 'LinkedIn', campaign };
  if (/Snapchat/i.test(userAgent)) return { channel: 'Social', source: 'Snapchat', campaign };
  if (q.get('fbclid')) return { channel: 'Social', source: 'Facebook', campaign };

  return { channel: 'Direct', source: 'Direct', campaign };
}

export type Device = 'Mobile' | 'Tablet' | 'Desktop';

export function deviceOf(userAgent: string): Device {
  if (/iPad|Tablet|PlayBook|Silk|(Android(?!.*Mobile))/i.test(userAgent)) return 'Tablet';
  if (/Mobi|iPhone|iPod|Android|IEMobile|Opera Mini/i.test(userAgent)) return 'Mobile';
  return 'Desktop';
}

/** Crawlers, link previews, uptime checks and scripts: not people. */
export const BOT_UA =
  /bot|crawl|spider|slurp|facebookexternalhit|embedly|preview|headless|lighthouse|pagespeed|pingdom|uptime|monitor|curl|wget|python|axios|node-fetch|go-http|java\/|httpclient|vercel/i;
