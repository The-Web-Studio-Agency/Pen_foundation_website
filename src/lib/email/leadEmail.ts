import nodemailer from 'nodemailer';

import type { Lead } from '@/lib/cms/server';

/**
 * Emails each new enquiry to the team, alongside the admin's leads sheet.
 *
 * Plain SMTP, so any mailbox works (Gmail / Google Workspace with an app
 * password, Zoho, Hostinger, Outlook). Set in the environment:
 *
 *   LEAD_EMAIL_TO     where enquiries go; several addresses comma-separated
 *   SMTP_HOST         e.g. smtp.gmail.com
 *   SMTP_PORT         465 (SSL) or 587 (STARTTLS); default 465
 *   SMTP_USER         the sending mailbox's login
 *   SMTP_PASS         its password (for Gmail: an app password)
 *   LEAD_EMAIL_FROM   optional sender, default SMTP_USER
 *
 * If any of the required ones is missing, nothing is sent and the form keeps
 * working exactly as before.
 */

const env = (name: string) => process.env[name]?.trim() || '';

export const leadEmailEnabled = () =>
  Boolean(env('LEAD_EMAIL_TO') && env('SMTP_HOST') && env('SMTP_USER') && env('SMTP_PASS'));

const FORM_NAMES: Record<string, string> = {
  contact: 'Contact form',
  partners: 'Partners form',
  'landing-top': 'Landing page form (top)',
  'landing-bottom': 'Landing page form (bottom)',
};

const escape = (s: string) =>
  s.replace(
    /[&<>"']/g,
    (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[ch]!,
  );

/** The visitor's own address, if they gave one, so "Reply" reaches them. */
function visitorEmail(fields: Record<string, string>) {
  for (const value of Object.values(fields)) {
    const v = value.trim();
    if (/^[^\s@<>,;"]+@[^\s@<>,;"]+\.[a-z]{2,}$/i.test(v)) return v;
  }
  return undefined;
}

/** A short identifier for the subject: the first name-like field. */
function visitorName(fields: Record<string, string>) {
  const key = Object.keys(fields).find((k) => /name/i.test(k));
  return key ? fields[key].replace(/[\r\n]+/g, ' ').slice(0, 80) : '';
}

function rows(record: Record<string, string>) {
  return Object.entries(record)
    .map(
      ([k, v]) =>
        `<tr><td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;color:#6b7280;vertical-align:top;white-space:nowrap">${escape(k)}</td>` +
        `<td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;color:#03222a;white-space:pre-wrap">${escape(v)}</td></tr>`,
    )
    .join('');
}

export async function sendLeadEmail(lead: Lead, siteUrl: string) {
  if (!leadEmailEnabled()) return;

  const port = Number(env('SMTP_PORT') || 465);
  const transport = nodemailer.createTransport({
    host: env('SMTP_HOST'),
    port,
    secure: port === 465,
    auth: { user: env('SMTP_USER'), pass: env('SMTP_PASS') },
  });

  const form = FORM_NAMES[lead.source] ?? lead.source;
  const name = visitorName(lead.fields);
  const when = new Date(lead.createdAt).toLocaleString('en-IN', {
    timeZone: process.env.ANALYTICS_TIMEZONE || 'Asia/Kolkata',
    dateStyle: 'medium',
    timeStyle: 'short',
  });
  const adminUrl = `${siteUrl}/web-admin/leads`;
  const details: Record<string, string> = { Form: form, Page: lead.page || '—', Received: when };

  const html = `<div style="font-family:Arial,Helvetica,sans-serif;font-size:14px;max-width:640px">
  <h2 style="margin:0 0 16px;color:#03222a">New enquiry${name ? ` from ${escape(name)}` : ''}</h2>
  <table style="border-collapse:collapse;width:100%;margin-bottom:20px">${rows(lead.fields)}</table>
  <table style="border-collapse:collapse;width:100%;margin-bottom:20px;font-size:13px">${rows(details)}${
    Object.keys(lead.campaign).length ? rows(lead.campaign) : ''
  }</table>
  <p style="margin:0"><a href="${escape(adminUrl)}" style="color:#03222a">Open the leads sheet</a></p>
</div>`;

  const text = [
    `New enquiry${name ? ` from ${name}` : ''}`,
    '',
    ...Object.entries(lead.fields).map(([k, v]) => `${k}: ${v}`),
    '',
    ...Object.entries({ ...details, ...lead.campaign }).map(([k, v]) => `${k}: ${v}`),
    '',
    `Leads sheet: ${adminUrl}`,
  ].join('\n');

  await transport.sendMail({
    from: { name: 'PEN Foundation website', address: env('LEAD_EMAIL_FROM') || env('SMTP_USER') },
    to: env('LEAD_EMAIL_TO')
      .split(',')
      .map((a) => a.trim())
      .filter(Boolean),
    replyTo: visitorEmail(lead.fields),
    subject: `New enquiry${name ? ` from ${name}` : ''} — ${form}`,
    text,
    html,
  });
}
