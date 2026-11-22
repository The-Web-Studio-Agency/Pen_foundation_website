'use client';

import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';

import type { PageDefaults } from '@/config/seo';
import type { SitePage } from '@/lib/seo/routes';
import {
  LABELS,
  TRACKING_FORMATS,
  FILE_PATH,
  RESERVED_FILES,
  type SeoExtraFile,
  type SeoFiles,
  type SeoPage,
  type SeoPages,
  type SeoSection,
  type SeoSite,
  type SeoTracking,
} from '@/lib/seo/settings';

import { cx } from '../components/primitives';
import s from './admin.module.css';
import { useToast, useUnsavedGuard } from './ContentEditor';
import { MediaPicker } from './MediaPicker';

/**
 * The SEO team's screens (only their account sees them):
 *
 *   SeoPagesEditor     every page's title, description, share image, indexing
 *   SeoTrackingForm    GA4, Tag Manager, Ads, Meta Pixel, Clarity, LinkedIn
 *   SeoSiteForm        verification codes, default share image, robots.txt
 *
 * Each saves its whole section through /api/cms/seo; the site picks the
 * change up at once.
 */

async function saveSection(section: SeoSection, value: unknown) {
  const res = await fetch('/api/cms/seo', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ section, value }),
  });
  const body = (await res.json().catch(() => ({}))) as { error?: string; value?: unknown };
  if (!res.ok) throw new Error(body.error ?? 'Could not save.');
  return body.value;
}

/** Save / Discard bar shared by the three screens. */
function useSection<T>(section: SeoSection, initial: T) {
  const router = useRouter();
  const [value, setValue] = useState<T>(initial);
  const [saved, setSaved] = useState(JSON.stringify(initial));
  const [busy, setBusy] = useState(false);
  const { show, node } = useToast();
  const dirty = JSON.stringify(value) !== saved;
  useUnsavedGuard(dirty);

  const save = async () => {
    setBusy(true);
    try {
      const clean = (await saveSection(section, value)) as T;
      setValue(clean);
      setSaved(JSON.stringify(clean));
      show({ text: 'Saved. The website uses it now.' });
      router.refresh();
    } catch (e) {
      show({ text: (e as Error).message, error: true });
    } finally {
      setBusy(false);
    }
  };

  const bar = (
    <div className={s.editorBar}>
      <button
        type="button"
        className={cx(s.btn, s.primary)}
        onClick={save}
        disabled={busy || !dirty}
      >
        {busy ? 'Saving…' : 'Save changes'}
      </button>
      <button
        type="button"
        className={cx(s.btn, s.secondary)}
        onClick={() => setValue(JSON.parse(saved) as T)}
        disabled={busy || !dirty}
      >
        Discard
      </button>
      {dirty && <span className={s.dirty}>Unsaved changes</span>}
    </div>
  );
  return { value, setValue, bar, toast: node };
}

/* ---- length counter ----------------------------------------------------------- */

function Counter({ length, min, max }: { length: number; min: number; max: number }) {
  const state = length === 0 ? '' : length > max ? 'over' : length < min ? 'under' : 'ok';
  return (
    <span
      className={cx(s.counter, state === 'over' && s.counterOver, state === 'ok' && s.counterOk)}
    >
      {length} / {max}
      {state === 'over' && ' · may be cut off in Google'}
      {state === 'under' && ' · a little short'}
    </span>
  );
}

/* ---- pages ---------------------------------------------------------------- */

export interface SeoPageRow extends SitePage {
  defaults: PageDefaults;
}

function GooglePreview({
  url,
  title,
  description,
}: {
  url: string;
  title: string;
  description: string;
}) {
  return (
    <div className={s.serp} aria-label="How this page may look in Google">
      <span className={s.serpUrl}>{url}</span>
      <span className={s.serpTitle}>{title.length > 62 ? `${title.slice(0, 60)}…` : title}</span>
      <span className={s.serpDesc}>
        {description.length > 162 ? `${description.slice(0, 160)}…` : description}
      </span>
    </div>
  );
}

