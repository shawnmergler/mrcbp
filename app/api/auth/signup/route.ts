import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { randomUUID } from 'crypto';

export async function POST(req: NextRequest) {
  const { displayName, email } = await req.json();
  const id = randomUUID();
  await prisma.user.create({ data: { id, displayName: String(displayName||'User'), email: email? String(email): null } });
  cookies().set('uid', id, { httpOnly: true, sameSite: 'lax', path: '/', maxAge: 60*60*24*365 });
  return NextResponse.json({ ok: true });
}
