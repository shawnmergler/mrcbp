// components/admin/QuestionDB.tsx
'use client';
import React, { useEffect, useMemo, useState } from 'react';
import Icons from '@/components/Icons';

type SystemId = 'PROJECT_MANAGEMENT' | 'SITE_SUPERVISION';
type Lesson = { id:number; title:string; system:SystemId };
type Question = {
  id:number;
  lessonId:number;
  type:'MULTIPLE_CHOICE'|'TRUE_FALSE'|'TEXT';
  prompt:string;
  optionsJson?:string|null;
  answerKey?:string|null;
};

type LessonWithQs = Lesson & { questions: Question[] };

export default function QuestionDB(){
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [open, setOpen] = useState<Record<number, boolean>>({});

  async function refresh(){
    const [ls, qs] = await Promise.all([
      fetch('/api/admin/lessons').then(r=>r.json()),
      fetch('/api/admin/questions').then(r=>r.json()),
    ]);
    setLessons(ls);
    setQuestions(qs);
  }
  useEffect(()=>{ refresh(); },[]);

  const grouped: Record<SystemId, LessonWithQs[]> = useMemo(()=>{
    const byLesson: Record<number, Question[]> = {};
    for(const q of questions){
      byLesson[q.lessonId] = byLesson[q.lessonId] || [];
      byLesson[q.lessonId].push(q);
    }
    const res: Record<SystemId, LessonWithQs[]> = { PROJECT_MANAGEMENT: [], SITE_SUPERVISION: [] };
    for(const l of lessons){
      res[l.system].push({...l, questions: byLesson[l.id] || []})
    }
    res.PROJECT_MANAGEMENT.sort((a,b)=> a.title.localeCompare(b.title));
    res.SITE_SUPERVISION.sort((a,b)=> a.title.localeCompare(b.title));
    return res;
  }, [lessons, questions]);

  function OptionEditor({q}:{q:Question}){
    const [prompt, setPrompt] = useState(q.prompt);
    const [opts, setOpts]   = useState<string[]>(()=>{
      try{ return q.optionsJson ? JSON.parse(q.optionsJson) : ["","","",""]; }catch{ return ["","","",""]; }
    });
    const [answer, setAnswer] = useState(q.answerKey ?? '');

    async function save(){
      await fetch('/api/admin/questions', { method:'PUT', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ id:q.id, prompt, options:opts, answerKey:answer })});
    }
    async function remove(){
      await fetch('/api/admin/questions', { method:'DELETE', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ id:q.id })});
      await refresh();
    }

    return (
      <div className="p-3 rounded border bg-gray-50 mt-2">
        <div className="label">Prompt</div>
        <textarea className="input w-full min-h-16" value={prompt} onChange={e=>setPrompt(e.target.value)} />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
          {opts.map((o,i)=>(
            <div key={i}>
              <div className="label">Choice {String.fromCharCode(65+i)}</div>
              <input className="input w-full" value={o} onChange={e=>{
                const n=[...opts]; n[i]=e.target.value; setOpts(n);
              }} />
            </div>
          ))}
        </div>
        <div className="mt-2">
          <div className="label">Answer (A/B/C/D)</div>
          <input className="input w-24" value={answer ?? ''} onChange={e=>setAnswer(e.target.value.toUpperCase())} />
        </div>
        <div className="mt-3 flex gap-2">
          <button className="btn" onClick={save}><Icons.save className="w-4 h-4" /> Save</button>
          <button className="btn-ghost" onClick={remove}><Icons.trash className="w-4 h-4" /> Delete</button>
        </div>
      </div>
    );
  }

  function LessonBlock({l}:{l:LessonWithQs}){
    const expanded = !!open[l.id];
    return (
      <div className="border rounded mb-3">
        <button className="w-full text-left p-3 font-medium bg-white hover:bg-gray-50 rounded flex items-center justify-between"
          onClick={()=> setOpen({...open, [l.id]: !expanded})}>
          <span className="flex items-center gap-2"><Icons.lesson className="w-4 h-4" /> {l.title}</span>
          <span className="text-xs text-gray-500">{expanded ? 'Collapse' : `${l.questions.length} question${l.questions.length===1?'':'s'}`}</span>
        </button>
        {expanded && (
          <div className="p-3 bg-white">
            {l.questions.length === 0 ? <div className="text-sm text-gray-500">No questions yet.</div> : null}
            {l.questions.map(q => <OptionEditor key={q.id} q={q} />)}
          </div>
        )}
      </div>
    );
  }

  return (
    <section className="card">
      <h3 className="section">Questions Database</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 className="font-semibold mb-2">Project Management</h4>
          {grouped.PROJECT_MANAGEMENT.map(l => <LessonBlock key={l.id} l={l} />)}
        </div>
        <div>
          <h4 className="font-semibold mb-2">Site Supervision</h4>
          {grouped.SITE_SUPERVISION.map(l => <LessonBlock key={l.id} l={l} />)}
        </div>
      </div>
    </section>
  );
}
