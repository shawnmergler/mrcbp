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
  await prisma.division.upsert({ where: { csiCode }, update: { name }, create: { csiCode, name } });
  revalidatePath('/admin');
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
  await prisma.lesson.create({ data: { divisionId, system: system as any, title, slug, roleId: roleId ?? undefined } });
  revalidatePath('/admin');
}

export async function createMCQ(formData: FormData): Promise<void> {
  const lessonId = num(formData.get('lessonId'));
  const prompt = String(formData.get('prompt') || '').trim();
  const c1 = String(formData.get('choice1') || '').trim();
  const c2 = String(formData.get('choice2') || '').trim();
  const c3 = String(formData.get('choice3') || '').trim();
  const c4 = String(formData.get('choice4') || '').trim();
  const correctIndex = num(formData.get('correctIndex')) ?? 0;
  if (!lessonId || !prompt || !c1 || !c2 || !c3 || !c4) return;

  let attachment: any = null;
  // Prefer b64 fields for drag-drop progress
  const b64 = String(formData.get('attachment_b64') || '');
  const attName = String(formData.get('attachment_name') || '');
  const attType = String(formData.get('attachment_type') || '');
  if (b64 && attType) {
    attachment = { filename: attName || 'upload', mime: attType, dataUrl: `data:${attType};base64,${b64}` };
  } else {
    const file = formData.get('attachment') as unknown as File | null;
    if (file && typeof file === 'object' && 'arrayBuffer' in file) {
      const buf = Buffer.from(await (file as any).arrayBuffer());
      const mime = (file as any).type || 'application/octet-stream';
      const filename = (file as any).name || 'upload';
      attachment = { filename, mime, dataUrl: `data:${mime};base64,${buf.toString('base64')}` };
    }
  }

  const data: any = { choices: [c1, c2, c3, c4] };
  if (attachment) data.attachment = attachment;
  const answer: any = { correctIndex };

  await prisma.exercise.create({ data: { lessonId, type: 'MCQ' as any, prompt, data, answer } });
  revalidatePath('/admin');
}

export async function updateMCQ(formData: FormData): Promise<void> {
  const id = num(formData.get('id')); if (!id) return;
  const prompt = String(formData.get('prompt') || '').trim();
  const c1 = String(formData.get('choice1') || '').trim();
  const c2 = String(formData.get('choice2') || '').trim();
  const c3 = String(formData.get('choice3') || '').trim();
  const c4 = String(formData.get('choice4') || '').trim();
  const correctIndex = num(formData.get('correctIndex')) ?? 0;

  let data: any = { choices: [c1, c2, c3, c4] };
  const existing = await prisma.exercise.findUnique({ where: { id } });
  if (existing?.data && (existing.data as any).attachment) {
    data.attachment = (existing.data as any).attachment;
  }

  await prisma.exercise.update({ where: { id }, data: { prompt, data, answer: { correctIndex } } as any });
  revalidatePath('/admin');
}

export async function deleteExercise(formData: FormData): Promise<void> {
  const id = num(formData.get('id')); if (!id) return;
  await prisma.exercise.delete({ where: { id } });
  revalidatePath('/admin');
}

export async function importCSV(formData: FormData): Promise<void> {
  const csv = String(formData.get('csv') || '');
  const defaultLessonId = num(formData.get('lessonId'));
  if (!csv.trim()) return;

  function parseLine(line: string): string[] {
    const out: string[] = [];
    let cur = '', inQ = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"' ) {
        if (inQ && line[i+1] === '"') { cur += '"'; i++; }
        else inQ = !inQ;
      } else if (ch === ',' && !inQ) {
        out.push(cur); cur = '';
      } else {
        cur += ch;
      }
    }
    out.push(cur);
    return out;
  }

  const lines = csv.split(/\r?\n/).filter(l => l.trim().length);
  const header = parseLine(lines[0]).map(h => h.trim().toLowerCase());
  const rows = lines.slice(1).map(parseLine);

  const idx = {
    prompt: header.indexOf('prompt'),
    c1: header.indexOf('choice1'),
    c2: header.indexOf('choice2'),
    c3: header.indexOf('choice3'),
    c4: header.indexOf('choice4'),
    correct: header.indexOf('correctindex'),
    lesson: header.indexOf('lessonid'),
  };

  for (const r of rows) {
    const lessonId = idx.lesson >= 0 ? Number(r[idx.lesson]) : defaultLessonId;
    if (!lessonId) continue;
    const prompt = idx.prompt >= 0 ? r[idx.prompt] : '';
    const c1 = idx.c1 >= 0 ? r[idx.c1] : '';
    const c2 = idx.c2 >= 0 ? r[idx.c2] : '';
    const c3 = idx.c3 >= 0 ? r[idx.c3] : '';
    const c4 = idx.c4 >= 0 ? r[idx.c4] : '';
    const correctIndex = idx.correct >= 0 ? Number(r[idx.correct] || 0) : 0;
    if (!prompt || !c1 || !c2 || !c3 || !c4) continue;
    await prisma.exercise.create({ data: { lessonId, type: 'MCQ' as any, prompt, data: { choices: [c1,c2,c3,c4] }, answer: { correctIndex } as any } });
  }
  revalidatePath('/admin');
}

export async function addStandard(formData: FormData): Promise<void> {
  const title = String(formData.get('title') || '').trim();
  const url = String(formData.get('url') || '').trim();
  const category = String(formData.get('category') || '').trim();
  if (!title || !url) return;
  await prisma.standard.create({ data: { title, url, category } });
  revalidatePath('/admin');
}
