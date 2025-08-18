// components/admin/LeaderboardEditor.tsx
'use client';

import { useEffect, useState } from 'react';

type Entry = { id: number; name: string; score: number; streak?: number };

export default function LeaderboardEditor() {
  const [rows, setRows] = useState<Entry[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [name, setName] = useState('');
  const [score, setScore] = useState<string>('');
  const [streak, setStreak] = useState<string>('');

  async function refresh() {
    const r = await fetch('/api/admin/leaderboard');
    if (r.ok) setRows(await r.json());
  }
  useEffect(() => { refresh(); }, []);

  async function upsert() {
    await fetch('/api/admin/leaderboard', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: editingId ?? undefined,
        name,
        score: Number(score || 0),
        streak: Number(streak || 0),
      }),
    });
    setEditingId(null);
    setName(''); setScore(''); setStreak('');
    refresh();
  }

  async function remove(id: number) {
    await fetch('/api/admin/leaderboard', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    refresh();
  }

  function startEdit(e: Entry) {
    setEditingId(e.id);
    setName(e.name);
    setScore(String(e.score));
    setStreak(String(e.streak ?? 0));
  }

  return (
    <section className="card" id="leaderboard-editor">
      <h3 className="section">Leaderboard Editor</h3>

      <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 mt-2">
        <input className="input" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
        <input className="input" placeholder="Score" type="number" value={score}
               onChange={(e) => setScore(e.target.value)} />
        <input className="input" placeholder="Streak" type="number" value={streak}
               onChange={(e) => setStreak(e.target.value)} />
        <button className="btn" onClick={upsert} disabled={!name}>
          {editingId ? 'Update' : 'Add'}
        </button>
        {editingId && (
          <button
            type="button"
            className="btn-ghost"
            onClick={() => { setEditingId(null); setName(''); setScore(''); setStreak(''); }}
          >
            Cancel
          </button>
        )}
      </div>

      <div className="mt-4 overflow-x-auto">
        <table className="table">
          <thead>
            <tr><th>Name</th><th>Score</th><th>Streak</th><th></th></tr>
          </thead>
          <tbody>
            {rows.map(r => (
              <tr key={r.id}>
                <td>{r.name}</td>
                <td>{r.score}</td>
                <td>{r.streak ?? 0}</td>
                <td className="flex gap-2">
                  <button className="btn-ghost" onClick={() => startEdit(r)}>Edit</button>
                  <button className="btn-ghost" o
