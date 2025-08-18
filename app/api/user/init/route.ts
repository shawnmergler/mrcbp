import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { uid as makeId } from '@/lib/utils';

export async function POST(req: NextRequest){
  const { displayName, email } = await req.json();
  let id = req.cookies.get('uid')?.value;
  if(!id) id = makeId();
  await prisma.user.upsert({
    where: { id },
    update: { displayName, email },
    create: { id, displayName, email }
  });
  const res = NextResponse.json({ ok: true });
  res.cookies.set('uid', id, { httpOnly: false, path: '/', maxAge: 60*60*24*365 });
  return res;
}
