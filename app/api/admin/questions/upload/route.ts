// app/api/admin/questions/upload/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';

export async function POST(req: NextRequest){
  const data = await req.formData();
  const file = data.get('file') as File | null;
  if(!file) return NextResponse.json({ error:'missing file' }, { status:400 });

  const buf = Buffer.from(await file.arrayBuffer());
  const fname = `${Date.now()}-${Math.random().toString(16).slice(2)}-${file.name}`.replace(/\s+/g,'_');
  const publicDir = path.join(process.cwd(), 'public', 'uploads');
  await writeFile(path.join(publicDir, fname), buf);
  return NextResponse.json({ url: `/uploads/${fname}`, mime: file.type });
}
