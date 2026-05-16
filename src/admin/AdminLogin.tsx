import { useState } from 'react';
import { Lock, Eye, EyeOff } from 'lucide-react';
interface P{onLogin:()=>void}
export default function AdminLogin({onLogin}:P){
  const [u,setU]=useState('');const [p,setP]=useState('');const [s,setS]=useState(false);const [e,setE]=useState('');
  const go=(ev:React.FormEvent)=>{ev.preventDefault();if(u==='admin'&&p==='optimum2024'){sessionStorage.setItem('ops_admin','1');localStorage.setItem('ops_admin','1');onLogin();}else setE('Invalid credentials');};
  return<div className="flex min-h-screen items-center justify-center bg-navy-950 px-4"><div className="w-full max-w-md">
    <div className="text-center mb-8"><div className="inline-flex items-center gap-2 mb-3"><div className="h-10 w-10 rounded-lg bg-accent flex items-center justify-center font-black text-sm text-white">OP</div></div><p className="text-xl font-bold text-white">Admin Panel</p><p className="text-sm text-navy-400">Sign in to manage your website</p></div>
    <form onSubmit={go} className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur">
      {e&&<div className="mb-4 rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-300">{e}</div>}
      <div className="mb-4"><label className="block text-sm text-navy-300 mb-1.5">Username</label><input value={u} onChange={ev=>setU(ev.target.value)} className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white outline-none focus:border-accent"/></div>
      <div className="mb-6"><label className="block text-sm text-navy-300 mb-1.5">Password</label><div className="relative"><input type={s?'text':'password'} value={p} onChange={ev=>setP(ev.target.value)} className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 pr-10 text-sm text-white outline-none focus:border-accent"/><button type="button" onClick={()=>setS(!s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-navy-400">{s?<EyeOff className="h-4 w-4"/>:<Eye className="h-4 w-4"/>}</button></div></div>
      <button type="submit" className="w-full flex items-center justify-center gap-2 rounded-lg bg-accent px-6 py-3 text-sm font-semibold text-white hover:bg-accent-dark transition"><Lock className="h-4 w-4"/>Sign In</button>
      <p className="mt-4 text-center text-xs text-navy-500">admin / optimum2024</p>
    </form>
  </div></div>;
}
