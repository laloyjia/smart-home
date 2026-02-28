import { useState } from 'react';
import { ShieldCheck, Lock, User, Loader2 } from 'lucide-react';
import api from '../../api/axios';

export const Login = ({ onLoginSuccess }: any) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.post('/auth/login', { email, password });
      const token = response.data.token;
      localStorage.setItem('token', token);
      onLoginSuccess(token);
    } catch (error) {
      alert("Credenciales inválidas");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070b14] flex items-center justify-center p-6 bg-[radial-gradient(circle_at_50%_50%,_#1e1b4b_0%,_transparent_50%)]">
      <div className="w-full max-w-md bg-[#1e293b]/40 backdrop-blur-xl p-10 rounded-[3rem] border border-white/10 shadow-2xl">
        <div className="flex flex-col items-center mb-10">
          <div className="p-5 bg-sky-500/10 rounded-full border border-sky-500/30 mb-4">
            <ShieldCheck className="text-sky-400" size={40} />
          </div>
          <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter text-center">
            Acceso al Sistema
          </h2>
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.4em] mt-2 text-center">Secure Node Login</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <User className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
            <input 
              required
              type="email"
              placeholder="Admin Email"
              className="w-full bg-black/40 border border-white/5 rounded-2xl py-5 pl-14 pr-6 text-white font-bold outline-none focus:border-sky-500/50 transition-all"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
            <input 
              required
              type="password"
              placeholder="Contraseña"
              className="w-full bg-black/40 border border-white/5 rounded-2xl py-5 pl-14 pr-6 text-white font-bold outline-none focus:border-sky-500/50 transition-all"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button 
            disabled={loading}
            className="w-full bg-sky-500 hover:bg-sky-400 text-white font-black py-5 rounded-2xl transition-all shadow-lg shadow-sky-500/20 uppercase text-xs tracking-[0.2em]"
          >
            {loading ? <Loader2 className="animate-spin mx-auto" /> : 'Entrar al Panel'}
          </button>
        </form>
      </div>
    </div>
  );
};