function PageFields({
  row,
  value,
  onChange,
  siteUrl,
}: {
  row: SeoPageRow;
  value: SeoPage;
  onChange: (next: SeoPage) => void;
  siteUrl: string;
}) {
  const [picking, setPicking] = useState(false);
  const d = row.defaults;
  const set = (patch: Partial<SeoPage>) => onChange({ ...value, ...patch });
  const title = value.title || d.title;
  const description = value.description || d.description;
  const indexing = value.noIndex === undefined ? 'default' : value.noIndex ? 'hide' : 'show';

  return (
    <div className={s.sectionBody}>
      <GooglePreview url={`${siteUrl}${row.path}`} title={title} description={description} />

      <label className={s.field}>
        <span className={s.label}>
          Title tag <Counter length={(value.title || '').length} min={30} max={60} />
        </span>
        <input
          className={s.input}
          value={value.title ?? ''}
          placeholder={d.title}
          onChange={(e) => set({ title: e.target.value })}
        />
        <span className={s.muted}>
          The whole title, exactly as Google should show it. Empty = the page’s own title (shown
          faded).
        </span>
      </label>

      <label className={s.field}>
        <span className={s.label}>
          Meta description <Counter length={(value.description || '').length} min={70} max={160} />
        </span>
        <textarea
          className={s.textarea}
          value={value.description ?? ''}
          placeholder={d.description}
          onChange={(e) => set({ description: e.target.value })}
        />
      </label>

      <div className={s.field}>
        <span className={s.label}>Share image (WhatsApp, LinkedIn, Facebook preview)</span>
        <div className={s.primitiveRow}>
          <input
            className={s.input}
            value={value.image ?? ''}
            placeholder={d.image}
            onChange={(e) => set({ image: e.target.value })}
          />
          <button type="button" className={cx(s.btn, s.secondary)} onClick={() => setPicking(true)}>
            Choose…
          </button>
        </div>
        <span className={s.muted}>Best at 1200 × 630 pixels.</span>
      </div>

      <label className={s.field}>
        <span className={s.label}>Search engines</span>
        <select
          className={s.select}
          value={indexing}
          onChange={(e) =>
            set({
              noIndex: e.target.value === 'default' ? undefined : e.target.value === 'hide',
            })
          }
        >
          <option value="default">
            Page default ({d.noIndex ? 'hidden from Google' : 'shown in Google'})
          </option>
          <option value="show">Show in Google</option>
          <option value="hide">Hide from Google (noindex, and left out of the sitemap)</option>
        </select>
      </label>

      <div className={s.addRow}>
        <a
          href={row.path}
          target="_blank"
          rel="noopener noreferrer"
          className={cx(s.btn, s.secondary, s.small)}
        >
          View page ↗
        </a>
      </div>

      {picking && (
        <MediaPicker
          onPick={(url) => {
            set({ image: url });
            setPicking(false);
          }}
          onClose={() => setPicking(false)}
        />
      )}
    </div>
  );
}

export function SeoPagesEditor({
  rows,
  initial,
  siteUrl,
}: {
  rows: SeoPageRow[];
  initial: SeoPages;
  siteUrl: string;
}) {
  const { value, setValue, bar, toast } = useSection<SeoPages>('pages', initial);
  const [query, setQuery] = useState('');
  const [onlyCustom, setOnlyCustom] = useState(false);

  const groups = useMemo(() => {
    const q = query.trim().toLowerCase();
    const map = new Map<string, SeoPageRow[]>();
    for (const row of rows) {
      const custom = Boolean(value[row.path] && Object.keys(value[row.path]).length);
      if (onlyCustom && !custom) continue;
      if (q && !`${row.path} ${row.defaults.title}`.toLowerCase().includes(q)) continue;
      map.set(row.group, [...(map.get(row.group) ?? []), row]);
    }
    return [...map];
  }, [rows, value, query, onlyCustom]);

  const update = (path: string, next: SeoPage) => {
    const clean = Object.fromEntries(
      Object.entries(next).filter(([, v]) => v !== '' && v !== undefined),
    ) as SeoPage;
    setValue((all) => {
      const copy = { ...all };
      if (Object.keys(clean).length) copy[path] = clean;
      else delete copy[path];
      return copy;
    });
  };

  return (
    <>
      {bar}
      <div className={s.searchRow}>
        <input
          className={s.input}
          placeholder="Search pages…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <label className={s.check}>
          <input
            type="checkbox"
            checked={onlyCustom}
            onChange={(e) => setOnlyCustom(e.target.checked)}
          />
          Only pages with SEO changes
        </label>
      </div>

      {groups.length === 0 && <p className={s.empty}>No pages match.</p>}
      {groups.map(([group, items]) => (
        <section key={group} className={s.group}>
          <h2 className={s.groupTitle}>{group}</h2>
          <div className={s.items}>
            {items.map((row) => {
              const own = value[row.path] ?? {};
              const custom = Object.keys(own).length > 0;
              const title = own.title || row.defaults.title;
              const hidden = own.noIndex ?? row.defaults.noIndex;
              return (
                <details key={row.path} className={s.section}>
                  <summary>
                    <span className={s.ellipsis}>
                      <span className={s.mono}>{row.path}</span>
                      <span className={s.muted}> — {title}</span>
                    </span>
                    <span className={s.grow} />
                    {hidden && <span className={s.badge}>Hidden from Google</span>}
                    {custom && <span className={cx(s.badge, s.badgeEdited)}>SEO edited</span>}
                    {!custom && title.length > 60 && <span className={s.badge}>Title long</span>}
                  </summary>
                  <PageFields
                    row={row}
                    value={own}
                    onChange={(next) => update(row.path, next)}
                    siteUrl={siteUrl}
                  />
                  {custom && (
                    <div className={s.sectionBody}>
                      <div className={s.addRow}>
                        <button
                          type="button"
                          className={cx(s.btn, s.danger, s.small)}
                          onClick={() => update(row.path, {})}
                        >
                          Use the page’s own title and description
                        </button>
                      </div>
                    </div>
                  )}
                </details>
              );
            })}
          </div>
        </section>
      ))}
      {toast}
    </>
  );
}

