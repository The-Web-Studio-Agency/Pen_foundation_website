import { documents } from '../content';

/**
 * Downloadable documents — the anchor target for Resources ▸ Documents.
 *
 * Renders only what actually exists on disk. An entry with `pending: true` is
 * shown as a disabled row rather than a live link, so a missing file reads as
 * "not published yet" instead of a broken download.
 */
export function DocumentsSection() {
  return (
    <section id="documents" className="site-gutter w-full scroll-mt-nav py-24 lg:py-32">
      <div className="mx-auto max-w-6xl">
        <p className="label-4 text-[var(--c-dark-gray)] uppercase">{documents.eyebrow}</p>
        <h2 className="title-h2 mt-6 max-w-[24ch] font-normal text-[var(--c-dark-green)]">
          {documents.heading}
        </h2>

        <ul className="mt-12 divide-y divide-[var(--c-dark-green-15)] border-y border-[var(--c-dark-green-15)]">
          {documents.items.map((doc) => {
            const row = (
              <>
                <span className="flex flex-col gap-1">
                  <span className="text-lg text-[var(--c-dark-green)]">{doc.title}</span>
                  <span className="body-3 text-[var(--c-dark-gray)]">{doc.meta}</span>
                </span>
                <span className="label-4 shrink-0 uppercase">
                  {doc.pending ? 'Coming soon' : 'Download'}
                </span>
              </>
            );

            return (
              <li key={doc.title}>
                {doc.pending ? (
                  <span
                    aria-disabled
                    className="flex items-center justify-between gap-6 py-6 text-[var(--c-dark-gray)]/60"
                  >
                    {row}
                  </span>
                ) : (
                  <a
                    href={doc.file}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between gap-6 py-6 text-[var(--c-dark-green)] transition-colors duration-200 fine:hover:text-[var(--c-accent)]"
                  >
                    {row}
                  </a>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
