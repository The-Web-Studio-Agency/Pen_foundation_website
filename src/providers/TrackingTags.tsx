'use client';

import { usePathname } from 'next/navigation';
import Script from 'next/script';
import { useEffect, useRef } from 'react';

import type { SeoTracking } from '@/lib/seo/settings';

/**
 * The SEO team's tracking tags (set in /web-admin/seo/tracking): Google
 * Analytics 4, Tag Manager, Google Ads, Meta Pixel, Microsoft Clarity,
 * LinkedIn Insight and any custom code. The IDs arrive already checked
 * against their formats (lib/seo/settings.ts), because they are written
 * into inline scripts.
 *
 * Loaded after the page is interactive so they never hold up the first
 * paint, and never on the admin, so the team's own visits are not counted.
 */

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

/** Custom HTML, with its scripts made runnable (innerHTML leaves them inert). */
function inject(html: string, where: 'head' | 'body') {
  const template = document.createElement('template');
  template.innerHTML = html;
  const revive = (node: Node): Node => {
    if (node instanceof HTMLScriptElement) {
      const script = document.createElement('script');
      for (const attr of Array.from(node.attributes)) script.setAttribute(attr.name, attr.value);
      script.text = node.text;
      return script;
    }
    node.childNodes.forEach((child) => {
      const next = revive(child);
      if (next !== child) node.replaceChild(next, child);
    });
    return node;
  };
  const nodes = Array.from(template.content.childNodes).map(revive);
  const anchor = where === 'body' ? document.body.firstChild : null;
  for (const node of nodes) {
    if (node instanceof Element) node.setAttribute('data-seo-custom', '');
    if (where === 'head') document.head.appendChild(node);
    else document.body.insertBefore(node, anchor);
  }
}

let injected = false;

export function TrackingTags({ tags }: { tags: SeoTracking }) {
  const pathname = usePathname() ?? '';
  const off = pathname.startsWith('/web-admin');
  const { ga4, gtm, googleAds, metaPixel, clarity, linkedin, headCode, bodyCode } = tags;

  // Custom code: once per visit.
  useEffect(() => {
    if (off || injected || (!headCode && !bodyCode)) return;
    injected = true;
    if (headCode) inject(headCode, 'head');
    if (bodyCode) inject(bodyCode, 'body');
  }, [off, headCode, bodyCode]);

  // The pixel's snippet counts the first page; count each later one too.
  const firstPath = useRef(true);
  useEffect(() => {
    if (off || !metaPixel) return;
    if (firstPath.current) {
      firstPath.current = false;
      return;
    }
    window.fbq?.('track', 'PageView');
  }, [pathname, off, metaPixel]);

  if (off) return null;
  const gtagId = ga4 || googleAds;

  return (
    <>
      {gtagId && (
        <>
          <Script
            id="seo-gtag-src"
            src={`https://www.googletagmanager.com/gtag/js?id=${gtagId}`}
            strategy="afterInteractive"
          />
          <Script id="seo-gtag" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());${
              ga4 ? `gtag('config','${ga4}');` : ''
            }${googleAds ? `gtag('config','${googleAds}');` : ''}`}
          </Script>
        </>
      )}

      {gtm && (
        <Script id="seo-gtm" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${gtm}');`}
        </Script>
      )}

      {metaPixel && (
        <Script id="seo-meta-pixel" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${metaPixel}');fbq('track','PageView');`}
        </Script>
      )}

      {clarity && (
        <Script id="seo-clarity" strategy="lazyOnload">
          {`(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script","${clarity}");`}
        </Script>
      )}

      {linkedin && (
        <Script id="seo-linkedin" strategy="lazyOnload">
          {`window._linkedin_partner_id="${linkedin}";window._linkedin_data_partner_ids=window._linkedin_data_partner_ids||[];window._linkedin_data_partner_ids.push(window._linkedin_partner_id);(function(l){if(!l){window.lintrk=function(a,b){window.lintrk.q.push([a,b])};window.lintrk.q=[]}var s=document.getElementsByTagName("script")[0];var b=document.createElement("script");b.type="text/javascript";b.async=true;b.src="https://snap.licdn.com/li.lms-analytics/insight.min.js";s.parentNode.insertBefore(b,s);})(window.lintrk);`}
        </Script>
      )}
    </>
  );
}
