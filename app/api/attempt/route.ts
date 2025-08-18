import { prisma } from "@/lib/prisma";
import { updateSM2, nextDueDate } from "@/lib/srs";
import { NextResponse } from "next/server";
type Body = { userId: string; exerciseId: number; correct: boolean; response?: any; xpAward?: number; };

export async function POST(req: Request) {
  const body = (await req.json()) as Body;
  if (!body?.userId || !body?.exerciseId) return NextResponse.json({ error: "Missing userId or exerciseId" }, { status: 400 });
  const { userId, exerciseId, correct, response } = body;
  const user = await prisma.user.upsert({ where: { id: userId }, update: {}, create: { id: userId, xp: 0, streak: 0 } });
  await prisma.attempt.create({ data: { userId, exerciseId, correct, response: response ?? {} } });
  const existing = await prisma.sRSItem.findUnique({ where: { userId_exerciseId: { userId, exerciseId } } });
  const prev = existing ? { repetition: existing.repetition, interval: existing.interval, ef: existing.ef } : { repetition: 0, interval: 0, ef: 2.5 };
  const quality = correct ? 4 : 2;
  const next = updateSM2(prev, quality as 0|1|2|3|4|5);
  const due = nextDueDate(next.interval);
  await prisma.sRSItem.upsert({ where: { userId_exerciseId: { userId, exerciseId } }, update: { repetition: next.repetition, interval: next.interval, ef: next.ef, dueDate: due }, create: { userId, exerciseId, repetition: next.repetition, interval: next.interval, ef: next.ef, dueDate: due } });
  const xpGain = body.xpAward ?? (correct ? 10 : 2);
  await prisma.user.update({ where: { id: userId }, data: { xp: (user.xp||0)+xpGain, streak: (user.streak||0)+1, lastActiveUTC: new Date() } });
  return NextResponse.json({ ok: true, nextDue: due });
}