/* ---- tracking ---------------------------------------------------------------- */

const WHERE: Record<keyof typeof TRACKING_FORMATS, string> = {
  ga4: 'Google Analytics → Admin → Data streams → your web stream → Measurement ID.',
  gtm: 'Tag Manager → the container ID at the top (GTM-…). Tags you add inside GTM load through it.',
  googleAds:
    'Google Ads → Tools → Data manager → Google tag → Tag ID (AW-…). For conversion tracking.',
  metaPixel: 'Meta Events Manager → Data sources → your pixel → Pixel ID (numbers only).',
  clarity: 'clarity.microsoft.com → your project → Settings → Overview → Project ID.',
  linkedin: 'LinkedIn Campaign Manager → Analyze → Insight Tag → Partner ID (numbers only).',
};

export function SeoTrackingForm({ initial }: { initial: SeoTracking }) {
  const { value, setValue, bar, toast } = useSection<SeoTracking>('tracking', initial);
  const set = (patch: Partial<SeoTracking>) => setValue((v) => ({ ...v, ...patch }));
  const keys = Object.keys(TRACKING_FORMATS) as (keyof typeof TRACKING_FORMATS)[];

  return (
    <>
      {bar}
      <p className={s.hint}>
        Paste just the ID, not the whole code: the website adds the official snippet itself, loads
        it after the page is ready (so it does not slow the site down), and leaves it out of this
        admin. Using Tag Manager? Then you usually only need the GTM ID here, and add GA4 and the
        pixel inside Tag Manager instead, so nothing is counted twice.
      </p>

      <div className={cx(s.panel, s.fields)}>
        {keys.map((key) => {
          const v = value[key] ?? '';
          const valid =
            !v || TRACKING_FORMATS[key].pattern.test(key === 'clarity' ? v : v.toUpperCase());
          return (
            <label key={key} className={s.field}>
              <span className={s.label}>
                {LABELS[key]}
                {v && valid && <span className={cx(s.badge, s.badgeOk)}>On</span>}
                {!valid && <span className={cx(s.badge, s.counterOver)}>Check the format</span>}
              </span>
              <input
                className={cx(s.input, s.mono)}
                value={v}
                placeholder={TRACKING_FORMATS[key].example}
                onChange={(e) => set({ [key]: e.target.value.trim() })}
                spellCheck={false}
              />
              <span className={s.muted}>{WHERE[key]}</span>
            </label>
          );
        })}
      </div>

      <h2 className={s.groupTitle} style={{ marginTop: '2rem' }}>
        Custom code
      </h2>
      <p className={s.hint}>
        For anything without its own box above: another platform’s tag, a JSON-LD structured-data
        block, a chat widget. Paste the code exactly as the platform gives it. It runs on every
        public page, so only paste code from a source you trust.
      </p>
      <div className={cx(s.panel, s.fields)}>
        <label className={cx(s.field, s.wide)}>
          <span className={s.label}>Added to &lt;head&gt;</span>
          <textarea
            className={cx(s.textarea, s.mono)}
            rows={6}
            value={value.headCode ?? ''}
            onChange={(e) => set({ headCode: e.target.value })}
            spellCheck={false}
            placeholder={'<script type="application/ld+json">{ … }</script>'}
          />
        </label>
        <label className={cx(s.field, s.wide)}>
          <span className={s.label}>Added to the start of &lt;body&gt;</span>
          <textarea
            className={cx(s.textarea, s.mono)}
            rows={4}
            value={value.bodyCode ?? ''}
            onChange={(e) => set({ bodyCode: e.target.value })}
            spellCheck={false}
          />
        </label>
      </div>
      {toast}
    </>
  );
}

