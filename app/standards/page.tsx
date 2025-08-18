import { prisma } from '@/lib/prisma';

export default async function StandardsPage(){
  const list = await prisma.standard.findMany({ orderBy: { createdAt: 'desc' } });
  return (
    <div className="card">
      <h1 className="section">Company Standards</h1>
      <table className="table">
        <thead><tr><th>Title</th><th>Description</th><th>Link</th></tr></thead>
        <tbody>
          {list.map(s => (
            <tr key={s.id}>
              <td>{s.title}</td>
              <td>{s.description}</td>
              <td><a href={s.url} target="_blank">Open</a></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
