// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const { pathname, searchParams } = req.nextUrl;

  // Only guard /admin routes; allow the login page itself through
  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    const authed = req.cookies.get('admin_authed')?.value === 'true';
    if (!authed) {
      const url = req.nextUrl.clone();
      url.pathname = '/admin/login';
      url.searchParams.set('next', pathname + (searchParams.toString() ? `?${searchParams.toString()}` : ''));
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
