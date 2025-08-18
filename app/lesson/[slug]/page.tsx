import { prisma } from "@/lib/prisma";
import ExerciseRunner from "@/components/ExerciseRunner";
import { DEMO_MODE } from "@/lib/env";
import Link from "next/link";

export default async function LessonPage({ params }: { params: { slug: string } }) {
  const lesson = await prisma.lesson.findUnique({ where: { slug: params.slug }, include: { exercises: true, division: true } });
  if (!lesson) {
    return (
      <div className="card">
        <p>Lesson not found.</p>
        <Link href="/" className="btn btn-primary mt-4">Back</Link>
      </div>
    );
  }
  const ex = lesson.exercises.map(e => ({ id: e.id, type: e.type as any, prompt: e.prompt, data: e.data as any, answer: e.answer as any }));
  const userId = DEMO_MODE ? "demo-user" : "TODO-auth-user-id";
  return (
    <div className="space-y-6">
      <div className="card">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold" style={{ viewTransitionName: `lesson-${lesson.slug}` }}>{lesson.title}</h1>
            <p className="text-gray-600 mt-1">Division <span style={{ viewTransitionName: `div-${lesson.division.csiCode}` }}>{String(lesson.division.csiCode).padStart(2,'0')} – {lesson.division.name}</span></p>
          </div>
          <Link href="/" className="btn btn-ghost">Back</Link>
        </div>
        {lesson.description && <p className="mt-3 text-gray-700">{lesson.description}</p>}
      </div>
      <ExerciseRunner exercises={ex} lessonSlug={lesson.slug} userId={userId} />
    </div>
  );
}
