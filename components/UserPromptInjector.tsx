'use client';
import { useEffect, useState } from 'react';
import Icons from './Icons';

export default function UserPromptInjector(){
  const [show, setShow] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  useEffect(()=>{
    const uid = document.cookie.split('; ').find(r=>r.startsWith('uid='));
    if(!uid && !localStorage.getItem('uid_init')){
      setShow(true);
    }
  },[]);

  const submit = async ()=>{
    const r = await fetch('/api/user/init', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ displayName:name, email }) });
    if(r.ok){
      localStorage.setItem('uid_init','1');
      setShow(false);
    }
  };

  if(!show) return null;
  return (
    <div className="modal">
      <div className="card">
        <div className="flex items-center gap-3 mb-3">
          <div className="iconwrap"><Icons.user className="w-6 h-6 text-gray-900" /></div>
          <div className="font-medium">Welcome! Create your profile</div>
        </div>
        <div className="mb-3">
          <div className="label">Name</div>
          <input className="input full-width" value={name} onChange={e=>setName(e.target.value)} placeholder="Your name" />
        </div>
        <div className="mb-3">
          <div className="label">Email (optional)</div>
          <input className="input full-width" value={email} onChange={e=>setEmail(e.target.value)} placeholder="name@example.com" />
        </div>
        <button className="btn" onClick={submit}>Save</button>
      </div>
    </div>
  );
}
