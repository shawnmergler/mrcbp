import { prisma } from '@/lib/prisma';
import { createDivision, createLesson, createExercise } from './actions';

export default async function AdminPage() {
  const [divisions, roles, lessons] = await Promise.all([
    prisma.division.findMany({ orderBy: { csiCode: 'asc' } }),
    prisma.role.findMany({ orderBy: [{ system: 'asc' }, { level: 'asc' }] }),
    prisma.lesson.findMany({ orderBy: [{ system: 'asc' }, { title: 'asc' }] }),
  ]);

  const pmRoles = roles.filter(r => r.system === 'PROJECT_MANAGEMENT');
  const ssRoles = roles.filter(r => r.system === 'SITE_SUPERVISION');

  return (
    <div className="space-y-6">
      <div className="card">
        <h1 className="text-xl font-bold mb-2">Admin • Authoring</h1>
        <p className="text-gray-700">Create divisions, lessons, and exercises. Attach questions to lessons under Project Management or Site Supervision.</p>
      </div>

      {/* Create Division */}
      <div className="card">
        <h2 className="font-semibold mb-3">New Division</h2>
        <form action={createDivision} className="grid grid-cols-1 sm:grid-cols-4 gap-2 items-end">
          <label className="flex flex-col text-sm">
            <span className="mb-1">CSI Code</span>
            <input type="number" name="csiCode" className="input" placeholder="e.g., 1" required />
          </label>
          <label className="flex flex-col text-sm sm:col-span-2">
            <span className="mb-1">Name</span>
            <input type="text" name="name" className="input" placeholder="General Requirements" required />
          </label>
          <button className="btn btn-primary">Create Division</button>
        </form>
      </div>

      {/* Create Lesson */}
      <div className="card">
        <h2 className="font-semibold mb-3">New Lesson</h2>
        <form action={createLesson} className="grid grid-cols-1 sm:grid-cols-6 gap-2 items-end">
          <label className="flex flex-col text-sm">
            <span className="mb-1">Division</span>
            <select name="divisionId" className="input" required defaultValue="">
              <option value="" disabled>Select division</option>
              {divisions.map(d => (
                <option key={d.id} value={d.id}>Div {String(d.csiCode).padStart(2, '0')} • {d.name}</option>
              ))}
            </select>
          </label>

          <label className="flex flex-col text-sm">
            <span className="mb-1">System</span>
            <select name="system" className="input" required defaultValue="PROJECT_MANAGEMENT">
              <option value="PROJECT_MANAGEMENT">Project Management</option>
              <option value="SITE_SUPERVISION">Site Supervision</option>
            </select>
          </label>

          <label className="flex flex-col text-sm">
            <span className="mb-1">Role Level (optional)</span>
            <select name="roleLevel" className="input" defaultValue="">
              <option value="">No role</option>
              <optgroup label="PM">
                {pmRoles.map(r => (
                  <option key={r.id} value={r.level}>Lv{r.level} • {r.name}</option>
                ))}
              </optgroup>
              <optgroup label="Site">
                {ssRoles.map(r => (
                  <option key={r.id} value={r.level}>Lv{r.level} • {r.name}</option>
                ))}
              </optgroup>
            </select>
          </label>

          <label className="flex flex-col text-sm sm:col-span-2">
            <span className="mb-1">Title</span>
            <input type="text" name="title" className="input" placeholder="Budget Basics" required />
          </label>
          <label className="flex flex-col text-sm">
            <span className="mb-1">Slug</span>
            <input type="text" name="slug" className="input" placeholder="pm-budget-basics" required />
          </label>

          <button className="btn btn-primary sm:col-span-6">Create Lesson</button>
        </form>
      </div>

      {/* Create Exercise */}
      <div className="card">
        <h2 className="font-semibold mb-3">New Exercise (Question)</h2>
        <form action={createExercise} className="grid grid-cols-1 sm:grid-cols-6 gap-2 items-start">
          <label className="flex flex-col text-sm sm:col-span-2">
            <span className="mb-1">Lesson</span>
            <select name="lessonId" className="input" required defaultValue="">
              <option value="" disabled>Select lesson</option>
              {lessons.map(l => (
                <option key={l.id} value={l.id}>{l.system === 'PROJECT_MANAGEMENT' ? 'PM' : 'Site'} • {l.title}</option>
              ))}
            </select>
          </label>

          <label className="flex flex-col text-sm">
            <span className="mb-1">Type</span>
            <select name="type" className="input" required defaultValue="MCQ">
              <option value="MCQ">Multiple Choice (MCQ)</option>
              <option value="IMAGE_ID">Image-ID</option>
              <option value="ORDERING">Ordering</option>
              <option value="CALC">Unit/Calc</option>
              <option value="TERMS">Terms</option>
            </select>
          </label>

          <label className="flex flex-col text-sm sm:col-span-3">
            <span className="mb-1">Prompt</span>
            <input type="text" name="prompt" className="input" placeholder="Question text..." required />
          </label>

          <label className="flex flex-col text-sm sm:col-span-3">
            <span className="mb-1">Data (JSON)</span>
            <textarea name="data" className="input" rows={6} placeholder='{"choices":["A","B","C","D"]}' />
          </label>
          <label className="flex flex-col text-sm sm:col-span-3">
            <span className="mb-1">Answer (JSON)</span>
            <textarea name="answer" className="input" rows={6} placeholder='{"correctIndex":1}' />
          </label>

          <button className="btn btn-primary sm:col-span-6">Create Exercise</button>
        </form>
        <p className="text-xs text-gray-500 mt-2">
          Hints: MCQ → <code>{"{"}"choices": string[], "imageUrl"?: string{"}"}</code> &nbsp;•&nbsp;
          IMAGE_ID → <code>{"{"}"imageUrl": string, "hotspots": [{"{"}"id": "window-left", "x":0.3, "y":0.4{"}"}]{"}"}</code> &nbsp;•&nbsp;
          ORDERING → <code>{"{"}"steps": string[]{"}"}</code> &nbsp;•&nbsp;
          CALC → <code>{"{"}"unit":"ft","precision":2{"}"}</code> &nbsp;•&nbsp;
          TERMS → <code>{"{"}"terms":[{"{"}"term":"HSS","definition":"..."{"}"}]{"}"}</code>
        </p>
      </div>

      {/* Existing Lessons Quick-Add */}
      <div className="card">
        <h2 className="font-semibold mb-3">Lessons</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {lessons.map(l => (
            <div key={l.id} className="tile items-stretch">
              <div className="text-left w-full">
                <div className="text-sm font-semibold mb-1">{l.system === 'PROJECT_MANAGEMENT' ? 'PM' : 'Site'} • {l.title}</div>
                <form action={createExercise} className="grid grid-cols-1 gap-2">
                  <input type="hidden" name="lessonId" value={l.id} />
                  <div className="grid grid-cols-3 gap-2">
                    <select name="type" className="input text-[13px]" defaultValue="MCQ">
                      <option value="MCQ">MCQ</option>
                      <option value="IMAGE_ID">IMG</option>
                      <option value="ORDERING">Order</option>
                      <option value="CALC">Calc</option>
                      <option value="TERMS">Terms</option>
                    </select>
                    <input type="text" name="prompt" className="input col-span-2 text-[13px]" placeholder="Prompt..." required />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <textarea name="data" className="input text-[12px]" rows={3} placeholder='{"choices":["A","B","C"]}' />
                    <textarea name="answer" className="input text-[12px]" rows={3} placeholder='{"correctIndex":0}' />
                  </div>
                  <div><button className="btn btn-primary w-full text-sm">Add Question</button></div>
                </form>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
