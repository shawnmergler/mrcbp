import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest){
  const divisionId = req.nextUrl.searchParams.get('divisionId');
  if(divisionId){
    const div = await prisma.division.findUnique({ where: { id: Number(divisionId) }, include: { lessons: true } });
    return NextResponse.json(div ?? {});
  }
  const divisions = await prisma.division.findMany({ include: { lessons: { include: { exercises: { select: { id:true, prompt:true, lessonId:true } } } } }, orderBy: { csiCode: 'asc' } });
  return NextResponse.json(divisions.map(d => ({ division: { id: d.id, csiCode: d.csiCode, name: d.name }, lessons: d.lessons.map(l => ({ id: l.id, title: l.title, exercises: l.exercises })) })));
}

export async function POST(req: NextRequest){
  const { lessonId, prompt, options, correct, assetUrl } = await req.json();
  const ex = await prisma.exercise.create({
    data: {
      lessonId: Number(lessonId),
      type: 'MCQ',
      prompt,
      data: { options },
      answer: { correct },
      assetUrl
    }
  });
  return NextResponse.json(ex);
}

export async function DELETE(req: NextRequest){
  const { id } = await req.json();
  await prisma.exercise.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
