import { prisma } from '@/lib/prisma';

export default async function LessonPage({ params }: { params: { slug: string } }) {
  const lesson = await prisma.lesson.findUnique({ where: { slug: params.slug }, include: { division: true, role: true, exercises: true } });
  if (!lesson) return <div className="card">Lesson not found.</div>;
  return (
    <div className="space-y-4">
      <div className="card">
        <h1 className="text-2xl font-semibold">{lesson.title}</h1>
        {lesson.description ? <p className="text-gray-700 mt-1">{lesson.description}</p> : null}
      </div>
      <div className="card">
        <h2 className="font-semibold mb-2">Exercises</h2>
        <div className="text-sm text-gray-600">Authoring UI coming here—use /admin to add content.</div>
      </div>
    </div>
  );
}
