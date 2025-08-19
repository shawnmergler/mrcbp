// components/admin/DivisionsEditor.tsx
'use client';
import React, { useEffect, useState } from 'react';
import Icons from '@/components/Icons';

type Division = { id:number; code:string; name:string };

export default function DivisionsEditor(){
  const [list, setList] = useState<Division[]>([]);
  const [code, setCode] = useState('');
  const [name, setName] = useState('');

  async function refresh(){
    const r = await fetch('/api/admin/divisions'); setList(await r.json());
  }
  useEffect(()=>{ refresh(); },[]);

  async function addOrUpdate(){
    const existing = list.find(d=>d.code.toUpperCase()===code.toUpperCase());
    if(existing){
      await fetch('/api/admin/divisions', { method:'PUT', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ id: existing.id, code, name }) });
    }else{
      await fetch('/api/admin/divisions', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ code, name }) });
    }
    setCode(''); setName(''); await refresh();
  }

  async function del(id:number){
    await fetch('/api/admin/divisions', { method:'DELETE', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ id }) });
    await refresh();
  }

  return (
    <section className="card">
      <h3 className="section">CSI Divisions</h3>
      <form className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-2" onSubmit={e=>{e.preventDefault(); addOrUpdate();}}>
        <input className="input" placeholder="CSI Code (e.g., 01)" value={code} onChange={e=>setCode(e.target.value)} />
        <input className="input" placeholder="Label" value={name} onChange={e=>setName(e.target.value)} />
        <button className="btn" type="submit"><Icons.save className="w-4 h-4" /> Add/Update</button>
      </form>

      <div className="mt-4">
        <table className="table">
          <thead><tr><th>Code</th><th>Label</th><th></th></tr></thead>
          <tbody>
            {list.map(d=> (
              <tr key={d.id}>
                <td>{d.code}</td>
                <td>{d.name}</td>
                <td><button className="btn-ghost" onClick={()=>del(d.id)}><Icons.trash className="w-4 h-4" /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
