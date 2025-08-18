// components/admin/StandardsManager.tsx
'use client';

import { useEffect, useState } from 'react';
import { Icons } from '@/components/Icons';

type Standard = { id: number; title: string; description?: string; url: string; mime?: string };

export default function StandardsManager() {
  const [list, setList] = useState<Standard[]>([]);
  const [drag, setDrag] = useState(false);
  const [progress, setProgress] = useState<number | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);

  async function refresh() {
    const r = await fetch('/api/admin/standards');
    if (r.ok) setList(await r.json());
  }
  useEffect(() => { refresh(); }, []);

  async function upload(f: File) {
    setProgress(0);
    const form = new FormData();
    form.append('file', f);

    const url = await new Promise<string>((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) setProgress(Math.round((e.loaded / e.total) * 100));
      };
      xhr.onload = () => {
        try { resolve(JSON.parse(xhr.responseText).url as string); }
        catch (e) { reject(e); }
      };
      xhr.onerror = reject;
      xhr.open('POST', '/api/admin/standards/upload');
      xhr.send(form);
    });

    setProgress(null);
    return url;
  }

  async function add() {
    let url = '';
    if (file) url = await upload(file);
    await fetch('/api/admin/standards', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description, url, mime: file?.type }),
    });
    setTitle(''); setDescription(''); setFile(null);
    refresh();
  }

  async function del(id: number) {
    await fetch('/api/admin/standards', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    refresh();
  }

  return (
    <section className="card">
      <h3 className="section">Standards</h3>

      <div
        className="dragger"
        onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => { e.preventDefault(); setDrag(false); const f = e.dataTransfer.files?.[0]; if (f) setFile(f); }}
        style={{ background: drag ? '#eef2ff' : 'transparent' }}
      >
        <div className="flex items-center gap-2" style={{ justifyContent: 'center' }}>
          <Icons.upload className="w-6 h-6" /> Drag & Drop a file here or
          <label className="btn-ghost" style={{ padding: '6px 8px', borderRadius: 8, cursor: 'pointer' }}>
            Choose File
            <input type="file" style={{ display: 'none' }} onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
          </label>
        </div>
        {file && <div className="mt-4">Selected: <strong>{file.name}</strong></div>}
        {progress != null && <div className="mt-4">Uploading… {progress}%</div>}
      </div>

      <div className="mt-4" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <div>
          <div className="label">Title</div>
          <input className="input full-width" value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div>
          <div className="label">Description</div>
          <input className="input full-width" value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>
      </div>

      <div className="mt-4"><button className="btn" onClick={add} disabled={!title || !file}>Add to Standards</button></div>

      <div className="mt-4 overflow-x-auto">
        <table className="table">
          <thead><tr><th>Title</th><th>Description</th><th>Link</th><th></th></tr></thead>
        <tbody>
          {list.map(s => (
            <tr key={s.id}>
              <td>{s.title}</td>
              <td>{s.description}</td>
              <td><a href={s.url} target="_blank" rel="noreferrer">Open</a></td>
              <td><button className="btn-ghost" onClick={() => del(s.id)}>Delete</button></td>
            </tr>
          ))}
        </tbody>
        </table>
      </div>
    </section>
  );
}
