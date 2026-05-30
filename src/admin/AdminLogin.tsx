import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Eye, EyeOff } from 'lucide-react';

interface Props {
  onLogin: (email: string, password: string) => Promise<void>;
}

export default function AdminLogin({ onLogin }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const navigate = useNavigate();

  const resetAuth = () => {
    navigate('/');
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Provide both email and password.');
      return;
    }

    try {
      await onLogin(email.trim(), password);
      navigate('/admin/dashboard');
    } catch (err) {
      setError('Login failed. Check your credentials and try again.');
      console.error(err);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#001f3f] px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-3">
            <div className="h-10 w-10 rounded-lg bg-accent flex items-center justify-center font-black text-sm text-white">OP</div>
          </div>
          <p className="text-xl font-bold text-white">Admin Panel</p>
          <p className="text-sm text-navy-400">Sign in to manage your website content</p>
        </div>

        <form onSubmit={handleSubmit} className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur">
          {error && (
            <div className="mb-4 rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-300">
              {error}
            </div>
          )}

          <div className="mb-4">
            <label className="block text-sm text-navy-300 mb-1.5">Email</label>
            <input
              type="email"
              value={email}
              onChange={(ev) => setEmail(ev.target.value)}
              placeholder="admin@example.com"
              className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white outline-none focus:border-accent"
            />
          </div>

          <div className="mb-4 relative">
            <label className="block text-sm text-navy-300 mb-1.5">Password</label>
            <input
              type={isPasswordVisible ? 'text' : 'password'}
              value={password}
              onChange={(ev) => setPassword(ev.target.value)}
              placeholder="••••••••"
              className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 pr-12 text-sm text-white outline-none focus:border-accent"
            />
            <button
              type="button"
              onClick={() => setIsPasswordVisible((visible) => !visible)}
              className="absolute right-3 top-9 text-slate-400 hover:text-white"
              aria-label={isPasswordVisible ? 'Hide password' : 'Show password'}
            >
              {isPasswordVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 rounded-lg bg-accent px-6 py-3 text-sm font-semibold text-white hover:bg-accent-dark transition"
          >
            <Lock className="h-4 w-4" /> Sign In
          </button>

          <div className="mt-4 flex items-center justify-between text-xs text-navy-500">
            <p>Hidden admin backend: direct access via /admin only</p>
            <button type="button" onClick={resetAuth} className="font-semibold text-accent hover:text-accent-dark">
              Return to website
            </button>
          </div>

          <p className="mt-3 text-center text-xs text-navy-400">
            Note: the admin panel uses Firebase authentication. Create your admin account in the Firebase console.
          </p>
        </form>
      </div>
    </div>
  );
}
