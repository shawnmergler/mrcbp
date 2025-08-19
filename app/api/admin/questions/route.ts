// app/api/admin/questions/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest){
  const url = new URL(req.url);
  const lessonId = url.searchParams.get('lessonId');
  const where = lessonId ? { lessonId: Number(lessonId) } : {};
  const rows = await prisma.exercise.findMany({
    where,
    orderBy: [{ lessonId:'asc' }, { id:'asc' }],
    select: { id:true, lessonId:true, type:true, prompt:true, optionsJson:true, answerKey:true }
  });
  return NextResponse.json(rows);
}

export async function POST(req: NextRequest){
  const { lessonId, type, prompt, options, answerKey } = await req.json();
  if(!lessonId || !prompt) return NextResponse.json({ error:'Missing fields' }, { status:400 });
  const created = await prisma.exercise.create({
    data: {
      lessonId: Number(lessonId),
      type: type ?? 'MULTIPLE_CHOICE',
      prompt,
      optionsJson: options ? JSON.stringify(options) : null,
      answerKey: answerKey ?? null,
    }
  });
  return NextResponse.json(created, { status:201 });
}

export async function PUT(req: NextRequest){
  const { id, prompt, options, answerKey } = await req.json();
  if(!id) return NextResponse.json({ error:'Missing id' }, { status:400 });
  const updated = await prisma.exercise.update({
    where: { id: Number(id) },
    data: {
      prompt,
      optionsJson: options ? JSON.stringify(options) : undefined,
      answerKey
    }
  });
  return NextResponse.json(updated);
}

export async function DELETE(req: NextRequest){
  const { id } = await req.json();
  if(!id) return NextResponse.json({ error:'Missing id' }, { status:400 });
  await prisma.exercise.delete({ where: { id: Number(id) } });
  return NextResponse.json({ ok:true });
}
