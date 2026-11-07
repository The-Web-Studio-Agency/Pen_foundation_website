'use client';

import { useEffect, useRef, useState, type FormEvent } from 'react';

import { formFields } from '@/content/data/contact';
import { buildWhatsAppUrl, type EnquiryValues } from '@/lib/contact/whatsapp';

import { ChevronRight, cx } from '../../components/primitives';
import t from '../../styles/theme.module.css';
import s from './contact.module.css';

/**
 * The /contact enquiry form in the v2 language. Same fields (from
 * `formFields`), same requiredness and the same submission as
 * `components/contact/ContactForm.tsx`: the enquiry is composed into a
 * WhatsApp deep link to the number in `siteConfig` and opened from the submit
 * gesture. The card then swaps for an acknowledgement that repeats the link in
 * case the new tab was blocked.
 *
 * The acknowledgement mounts after the page's reveal pass, so it animates with
 * its own CSS rather than `data-reveal` (which would leave it hidden).
 */

/** Browser autofill hints, keyed by field name. */
const autoComplete: Record<string, string> = {
  name: 'name',
  phone: 'tel',
  email: 'email',
  company: 'organization',
  role: 'organization-title',
};

export function EnquiryForm() {
  const [enquiryUrl, setEnquiryUrl] = useState<string | null>(null);
  const [openedInNewTab, setOpenedInNewTab] = useState(false);
  const ackRef = useRef<HTMLHeadingElement>(null);

  // Move focus to the acknowledgement so keyboard and screen-reader users
  // land on the outcome rather than on a button that no longer exists.
  useEffect(() => {
    if (enquiryUrl) ackRef.current?.focus();
  }, [enquiryUrl]);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const entries = new FormData(event.currentTarget);
    const values: EnquiryValues = {};
    for (const [key, value] of entries.entries()) {
      if (typeof value === 'string') values[key] = value;
    }

    const url = buildWhatsAppUrl(values);
    // Opened straight from the submit gesture, which keeps popup blockers out
    // of the way on the common path. No `noopener` feature string: with it,
    // `window.open` always returns null, which would report every successful
    // open as blocked. The opener is cut by hand instead.
    const opened = window.open(url, '_blank');
    if (opened) opened.opener = null;

    setEnquiryUrl(url);
    setOpenedInNewTab(opened !== null);
  };

  return (
    <div className={s.formCard}>
      {enquiryUrl ? (
        <div className={s.ack} aria-live="polite">
          <h3 ref={ackRef} tabIndex={-1} className={cx(t.h3, s.ackTitle)}>
            {openedInNewTab
              ? 'Thanks — WhatsApp is open with your details.'
              : 'Thanks — one tap left to send it.'}
          </h3>
          <p className={s.ackBody}>
            {openedInNewTab
              ? 'Press send there and it reaches the engineering team, who will call you back the same day. Nothing leaves this page until you do.'
              : 'Your browser blocked the new tab. Open the chat below and press send — your answers are already written into the message.'}
          </p>
          <div className={s.ackActions}>
            <a
              href={enquiryUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={cx(t.btn, t.solid)}
            >
              <span>{openedInNewTab ? 'Reopen WhatsApp' : 'Open WhatsApp'}</span>
              <span className={t.btnIcon}>
                <ChevronRight />
              </span>
            </a>
            <button
              type="button"
              className={cx(t.btn, t.onDark, s.resetBtn)}
              onClick={() => {
                setEnquiryUrl(null);
                setOpenedInNewTab(false);
              }}
            >
              Send another
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={onSubmit} className={s.form}>
          <div className={s.fields}>
            {formFields.map((field) => (
              <div key={field.name} className={cx(s.field, field.span === 'full' && s.fieldFull)}>
                <label htmlFor={field.name} className={cx(t.mono, s.label)}>
                  {field.label}
                  {field.required ? (
                    <span aria-hidden className={s.required}>
                      {' '}
                      *
                    </span>
                  ) : null}
                </label>
                {field.type === 'select' ? (
                  <select
                    id={field.name}
                    name={field.name}
                    required={field.required}
                    defaultValue=""
                    className={cx(s.input, s.select)}
                  >
                    <option value="" disabled>
                      {field.placeholder}
                    </option>
                    {field.options?.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    id={field.name}
                    name={field.name}
                    type={field.type}
                    required={field.required}
                    placeholder={field.placeholder}
                    autoComplete={autoComplete[field.name]}
                    {...(field.type === 'tel'
                      ? {
                          inputMode: 'tel' as const,
                          // Digits, spaces and the punctuation a written
                          // number carries. Every symbol is escaped: browsers
                          // compile `pattern` with the `v` flag, which rejects
                          // the unescaped `(`, `)` and `-` the old form used.
                          pattern: '[\\d\\s+.\\(\\)\\-]{7,}',
                          title: 'Enter a phone number we can call back on, with country code.',
                        }
                      : null)}
                    className={s.input}
                  />
                )}
              </div>
            ))}
          </div>

          <div className={s.submitRow}>
            <button type="submit" className={cx(t.btn, t.solid, s.submit)}>
              <span>Submit</span>
              <span className={t.btnIcon}>
                <ChevronRight />
              </span>
            </button>
            <p className={cx(t.mono, s.submitNote)}>
              <span className={s.required} aria-hidden>
                *
              </span>{' '}
              Required. Sends via WhatsApp.
            </p>
          </div>
        </form>
      )}
    </div>
  );
}
