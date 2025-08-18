import { prisma } from '@/lib/prisma';

export default async function LessonPage({ params }: { params: { slug: string } }){
  const lesson = await prisma.lesson.findUnique({ where: { slug: params.slug }, include: { exercises: true, division: true } });
  if(!lesson) return <div className="card">Lesson not found.</div>;
  return (
    <div className="card">
      <h1 className="section">{lesson.title}</h1>
      <div className="label">Division {String(lesson.division.csiCode).padStart(2,'0')} — {lesson.division.name}</div>
      <div className="mt-4">
        {lesson.exercises.length===0 ? <div>No questions yet.</div> : null}
        <ol>
          {lesson.exercises.map(ex => <li key={ex.id} style={{marginBottom:8}}>{ex.prompt}</li>)}
        </ol>
      </div>
    </div>
  );
}
