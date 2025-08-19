// components/admin/QuestionBuilder.tsx
'use client';
import React, { useEffect, useState } from 'react';
import Icons from '@/components/Icons';

type SystemId = 'PROJECT_MANAGEMENT' | 'SITE_SUPERVISION';
type Lesson = { id:number; title:string; system:SystemId };

export default function QuestionBuilder(){
  const [sections, setSections] = useState<{id:SystemId; name:string}[]>([]);
  const [lessons, setLessons]   = useState<Lesson[]>([]);
  const [lessonId, setLessonId] = useState<number | ''>('');

  const [prompt, setPrompt] = useState('');
  const [choices, setChoices] = useState<string[]>(['','','','']);
  const [answer, setAnswer] = useState('A');

  useEffect(()=>{
    (async ()=>{
      const secs = await fetch('/api/admin/sections').then(r=>r.json());
      const ls = await fetch('/api/admin/lessons').then(r=>r.json());
      setSections(secs);
      setLessons(ls);
    })();
  },[]);

  async function create(){
    if(!lessonId) return;
    await fetch('/api/admin/questions', {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({
        lessonId: Number(lessonId),
        type: 'MULTIPLE_CHOICE',
        prompt,
        options: choices,
        answerKey: answer
      })
    });
    setPrompt(''); setChoices(['','','','']); setAnswer('A'); setLessonId('');
  }

  return (
    <section className="card">
      <h3 className="section">Create Questions</h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        <div className="md:col-span-2">
          <div className="label">Prompt</div>
          <textarea className="input w-full min-h-24" value={prompt} onChange={e=>setPrompt(e.target.value)} placeholder="Write the question stem here..." />
        </div>
        <div>
          <div className="label">Lesson</div>
          <select className="input w-full" value={lessonId} onChange={e=>setLessonId(e.target.value ? Number(e.target.value) : '')}>
            <option value="">— Choose Lesson —</option>
            {sections.map(sec => (
              <optgroup key={sec.id} label={sec.name}>
                {lessons.filter(l=>l.system===sec.id).map(l=> <option key={l.id} value={l.id}>{l.title}</option>)}
              </optgroup>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3">
        {choices.map((c, i)=> (
          <div key={i}>
            <div className="label">Choice {String.fromCharCode(65+i)}</div>
            <input className="input w-full" value={c} onChange={e=>{
              const n=[...choices]; n[i]=e.target.value; setChoices(n);
            }} />
          </div>
        ))}
      </div>

      <div className="mt-2">
        <div className="label">Correct Answer</div>
        <select className="input w-32" value={answer} onChange={e=>setAnswer(e.target.value)}>
          <option>A</option><option>B</option><option>C</option><option>D</option>
        </select>
      </div>

      <div className="mt-3">
        <button className="btn" onClick={create}><Icons.save className="w-4 h-4" /> Save Question</button>
      </div>
    </section>
  );
}
