import { prisma } from '@/lib/prisma';

export default async function LeaderboardPage() {
  const top = await prisma.user.findMany({
    orderBy: [{ xp: 'desc' }],
    take: 50,
    select: { id: true, displayName: true, xp: true, streak: true },
  });
  return (
    <div className="space-y-3">
      <div className="card">
        <h1 className="text-xl font-semibold mb-1">Leaderboard</h1>
        <p className="text-gray-700">Top learners by XP</p>
      </div>
      <div className="card p-0 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-white/60">
            <tr className="text-left text-xs text-gray-600">
              <th className="px-3 py-2">Rank</th>
              <th className="px-3 py-2">Name</th>
              <th className="px-3 py-2">XP</th>
              <th className="px-3 py-2">Streak</th>
            </tr>
          </thead>
          <tbody>
            {top.map((u, i) => (
              <tr key={u.id} className="odd:bg-white/40 even:bg-white/20">
                <td className="px-3 py-2">{i+1}</td>
                <td className="px-3 py-2">{u.displayName || 'Learner'}</td>
                <td className="px-3 py-2">{u.xp}</td>
                <td className="px-3 py-2">{u.streak}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
