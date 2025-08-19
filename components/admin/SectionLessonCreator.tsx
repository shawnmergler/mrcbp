
'use client';
import React, { useEffect, useState } from 'react';
import { Icons } from '@/components/Icons';

type Division = { id:number; code:number; name:string };
type Lesson = { id:number; title:string; slug:string; divisionId:number|null };

export default function SectionLessonCreator(){
  const [divisions,setDivisions] = useState<Division[]>([]);
  const [lessons,setLessons] = useState<Lesson[]>([]);
  const [newCode,setNewCode] = useState('');
  const [newName,setNewName] = useState('');
  const [selDiv,setSelDiv] = useState<number | ''>('');
  const [newLesson,setNewLesson] = useState('');

  async function load(){
    const d = await fetch('/api/admin/divisions').then(r=>r.json());
    setDivisions(d);
    const l = await fetch('/api/admin/lesson').then(r=>r.json());
    setLessons(l);
  }
  useEffect(()=>{load();},[]);

  async function addDivision(){
    const code = parseInt(newCode || '0',10);
    if(!code || !newName.trim()) return;
    await fetch('/api/admin/divisions', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ code, name:newName.trim() }) });
    setNewCode(''); setNewName('');
    await load();
  }

  async function delDivision(id:number){
    await fetch('/api/admin/divisions', { method:'DELETE', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ id })});
    await load();
  }

  async function addLesson(){
    if(!newLesson.trim()) return;
    await fetch('/api/admin/lesson', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ title:newLesson.trim(), divisionId: selDiv || null }) });
    setNewLesson(''); setSelDiv('');
    await load();
  }

  async function delLesson(id:number){
    await fetch('/api/admin/lesson', { method:'DELETE', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ id }) });
    await load();
  }

  return (
    <section className="card">
      <h3 className="section flex items-center gap-2"><Icons.division className="w-5 h-5" /> Sections & Lessons</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <div className="label mb-1">New Section (CSI Division)</div>
          <div className="flex gap-2">
            <input className="input" placeholder="Code e.g. 03" value={newCode} onChange={e=>setNewCode(e.target.value)} style={{width:100}} />
            <input className="input grow" placeholder="Name e.g. Concrete" value={newName} onChange={e=>setNewName(e.target.value)} />
            <button className="btn" onClick={addDivision}>Add</button>
          </div>
          <ul className="mt-3 space-y-2">
            {divisions.map(d=> (
              <li key={d.id} className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 rounded px-2 py-1">
                <div className="font-medium">Division {String(d.code).padStart(2,'0')} — {d.name}</div>
                <button className="btn-ghost" onClick={()=>delDivision(d.id)}>Delete</button>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <div className="label mb-1">New Lesson</div>
          <div className="flex gap-2">
            <select className="input" value={selDiv} onChange={e=> setSelDiv(e.target.value ? parseInt(e.target.value,10) : '')} style={{width:220}}>
              <option value="">No Section</option>
              {divisions.map(d=> <option key={d.id} value={d.id}>Division {String(d.code).padStart(2,'0')} — {d.name}</option>)}
            </select>
            <input className="input grow" placeholder="Lesson title" value={newLesson} onChange={e=>setNewLesson(e.target.value)} />
            <button className="btn" onClick={addLesson}>Add</button>
          </div>
          <ul className="mt-3 space-y-2">
            {lessons.map(l=> (
              <li key={l.id} className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 rounded px-2 py-1">
                <div>{l.title}</div>
                <button className="btn-ghost" onClick={()=>delLesson(l.id)}>Delete</button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
