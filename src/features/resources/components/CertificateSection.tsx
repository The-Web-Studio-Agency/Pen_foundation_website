import Image from 'next/image';

import { certificate } from '../content';

/**
 * Certification block — the anchor target for the header's Resources ▸
 * Certificate item.
 *
 * Unlike the rest of this route, the content here is real: the GRIHA listing
 * and its PDF are PEN's own documents, not clone placeholder copy.
 */
export function CertificateSection() {
  return (
    <section id="certificate" className="site-gutter w-full scroll-mt-nav py-24 lg:py-32">
      <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <div>
          <p className="label-4 text-[var(--c-dark-gray)] uppercase">{certificate.eyebrow}</p>
          <h2 className="title-h2 mt-6 font-normal text-[var(--c-dark-green)]">
            {certificate.heading}
          </h2>
          <p className="body-3 mt-6 max-w-[46ch] text-[var(--c-dark-green)]/80">
            {certificate.body}
          </p>

          <dl className="mt-8 grid grid-cols-2 gap-x-8 gap-y-5">
            {certificate.facts.map((fact) => (
              <div key={fact.label}>
                <dt className="label-4 text-[var(--c-dark-gray)] uppercase">{fact.label}</dt>
                <dd className="mt-2 text-[var(--c-dark-green)]">{fact.value}</dd>
              </div>
            ))}
          </dl>

          <a
            href={certificate.file}
            target="_blank"
            rel="noopener noreferrer"
            className="label-4 mt-10 inline-flex items-center rounded-lg bg-[var(--c-dark-green)] px-8 py-4 text-[var(--c-white)] uppercase transition-colors duration-300 fine:hover:bg-[var(--c-accent)] fine:hover:text-white"
          >
            {certificate.downloadLabel}
          </a>
        </div>

        <div className="relative mx-auto w-full max-w-[26rem]">
          <Image
            src={certificate.image}
            alt={certificate.imageAlt}
            width={676}
            height={794}
            sizes="(min-width: 1024px) 26rem, 90vw"
            className="h-auto w-full rounded-sm shadow-[0_24px_60px_rgba(1,44,50,0.14)]"
          />
        </div>
      </div>
    </section>
  );
}
