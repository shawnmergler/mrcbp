import { prisma } from '@/lib/prisma';

export default async function StandardsPage() {
  const items = await prisma.standard.findMany({ orderBy: [{ createdAt: 'desc' }] });
  return (
    <div className="space-y-3">
      <div className="card">
        <h1 className="text-xl font-semibold mb-1">Standards</h1>
        <p className="text-gray-700">Company documents & references curated by admins.</p>
      </div>
      <div className="grid grid-cols-1 gap-2">
        {items.map(s => (
          <a key={s.id} href={s.url} target="_blank" rel="noreferrer" className="tile justify-start gap-3">
            <div className="text-left">
              <div className="font-medium">{s.title}</div>
              <div className="text-xs text-gray-600">{s.url} {s.category ? `• ${s.category}` : ''}</div>
            </div>
          </a>
        ))}
        {!items.length && <div className="card">No standards yet. Add some in Admin → Standards.</div>}
      </div>
    </div>
  );
}
