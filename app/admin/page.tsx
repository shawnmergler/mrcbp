import { prisma } from '@/lib/prisma';
import MCQForm from '@/components/admin/MCQForm';
import { createDivision, createLesson, createMCQ, updateMCQ, deleteExercise, importCSV, addStandard } from './actions';

export default async function AdminPage() {
  const [divisions, roles, lessons, exercises, standards] = await Promise.all([
    prisma.division.findMany({ orderBy: { csiCode: 'asc' } }),
    prisma.role.findMany({ orderBy: [{ system: 'asc' }, { level: 'asc' }] }),
    prisma.lesson.findMany({ orderBy: [{ system: 'asc' }, { title: 'asc' }] }),
    prisma.exercise.findMany({ orderBy: [{ lessonId: 'asc' }, { id: 'asc' }] }),
    prisma.standard.findMany({ orderBy: [{ createdAt: 'desc' }] }),
  ]);

  const pmRoles = roles.filter(r => r.system === 'PROJECT_MANAGEMENT');
  const ssRoles = roles.filter(r => r.system === 'SITE_SUPERVISION');

  return (
    <div className="space-y-6">
      <div className="card">
        <h1 className="text-xl font-bold mb-2">Admin • Authoring</h1>
        <p className="text-gray-700">Create divisions, lessons, and multiple-choice questions with 4 choices. Upload images/PDFs, bulk import CSV, manage standards, and edit existing content.</p>
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

      {/* New MCQ form with preview & drag-drop */}
      <div className="card">
        <h2 className="font-semibold mb-3">New Question (MCQ, 4 choices)</h2>
        <MCQForm lessons={lessons} action={createMCQ} />
      </div>

      {/* CSV import */}
      <div className="card">
        <h2 className="font-semibold mb-3">Bulk Import (CSV)</h2>
        <form action={importCSV} className="grid grid-cols-1 gap-2">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 items-end">
            <label className="flex flex-col text-sm">
              <span className="mb-1">Default Lesson (if CSV has no lessonId)</span>
              <select name="lessonId" className="input" defaultValue="">
                <option value="">-- none --</option>
                {lessons.map(l => (
                  <option key={l.id} value={l.id}>{l.system==='PROJECT_MANAGEMENT'?'PM':'Site'} • {l.title}</option>
                ))}
              </select>
            </label>
            <div className="sm:col-span-2 text-xs text-gray-600">
              Columns (header required): <code>prompt,choice1,choice2,choice3,choice4,correctIndex,lessonId?</code>
            </div>
          </div>
          <textarea name="csv" className="input" rows={5} placeholder='prompt,choice1,choice2,choice3,choice4,correctIndex,lessonId
What is the min slab thickness?,4",6",8",10",1,12
...' />
          <button className="btn btn-primary">Import CSV</button>
        </form>
      </div>

      {/* Standards Admin */}
      <div className="card">
        <h2 className="font-semibold mb-3">Standards</h2>
        <form action={addStandard} className="grid grid-cols-1 sm:grid-cols-6 gap-2 items-end mb-3">
          <label className="flex flex-col text-sm sm:col-span-2">
            <span className="mb-1">Title</span>
            <input type="text" name="title" className="input" placeholder="Quality Manual" required />
          </label>
          <label className="flex flex-col text-sm sm:col-span-2">
            <span className="mb-1">URL</span>
            <input type="url" name="url" className="input" placeholder="https://..." required />
          </label>
          <label className="flex flex-col text-sm">
            <span className="mb-1">Category</span>
            <input type="text" name="category" className="input" placeholder="Safety / Quality / Spec" />
          </label>
          <button className="btn btn-primary">Add</button>
        </form>
        <div className="space-y-1">
          {standards.map(s => (
            <div key={s.id} className="text-sm">{s.title} — <a className="link" href={s.url} target="_blank" rel="noreferrer">{s.url}</a> <span className="text-[11px] text-gray-500">[{s.category}]</span></div>
          ))}
        </div>
      </div>

      {/* Questions DB */}
      <div className="card">
        <h2 className="font-semibold mb-3">Questions Database</h2>
        <div className="space-y-4">
          {lessons.map(l => (
            <div key={l.id}>
              <div className="font-semibold mb-2">{l.system==='PROJECT_MANAGEMENT'?'PM':'Site'} • {l.title}</div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-separate border-spacing-y-2">
                  <thead>
                    <tr className="text-left text-xs text-gray-500">
                      <th className="px-2">ID</th>
                      <th className="px-2">Prompt</th>
                      <th className="px-2">Choices</th>
                      <th className="px-2">Correct</th>
                      <th className="px-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {exercises.filter(e=>e.lessonId===l.id).map(e => {
                      const data = (e.data as any) || {};
                      const choices = (data.choices as string[]) || [];
                      const correct = (e.answer as any)?.correctIndex ?? 0;
                      return (
                        <tr key={e.id}>
                          <td className="px-2 align-top">{e.id}</td>
                          <td className="px-2 align-top w-[30%]">
                            <form action={updateMCQ} className="space-y-1">
                              <input type="hidden" name="id" value={e.id} />
                              <input type="text" name="prompt" defaultValue={e.prompt} className="input w-full" />
                          </form></td>
                          <td className="px-2 align-top w-[40%]">
                            <form action={updateMCQ} className="grid grid-cols-2 gap-1">
                              <input type="hidden" name="id" value={e.id} />
                              <input type="text" name="choice1" defaultValue={choices[0]||''} className="input text-[12px]" />
                              <input type="text" name="choice2" defaultValue={choices[1]||''} className="input text-[12px]" />
                              <input type="text" name="choice3" defaultValue={choices[2]||''} className="input text-[12px]" />
                              <input type="text" name="choice4" defaultValue={choices[3]||''} className="input text-[12px]" />
                              <div className="col-span-2 flex items-center gap-2 text-xs">
                                Correct:
                                {[0,1,2,3].map(i => (
                                  <label key={i} className="flex items-center gap-1">
                                    <input type="radio" name="correctIndex" value={i} defaultChecked={i===correct} className="accent-blue-600" />
                                    {String.fromCharCode(65+i)}
                                  </label>
                                ))}
                              </div>
                              <div className="col-span-2"><button className="btn btn-primary btn-xs">Save</button></div>
                            </form>
                          </td>
                          <td className="px-2 align-top">{String.fromCharCode(65+correct)}</td>
                          <td className="px-2 align-top">
                            <form action={deleteExercise}>
                              <input type="hidden" name="id" value={e.id} />
                              <button className="btn btn-danger btn-xs">Delete</button>
                            </form>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
