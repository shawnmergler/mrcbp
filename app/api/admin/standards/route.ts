import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(){
  const list = await prisma.standard.findMany({ orderBy: { createdAt: 'desc' } });
  return NextResponse.json(list);
}

export async function POST(req: NextRequest){
  const { title, description, url, mime } = await req.json();
  const s = await prisma.standard.create({ data: { title, description, url, mime } });
  return NextResponse.json(s);
}

export async function DELETE(req: NextRequest){
  const { id } = await req.json();
  await prisma.standard.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
