// app/admin/login/actions.ts
'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const ADMIN_USER = process.env.ADMIN_USER || 'admin';
const ADMIN_PASS = process.env.ADMIN_PASS || 'letmein';

export async function login(prevState: any, formData: FormData){
  const username = String(formData.get('username') || '');
  const password = String(formData.get('password') || '');

  if(username === ADMIN_USER && password === ADMIN_PASS){
    (await cookies()).set('admin','true',{ httpOnly:true, path:'/' });
    redirect('/admin');
  } else {
    // clear cookie just in case and send them home with a soft message
    (await cookies()).delete('admin');
    redirect('/?err=badlogin');
  }
}

export async function logout(){
  (await cookies()).delete('admin');
  redirect('/');
}
