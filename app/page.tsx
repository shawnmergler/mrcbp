import Link from 'next/link';
import TrackCard from '@/components/TrackCard';
import Icons from '@/components/Icons';
import { prisma } from '@/lib/prisma';

export default async function HomePage(){
  const divisions = await prisma.division.findMany({ include: { lessons: true } });
  return (
    <div>
      <div className="grid-cards mt-4">
        <TrackCard title="Project Management" subtitle="Budgets • Contracts • Risk" href="/system/PROJECT_MANAGEMENT" gradient="linear-gradient(135deg, #1e3a8a, #0ea5e9)" icon="pm" />
        <TrackCard title="Site Supervision" subtitle="Field • Quality • Codes" href="/system/SITE_SUPERVISION" gradient="linear-gradient(135deg, #14532d, #10b981)" icon="site" />
      </div>
      <div className="section">Divisions</div>
      <div className="grid-cards">
        {divisions.map(d => (
          <div key={d.id} className="card">
            <div className="flex items-center gap-3 mb-3">
              <div className="iconwrap" style={{ background: 'rgba(17,24,39,.06)' }}>
                <Icons.division className="w-6 h-6 text-gray-900" />
              </div>
              <div>
                <div className="font-medium">Division {String(d.csiCode).padStart(2,'0')}</div>
                <div className="text-xs" style={{color:'#4b5563'}}>{d.name}</div>
              </div>
            </div>
            <div className="grid-cards">
              {d.lessons.map(l => (
                <Link key={l.id} href={`/lesson/${l.slug}`} className="tile">
                  <Icons.lesson className="w-6 h-6 text-gray-900" data-vt />
                  <div className="text-xs font-medium text-gray-900 text-center">{l.title}</div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
