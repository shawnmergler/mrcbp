// components/admin/SectionLessonManager.tsx
'use client';
import React, { useEffect, useState } from 'react';
import Icons from '@/components/Icons';

type SystemId = 'PROJECT_MANAGEMENT' | 'SITE_SUPERVISION';
type Division = { id:number; code:string; name:string };
type Lesson = { id:number; title:string; slug:string; system: SystemId; divisionId?: number | null };

export default function SectionLessonManager(){
  const [systems] = useState<{id:SystemId; name:string}[]>([
    { id:'PROJECT_MANAGEMENT', name:'Project Management' },
    { id:'SITE_SUPERVISION', name:'Site Supervision' },
  ]);
  const [divisions, setDivisions] = useState<Division[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [system, setSystem] = useState<SystemId>('PROJECT_MANAGEMENT');
  const [divisionId, setDivisionId] = useState<number | ''>('');

  async function refresh(){
    const [d, l] = await Promise.all([
      fetch('/api/admin/divisions').then(r=>r.json()),
      fetch('/api/admin/lessons').then(r=>r.json()),
    ]);
    setDivisions(d);
    setLessons(l);
  }
  useEffect(()=>{ refresh(); },[]);

  async function createLesson(){
    const body:any = { title, system, slug };
    if(divisionId) body.divisionId = Number(divisionId);
    await fetch('/api/admin/lessons', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(body)});
    setTitle(''); setSlug(''); setDivisionId('');
    await refresh();
  }

  async function removeLesson(id:number){
    await fetch('/api/admin/lessons', { method:'DELETE', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ id })});
    await refresh();
  }

  return (
    <section className="card">
      <h3 className="section">Sections & Lessons</h3>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
        <div>
          <div className="label">Lesson Title</div>
          <input className="input full-width" value={title} onChange={e=>setTitle(e.target.value)} placeholder="e.g. RFIs & Submittals" />
        </div>
        <div>
          <div className="label">Slug</div>
          <input className="input full-width" value={slug} onChange={e=>setSlug(e.target.value)} placeholder="rfis-and-submittals" />
        </div>
        <div>
          <div className="label">System</div>
          <select className="input full-width" value={system} onChange={e=>setSystem(e.target.value as SystemId)}>
            {systems.map(s=> <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </div>
        <div>
          <div className="label">CSI Division (optional)</div>
          <select className="input full-width" value={divisionId} onChange={e=>setDivisionId(e.target.value ? Number(e.target.value) : '')}>
            <option value="">— None —</option>
            {divisions.map(d=> <option key={d.id} value={d.id}>{d.code} — {d.name}</option>)}
          </select>
        </div>
      </div>
      <div className="mt-3">
        <button className="btn" onClick={createLesson}><Icons.save className="w-4 h-4" /> Create Lesson</button>
      </div>

      <div className="mt-6">
        <table className="table">
          <thead><tr><th>Title</th><th>Slug</th><th>System</th><th>Division</th><th></th></tr></thead>
          <tbody>
            {lessons.map(l=> (
              <tr key={l.id}>
                <td>{l.title}</td>
                <td>{l.slug}</td>
                <td>{l.system === 'PROJECT_MANAGEMENT' ? 'Project Management' : 'Site Supervision'}</td>
                <td>{divisions.find(d=>d.id===l.divisionId)?.code ?? '—'}</td>
                <td><button className="btn-ghost" onClick={()=>removeLesson(l.id)}><Icons.trash className="w-4 h-4"/></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
