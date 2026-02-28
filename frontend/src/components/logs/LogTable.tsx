import { Clock, User, Activity, Info, Terminal, Hash } from "lucide-react";

interface Log {
  id: number;
  adminName: string;
  action: string;
  targetId: number | null;
  details: string;
  createdAt: string;
}

export const LogTable = ({ logs }: { logs: Log[] }) => {
  // Función para determinar el color y estilo según la acción
  const getActionStyle = (action: string) => {
    const act = action.toUpperCase();
    if (act.includes('CREATE') || act.includes('ADD')) 
      return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.1)]";
    if (act.includes('DELETE') || act.includes('REMOVE')) 
      return "bg-red-500/10 text-red-400 border-red-500/20 shadow-[0_0_10px_rgba(239,68,68,0.1)]";
    if (act.includes('UPDATE') || act.includes('EDIT')) 
      return "bg-sky-500/10 text-sky-400 border-sky-500/20 shadow-[0_0_10px_rgba(14,165,233,0.1)]";
    return "bg-amber-500/10 text-amber-400 border-amber-500/20";
  };

  return (
    <div className="w-full">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-separate border-spacing-y-2">
          <thead>
            <tr className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">
              <th className="px-6 py-4">Timestamp</th>
              <th className="px-6 py-4">Operator</th>
              <th className="px-6 py-4">System Event</th>
              <th className="px-6 py-4">Technical Details</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {logs.map((log) => (
              <tr key={log.id} className="group transition-all duration-300">
                {/* Fecha y Hora */}
                <td className="bg-[#0f172a]/40 backdrop-blur-sm px-6 py-4 rounded-l-2xl border-y border-l border-white/5 group-hover:bg-[#1e293b]/60 transition-colors">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2 text-white font-bold">
                      <Clock size={12} className="text-sky-500" />
                      {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </div>
                    <span className="text-[10px] text-slate-500 ml-5 font-medium">
                      {new Date(log.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </td>

                {/* Administrador */}
                <td className="bg-[#0f172a]/40 backdrop-blur-sm px-6 py-4 border-y border-white/5 group-hover:bg-[#1e293b]/60 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-sky-500/30 transition-all">
                      <User size={14} className="text-slate-400 group-hover:text-sky-400" />
                    </div>
                    <span className="font-black text-slate-200 uppercase tracking-tighter text-xs">
                      {log.adminName}
                    </span>
                  </div>
                </td>

                {/* Acción (Badge) */}
                <td className="bg-[#0f172a]/40 backdrop-blur-sm px-6 py-4 border-y border-white/5 group-hover:bg-[#1e293b]/60 transition-colors">
                  <span className={`px-3 py-1 rounded-md text-[9px] font-black tracking-[0.1em] border uppercase ${getActionStyle(log.action)}`}>
                    {log.action}
                  </span>
                </td>

                {/* Detalles (Terminal Style) */}
                <td className="bg-[#0f172a]/40 backdrop-blur-sm px-6 py-4 rounded-r-2xl border-y border-r border-white/5 group-hover:bg-[#1e293b]/60 transition-colors">
                  <div className="flex items-center gap-3 font-mono text-xs">
                    <Terminal size={12} className="text-slate-600 shrink-0" />
                    <span className="text-slate-400 group-hover:text-slate-200 transition-colors line-clamp-1 italic">
                      {log.details}
                    </span>
                    {log.targetId && (
                      <span className="ml-auto flex items-center gap-1 text-[10px] bg-black/30 px-2 py-0.5 rounded border border-white/5 text-slate-500">
                        <Hash size={10} /> {log.targetId}
                      </span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {logs.length === 0 && (
        <div className="flex flex-col items-center justify-center p-20 bg-[#0f172a]/20 rounded-[2.5rem] border-2 border-dashed border-white/5">
          <Activity size={40} className="text-slate-800 mb-4" />
          <p className="text-slate-600 font-black uppercase tracking-widest text-xs">Waiting for system events...</p>
        </div>
      )}
    </div>
  );
};