// app/admin/login/route.ts
import { NextResponse } from 'next/server';

const FALLBACK_USER = 'Shawn';
const FALLBACK_PASS = 'Quiz0810';

export async function POST(req: Request) {
  const form = await req.formData();
  const username = String(form.get('username') ?? '').trim();
  const password = String(form.get('password') ?? '');
  const nextPath = String(form.get('next') ?? '/admin');

  const ok =
    (process.env.ADMIN_USER || FALLBACK_USER) === username &&
    (process.env.ADMIN_PASS || FALLBACK_PASS) === password;

  if (ok) {
    const res = NextResponse.redirect(new URL(nextPath, req.url));
    res.cookies.set('admin_authed', 'true', {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 8, // 8 hours
    });
    return res;
  }

  // On incorrect credentials: clear any token and send to home with a flag
  const res = NextResponse.redirect(new URL('/?adminError=1', req.url));
  res.cookies.delete('admin_authed', { path: '/' });
  return res;
}
