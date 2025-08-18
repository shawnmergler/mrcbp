'use client';
import { useEffect, useMemo, useState } from 'react';

type Choice = { id: 'A' | 'B' | 'C' | 'D'; text: string; correct: boolean };
type Section = { id: number; title: string };
type Lesson = { id: number; title: string };

export default function QuestionBuilder() {
  const [prompt, setPrompt] = useState('');
  const [choices, setChoices] = useState<Choice[]>([
    { id: 'A', text: '', correct: false },
    { id: 'B', text: '', correct: false },
    { id: 'C', text: '', correct: false },
    { id: 'D', text: '', correct: false },
  ]);
  const [sectionId, setSectionId] = useState<number | ''>('');
  const [lessonId, setLessonId] = useState<number | ''>('');
  const [sections, setSections] = useState<Section[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const correct = useMemo(() => choices.find(c => c.correct)?.id ?? null, [choices]);

  useEffect(() => {
    (async () => {
      const s = await fetch('/api/admin/sections'); if (s.ok) setSections(await s.json());
      const l = await fetch('/api/admin/lessons');  if (l.ok) setLessons(await l.json());
    })();
  }, []);

  function setChoice(id: Choice['id'], text: string) { setChoices(cs => cs.map(c => c.id === id ? { ...c, text } : c)); }
  function setCorrect(id: Choice['id']) { setChoices(cs => cs.map(c => ({ ...c, correct: c.id === id }))); }

  async function save() {
    let mediaUrl = '';
    if (file) {
      const form = new FormData(); form.append('file', file);
      const r = await fetch('/api/admin/questions/upload', { method: 'POST', body: form });
      if (r.ok) mediaUrl = (await r.json()).url;
    }
    await fetch('/api/admin/questions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt,
        choices: choices.map(c => ({ label: c.id, text: c.text, correct: c.correct })),
        sectionId, lessonId, mediaUrl
      }),
    });
    setPrompt(''); setChoices(choices.map(c => ({ ...c, text: '', correct: false }))); setFile(null);
  }

  return (
    <section className="card">
      <h3 className="section">Create Question</h3>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <div className="label">Prompt</div>
          <textarea className="input full-width" rows={4} value={prompt} onChange={(e) => setPrompt(e.target.value)} />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
            {choices.map(c => (
              <div key={c.id} className="flex items-center gap-2">
                <input type="radio" name="correct" checked={c.correct} onChange={() => setCorrect(c.id)} />
                <input className="input w-full" placeholder={`Choice ${c.id}`} value={c.text}
                       onChange={(e) => setChoice(c.id, e.target.value)} />
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-3">
            <select className="input" value={sectionId as any} onChange={(e) => setSectionId(e.target.value ? Number(e.target.value) : '')}>
              <option value="">Select section</option>
              {sections.map(s => <option key={s.id} value={s.id}>{s.title}</option>)}
            </select>
            <select className="input" value={lessonId as any} onChange={(e) => setLessonId(e.target.value ? Number(e.target.value) : '')}>
              <option value="">Assign to lesson</option>
              {lessons.map(l => <option key={l.id} value={l.id}>{l.title}</option>)}
            </select>
            <label className="btn-ghost" style={{ padding: '6px 8px', borderRadius: 8, cursor: 'pointer', textAlign: 'center' }}>
              Attach file
              <input type="file" accept="image/*,application/pdf" style={{ display: 'none' }}
                     onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
            </label>
          </div>
          <div className="mt-3"><button className="btn" onClick={save} disabled={!prompt || !correct}>Save Question</button></div>
        </div>

        {/* Preview */}
        <div className="rounded-lg border p-4 bg-white">
          <div className="text-xs uppercase font-semibold text-gray-500 mb-2">Preview</div>
          <div className="font-medium mb-3">{prompt || 'Your question will appear here…'}</div>
          <ul className="space-y-2">
            {choices.map(c => (
              <li key={c.id} className={`p-2 rounded border ${c.correct ? 'border-green-500' : 'border-gray-200'}`}>
                {c.id}. {c.text || <span className="text-gray-400">Choice {c.id}</span>}
              </li>
            ))}
          </ul>
          {file && <div className="mt-3 text-sm truncate">Attached: {file.name}</div>}
        </div>
      </div>
    </section>
  );
}
