import Link from "next/link";
import { prisma } from "@/lib/prisma";
import TrackCard from "@/components/TrackCard";
import IconTile from "@/components/IconTile";
import RoleBadge from "@/components/RoleBadge";
import { Icons } from "@/components/Icons";

export default async function HomePage() {
  const divisions = await prisma.division.findMany({ orderBy: { csiCode: "asc" }, include: { lessons: { include: { role: true } } } });
  return (
    <div className="space-y-8">
      <section className="card">
        <h1 className="text-2xl font-bold mb-1">Marmol-Radziner Construction BP</h1>
        <p className="text-gray-700">Luxury residential training with modern, on-site practicality.</p>
        <div className="grid-cards mt-4">
          <TrackCard title="Project Management" subtitle="Budgets • Contracts • Risk"
            href="/system/PROJECT_MANAGEMENT" gradient="linear-gradient(135deg, #1e3a8a, #0ea5e9)" icon="pm" />
          <TrackCard title="Site Supervision" subtitle="Field • Quality • Codes"
            href="/system/SITE_SUPERVISION" gradient="linear-gradient(135deg, #14532d, #10b981)" icon="site" />
          <div className="card">
            <h3 className="font-semibold mb-2">Quick Access</h3>
            <div className="icon-grid">
              <IconTile label="Continue PM" href="/system/PROJECT_MANAGEMENT" icon="pm" vtName="vt-pm" />
              <IconTile label="Continue Site" href="/system/SITE_SUPERVISION" icon="site" vtName="vt-site" />
              <IconTile label="Leaderboard" href="/leaderboard" icon="leaderboard" />
              <IconTile label="Admin" href="/admin" icon="admin" />
              <IconTile label="Install App" href="/install" icon="bolt" />\n          <IconTile label="OSHA" href="https://www.osha.gov/training" icon="osha" />\n          <IconTile label="Building Codes" href="https://codes.iccsafe.org/" icon="codes" />
              <IconTile label="Standards" href="/standards" icon="cap" />
            </div>
          </div>
        </div>
      </section>

      <section className="card">
        <h2 className="text-lg font-semibold mb-2">CSI Divisions</h2>
        <p className="text-sm text-gray-600 mb-4">Jump into fundamentals organized by MasterFormat.</p>
        <div className="grid-cards">
          {divisions.map((d) => (
            <div key={d.id} className="card">
              <div className="flex items-center gap-3 mb-3">
                <div className="iconwrap" style={{ background: 'rgba(17,24,39,.06)' }}>
                  <Icons.division className="w-6 h-6 text-gray-900" />
                </div>
                <div>
                  <div className="font-semibold">Division {String(d.csiCode).padStart(2, '0')}</div>
                  <div className="text-sm text-gray-600">{d.name}</div>
                </div>
                <span className="ml-auto badge">{d.lessons.length} lesson{d.lessons.length !== 1 ? 's' : ''}</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {d.lessons.map((l) => (
                  <Link key={l.id} href={`/lesson/${l.slug}`} className="tile">
                    <Icons.lesson className="w-6 h-6 text-gray-900" data-vt />
                    <div className="text-xs font-medium text-gray-900 text-center">{l.title}</div>
                    {l.role ? <RoleBadge system={l.system as any} level={l.role.level} name={l.role.name} /> : null}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
