import React from 'react';
import { Lightbulb, Tv, Wind, Power, Zap, Cpu, Signal, Loader2 } from 'lucide-react';

interface Device {
  id: number;
  name: string;
  status: any;
  Room?: { name: string };
}

interface DeviceViewProps {
  devices: Device[];
  onToggle: (id: number, currentStatus: any) => void;
  loadingId: number | null;
}

export const DeviceView: React.FC<DeviceViewProps> = ({ devices, onToggle, loadingId }) => {
  const checkIsOn = (status: any) => {
    const s = String(status).toUpperCase();
    return s === 'ON' || s === '1' || s === 'TRUE' || s === 'ACTIVE';
  };

  const getConfig = (name: string, isOn: boolean) => {
    const n = name.toLowerCase();
    if (n.includes('luz') || n.includes('foco')) return { icon: <Lightbulb size={22} />, color: isOn ? 'text-yellow-400' : 'text-slate-600', glow: 'shadow-[0_0_40px_rgba(250,204,21,0.15)]' };
    if (n.includes('aire') || n.includes('ac')) return { icon: <Wind size={22} />, color: isOn ? 'text-emerald-400' : 'text-slate-600', glow: 'shadow-[0_0_40px_rgba(16,185,129,0.15)]' };
    return { icon: <Zap size={22} />, color: isOn ? 'text-purple-400' : 'text-slate-600', glow: 'shadow-[0_0_40_rgba(168,85,247,0.15)]' };
  };

  if (!devices.length) return (
    <div className="p-20 border-2 border-dashed border-white/5 rounded-[3rem] text-center">
      <Cpu size={48} className="text-slate-800 mx-auto mb-4" />
      <p className="text-slate-600 font-black uppercase text-[10px] tracking-widest italic">Red IoT sin nodos vinculados</p>
    </div>
  );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {devices.map((device) => {
        const isOn = checkIsOn(device.status);
        const config = getConfig(device.name, isOn);
        return (
          <div key={device.id} className={`p-8 rounded-[2.5rem] border transition-all duration-500 ${isOn ? `bg-white/5 border-white/10 ${config.glow} scale-[1.02]` : 'bg-black/20 border-white/5 opacity-60'}`}>
            <div className="flex flex-col gap-8">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center bg-black/40 border border-white/5 ${config.color}`}>
                {config.icon}
              </div>
              <div>
                <h4 className="font-black text-white text-xl uppercase italic truncate">{device.name}</h4>
                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mt-1 italic">{device.Room?.name || 'Sistema'}</p>
              </div>
              <div className="flex items-center justify-between pt-6 border-t border-white/5">
                <span className={`text-[10px] font-black uppercase ${isOn ? 'text-sky-400' : 'text-slate-600'}`}>{isOn ? 'Online' : 'Standby'}</span>
                <button 
                  onClick={() => onToggle(device.id, device.status)}
                  disabled={loadingId === device.id}
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${isOn ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/40' : 'bg-white/5 text-slate-600 hover:text-white'}`}
                >
                  {loadingId === device.id ? <Loader2 className="animate-spin" /> : <Power size={22} />}
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};