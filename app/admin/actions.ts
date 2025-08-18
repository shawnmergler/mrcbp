'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

function num(v: FormDataEntryValue | null) {
  if (v === null) return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

export async function createDivision(formData: FormData): Promise<void> {
  const csiCode = num(formData.get('csiCode'));
  const name = String(formData.get('name') || '').trim();
  if (!csiCode || !name) return;
  await prisma.division.upsert({
    where: { csiCode },
    update: { name },
    create: { csiCode, name },
  });
  revalidatePath('/admin');
  return;
}

export async function createLesson(formData: FormData): Promise<void> {
  const divisionId = num(formData.get('divisionId'));
  const system = String(formData.get('system') || '');
  const title = String(formData.get('title') || '').trim();
  const slug = String(formData.get('slug') || '').trim();
  const roleLevel = num(formData.get('roleLevel'));
  if (!divisionId || !system || !title || !slug) return;

  let roleId: number | null = null;
  if (roleLevel) {
    const role = await prisma.role.findUnique({ where: { system_level: { system: system as any, level: roleLevel } } });
    roleId = role?.id ?? null;
  }

  await prisma.lesson.create({
    data: { divisionId, system: system as any, title, slug, roleId: roleId ?? undefined },
  });
  revalidatePath('/admin');
  return;
}

export async function createExercise(formData: FormData): Promise<void> {
  const lessonId = num(formData.get('lessonId'));
  const type = String(formData.get('type') || '');
  const prompt = String(formData.get('prompt') || '').trim();
  const dataStr = String(formData.get('data') || '');
  const answerStr = String(formData.get('answer') || '');
  if (!lessonId || !type || !prompt) return;
  let data: any = {};
  let answer: any = {};
  try { data = dataStr ? JSON.parse(dataStr) : {}; } catch {}
  try { answer = answerStr ? JSON.parse(answerStr) : {}; } catch {}

  await prisma.exercise.create({
    data: { lessonId, type: type as any, prompt, data, answer },
  });
  revalidatePath('/admin');
  return;
}