/* ---- site: verification, robots ----------------------------------------------- */

const VERIFY: { key: keyof SeoSite; label: string; where: string }[] = [
  {
    key: 'googleVerification',
    label: 'Google Search Console',
    where: 'Search Console → Add property → URL prefix → HTML tag. Paste the tag or just its code.',
  },
  {
    key: 'bingVerification',
    label: 'Bing Webmaster Tools',
    where: 'Bing Webmaster → Add site → HTML Meta Tag (msvalidate.01).',
  },
  {
    key: 'facebookVerification',
    label: 'Meta (Facebook) domain verification',
    where: 'Meta Business Settings → Brand safety → Domains → Meta-tag verification.',
  },
  {
    key: 'pinterestVerification',
    label: 'Pinterest',
    where: 'Pinterest → Settings → Claimed accounts → Website → HTML tag.',
  },
  {
    key: 'yandexVerification',
    label: 'Yandex Webmaster',
    where: 'Yandex Webmaster → Add site → Meta tag.',
  },
];

export function SeoSiteForm({ initial, siteUrl }: { initial: SeoSite; siteUrl: string }) {
  const { value, setValue, bar, toast } = useSection<SeoSite>('site', initial);
  const [picking, setPicking] = useState(false);
  const set = (patch: Partial<SeoSite>) => setValue((v) => ({ ...v, ...patch }));

  return (
    <>
      {bar}

      <h2 className={s.groupTitle}>Ownership verification</h2>
      <div className={cx(s.panel, s.fields)}>
        {VERIFY.map(({ key, label, where }) => (
          <label key={key} className={s.field}>
            <span className={s.label}>
              {label}
              {value[key] && <span className={cx(s.badge, s.badgeOk)}>On</span>}
            </span>
            <input
              className={cx(s.input, s.mono)}
              value={(value[key] as string | undefined) ?? ''}
              onChange={(e) => set({ [key]: e.target.value })}
              spellCheck={false}
            />
            <span className={s.muted}>{where}</span>
          </label>
        ))}
      </div>

      <h2 className={s.groupTitle} style={{ marginTop: '2rem' }}>
        Default share image
      </h2>
      <div className={cx(s.panel, s.field)}>
        <div className={s.primitiveRow}>
          <input
            className={s.input}
            value={value.defaultImage ?? ''}
            placeholder="/media/images/shared/og-default.png"
            onChange={(e) => set({ defaultImage: e.target.value })}
          />
          <button type="button" className={cx(s.btn, s.secondary)} onClick={() => setPicking(true)}>
            Choose…
          </button>
        </div>
        <span className={s.muted}>
          Shown when a page is shared on WhatsApp, LinkedIn or Facebook and has no image of its own.
          Best at 1200 × 630 pixels.
        </span>
      </div>

      <p className={s.hint} style={{ marginTop: '2rem' }}>
        robots.txt, sitemap.xml, llms.txt and any other file for the site’s root are under{' '}
        <a href="/web-admin/seo/files">Files</a>. Submit{' '}
        <span className={s.mono}>{siteUrl}/sitemap.xml</span> in Search Console.
      </p>

      <h2 className={s.groupTitle} style={{ marginTop: '2rem' }}>
        Danger zone
      </h2>
      <div className={cx(s.panel, s.field)}>
        <label className={s.check}>
          <input
            type="checkbox"
            checked={Boolean(value.hideSite)}
            onChange={(e) => {
              if (
                e.target.checked &&
                !window.confirm(
                  'Hide the WHOLE website from Google and every other search engine? It will drop out of search results. Only for a site that is not ready yet.',
                )
              )
                return;
              set({ hideSite: e.target.checked || undefined });
            }}
          />
          <b>Hide the whole website from search engines</b>
        </label>
        <span className={s.muted}>
          Adds noindex to every page, blocks everything in robots.txt and empties the sitemap. Leave
          this off for the live site.
        </span>
      </div>

      {picking && (
        <MediaPicker
          onPick={(url) => {
            set({ defaultImage: url });
            setPicking(false);
          }}
          onClose={() => setPicking(false)}
        />
      )}
      {toast}
    </>
  );
}

