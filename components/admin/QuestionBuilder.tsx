'use client';
import { useEffect, useMemo, useState } from 'react';
import Icons from '@/components/Icons';

type Division = { id:number; csiCode:number; name:string };
type Lesson   = { id:number; title:string };
type Option = { text:string };
type Preview = { prompt:string; options: Option[]; correct:number; assetUrl?:string };

export default function QuestionBuilder(){
  const [divs, setDivs] = useState<Division[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [divisionId, setDivisionId] = useState<number | ''>('');
  const [lessonId, setLessonId] = useState<number | ''>('');

  const [prompt, setPrompt] = useState('');
  const [options, setOptions] = useState<Option[]>([{text:''},{text:''},{text:''},{text:''}]);
  const [correct, setCorrect] = useState(0);
  const [file, setFile] = useState<File | null>(null);
  const [assetUrl, setAssetUrl] = useState<string | undefined>(undefined);

  useEffect(()=>{ (async()=>{
    const r = await fetch('/api/admin/divisions'); setDivs(await r.json());
  })(); },[]);

  useEffect(()=>{
    (async()=>{
      if(divisionId===''){ setLessons([]); return; }
      const r = await fetch('/api/admin/questions?divisionId='+divisionId); const data = await r.json();
      setLessons(data.lessons ?? []);
    })();
  },[divisionId]);

  const preview: Preview = useMemo(()=>({ prompt, options, correct, assetUrl }), [prompt, options, correct, assetUrl]);

  async function upload(f: File){
    const form = new FormData(); form.append('file', f);
    const r = await fetch('/api/admin/standards/upload', { method:'POST', body:form });
    const data = await r.json(); setAssetUrl(data.url);
  }

  async function save(){
    if(!lessonId) return;
    await fetch('/api/admin/questions', {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ lessonId, prompt, options, correct, assetUrl })
    });
    setPrompt(''); setOptions([{text:''},{text:''},{text:''},{text:''}]); setCorrect(0); setFile(null); setAssetUrl(undefined);
  }

  return (
    <section className="card">
      <h3 className="section">Create Question (MCQ)</h3>
      <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:10}}>
        <div>
          <div className="label">Division</div>
          <select className="input full-width" value={divisionId} onChange={(e)=>setDivisionId(e.target.value===''?'':Number(e.target.value))}>
            <option value="">Select…</option>
            {divs.map(d=> <option key={d.id} value={d.id}>Division {String(d.csiCode).padStart(2,'0')} — {d.name}</option>)}
          </select>
        </div>
        <div>
          <div className="label">Lesson</div>
          <select className="input full-width" value={lessonId} onChange={(e)=>setLessonId(e.target.value===''?'':Number(e.target.value))}>
            <option value="">Select…</option>
            {lessons.map(l=> <option key={l.id} value={l.id}>{l.title}</option>)}
          </select>
        </div>
      </div>
      <div className="mt-4">
        <div className="label">Prompt</div>
        <textarea className="input full-width" rows={3} value={prompt} onChange={(e)=>setPrompt(e.target.value)} />
      </div>
      <div className="mt-4" style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:10}}>
        {options.map((o, i) => (
          <div key={i}>
            <div className="label">Choice {String.fromCharCode(65+i)}</div>
            <input className="input full-width" value={o.text} onChange={(e)=>{
              const next=[...options]; next[i]={text:e.target.value}; setOptions(next);
            }} />
            <label style={{display:'block', marginTop:6}}>
              <input type="radio" checked={correct===i} onChange={()=>setCorrect(i)} /> Correct answer
            </label>
          </div>
        ))}
      </div>
      <div className="mt-4">
        <div className="label">Optional image/PDF</div>
        <label className="btn-ghost" style={{padding:'6px 8px', borderRadius:'8px', cursor:'pointer'}}>
          Upload
          <input type="file" style={{display:'none'}} onChange={(e)=>{ const f=e.target.files?.[0]; if(f){ setFile(f); upload(f); } }} />
        </label>
        {assetUrl ? <span style={{marginLeft:10}}><a href={assetUrl} target="_blank">View asset</a></span> : null}
      </div>

      <div className="mt-4"><button className="btn" onClick={save}>Save Question</button></div>

      <div className="mt-4">
        <h4 className="section">Live Preview</h4>
        <div className="preview">
          <div className="mb-3">{preview.prompt || 'Your prompt will appear here.'}</div>
          {preview.assetUrl ? <div className="mb-3"><a href={preview.assetUrl} target="_blank">Attached asset</a></div> : null}
          <ol style={{paddingLeft:16}}>
            {preview.options.map((o,i)=> (
              <li key={i} style={{marginBottom:8}}>
                <label><input type="radio" disabled /> <span>{o.text || `Choice ${String.fromCharCode(65+i)}`}</span></label>
              </li>
            ))}
          </ol>
        </div>
      </div>

      <BulkCSV lessonId={lessonId||0} />
    </section>
  );
}

function BulkCSV({ lessonId }: { lessonId:number }){
  const [file, setFile] = useState<File | null>(null);
  async function importCsv(){
    if(!file || !lessonId) return;
    const text = await file.text();
    const rows = text.split(/\r?\n/).filter(Boolean);
    // header: prompt, A, B, C, D, correct(A-D), assetUrl(optional)
    for(const r of rows.slice(1)){
      const cols = r.split(',');
      const [prompt, A, B, C, D, correct, assetUrl] = cols;
      const body = { lessonId, prompt, options:[{text:A},{text:B},{text:C},{text:D}], correct: (correct||'A').toUpperCase().charCodeAt(0)-65, assetUrl };
      await fetch('/api/admin/questions', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(body) });
    }
    alert('Import complete');
  }
  return (
    <div className="card" style={{marginTop:16}}>
      <div className="flex items-center gap-2"><Icons.csv className="w-6 h-6" /> Bulk CSV Import</div>
      <div className="label">Columns: prompt, choiceA, choiceB, choiceC, choiceD, correct(A-D), assetUrl(optional)</div>
      <input type="file" accept=".csv" onChange={(e)=>setFile(e.target.files?.[0]??null)} />
      <div className="mt-4"><button className="btn" onClick={importCsv} disabled={!file || !lessonId}>Import</button></div>
    </div>
  );
}
