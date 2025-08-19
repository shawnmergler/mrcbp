// app/api/admin/sections/route.ts
import { NextResponse } from 'next/server';

export async function GET(){
  // Static "sections" that correspond to Systems in the DB
  return NextResponse.json([
    { id: 'PROJECT_MANAGEMENT', name: 'Project Management' },
    { id: 'SITE_SUPERVISION',   name: 'Site Supervision'   },
  ]);
}
