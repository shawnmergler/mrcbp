'use client';
import { useEffect, useState } from 'react';

type Division = { id: number; csiCode: number; label: string };

export default function DivisionsEditor() {
  const [divs, setDivs] = useState<Division[]>([]);
  const [code, setCode] = useState<string>(''); // keep as string for input
  const [label, setLabel] = useState('');

  async function refresh() {
    const r = await fetch('/api/admin/divisions');
    if (r.ok) setDivs(await r.json());
  }
  useEffect(() => { refresh(); }, []);

  async function upsert() {
    await fetch('/api/admin/divisions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ csiCode: Number(code), label }),
    });
    setCode(''); setLabel(''); refresh();
  }

  async function remove(id: number) {
    await fetch('/api/admin/divisions', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    refresh();
  }

  return (
    <section className="card">
      <h3 className="section">CSI Divisions</h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-2">
        <input className="input" placeholder="CSI Code" value={code} onChange={(e) => setCode(e.target.value)} />
        <input className="input" placeholder="Label" value={label} onChange={(e) => setLabel(e.target.value)} />
        <button className="btn" onClick={upsert} disabled={!code || !label}>Add/Update</button>
      </div>
      <div className="mt-4 overflow-x-auto">
        <table className="table">
          <thead><tr><th>Code</th><th>Label</th><th></th></tr></thead>
          <tbody>
            {divs.map(d => (
              <tr key={d.id}>
                <td>{String(d.csiCode).padStart(2, '0')}</td>
                <td>{d.label}</td>
                <td><button className="btn-ghost" onClick={() => remove(d.id)}>Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

