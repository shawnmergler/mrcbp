import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { Icons } from '@/components/Icons';

export default async function SystemPage({ params }: { params: { system: 'PROJECT_MANAGEMENT' | 'SITE_SUPERVISION' } }) {
  const lessons = await prisma.lesson.findMany({ where: { system: params.system } });
  return (
    <div className="card">
      <h1 className="text-xl font-bold mb-2">{params.system.replace('_',' ')}</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {lessons.map((l) => (
          <Link key={l.id} href={`/lesson/${l.slug}`} className="tile">
            <Icons.lesson className="w-6 h-6 text-gray-900" />
            <div className="text-xs font-medium text-gray-900">{l.title}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
