import { Radio, Activity, Search, Clock } from "lucide-react";
import { LogTable } from "./LogTable";
import { useState } from "react";

export const EventLogs = ({ logs }: any) => {
  const [filter, setFilter] = useState("");

  const filteredLogs = logs?.filter((log: any) => 
    log.details?.toLowerCase().includes(filter.toLowerCase()) ||
    log.adminName?.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Consola de Monitoreo */}
      <div className="bg-[#1e293b]/60 backdrop-blur-2xl p-10 rounded-[3rem] border border-white/5 shadow-2xl flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-6">
          <div className="relative">
            <div className="absolute inset-0 bg-red-500 rounded-2xl blur-lg opacity-20 animate-pulse"></div>
            <div className="relative p-5 bg-red-500/10 rounded-2xl border border-red-500/30">
              <Activity className="text-red-500" size={32} />
            </div>
          </div>
          <div>
            <h3 className="text-4xl font-black text-white uppercase italic tracking-tighter">Audit Log</h3>
            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.4em]">Registros del Servidor en Vivo</p>
          </div>
        </div>

        <div className="relative w-full md:w-96">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
          <input 
            type="text"
            placeholder="Filtrar por evento o admin..."
            className="w-full bg-black/40 border border-white/5 rounded-2xl py-5 pl-14 pr-6 text-xs text-white focus:outline-none focus:border-red-500/30 transition-all font-bold"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        </div>
      </div>

      {/* Tabla de Logs Estilo Terminal */}
      <div className="bg-black/20 backdrop-blur-md p-4 rounded-[3.5rem] border border-white/5">
        <div className="flex items-center gap-3 mb-6 px-6 text-slate-500">
          <Clock size={14} />
          <span className="text-[10px] font-black uppercase tracking-[0.3em]">Timeline de Actividad Reciente</span>
        </div>
        
        <div className="bg-[#0a0f1a]/80 rounded-[2.5rem] border border-white/5 overflow-hidden">
          <LogTable logs={filteredLogs || []} />
          
          {(!filteredLogs || filteredLogs.length === 0) && (
            <div className="py-32 text-center flex flex-col items-center gap-4">
              <div className="w-16 h-1 bg-slate-800 rounded-full"></div>
              <p className="text-slate-600 font-black uppercase italic tracking-tighter text-2xl">Buffer Vacío / No hay registros</p>
              <div className="w-16 h-1 bg-slate-800 rounded-full"></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};