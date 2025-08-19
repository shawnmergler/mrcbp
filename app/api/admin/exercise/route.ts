
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  // list exercises with minimal info
  const xs = await prisma.exercise.findMany({
    include: { lesson: { select: { id:true, title:true } } },
    orderBy: { id: 'desc' },
    take: 200
  });
  return NextResponse.json(xs);
}

export async function POST(req: Request) {
  try{
    const body = await req.json();
    const {
      lessonId,
      type,
      prompt,
      explanation,
      choices,           // [{text, isCorrect}]
      ordering,          // [{text, order}]
      pairs,             // [{left,right}]
      hotspots,          // [{x,y,w,h,label,isCorrect}]
      blanks,            // [{index, answer}]
      scale,             // [{label,value,isCorrect?}]
      codingTemplates,   // [{language, starter, tests}]
      correct,           // index or value for True/False or MCQ (optional if choices already mark correct)
    } = body;

    if(!lessonId || !type || !prompt) {
      return NextResponse.json({error:'Missing required fields'}, { status: 400 });
    }

    const ex = await prisma.exercise.create({
    data: { lessonId, type, prompt, explanation: explanation || null }
});

    // Attach children per type
    switch(type){
      case 'MULTIPLE_CHOICE': {
        if(Array.isArray(choices)){
          for(const c of choices){
            await prisma.choice.create({ data: { exerciseId: ex.id, text: String(c.text||''), isCorrect: !!c.isCorrect } });
          }
        }
        break;
      }
      case 'TRUE_FALSE': {
        // store as two choices for consistency
        const val = typeof correct === 'boolean' ? correct : (choices?.find?.((c:any)=>c.isCorrect)?.text?.toLowerCase?.() === 'true');
        await prisma.choice.createMany({ data: [
          { exerciseId: ex.id, text: 'True',  isCorrect: !!val },
          { exerciseId: ex.id, text: 'False', isCorrect: !val },
        ]});
        break;
      }
      case 'ORDERING': {
        if(Array.isArray(ordering)){
          let i=0;
          for(const it of ordering){
            await prisma.orderingItem.create({ data: { exerciseId: ex.id, text: String(it.text||''), order: typeof it.order==='number'? it.order : i++ } });
          }
        }
        break;
      }
      case 'MATCHING_PAIRS': {
        if(Array.isArray(pairs)){
          for(const pr of pairs){
            await prisma.pair.create({ data: { exerciseId: ex.id, left: String(pr.left||''), right: String(pr.right||'') } });
          }
        }
        break;
      }
      case 'HOTSPOT': {
        if(Array.isArray(hotspots)){
          for(const h of hotspots){
            await prisma.hotspot.create({ data: { exerciseId: ex.id, x: +h.x||0, y:+h.y||0, w:+h.w||0, h:+h.h||0, label: String(h.label||''), isCorrect: !!h.isCorrect } });
          }
        }
        break;
      }
      case 'SHORT_ANSWER': {
        // store acceptable answers in choices as correct=true
        if(Array.isArray(choices)){
          for(const c of choices){
            await prisma.choice.create({ data: { exerciseId: ex.id, text: String(c.text||''), isCorrect: true } });
          }
        }
        break;
      }
      case 'CLOZE': {
        if(Array.isArray(blanks)){
          for(const b of blanks){
            await prisma.clozeBlank.create({ data: { exerciseId: ex.id, index: +b.index||0, answer: String(b.answer||'') } });
          }
        }
        break;
      }
      case 'SCALE': {
        if(Array.isArray(scale)){
          for(const s of scale){
            await prisma.scaleOption.create({ data: { exerciseId: ex.id, label: String(s.label||''), value: +s.value||0, isCorrect: !!s.isCorrect } });
          }
        }
        break;
      }
      case 'CODING_CHALLENGE': {
        if(Array.isArray(codingTemplates)){
          for(const t of codingTemplates){
            await prisma.codingTemplate.create({ data: { exerciseId: ex.id, language: String(t.language||'js'), starter: String(t.starter||''), tests: String(t.tests||'') } });
          }
        }
        break;
      }
      default:
        break;
    }

    return NextResponse.json({ok:true, id: ex.id});
  }catch(e:any){
    console.error(e);
    return NextResponse.json({error: e?.message || 'Server error'}, { status: 500 });
  }
}

export async function DELETE(req: Request){
  const { searchParams } = new URL(req.url);
  const id = Number(searchParams.get('id'));
  if(!id) return NextResponse.json({error:'id required'},{status:400});
  await prisma.exercise.delete({ where:{ id }});
  return NextResponse.json({ok:true});
}
