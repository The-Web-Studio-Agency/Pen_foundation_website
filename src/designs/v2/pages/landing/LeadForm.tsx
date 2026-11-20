'use client';

import { useEffect, useId, useRef, useState, type FormEvent } from 'react';

import { landing, LANDING_PHONE } from '@/content/data/landing';
import { campaignParams, trackCall, trackLead } from '@/lib/analytics/track';
import { whatsappNumber } from '@/lib/contact/whatsapp';

import { ChevronRight, cx } from '../../components/primitives';
import t from '../../styles/theme.module.css';
import s from './landing.module.css';

const { fields, types } = landing.form;

/** The source's form, as one message to WhatsApp, with the ad source appended. */
function buildMessage(values: Record<string, string>, formId: string) {
  const lines = (Object.keys(fields) as (keyof typeof fields)[])
    .map((key) => {
      const value = values[key]?.trim();
      return value ? `${fields[key].label}: ${value}` : null;
    })
    .filter(Boolean);
  const campaign = Object.entries(campaignParams()).map(([k, v]) => `${k}: ${v}`);
  return [
    'New project assessment request (landing page)',
    '',
    ...lines,
    '',
    `Form: ${formId}`,
    ...(campaign.length ? ['', ...campaign] : []),
  ].join('\n');
}

/**
 * The landing page's project enquiry. There is no backend, so, as on
 * /contact, the enquiry is written into a WhatsApp message to the team's
 * number and opened from the submit tap. The submission is reported as a lead
 * (see lib/analytics/track.ts) before WhatsApp opens.
 */
export function LeadForm({
  formId,
  title,
  submit,
  callPrompt,
  note,
}: {
  formId: string;
  title: string;
  submit: string;
  callPrompt: string;
  note: string;
}) {
  const uid = useId();
  const [url, setUrl] = useState<string | null>(null);
  const [opened, setOpened] = useState(false);
  const ackRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (url) ackRef.current?.focus();
  }, [url]);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const values: Record<string, string> = {};
    for (const [key, value] of data.entries()) if (typeof value === 'string') values[key] = value;

    trackLead({ form_id: formId, project_type: values.type, ...campaignParams() });

    const link = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(buildMessage(values, formId))}`;
    const win = window.open(link, '_blank');
    if (win) win.opener = null;
    setUrl(link);
    setOpened(win !== null);
  };

  const id = (name: string) => `${uid}-${name}`;

  return (
    <div className={s.formCard}>
      {url ? (
        <div className={s.ack} aria-live="polite">
          <span className={s.ackTick} aria-hidden>
            <svg width="20" height="20" viewBox="0 0 12 12" fill="none">
              <path d="m2.5 6.2 2.3 2.3 4.7-5" stroke="currentColor" strokeWidth="1.6" />
            </svg>
          </span>
          <h3 ref={ackRef} tabIndex={-1} className={cx(t.h3, s.ackTitle)}>
            {opened
              ? 'Thank you. WhatsApp is open with your details.'
              : 'Thank you. One tap left to send it.'}
          </h3>
          <p className={s.ackBody}>
            {opened
              ? 'Press send there and it reaches our engineering team.'
              : 'Your browser blocked the new tab. Open WhatsApp below and press send; your details are already in the message.'}{' '}
            {note}
          </p>
          <div className={s.ackActions}>
            <a href={url} target="_blank" rel="noopener noreferrer" className={cx(t.btn, t.solid)}>
              <span>{opened ? 'Reopen WhatsApp' : 'Open WhatsApp'}</span>
              <span className={t.btnIcon}>
                <ChevronRight />
              </span>
            </a>
            <a
              href={`tel:${LANDING_PHONE.tel}`}
              className={cx(t.btn, t.onLight)}
              onClick={() => trackCall(`${formId}-ack`)}
            >
              <span>Call {LANDING_PHONE.display}</span>
            </a>
          </div>
        </div>
      ) : (
        <form onSubmit={onSubmit} className={s.form} aria-label={title}>
          <p className={cx(t.mono, s.formTitle)}>{title}</p>
          <div className={s.fields}>
            <Field id={id('name')} label={fields.name.label} required>
              <input
                id={id('name')}
                name="name"
                type="text"
                required
                autoComplete="name"
                placeholder={fields.name.placeholder}
                className={s.input}
              />
            </Field>
            <Field id={id('phone')} label={fields.phone.label} required>
              <input
                id={id('phone')}
                name="phone"
                type="tel"
                required
                inputMode="tel"
                autoComplete="tel"
                placeholder={fields.phone.placeholder}
                className={s.input}
              />
            </Field>
            <Field id={id('email')} label={fields.email.label}>
              <input
                id={id('email')}
                name="email"
                type="email"
                autoComplete="email"
                placeholder={fields.email.placeholder}
                className={s.input}
              />
            </Field>
            <Field id={id('location')} label={fields.location.label} required>
              <input
                id={id('location')}
                name="location"
                type="text"
                required
                autoComplete="address-level2"
                placeholder={fields.location.placeholder}
                className={s.input}
              />
            </Field>
            <Field id={id('type')} label={fields.type.label} required full>
              <select
                id={id('type')}
                name="type"
                required
                defaultValue=""
                className={cx(s.input, s.select)}
              >
                <option value="" disabled>
                  {fields.type.placeholder}
                </option>
                {types.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </Field>
            <Field id={id('message')} label={fields.message.label} full>
              <textarea
                id={id('message')}
                name="message"
                rows={3}
                placeholder={fields.message.placeholder}
                className={cx(s.input, s.textarea)}
              />
            </Field>
          </div>

          <button type="submit" className={cx(t.btn, t.solid, s.submit)}>
            <span>{submit}</span>
            <span className={t.btnIcon}>
              <ChevronRight />
            </span>
          </button>

          <div className={s.formFoot}>
            <p className={s.callPrompt}>
              {callPrompt}{' '}
              <a href={`tel:${LANDING_PHONE.tel}`} onClick={() => trackCall(formId)}>
                {LANDING_PHONE.display}
              </a>
            </p>
            <p className={s.note}>{note}</p>
          </div>
        </form>
      )}
    </div>
  );
}

function Field({
  id,
  label,
  required,
  full,
  children,
}: {
  id: string;
  label: string;
  required?: boolean;
  full?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className={cx(s.field, full && s.fieldFull)}>
      <label htmlFor={id} className={cx(t.mono, s.label)}>
        {label}
        {required && (
          <span aria-hidden className={s.required}>
            {' '}
            *
          </span>
        )}
      </label>
      {children}
    </div>
  );
}
