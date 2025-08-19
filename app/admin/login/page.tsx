// app/admin/login/page.tsx
'use client';
import React from 'react';
import { useFormState } from 'react-dom';
import { login } from './actions';

export default function AdminLoginPage(){
  const [state, formAction] = useFormState(login, null);

  return (
    <div className="max-w-md mx-auto mt-16 p-6 bg-white rounded-xl shadow">
      <h1 className="text-lg font-semibold mb-2">Admin Login</h1>
      <p className="text-sm text-gray-600 mb-4">Please sign in to access the admin panel.</p>
      <form action={formAction} className="space-y-2">
        <div>
          <label className="label">Username</label>
          <input name="username" className="input w-full" />
        </div>
        <div>
          <label className="label">Password</label>
          <input type="password" name="password" className="input w-full" />
        </div>
        <button className="btn w-full mt-2" type="submit">Sign In</button>
      </form>
      {state === 'error' ? <div className="text-red-600 text-sm mt-2">Invalid credentials.</div> : null}
    </div>
  );
}
