import { NextRequest, NextResponse } from 'next/server';

export const config = {
  matcher: ['/admin/:path*'],
};

export function middleware(req: NextRequest) {
  const auth = req.headers.get('authorization') || '';
  // Expect "Basic base64(username:password)"
  const expectedUser = 'Shawn';
  const expectedPass = 'Quiz0810';

  if (!auth.startsWith('Basic ')) {
    return new Response('Authentication required', {
      status: 401,
      headers: { 'WWW-Authenticate': 'Basic realm="Admin"' },
    });
  }

  try {
    const base64 = auth.slice(6);
    const [user, pass] = Buffer.from(base64, 'base64').toString('utf8').split(':', 2);
    if (user === expectedUser && pass === expectedPass) {
      return NextResponse.next();
    }
  } catch {}

  return new Response('Unauthorized', {
    status: 401,
    headers: { 'WWW-Authenticate': 'Basic realm="Admin"' },
  });
}
