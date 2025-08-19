// app/api/admin/leaderboard/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(){
  const rows = await prisma.user.findMany({
    orderBy: [{ xp: 'desc' }, { name: 'asc' }],
    select: { id:true, name:true, xp:true, streak:true }
  });
  return NextResponse.json(rows);
}

export async function POST(req: NextRequest){
  const { name, xp, streak } = await req.json();
  const created = await prisma.user.create({ data: { name, xp: Number(xp||0), streak: Number(streak||0) }});
  return NextResponse.json(created, { status:201 });
}

export async function PUT(req: NextRequest){
  const { id, name, xp, streak } = await req.json();
  const updated = await prisma.user.update({ where: { id: Number(id) }, data: { name, xp: Number(xp), streak: Number(streak) }});
  return NextResponse.json(updated);
}

export async function DELETE(req: NextRequest){
  const { id } = await req.json();
  await prisma.user.delete({ where: { id: Number(id) } });
  return NextResponse.json({ ok:true });
}
