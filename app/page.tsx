import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function HomePage() {
  const divisions = await prisma.division.findMany({ orderBy: { csiCode: "asc" }, include: { lessons: true } });
  return (
    <div className="space-y-8">
      <section className="card">
        <h1 className="text-2xl font-bold mb-2">Choose a Training System</h1>
        <p className="text-gray-600">Tailored for luxury residential quality and execution.</p>
        <div className="grid-cards mt-4">
          <Link href="/system/PROJECT_MANAGEMENT" className="card hover:shadow-md">
            <h3 className="font-semibold" style={{ viewTransitionName: "vt-pm" }}>Project Management</h3>
            <p className="text-sm text-gray-600 mt-1">Budgets, contracts, communication, risk, and quality oversight.</p>
          </Link>
          <Link href="/system/SITE_SUPERVISION" className="card hover:shadow-md">
            <h3 className="font-semibold" style={{ viewTransitionName: "vt-site" }}>Site Supervision</h3>
            <p className="text-sm text-gray-600 mt-1">Field best practices, review workflows, codes, inspections, and materials.</p>
          </Link>
        </div>
      </section>

      <section className="card">
        <h2 className="text-lg font-semibold mb-2">Foundations by CSI Division</h2>
        <p className="text-sm text-gray-600">Review fundamentals organized by CSI MasterFormat.</p>
        <div className="grid-cards mt-4">
          {divisions.map((d) => (
            <div key={d.id} className="card">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">Division {String(d.csiCode).padStart(2, '0')} – <span style={{ viewTransitionName: `div-${d.csiCode}` }}>{d.name}</span></h3>
                  <span className="badge mt-2">{d.lessons.length} lesson{d.lessons.length !== 1 ? 's' : ''}</span>
                </div>
              </div>
              <ul className="mt-4 space-y-2">
                {d.lessons.map(l => (
                  <li key={l.id} className="flex items-center justify-between">
                    <span style={{ viewTransitionName: `lesson-${l.slug}` }}>{l.title}</span>
                    <Link href={`/lesson/${l.slug}`} className="btn btn-primary">Open</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
