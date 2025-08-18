'use client';
import { useState, useMemo } from 'react';

type Lesson = { id: number; title: string; system: 'PROJECT_MANAGEMENT' | 'SITE_SUPERVISION' };

export default function MCQForm({
  lessons,
  action,
}: {
  lessons: Lesson[];
  action: (fd: FormData) => void;
}) {
  const [lessonId, setLessonId] = useState<string>('');
  const [prompt, setPrompt] = useState('');
  const [choices, setChoices] = useState(['', '', '', '']);
  const [correctIndex, setCorrectIndex] = useState(0);
  const [dragOver, setDragOver] = useState(false);
  const [uploadName, setUploadName] = useState<string | null>(null);
  const [uploadType, setUploadType] = useState<string | null>(null);
  const [uploadB64, setUploadB64] = useState<string | null>(null);
  const [progress, setProgress] = useState<number>(0);

  function onChoice(i: number, v: string) {
    const next = choices.slice();
    next[i] = v;
    setChoices(next);
  }

  async function handleFile(file: File) {
    setUploadName(file.name);
    setUploadType(file.type || 'application/octet-stream');
    setProgress(0);
    const reader = new FileReader();
    reader.onprogress = (e) => {
      if (e.lengthComputable) {
        setProgress(Math.round((e.loaded / e.total) * 100));
      }
    };
    reader.onload = () => {
      const base64 = (reader.result as string).split(',')[1];
      setUploadB64(base64);
      setProgress(100);
    };
    reader.readAsDataURL(file);
  }

  function onDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  }

  const canSubmit = useMemo(() => {
    return lessonId && prompt.trim() && choices.every(c => c.trim().length > 0);
  }, [lessonId, prompt, choices]);

  return (
    <form action={action} className="grid grid-cols-1 gap-3">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        <label className="flex flex-col text-sm">
          <span className="mb-1">Lesson</span>
          <select name="lessonId" className="input" required value={lessonId} onChange={e=>setLessonId(e.target.value)}>
            <option value="" disabled>Select lesson</option>
            {lessons.map(l => (
              <option key={l.id} value={l.id}>{l.system === 'PROJECT_MANAGEMENT' ? 'PM' : 'Site'} • {l.title}</option>
            ))}
          </select>
        </label>
        <label className="flex flex-col text-sm sm:col-span-2">
          <span className="mb-1">Prompt</span>
          <input type="text" name="prompt" className="input" placeholder="Question text..." value={prompt} onChange={e=>setPrompt(e.target.value)} required />
        </label>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {/* Left: inputs */}
        <div className="grid grid-cols-1 gap-2">
          {[0,1,2,3].map(i => (
            <div key={i} className="flex items-center gap-2">
              <input type="radio" name="correctIndex" value={i} checked={correctIndex===i} onChange={()=>setCorrectIndex(i)} className="accent-blue-600" />
              <input type="text" name={`choice${i+1}`} className="input w-full" placeholder={`Choice ${String.fromCharCode(65+i)}`} value={choices[i]} onChange={e=>onChoice(i, e.target.value)} required />
            </div>
          ))}

          <div
            className={"rounded-xl border border-[rgba(17,24,39,0.12)] bg-white/80 p-3 text-sm " + (dragOver ? "ring-2 ring-blue-500" : "")}
            onDragOver={(e)=>{ e.preventDefault(); setDragOver(true); }}
            onDragLeave={()=>setDragOver(false)}
            onDrop={onDrop}
          >
            <div className="font-medium mb-1">Attachment (optional)</div>
            <input type="file" accept="image/*,application/pdf" onChange={(e)=>{ const f=e.target.files?.[0]; if (f) handleFile(f);} } />
            {uploadName ? (
              <div className="mt-2 text-xs text-gray-600">
                {uploadName} • {uploadType} • {progress}%
              </div>
            ) : (
              <div className="text-xs text-gray-500">Drag & drop an image/PDF here or use the file picker.</div>
            )}
            {/* Hidden fields for server action */}
            <input type="hidden" name="attachment_name" value={uploadName ?? ''} />
            <input type="hidden" name="attachment_type" value={uploadType ?? ''} />
            <input type="hidden" name="attachment_b64" value={uploadB64 ?? ''} />
          </div>

          <div>
            <button className="btn btn-primary" disabled={!canSubmit}>Create Question</button>
          </div>
        </div>

        {/* Right: tiny preview */}
        <div className="rounded-xl border border-[rgba(17,24,39,0.12)] bg-white/80 p-3">
          <div className="text-sm font-semibold mb-2">Preview</div>
          <div className="rounded-lg bg-white/70 p-3">
            <div className="font-medium mb-2">{prompt || 'Question prompt...'}</div>
            <div className="space-y-1">
              {choices.map((c, i) => (
                <div key={i} className={"rounded-md px-2 py-1 text-sm border " + (i===correctIndex ? "border-green-500 bg-green-50" : "border-gray-200 bg-gray-50")}>
                  {String.fromCharCode(65+i)}. {c || `Choice ${String.fromCharCode(65+i)}`}
                </div>
              ))}
            </div>
            {uploadB64 && uploadType?.startsWith('image/') && (
              <img src={`data:${uploadType};base64,${uploadB64}`} alt="Attachment preview" className="mt-2 max-h-32 rounded" />
            )}
            {uploadB64 && uploadType==='application/pdf' && (
              <div className="mt-2 text-xs text-gray-600">PDF attached: {uploadName}</div>
            )}
          </div>
        </div>
      </div>
    </form>
  );
}
