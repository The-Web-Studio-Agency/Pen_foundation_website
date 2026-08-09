import { siteConfig } from '@/config/site';
import { formFields } from '@/content/data/contact';

/**
 * Turns a contact-form submission into a WhatsApp deep link.
 *
 * There is no backend on this site, so the enquiry is handed to the visitor's
 * WhatsApp with the message already written: they press send, and it lands in
 * the same inbox as the number in the footer. That keeps one destination for
 * enquiries instead of a form queue nobody watches.
 *
 * The message is built from `formFields`, not from a hardcoded list, so adding
 * or renaming a field on the form carries into the message without a second
 * edit here.
 */

/** `wa.me` wants the number bare: country code, digits, no `+` and no spaces. */
export const whatsappNumber = siteConfig.phone.replace(/\D/g, '');

/** Field values keyed by the `name` in `formFields`. */
export type EnquiryValues = Record<string, string>;

/**
 * Labelled lines for every field the visitor actually filled in. Blank
 * optional fields are dropped rather than sent as empty headings.
 */
export function buildEnquiryMessage(values: EnquiryValues): string {
  const lines = formFields
    .map((field) => {
      const value = values[field.name]?.trim();
      // Labels are written for the form, where "How Can We Help?" is a
      // question. In a message they are captions, so the trailing punctuation
      // goes rather than colliding with the colon.
      return value ? `${field.label.replace(/[?:]+$/, '')}: ${value}` : null;
    })
    .filter((line): line is string => line !== null);

  return [`New enquiry from the ${siteConfig.name} website`, '', ...lines].join('\n');
}

/**
 * `wa.me` opens the native app on mobile and WhatsApp Web on desktop, so one
 * URL covers both without sniffing the platform.
 */
export function buildWhatsAppUrl(values: EnquiryValues): string {
  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(buildEnquiryMessage(values))}`;
}