/* ---- files: robots.txt, sitemap.xml, llms.txt and anything else ------------ */

const CORE: {
  key: 'robots' | 'sitemap' | 'llms';
  file: string;
  what: string;
  auto: string;
}[] = [
  {
    key: 'robots',
    file: 'robots.txt',
    what: 'Tells search engines what they may crawl, and where the sitemap is.',
    auto: 'Generated: allows everything except the admin and old redirecting addresses, plus any extra paths below. Follows “Hide the whole website” on the Verification page.',
  },
  {
    key: 'sitemap',
    file: 'sitemap.xml',
    what: 'The list of pages for Google and Bing.',
    auto: 'Generated: every public page, including new projects and articles as they are added, minus any page set to “Hide from Google”.',
  },
  {
    key: 'llms',
    file: 'llms.txt',
    what: 'A plain-text guide to the site for AI assistants such as ChatGPT, Claude and Perplexity (llmstxt.org).',
    auto: 'Generated: the company summary and every public page with its title and description (your SEO versions where set).',
  },
];

const PRESETS: { label: string; path: string; content: string }[] = [
  { label: 'ads.txt', path: 'ads.txt', content: '' },
  { label: 'llms-full.txt', path: 'llms-full.txt', content: '' },
  {
    label: 'security.txt',
    path: '.well-known/security.txt',
    content: 'Contact: mailto:\nExpires: \nPreferred-Languages: en\n',
  },
  { label: 'Google verification file', path: 'google0000000000000000.html', content: '' },
  { label: 'Other file', path: '', content: '' },
];

