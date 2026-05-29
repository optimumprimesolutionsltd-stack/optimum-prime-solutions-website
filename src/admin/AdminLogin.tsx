import { useState } from 'react';
import { Lock, Eye, EyeOff } from 'lucide-react';
interface P{onLogin:()=>void}
export default function AdminLogin({onLogin}:P){
  const [u,setU]=useState('');const [e,setE]=useState('');
  const resetAuth = () => {
    sessionStorage.removeItem('ops_admin');
    localStorage.removeItem('ops_admin');
    window.location.hash = '';
    window.location.reload();
  };

  const go=(ev:React.FormEvent)=>{ev.preventDefault();
    // Passwordless admin: accept any username (or default to 'admin') to simplify local access
    const user = u.trim() || 'admin';
    sessionStorage.setItem('ops_admin','1');
    localStorage.setItem('ops_admin','1');
    onLogin();
  };
  return<div className="flex min-h-screen items-center justify-center bg-navy-950 px-4"><div className="w-full max-w-md">
    <div className="text-center mb-8"><div className="inline-flex items-center gap-2 mb-3"><div className="h-10 w-10 rounded-lg bg-accent flex items-center justify-center font-black text-sm text-white">OP</div></div><p className="text-xl font-bold text-white">Admin Panel</p><p className="text-sm text-navy-400">Sign in to manage your website</p></div>
    <form onSubmit={go} className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur">
      {e&&<div className="mb-4 rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-300">{e}</div>}
      <div className="mb-4"><label className="block text-sm text-navy-300 mb-1.5">Username</label><input value={u} onChange={ev=>setU(ev.target.value)} placeholder="admin" className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white outline-none focus:border-accent"/></div>
      <button type="submit" className="w-full flex items-center justify-center gap-2 rounded-lg bg-accent px-6 py-3 text-sm font-semibold text-white hover:bg-accent-dark transition">Sign In</button>
      <div className="mt-4 flex items-center justify-between text-xs text-navy-500">
        <p>Admin access enabled (no password required)</p>
        <button type="button" onClick={resetAuth} className="font-semibold text-accent hover:text-accent-dark">
          Return to website
        </button>
      </div>
      <p className="mt-3 text-center text-xs text-navy-400">If the page still shows an error, try clearing browser cache or opening in a private window.</p>
    </form>
  </div></div>;
}
