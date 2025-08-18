import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';

export const runtime = 'edge';

export async function POST(req: NextRequest){
  const form = await req.formData();
  const file = form.get('file') as File | null;
  if(!file) return NextResponse.json({ error: 'missing file' }, { status: 400 });

  try {
    if(process.env.BLOB_READ_WRITE_TOKEN){
      const blob = await put(`standards/${Date.now()}-${file.name}`, file, { access: 'public' });
      return NextResponse.json({ url: blob.url });
    }
  } catch(err){
    // fall through to base64
  }
  // Fallback: data URL
  const buf = await file.arrayBuffer();
  const b64 = Buffer.from(buf).toString('base64');
  const url = `data:${file.type};base64,${b64}`;
  return NextResponse.json({ url });
}
