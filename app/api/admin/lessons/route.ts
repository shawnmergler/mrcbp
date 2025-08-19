// app/api/admin/lessons/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest){
  const url = new URL(req.url);
  const system = url.searchParams.get('system') as ('PROJECT_MANAGEMENT'|'SITE_SUPERVISION'|null);
  const where = system ? { system } : {};
  const lessons = await prisma.lesson.findMany({
    where,
    orderBy: [{ system: 'asc' }, { title: 'asc' }],
    select: { id:true, title:true, slug:true, system:true, divisionId:true }
  });
  return NextResponse.json(lessons);
}

export async function POST(req: NextRequest){
  const { title, slug, system, divisionId } = await req.json();
  if(!title || !slug || !system) return NextResponse.json({ error:'Missing fields' }, { status:400 });
  const created = await prisma.lesson.create({
    data: { title, slug, system, divisionId: divisionId ?? null }
  });
  return NextResponse.json(created, { status:201 });
}

export async function PUT(req: NextRequest){
  const { id, title, slug, system, divisionId } = await req.json();
  if(!id) return NextResponse.json({ error:'Missing id' }, { status:400 });
  const updated = await prisma.lesson.update({
    where: { id:Number(id) },
    data: { title, slug, system, divisionId: divisionId ?? null }
  });
  return NextResponse.json(updated);
}

export async function DELETE(req: NextRequest){
  const { id } = await req.json();
  if(!id) return NextResponse.json({ error:'Missing id' }, { status:400 });
  await prisma.exercise.deleteMany({ where: { lessonId: Number(id) } });
  await prisma.lesson.delete({ where: { id: Number(id) } });
  return NextResponse.json({ ok:true });
}
