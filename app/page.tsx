import Link from 'next/link';

type SearchParams = {
  [key: string]: string | string[] | undefined;
};

function first(q: string | string[] | undefined) {
  return Array.isArray(q) ? q[0] : q;
}

export default function Home({
  searchParams,
}: {
  searchParams?: SearchParams;
}) {
  const badTry = first(searchParams?.adminError) === '1';

  return (
    <main className="container mx-auto p-4">
      {/* Friendly banner shown after an incorrect Admin login */}
      {badTry && (
        <div
          role="status"
          className="mb-4 rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
        >
          Admin sign-in failed. Click{' '}
          <Link href="/admin/login" className="underline">
            Admin
          </Link>{' '}
          to try again.
        </div>
      )}

      {/* --- Your existing homepage content goes below this line --- */}
      {/* If you already have content here, keep it; this block is a safe placeholder. */}
      <section className="card mb-6">
        <h1 className="text-xl font-semibold">Welcome</h1>
        <p className="text-sm text-gray-600">
          Use the quick links below to jump into training and resources.
        </p>
      </section>

      {/* Quick Access (example) */}
      <nav
        aria-label="Quick Access"
        className="card w-full mb-6 p-4 grid gap-3 sm:grid-cols-2 md:grid-cols-3"
      >
        <Link href="/lesson" className="btn">
          Lessons
        </Link>
        <Link href="/questions" className="btn">
          Practice Questions
        </Link>
        <Link href="/standards" className="btn">
          Standards
        </Link>
        <a
          href="https://www.osha.gov/training"
          target="_blank"
          rel="noreferrer"
          className="btn"
        >
          OSHA Safety Training
        </a>
        <a
          href="https://codes.iccsafe.org/"
          target="_blank"
          rel="noreferrer"
          className="btn"
        >
          Building Codes (ICC)
        </a>
        <Link href="/leaderboard" className="btn">
          Leaderboard
        </Link>
      </nav>

      {/* Placeholder main grid */}
      <section className="grid gap-4 sm:grid-cols-2">
        <div className="card p-4">
          <h2 className="font-semibold mb-2">Project Management</h2>
          <p className="text-sm text-gray-600">
            Budgets • Contracts • Risk • Scheduling
          </p>
        </div>
        <div className="card p-4">
          <h2 className="font-semibold mb-2">Site Supervision</h2>
          <p className="text-sm text-gray-600">
            Field • Quality • Codes • Safety
          </p>
        </div>
      </section>
      {/* --- End placeholder content --- */}
    </main>
  );
}
