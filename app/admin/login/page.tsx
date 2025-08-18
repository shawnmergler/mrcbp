// app/admin/login/page.tsx
export default function AdminLoginPage({
  searchParams,
}: {
  searchParams?: { next?: string; error?: string };
}) {
  const next = searchParams?.next ?? '/admin';

  return (
    <div className="container max-w-md mx-auto p-6">
      <div className="card p-6">
        <h1 className="text-xl font-semibold mb-4">Admin Login</h1>
        {searchParams?.error === '1' && (
          <div className="mb-4 p-3 rounded bg-red-50 text-red-700">
            Incorrect credentials. Try again.
          </div>
        )}
        <form method="POST" action="/admin/login">
          <input type="hidden" name="next" value={next} />
          <div className="mb-3">
            <label className="label">Username</label>
            <input name="username" className="input full-width" autoComplete="username" />
          </div>
          <div className="mb-4">
            <label className="label">Password</label>
            <input
              name="password"
              type="password"
              className="input full-width"
              autoComplete="current-password"
            />
          </div>
          <button className="btn w-full" type="submit">Sign in</button>
        </form>
      </div>
    </div>
  );
}
