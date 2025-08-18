// app/admin/login/page.tsx
import Link from 'next/link';
import { loginAction } from './actions';

export default function AdminLoginPage() {
  return (
    <main className="container mx-auto p-4">
      <section className="card max-w-md mx-auto">
        <h1 className="text-xl font-semibold mb-1">Admin Sign In</h1>
        <p className="text-sm text-gray-600 mb-4">
          Enter your admin credentials to continue.
        </p>

        <form action={loginAction} className="grid gap-3">
          <label className="grid gap-1">
            <span className="label">Username</span>
            <input
              name="username"
              className="input"
              autoComplete="username"
              required
            />
          </label>

          <label className="grid gap-1">
            <span className="label">Password</span>
            <input
              name="password"
              type="password"
              className="input"
              autoComplete="current-password"
              required
            />
          </label>

          <button type="submit" className="btn">Sign in</button>
        </form>

        <div className="mt-4 text-xs text-gray-500">
          Wrong credentials will send you back to the home page with a retry
          banner—just come back here to try again.
        </div>

        <div className="mt-4">
          <Link href="/" className="btn-ghost">← Back to Home</Link>
        </div>
      </section>
    </main>
  );
}
