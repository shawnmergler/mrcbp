'use client';
import { useEffect, useState } from 'react';

type Exercise = { id:number; prompt:string; lessonId:number };
type Group = { division:{ id:number; csiCode:number; name:string }, lessons: { id:number; title:string, exercises: Exercise[] }[] };

export default function QuestionDB(){
  const [groups, setGroups] = useState<Group[]>([]);
  async function refresh(){
    const r = await fetch('/api/admin/questions'); setGroups(await r.json());
  }
  useEffect(()=>{ refresh(); },[]);

  async function del(id:number){
    await fetch('/api/admin/questions', { method:'DELETE', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ id }) });
    await refresh();
  }

  return (
    <section className="card">
      <h3 className="section">Questions Database</h3>
      {groups.map(g=> (
        <details className="collapsible" key={g.division.id}>
          <summary>Division {String(g.division.csiCode).padStart(2,'0')} — {g.division.name}</summary>
          <div className="inner">
            {g.lessons.map(l => (
              <details key={l.id} className="collapsible" style={{marginTop:8}}>
                <summary>{l.title}</summary>
                <div className="inner">
                  {l.exercises.map(ex => (
                    <details key={ex.id} className="collapsible" style={{marginTop:8}}>
                      <summary>Q{ex.id}: {ex.prompt.slice(0, 80)}{ex.prompt.length>80?'…':''}</summary>
                      <div className="inner">
                        <div style={{whiteSpace:'pre-wrap'}}>{ex.prompt}</div>
                        <button className="btn-ghost" onClick={()=>del(ex.id)} style={{marginTop:10}}>Delete</button>
                      </div>
                    </details>
                  ))}
                </div>
              </details>
            ))}
          </div>
        </details>
      ))}
    </section>
  );
}
