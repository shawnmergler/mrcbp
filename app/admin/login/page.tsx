'use client';

import { loginAction } from './actions';

export default function AdminLoginPage() {
  return (
    <main className="container mx-auto p-4">
      <section className="card max-w-md mx-auto">
        <h1 className="text-xl font-semibold mb-3">Admin Sign In</h1>
        <form action={loginAction} className="grid gap-3">
          <label className="grid gap-1">
            <span className="label">Username</span>
            <input name="username" className="input" autoComplete="username" required />
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
          <button className="btn">Sign in</button>
        </form>
        <p className="text-xs text-gray-500 mt-3">
          Wrong credentials will return you to the home page with a retry link.
        </p>
      </section>
    </main>
  );
}

    </div>
  );
}
