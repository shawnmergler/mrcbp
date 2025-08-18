'use client';
import { useEffect, useState } from 'react';

type Division = { id:number; csiCode:number; name:string };

export default function DivisionsEditor(){
  const [list, setList] = useState<Division[]>([]);
  const [csi, setCsi] = useState<number | ''>('');
  const [name, setName] = useState('');

  async function refresh(){
    const r = await fetch('/api/admin/divisions'); setList(await r.json());
  }
  useEffect(()=>{ refresh(); },[]);

  async function add(){
    if(!csi || !name) return;
    await fetch('/api/admin/divisions', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ csiCode: Number(csi), name }) });
    setCsi(''); setName(''); await refresh();
  }

  async function update(d:Division){
    await fetch('/api/admin/divisions', { method:'PUT', headers:{'Content-Type':'application/json'}, body: JSON.stringify(d) });
  }

  async function del(id:number){
    await fetch('/api/admin/divisions', { method:'DELETE', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ id }) });
    await refresh();
  }

  return (
    <section className="card">
      <h3 className="section">CSI Divisions</h3>
      <div style={{display:'grid', gridTemplateColumns:'120px 1fr 120px', gap:8}}>
        <input className="input" type="number" placeholder="Code" value={csi} onChange={(e)=>setCsi(e.target.value===''?'':Number(e.target.value))} />
        <input className="input" placeholder="Label" value={name} onChange={(e)=>setName(e.target.value)} />
        <button className="btn" onClick={add}>Add</button>
      </div>
      <div className="mt-4">
        <table className="table">
          <thead><tr><th width="90">Code</th><th>Label</th><th width="150"></th></tr></thead>
          <tbody>
            {list.map(d => (
              <tr key={d.id}>
                <td><input className="input" type="number" defaultValue={d.csiCode} onBlur={(e)=>update({...d, csiCode:Number(e.target.value)})} /></td>
                <td><input className="input full-width" defaultValue={d.name} onBlur={(e)=>update({...d, name:e.target.value})} /></td>
                <td><button className="btn-ghost" onClick={()=>del(d.id)}>Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
