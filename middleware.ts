import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest){
  const path = req.nextUrl.pathname;
  if(path.startsWith('/admin') || path.startsWith('/api/admin')){
    const auth = req.headers.get('authorization');
    const expectedUser = process.env.ADMIN_USER || 'Shawn';
    const expectedPass = process.env.ADMIN_PASS || 'Quiz0810';
    if(!auth?.startsWith('Basic ')){
      return new NextResponse('Auth required', {
        status: 401,
        headers: { 'WWW-Authenticate': 'Basic realm="Admin"' }
      });
    }
    const decoded = Buffer.from(auth.split(' ')[1], 'base64').toString();
    const [user, pass] = decoded.split(':');
    if(user !== expectedUser || pass !== expectedPass){
      return new NextResponse('Invalid credentials', { status: 401 });
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*','/api/admin/:path*']
}
