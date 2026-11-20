import { NextResponse, type NextRequest } from 'next/server';

import { adminFrom, unauthorized } from '@/lib/cms/api';
import { deleteLead, readLeads, updateLead, type LeadStatus } from '@/lib/cms/server';

const STATUSES: LeadStatus[] = ['new', 'contacted', 'qualified', 'closed'];

export async function GET(request: NextRequest) {
  if (!adminFrom(request)) return unauthorized();
  return NextResponse.json({ leads: readLeads() });
}

/** PATCH { id, status?, note? } */
export async function PATCH(request: NextRequest) {
  if (!adminFrom(request)) return unauthorized();
  const body = (await request.json().catch(() => ({}))) as {
    id?: string;
    status?: LeadStatus;
    note?: string;
  };
  if (!body.id) return NextResponse.json({ error: 'Missing lead.' }, { status: 400 });
  if (body.status && !STATUSES.includes(body.status)) {
    return NextResponse.json({ error: 'Unknown status.' }, { status: 400 });
  }
  updateLead(body.id, {
    ...(body.status ? { status: body.status } : {}),
    ...(body.note !== undefined ? { note: String(body.note).slice(0, 2000) } : {}),
  });
  return NextResponse.json({ ok: true });
}

/** DELETE ?id= */
export async function DELETE(request: NextRequest) {
  if (!adminFrom(request)) return unauthorized();
  const id = request.nextUrl.searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Missing lead.' }, { status: 400 });
  deleteLead(id);
  return NextResponse.json({ ok: true });
}
