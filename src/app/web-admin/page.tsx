import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

import { LoginForm } from '@/designs/v2/admin/LoginForm';
import { currentAdmin } from '@/lib/cms/auth';

export const metadata: Metadata = { title: 'Sign in' };

/** /web-admin: the sign-in page, or straight to the dashboard if signed in. */
export default async function Page() {
  if (await currentAdmin()) redirect('/web-admin/dashboard');
  return <LoginForm />;
}
