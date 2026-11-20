import { campaignParams } from '@/lib/analytics/track';

/**
 * Records an enquiry in the admin's leads datasheet (POST /api/leads).
 *
 * Fire-and-forget with `keepalive`, so it never delays the WhatsApp tab the
 * form opens from the same tap, and still completes if the page unloads.
 * `fields` are keyed by the label the visitor saw ("Full Name": "…").
 */
export function submitLead(source: string, fields: Record<string, string>) {
  try {
    void fetch('/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      keepalive: true,
      body: JSON.stringify({
        source,
        page: window.location.pathname,
        fields,
        campaign: campaignParams(),
      }),
    }).catch(() => {});
  } catch {
    // Never let lead capture break the form.
  }
}
