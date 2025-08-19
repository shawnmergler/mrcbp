import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(){
  const list = await prisma.user.findMany({ orderBy: [{ xp: 'desc' }, { streak: 'desc' }], select: { id:true, displayName:true, xp:true, streak:true } });
  return NextResponse.json(list);
}

export async function PUT(req: NextRequest){
  const { id, displayName, xp, streak } = await req.json();
  const r = await prisma.user.update({ where: { id }, data: { displayName, xp, streak } });
  return NextResponse.json(r);
}

export async function DELETE(req: NextRequest){
  const { id } = await req.json();
  await prisma.user.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
