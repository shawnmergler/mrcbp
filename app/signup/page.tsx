'use client';
import { useState } from 'react';

export default function SignupPage() {
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ displayName, email }),
    });
    if (res.ok) setDone(true);
  }

  if (done) return <div className="card">Account created! You can start training now.</div>;

  return (
    <div className="card max-w-md">
      <h1 className="text-xl font-semibold mb-2">Create Account</h1>
      <form onSubmit={onSubmit} className="grid gap-2">
        <label className="text-sm">
          Display Name
          <input className="input w-full mt-1" value={displayName} onChange={e=>setDisplayName(e.target.value)} required />
        </label>
        <label className="text-sm">
          Email (optional)
          <input type="email" className="input w-full mt-1" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" />
        </label>
        <button className="btn btn-primary mt-2">Create</button>
      </form>
    </div>
  );
}
