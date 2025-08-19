
'use client';
import React, { useEffect, useMemo, useState } from 'react';

type Division = { id:number; code:number; name:string };
type Lesson = { id:number; title:string; divisionId:number|null };
type Choice = { id?:number; text:string; isCorrect?:boolean };

const TYPES = [
  'MULTIPLE_CHOICE',
  'TRUE_FALSE',
  'FILL_IN_THE_BLANK',
  'ORDERING',
  'MATCHING_PAIRS',
  'HOTSPOT',
  'SHORT_ANSWER',
  'CLOZE',
  'SCALE',
  'CODING_CHALLENGE',
] as const;
type ExerciseType = typeof TYPES[number];

export default function QuestionBuilder(){
  const [divisions,setDivisions] = useState<Division[]>([]);
  const [lessons,setLessons] = useState<Lesson[]>([]);
  const [divisionId,setDivisionId] = useState<number | ''>('');
  const [lessonId,setLessonId] = useState<number | ''>('');
  const [type,setType] = useState<ExerciseType>('MULTIPLE_CHOICE');
  const [prompt,setPrompt] = useState('');
  const [explanation,setExplanation] = useState('');
  const [choices,setChoices] = useState<Choice[]>([{text:''},{text:''},{text:''},{text:''}]);

  // Advanced payload bits
  const [ordering,setOrdering] = useState<{text:string}[]>([{text:''},{text:''},{text:''}]);
  const [pairs,setPairs] = useState<{left:string; right:string}[]>([{left:'',right:''}]);
  const [blanks,setBlanks] = useState<{index:number; answer:string}[]>([{index:0, answer:''}]);
  const [scale,setScale] = useState<{label:string; value:number; isCorrect?:boolean}[]>([{label:'Low', value:1},{label:'High', value:5}]);
  const [coding,setCoding] = useState<{language:string; starter:string; tests:string}[]>([{language:'js', starter:'', tests:''}]);
  const [tf,setTF] = useState(true);

  const filteredLessons = useMemo(()=> lessons.filter(l => divisionId ? l.divisionId === divisionId : true), [lessons, divisionId]);

  async function load(){
    const d = await fetch('/api/admin/divisions').then(r=>r.json());
    setDivisions(d);
    const l = await fetch('/api/admin/lesson').then(r=>r.json());
    setLessons(l);
  }
  useEffect(()=>{load();},[]);

  function addChoice(){ setChoices(cs => [...cs, {text:''}]); }
  function setChoice(i:number, patch: Partial<Choice>){ setChoices(cs => cs.map((c,idx)=> idx===i? {...c, ...patch}: c)); }
  function toggleCorrect(i:number){ setChoices(cs => cs.map((c,idx)=> idx===i? {...c, isCorrect: !c.isCorrect }: c)); }
  function delChoice(i:number){ setChoices(cs => cs.filter((_,idx)=> idx!==i)); }

  async function submit(){
    const payload:any = {
      lessonId: lessonId || null,
      type,
      prompt,
      explanation
    };
    if(type==='MULTIPLE_CHOICE'){
      payload.choices = choices;
    }else if(type==='TRUE_FALSE'){
      payload.correct = !!tf;
    }else if(type==='ORDERING'){
      payload.ordering = ordering.map((o,i)=> ({...o, order:i}));
    }else if(type==='MATCHING_PAIRS'){
      payload.pairs = pairs;
    }else if(type==='SHORT_ANSWER'){
      payload.choices = choices.filter(c=>c.text.trim()).map(c=> ({ text:c.text, isCorrect:true }));
    }else if(type==='CLOZE'){
      payload.blanks = blanks;
    }else if(type==='SCALE'){
      payload.scale = scale;
    }else if(type==='CODING_CHALLENGE'){
      payload.codingTemplates = coding;
    }
    const res = await fetch('/api/admin/exercise', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload) });
    if(res.ok){
      setPrompt(''); setExplanation('');
      alert('Question saved');
    }else{
      const j = await res.json().catch(()=> ({} as any));
      alert('Failed: ' + (j.error || res.statusText));
    }
  }

  return (
    <section className="card">
      <h3 className="section">Question Builder</h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        <select className="input" value={divisionId} onChange={e=> setDivisionId(e.target.value ? parseInt(e.target.value,10): '')}>
          <option value="">All Sections</option>
          {divisions.map(d=> <option key={d.id} value={d.id}>Division {String(d.code).padStart(2,'0')} — {d.name}</option>)}
        </select>
        <select className="input" value={lessonId} onChange={e=> setLessonId(e.target.value ? parseInt(e.target.value,10): '')}>
          <option value="">Pick a lesson</option>
          {filteredLessons.map(l => <option key={l.id} value={l.id}>{l.title}</option>)}
        </select>
        <select className="input" value={type} onChange={e=> setType(e.target.value as ExerciseType)}>
          {TYPES.map(t=> <option key={t} value={t}>{t}</option>)}
        </select>
      </div>

      <div className="mt-3">
        <div className="label">Prompt</div>
        <textarea className="input full-width" rows={3} value={prompt} onChange={e=>setPrompt(e.target.value)} />
      </div>
      <div className="mt-2">
        <div className="label">Explanation (optional)</div>
        <textarea className="input full-width" rows={2} value={explanation} onChange={e=>setExplanation(e.target.value)} />
      </div>

      {type==='MULTIPLE_CHOICE' && (
        <div className="mt-3 space-y-2">
          {choices.map((c,i)=> (
            <div key={i} className="flex gap-2 items-center">
              <input className="input grow" placeholder={'Choice ' + (i+1)} value={c.text} onChange={e=> setChoice(i,{text:e.target.value})} />
              <label className="flex items-center gap-1 text-xs"><input type="checkbox" checked={!!c.isCorrect} onChange={()=>toggleCorrect(i)} /> Correct</label>
              <button className="btn-ghost" onClick={()=>delChoice(i)}>Delete</button>
            </div>
          ))}
          <button className="btn" onClick={addChoice}>Add Choice</button>
        </div>
      )}

      {type==='TRUE_FALSE' && (
        <div className="mt-3 flex gap-4 items-center">
          <label className="flex items-center gap-2"><input type="radio" name="tf" checked={tf===true} onChange={()=>setTF(true)} /> True</label>
          <label className="flex items-center gap-2"><input type="radio" name="tf" checked={tf===false} onChange={()=>setTF(false)} /> False</label>
        </div>
      )}

      {type==='ORDERING' && (
        <div className="mt-3 space-y-2">
          {ordering.map((o,i)=> (
            <div key={i} className="flex gap-2 items-center">
              <span className="text-xs w-6 text-center">{i+1}</span>
              <input className="input grow" value={o.text} onChange={e=> setOrdering(arr => arr.map((x,idx)=> idx===i? {...x, text:e.target.value}: x))} />
              <button className="btn-ghost" onClick={()=> setOrdering(arr => arr.filter((_,idx)=> idx!==i))}>Delete</button>
            </div>
          ))}
          <button className="btn" onClick={()=> setOrdering(arr => [...arr,{text:''}])}>Add Item</button>
        </div>
      )}

      {type==='MATCHING_PAIRS' && (
        <div className="mt-3 space-y-2">
          {pairs.map((p,i)=> (
            <div key={i} className="grid grid-cols-2 gap-2 items-center">
              <input className="input" placeholder="Left" value={p.left} onChange={e=> setPairs(arr => arr.map((x,idx)=> idx===i? {...x, left:e.target.value}: x))} />
              <input className="input" placeholder="Right" value={p.right} onChange={e=> setPairs(arr => arr.map((x,idx)=> idx===i? {...x, right:e.target.value}: x))} />
              <div className="col-span-2 text-right"><button className="btn-ghost" onClick={()=> setPairs(arr => arr.filter((_,idx)=> idx!==i))}>Delete</button></div>
            </div>
          ))}
          <button className="btn" onClick={()=> setPairs(arr => [...arr, {left:'',right:''}])}>Add Pair</button>
        </div>
      )}

      {type==='SHORT_ANSWER' && (
        <div className="mt-3">
          <div className="text-sm opacity-70 mb-1">Provide one or more acceptable answers</div>
          {choices.map((c,i)=> (
            <div key={i} className="flex gap-2 items-center">
              <input className="input grow" placeholder={'Answer ' + (i+1)} value={c.text} onChange={e=> setChoice(i,{text:e.target.value})} />
              <button className="btn-ghost" onClick={()=>delChoice(i)}>Delete</button>
            </div>
          ))}
          <button className="btn mt-2" onClick={addChoice}>Add Acceptable Answer</button>
        </div>
      )}

      {type==='CLOZE' && (
        <div className="mt-3 space-y-2">
          {blanks.map((b,i)=> (
            <div key={i} className="flex gap-2 items-center">
              <input className="input w-24" type="number" placeholder="Index" value={b.index} onChange={e=> setBlanks(arr => arr.map((x,idx)=> idx===i? {...x, index: Number(e.target.value)}: x))} />
              <input className="input grow" placeholder="Answer" value={b.answer} onChange={e=> setBlanks(arr => arr.map((x,idx)=> idx===i? {...x, answer:e.target.value}: x))} />
              <button className="btn-ghost" onClick={()=> setBlanks(arr => arr.filter((_,idx)=> idx!==i))}>Delete</button>
            </div>
          ))}
          <button className="btn" onClick={()=> setBlanks(arr => [...arr, {index:0, answer:''}])}>Add Blank</button>
        </div>
      )}

      {type==='SCALE' && (
        <div className="mt-3 space-y-2">
          {scale.map((s,i)=> (
            <div key={i} className="grid grid-cols-6 gap-2 items-center">
              <input className="input col-span-3" placeholder="Label" value={s.label} onChange={e=> setScale(arr => arr.map((x,idx)=> idx===i? {...x, label:e.target.value}: x))} />
              <input className="input col-span-2" type="number" placeholder="Value" value={s.value} onChange={e=> setScale(arr => arr.map((x,idx)=> idx===i? {...x, value:Number(e.target.value)}: x))} />
              <label className="text-xs col-span-1 flex items-center gap-1"><input type="checkbox" checked={!!s.isCorrect} onChange={e=> setScale(arr => arr.map((x,idx)=> idx===i? {...x, isCorrect: !x.isCorrect}: x))} /> Correct</label>
            </div>
          ))}
          <button className="btn" onClick={()=> setScale(arr => [...arr, {label:'', value:0}])}>Add Option</button>
        </div>
      )}

      {type==='CODING_CHALLENGE' && (
        <div className="mt-3 space-y-2">
          {coding.map((c,i)=> (
            <div key={i} className="space-y-1">
              <div className="flex gap-2 items-center">
                <input className="input w-28" placeholder="Language" value={c.language} onChange={e=> setCoding(arr => arr.map((x,idx)=> idx===i? {...x, language:e.target.value}: x))} />
                <button className="btn-ghost" onClick={()=> setCoding(arr => arr.filter((_,idx)=> idx!==i))}>Delete</button>
              </div>
              <textarea className="input full-width" rows={3} placeholder="Starter code" value={c.starter} onChange={e=> setCoding(arr => arr.map((x,idx)=> idx===i? {...x, starter:e.target.value}: x))} />
              <textarea className="input full-width" rows={3} placeholder="Tests (e.g. unit tests)" value={c.tests} onChange={e=> setCoding(arr => arr.map((x,idx)=> idx===i? {...x, tests:e.target.value}: x))} />
            </div>
          ))}
          <button className="btn" onClick={()=> setCoding(arr => [...arr, {language:'js', starter:'', tests:''}])}>Add Template</button>
        </div>
      )}

      <div className="mt-4"><button className="btn" onClick={submit}>Save Question</button></div>
    </section>
  );
}
