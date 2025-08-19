'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

// Hard-coded creds per your request
const ADMIN_USER = 'Shawn';
const ADMIN_PASS = 'Quiz0810';

export async function loginAction(formData: FormData) {
  const username = String(formData.get('username') ?? '');
  const password = String(formData.get('password') ?? '');

  const ok = username === ADMIN_USER && password === ADMIN_PASS;
  if (!ok) {
    cookies().delete('admin_session');
    // Kick back to Home; your app/page.tsx shows a friendly banner via ?adminError=1
    redirect('/?adminError=1');
  }

  // Create a simple session token (opaque cookie)
  const token = `${Date.now().toString(36)}.${Math.random().toString(36).slice(2)}`;
  cookies().set('admin_session', token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: true,
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  redirect('/admin');
}
