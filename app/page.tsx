// app/page.tsx
import Link from 'next/link';
import Icons from '@/components/Icons';
import QuickAccess from '@/components/QuickAccess';

export default function HomePage() {
  return (
    <div className="space-y-6 pb-24">
      {/* Friendly banner */}
      <div className="rounded-xl p-4 md:p-6 bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow">
        <h1 className="text-xl md:text-2xl font-semibold">Welcome to the MR Construction BP</h1>
        <p className="opacity-90 mt-1">
          Dive into lessons, browse standards, and keep your crews sharp.
        </p>
      </div>

      {/* Big tiles */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Link href="/system/PROJECT_MANAGEMENT" className="tile">
          <Icons.pm className="w-6 h-6 text-gray-900" aria-hidden />
          <div className="text-xs font-medium text-gray-900 text-center">Project Management</div>
        </Link>

        <Link href="/system/SITE_SUPERVISION" className="tile">
          <Icons.site className="w-6 h-6 text-gray-900" aria-hidden />
          <div className="text-xs font-medium text-gray-900 text-center">Site Supervision</div>
        </Link>

        <Link href="/standards" className="tile">
          <Icons.standards className="w-6 h-6 text-gray-900" aria-hidden />
          <div className="text-xs font-medium text-gray-900 text-center">Standards</div>
        </Link>

        <Link href="/leaderboard" className="tile">
          <Icons.trophy className="w-6 h-6 text-gray-900" aria-hidden />
          <div className="text-xs font-medium text-gray-900 text-center">Leaderboard</div>
        </Link>
      </div>

      {/* Quick Access */}
      <QuickAccess />
    </div>
  );
}
