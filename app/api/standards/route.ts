import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(){
  const list = await prisma.standard.findMany({ orderBy: { createdAt: 'desc' } });
  return NextResponse.json(list);
}
