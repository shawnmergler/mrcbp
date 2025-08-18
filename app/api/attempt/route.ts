import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';

async function ensureBadge(code: string, name: string, description: string) {
  let b = await prisma.badge.findUnique({ where: { code } });
  if (!b) {
    b = await prisma.badge.create({ data: { code, name, description } });
  }
  return b;
}

export async function POST(req: NextRequest) {
  const { userId: rawUserId, exerciseId, correct, response } = await req.json();
  const cookieUid = cookies().get('uid')?.value || null;
  const userId = rawUserId || cookieUid;
  if (!userId) return NextResponse.json({ ok: false, error: 'Missing user' }, { status: 400 });

  // record attempt
  await prisma.attempt.create({ data: { userId, exerciseId: Number(exerciseId), correct: !!correct, response: response ?? {} } });

  // update streak/xp and award badge(s)
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return NextResponse.json({ ok: true });

  const newStreak = correct ? (user.streak + 1) : 0;
  const xpGain = correct ? 10 : 0;
  const updated = await prisma.user.update({
    where: { id: userId },
    data: {
      streak: newStreak,
      xp: user.xp + xpGain,
      lastActiveUTC: new Date(),
    },
  });

  // 3 In a Row!
  if (newStreak === 3) {
    const badge = await ensureBadge('streak3', '3 In a Row!', 'Answered 3 questions correctly in a row');
    const exists = await prisma.userBadge.findUnique({ where: { userId_badgeId: { userId, badgeId: badge.id } } });
    if (!exists) {
      await prisma.userBadge.create({ data: { userId, badgeId: badge.id } });
    }
  }

  return NextResponse.json({ ok: true, streak: updated.streak, xp: updated.xp });
}
