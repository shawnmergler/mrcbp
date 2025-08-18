import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(){
  const list = await prisma.division.findMany({ orderBy: { csiCode: 'asc' } });
  return NextResponse.json(list);
}

export async function POST(req: NextRequest){
  const { csiCode, name } = await req.json();
  const d = await prisma.division.create({ data: { csiCode, name } });
  return NextResponse.json(d);
}

export async function PUT(req: NextRequest){
  const d = await req.json();
  const r = await prisma.division.update({ where: { id: d.id }, data: { csiCode: d.csiCode, name: d.name } });
  return NextResponse.json(r);
}

export async function DELETE(req: NextRequest){
  const { id } = await req.json();
  await prisma.division.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
