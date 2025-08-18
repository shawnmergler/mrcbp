'use client';
import { useEffect, useState } from 'react';

type Row = { id:string; displayName:string|null; xp:number; streak:number };

export default function LeaderboardEditor(){
  const [rows, setRows] = useState<Row[]>([]);

  async function refresh(){
    const r = await fetch('/api/admin/leaderboard'); setRows(await r.json());
  }
  useEffect(()=>{ refresh(); },[]);

  async function save(row: Row){
    await fetch('/api/admin/leaderboard', { method:'PUT', headers:{'Content-Type':'application/json'}, body: JSON.stringify(row) });
  }

  async function del(id: string){
    await fetch('/api/admin/leaderboard', { method:'DELETE', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ id }) });
    await refresh();
  }

  return (
    <section className="card">
      <h3 className="section">Leaderboard (Admin)</h3>
      <table className="table">
        <thead><tr><th>User ID</th><th>Name</th><th>XP</th><th>Streak</th><th width="120"></th></tr></thead>
        <tbody>
          {rows.map(r => (
            <tr key={r.id}>
              <td>{r.id}</td>
              <td><input className="input" defaultValue={r.displayName ?? ''} onBlur={(e)=>save({...r, displayName:e.target.value})} /></td>
              <td><input className="input" type="number" defaultValue={r.xp} onBlur={(e)=>save({...r, xp:Number(e.target.value)})} /></td>
              <td><input className="input" type="number" defaultValue={r.streak} onBlur={(e)=>save({...r, streak:Number(e.target.value)})} /></td>
              <td><button className="btn-ghost" onClick={()=>del(r.id)}>Delete</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