export function SeoFilesForm({
  initial,
  generated,
  siteUrl,
}: {
  initial: SeoFiles;
  /** What each core file is when not written by hand. */
  generated: Record<'robots' | 'sitemap' | 'llms', string>;
  siteUrl: string;
}) {
  const { value, setValue, bar, toast } = useSection<SeoFiles>('files', initial);
  const set = (patch: Partial<SeoFiles>) => setValue((v) => ({ ...v, ...patch }));
  const extra = value.extra ?? [];
  const setExtra = (next: SeoExtraFile[]) => set({ extra: next.length ? next : undefined });

  const nameProblem = (path: string, i: number) => {
    const p = path.replace(/^\/+/, '');
    if (!p) return 'Give the file a name.';
    if (!FILE_PATH.test(p))
      return 'Use letters, numbers, dots, dashes or underscores, ending in .txt, .xml, .html, .json or .webmanifest.';
    if (RESERVED_FILES.includes(p.toLowerCase())) return `${p} has its own box above.`;
    if (extra.some((f, j) => j !== i && f.path.toLowerCase() === p.toLowerCase()))
      return 'Another file already has this name.';
    return '';
  };

  return (
    <>
      {bar}
      <p className={s.hint}>
        Each of these is served from the root of the website, e.g.{' '}
        <span className={s.mono}>{siteUrl}/robots.txt</span>. The three main files are generated
        automatically and stay up to date by themselves; switch one to “Write my own” only when you
        need full control. Changes can take up to 5 minutes to show, as these files are cached.
      </p>

      {CORE.map(({ key, file, what, auto }) => {
        const custom = value[key] !== undefined;
        return (
          <section key={key} className={cx(s.panel, s.field)} style={{ marginBottom: '1rem' }}>
            <div className={s.primitiveRow} style={{ alignItems: 'center' }}>
              <h2 className={s.panelTitle} style={{ margin: 0 }}>
                <span className={s.mono}>{file}</span>
              </h2>
              {custom && <span className={cx(s.badge, s.badgeEdited)}>Written by hand</span>}
              <span className={s.grow} />
              <a
                href={`/${file}`}
                target="_blank"
                rel="noopener noreferrer"
                className={cx(s.btn, s.secondary, s.small)}
              >
                Open live file ↗
              </a>
            </div>
            <span className={s.muted}>{what}</span>

            <div className={s.primitiveRow}>
              <label className={s.check}>
                <input
                  type="radio"
                  name={`${key}-mode`}
                  checked={!custom}
                  onChange={() => {
                    if (
                      value[key] &&
                      !window.confirm(
                        `Go back to the generated ${file}? Your own version will be removed when you save.`,
                      )
                    )
                      return;
                    set({ [key]: undefined });
                  }}
                />
                Automatic
              </label>
              <label className={s.check}>
                <input
                  type="radio"
                  name={`${key}-mode`}
                  checked={custom}
                  onChange={() => set({ [key]: generated[key] })}
                />
                Write my own
              </label>
            </div>

            {custom ? (
              <textarea
                className={cx(s.textarea, s.mono)}
                rows={14}
                value={value[key] ?? ''}
                onChange={(e) => set({ [key]: e.target.value })}
                spellCheck={false}
              />
            ) : (
              <>
                <span className={s.muted}>{auto}</span>
                {key === 'robots' && (
                  <label className={s.field}>
                    <span className={s.label}>Extra paths search engines should not crawl</span>
                    <textarea
                      className={cx(s.textarea, s.mono)}
                      rows={3}
                      value={value.robotsDisallow ?? ''}
                      placeholder={'/some-old-page\n/drafts/'}
                      onChange={(e) => set({ robotsDisallow: e.target.value })}
                      spellCheck={false}
                    />
                    <span className={s.muted}>
                      One per line, each starting with “/”. To keep a single page out of Google, use
                      “Hide from Google” on that page instead.
                    </span>
                  </label>
                )}
                <details className={s.section}>
                  <summary>Preview the current generated file</summary>
                  <pre className={cx(s.mono, s.filePreview)}>{generated[key]}</pre>
                </details>
              </>
            )}
          </section>
        );
      })}

      <h2 className={s.groupTitle} style={{ marginTop: '2rem' }}>
        Other files
      </h2>
      <p className={s.hint}>
        Add any other file a platform asks you to put on the website: ads.txt, a Google or Bing
        verification file, security.txt, llms-full.txt, an extra sitemap. It is served at the
        address shown, exactly as typed. A file can never replace one of the website’s own pages or
        images.
      </p>

      <div className={s.items}>
        {extra.map((f, i) => {
          const problem = nameProblem(f.path, i);
          const path = f.path.replace(/^\/+/, '');
          return (
            <section key={i} className={cx(s.panel, s.field)}>
              <div className={s.primitiveRow}>
                <span className={s.mono} style={{ alignSelf: 'center', color: 'var(--a-soft)' }}>
                  {siteUrl}/
                </span>
                <input
                  className={cx(s.input, s.mono)}
                  value={f.path}
                  placeholder="ads.txt"
                  onChange={(e) =>
                    setExtra(
                      extra.map((x, j) => (j === i ? { ...x, path: e.target.value.trim() } : x)),
                    )
                  }
                  spellCheck={false}
                  aria-label="File name"
                />
                {!problem && initial.extra?.some((x) => x.path === f.path) && (
                  <a
                    href={`/${path}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cx(s.btn, s.secondary)}
                  >
                    Open ↗
                  </a>
                )}
                <button
                  type="button"
                  className={cx(s.btn, s.danger)}
                  onClick={() => {
                    if (window.confirm(`Remove ${path || 'this file'}?`))
                      setExtra(extra.filter((_, j) => j !== i));
                  }}
                >
                  Remove
                </button>
              </div>
              {problem && <span className={s.counterOver}>{problem}</span>}
              <textarea
                className={cx(s.textarea, s.mono)}
                rows={8}
                value={f.content}
                placeholder="Paste the file’s contents here."
                onChange={(e) =>
                  setExtra(extra.map((x, j) => (j === i ? { ...x, content: e.target.value } : x)))
                }
                spellCheck={false}
                aria-label={`Contents of ${path || 'the file'}`}
              />
            </section>
          );
        })}
      </div>

      <div className={s.primitiveRow} style={{ flexWrap: 'wrap', marginTop: '1rem' }}>
        <span className={s.muted} style={{ alignSelf: 'center' }}>
          Add a file:
        </span>
        {PRESETS.map((preset) => (
          <button
            key={preset.label}
            type="button"
            className={cx(s.btn, s.secondary, s.small)}
            onClick={() => setExtra([...extra, { path: preset.path, content: preset.content }])}
          >
            + {preset.label}
          </button>
        ))}
      </div>
      {toast}
    </>
  );
}
