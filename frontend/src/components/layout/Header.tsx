import React from 'react';
import { 
  Search, 
  Bell, 
  Settings, 
  User, 
  Shield, 
  ChevronDown,
  Command,
  Zap
} from 'lucide-react';

export const Header = ({ adminName }: { adminName: string }) => {
  return (
    <header className="h-24 px-8 flex items-center justify-between sticky top-0 z-40 backdrop-blur-md bg-[#0a0f1a]/80 border-b border-white/5">
      
      {/* Buscador Inteligente - Masterizado */}
      <div className="flex-1 max-w-xl group">
        <div className="relative flex items-center">
          <div className="absolute left-5 text-slate-500 group-focus-within:text-sky-500 transition-colors">
            <Search size={18} />
          </div>
          <input 
            type="text" 
            placeholder="Buscar dispositivos, usuarios o logs... (Cmd + K)"
            className="w-full bg-black/40 border border-white/5 rounded-2xl py-3 pl-14 pr-16 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-sky-500/50 focus:bg-sky-500/5 transition-all font-medium"
          />
          <div className="absolute right-4 flex items-center gap-1 bg-white/5 px-2 py-1 rounded-lg border border-white/10">
            <Command size={10} className="text-slate-500" />
            <span className="text-[10px] font-black text-slate-500">K</span>
          </div>
        </div>
      </div>

      {/* Acciones del Sistema */}
      <div className="flex items-center gap-6">
        
        {/* Notificaciones con Badge de Brillo */}
        <button className="relative p-3 rounded-xl bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-all group">
          <Bell size={20} className="group-hover:rotate-12 transition-transform" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-sky-500 rounded-full border-2 border-[#0a0f1a] shadow-[0_0_10px_rgba(14,165,233,0.8)]"></span>
        </button>

        {/* Separador Tecnológico */}
        <div className="h-8 w-[1px] bg-white/10"></div>

        {/* Perfil del Administrador (ID Card Style) */}
        <div className="flex items-center gap-4 pl-2 group cursor-pointer">
          <div className="flex flex-col items-end">
            <span className="text-xs font-black text-white uppercase tracking-tighter leading-none group-hover:text-sky-400 transition-colors">
              {adminName || 'Root Admin'}
            </span>
            <div className="flex items-center gap-1 mt-1">
              <Shield size={10} className="text-emerald-500" />
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Master Commander</span>
            </div>
          </div>
          
          <div className="relative">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-sky-500 to-indigo-600 p-[1px] shadow-[0_0_20px_rgba(14,165,233,0.2)] group-hover:shadow-sky-500/40 transition-all">
              <div className="w-full h-full rounded-[0.9rem] bg-[#0a0f1a] flex items-center justify-center overflow-hidden">
                <User size={24} className="text-white opacity-80" />
              </div>
            </div>
            {/* Online Status Glow */}
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-[3px] border-[#0a0f1a]"></div>
          </div>
          
          <ChevronDown size={16} className="text-slate-600 group-hover:text-white transition-colors" />
        </div>

      </div>

      {/* Indicador de Latencia sutil */}
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-sky-500/20 to-transparent"></div>
    </header>
  );
};