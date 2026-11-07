import Image from 'next/image';
import Link from 'next/link';

import { assets } from '@/designs/v2/assets';
import { closingV2 } from '@/designs/v2/content';
import s from '@/designs/v2/styles/closing.module.css';
import t from '@/designs/v2/styles/theme.module.css';
import { LoopVideo } from '@/designs/v2/components/LoopVideo';
import { NotchedTop } from '@/designs/v2/components/NotchedTop';
import { ButtonLink, cx, stagger } from '@/designs/v2/components/primitives';

type SocialId = (typeof closingV2.social)[number]['id'];

/** Brand glyphs (simple-icons paths, 24×24), drawn in currentColor. */
const SOCIAL_ICONS: Record<SocialId, string> = {
  linkedin:
    'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.125 2.062 2.062 0 0 1 0 4.125zM7.119 20.452H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z',
  instagram:
    'M12 2.163c3.204 0 3.584.012 4.85.07 1.17.054 1.805.249 2.227.415.56.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.054 1.17-.249 1.805-.413 2.227-.217.562-.477.96-.896 1.382-.42.419-.819.679-1.382.896-.422.164-1.057.36-2.227.413-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.17-.054-1.805-.249-2.227-.413-.562-.217-.96-.477-1.382-.896-.419-.42-.679-.819-.896-1.382-.164-.422-.36-1.057-.413-2.227-.058-1.266-.07-1.646-.07-4.85s.012-3.584.07-4.85c.054-1.17.249-1.805.413-2.227.217-.562.477-.96.896-1.381.42-.419.819-.679 1.382-.896.422-.166 1.057-.361 2.227-.415 1.266-.058 1.646-.07 4.85-.07M12 0C8.741 0 8.333.014 7.053.072 5.775.131 4.902.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.902.131 5.775.072 7.053.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.059 1.277.261 2.149.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.741 24 12 24s3.668-.012 4.948-.072c1.277-.059 2.149-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.689.072-4.948s-.012-3.667-.072-4.947c-.059-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z',
  facebook:
    'M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z',
  youtube:
    'M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z',
  x: 'M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z',
};

/** Opens off-site in a new tab, without handing this page to the new one. */
const EXTERNAL = { target: '_blank', rel: 'noopener noreferrer' } as const;

/**
 * The site footer: closing CTA, the full-width wordmark and the link columns,
 * all on one film-backed forest ground. Rendered on every route by SiteChrome.
 * Links come from config/navigation.ts; styles from
 * designs/v2/styles/closing.module.css.
 */
export function SiteFooter() {
  return (
    <NotchedTop className={s.notched}>
      <footer className={s.closing}>
        <LoopVideo src={closingV2.film.src} poster={closingV2.film.poster} className={s.film} />
        <div className={s.shade} aria-hidden />

        <div className={cx(s.cta, t.gutter)}>
          <h2 className={cx(t.display, s.ctaTitle)}>
            {closingV2.heading.map((line, i) => (
              <span key={line} className={s.line} data-reveal style={stagger(i)}>
                {line}
              </span>
            ))}
          </h2>
          <p className={cx(t.body, s.ctaIntro)} data-reveal style={stagger(2)}>
            {closingV2.intro}
          </p>
          <div data-reveal style={stagger(3)}>
            <ButtonLink href={closingV2.cta.href} tone="solid">
              {closingV2.cta.label}
            </ButtonLink>
          </div>
        </div>

        <div className={cx(s.wordmarkWrap, t.gutter)} aria-hidden>
          <p className={s.wordmark}>{closingV2.wordmark}</p>
        </div>

        <div className={cx(s.footer, t.gutter)}>
          <div className={s.lead}>
            <p className={s.slogan}>{closingV2.slogan}</p>
            <ul className={s.social} aria-label="PEN Foundation on social media">
              {closingV2.social.map((item) => (
                <li key={item.id}>
                  <a
                    href={item.href}
                    {...EXTERNAL}
                    className={s.socialLink}
                    aria-label={`${item.label} (opens in a new tab)`}
                    title={item.label}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                      <path d={SOCIAL_ICONS[item.id]} />
                    </svg>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <nav className={s.columns} aria-label="Footer">
            {closingV2.columns.map((col) => (
              <div key={col.heading} className={s.col}>
                <p className={cx(t.mono, s.colHead)}>{col.heading}</p>
                <ul className={s.colList}>
                  {col.links.map((link) => (
                    <li key={link.href}>
                      <Link href={link.href} className={cx(t.mono, s.colLink)}>
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <div className={s.col}>
              <p className={cx(t.mono, s.colHead)}>{closingV2.contact.heading}</p>
              <ul className={s.colList}>
                <li>
                  <a
                    href={`tel:${closingV2.contact.phone.replace(/\s/g, '')}`}
                    className={cx(t.mono, s.colLink)}
                  >
                    {closingV2.contact.phone}
                  </a>
                </li>
                <li>
                  <Link href={closingV2.contact.contactHref} className={cx(t.mono, s.colLink)}>
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
          </nav>
        </div>

        <div className={cx(s.bottom, t.gutter)}>
          <p className={s.copyright}>
            <Image
              src={assets.logo.src}
              alt=""
              width={assets.logo.width}
              height={assets.logo.height}
              className={s.bottomLogo}
            />
            {closingV2.copyright}
          </p>
          <p className={s.credit}>
            {closingV2.credit.prefix}{' '}
            <a href={closingV2.credit.href} {...EXTERNAL} className={s.bottomLink}>
              {closingV2.credit.label}
              <span className={s.srOnly}> (opens in a new tab)</span>
            </a>
          </p>
          <a href="#top" className={s.bottomLink}>
            Back to top ↑
          </a>
        </div>
      </footer>
    </NotchedTop>
  );
}
