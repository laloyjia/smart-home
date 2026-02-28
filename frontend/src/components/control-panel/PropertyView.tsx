import { useState } from 'react';
import { Home, MapPin, Layout, ChevronRight, ArrowLeft, Plus, Zap, Loader2 } from 'lucide-react';

interface PropertyViewProps {
  properties: any[];
  onOpenRoomModal?: (homeId: number) => void;
  onOpenDeviceModal?: (homeId: number, roomId: number) => void;
  api: any; // Añadido
  refresh: () => void; // Añadido
}

export const PropertyView = ({ properties, onOpenRoomModal, onOpenDeviceModal, api, refresh }: PropertyViewProps) => {
  const [selectedHome, setSelectedHome] = useState<any | null>(null);
  const [togglingId, setTogglingId] = useState<number | null>(null);

  const handleToggle = async (deviceId: number) => {
    setTogglingId(deviceId);
    try {
      // Llamada al endpoint PATCH que definimos en el backend
      await api.patch(`/admin/devices/${deviceId}/toggle`);
      refresh(); // Recargamos datos para sincronizar
    } catch (error) {
      console.error("Error al conmutar dispositivo");
    } finally {
      setTogglingId(null);
    }
  };

  if (!properties || properties.length === 0) {
    return (
      <div className="py-20 text-center bg-black/20 rounded-[3rem] border border-dashed border-white/10">
        <p className="text-slate-500 font-black uppercase italic tracking-widest">No hay propiedades registradas</p>
      </div>
    );
  }

  const currentHome = selectedHome 
    ? properties.find(p => p.id === selectedHome.id) || selectedHome 
    : null;

  if (!currentHome) {
    return (
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 animate-in fade-in duration-500">
        {properties.map((home) => (
          <div key={home.id} onClick={() => setSelectedHome(home)} className="bg-[#1e293b]/30 backdrop-blur-md rounded-[3rem] border border-white/5 p-10 hover:border-sky-500/50 transition-all cursor-pointer group">
            <div className="flex justify-between items-start mb-10">
              <div className="flex gap-6">
                <div className="w-16 h-16 bg-slate-900 rounded-[1.5rem] flex items-center justify-center text-sky-500 border border-white/5 shadow-2xl group-hover:scale-110 transition-transform"><Home size={32} /></div>
                <div>
                  <h4 className="text-2xl font-black text-white uppercase italic">{home.name}</h4>
                  <p className="flex items-center gap-2 text-slate-500 font-bold text-[10px] uppercase"><MapPin size={12} /> {home.address || 'Ubicación Remota'}</p>
                </div>
              </div>
              <ChevronRight size={24} className="text-slate-700 group-hover:text-white" />
            </div>
            <div className="flex justify-between items-center text-xs font-black uppercase tracking-widest bg-black/20 p-6 rounded-2xl border border-white/5">
              <span className="text-slate-500">Habitaciones: {(home.rooms || home.Rooms || []).length}</span>
              <span className="text-white italic text-[10px]">Owner: {home.user?.name || home.User?.name || 'Admin'}</span>
            </div>
          </div>
        ))}
      </div>
    );
  }

  const rooms = currentHome.rooms || currentHome.Rooms || [];

  return (
    <div className="space-y-8 animate-in slide-in-from-right duration-500">
      <div className="flex items-center justify-between bg-[#1e293b]/40 p-8 rounded-[2.5rem] border border-white/5 backdrop-blur-md">
        <div className="flex items-center gap-6">
          <button onClick={() => setSelectedHome(null)} className="p-4 bg-white/5 rounded-2xl text-slate-400 hover:text-white transition-all"><ArrowLeft size={24} /></button>
          <h3 className="text-3xl font-black text-white uppercase italic">{currentHome.name}</h3>
        </div>
        <button onClick={() => onOpenRoomModal?.(currentHome.id)} className="bg-sky-500 hover:bg-sky-400 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase flex items-center gap-3">
          <Plus size={18} /> Añadir Habitación
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rooms.map((room: any) => (
          <div key={room.id} className="bg-[#1e293b]/20 backdrop-blur-md p-8 rounded-[2.5rem] border border-white/5">
            <div className="flex justify-between items-start mb-6">
              <div className="p-4 bg-purple-500/10 text-purple-400 rounded-2xl"><Layout size={28} /></div>
              <button onClick={() => onOpenDeviceModal?.(currentHome.id, room.id)} className="p-3 bg-amber-500/10 text-amber-500 rounded-xl hover:bg-amber-500 hover:text-black transition-all"><Plus size={16} /></button>
            </div>
            <h4 className="text-xl font-black text-white uppercase italic mb-6 tracking-tight">{room.name}</h4>
            <div className="space-y-3">
              {(room.devices || room.Devices || []).length > 0 ? (
                (room.devices || room.Devices).map((dev: any) => (
                  <div 
                    key={dev.id} 
                    onClick={() => handleToggle(dev.id)}
                    className={`flex items-center justify-between p-4 rounded-xl border transition-all cursor-pointer group/device ${
                      dev.status 
                        ? 'bg-emerald-500/5 border-emerald-500/20 hover:border-emerald-500/40' 
                        : 'bg-black/40 border-white/5 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {togglingId === dev.id ? (
                        <Loader2 size={14} className="animate-spin text-sky-400" />
                      ) : (
                        <Zap size={14} className={dev.status ? "text-amber-400 fill-amber-400" : "text-slate-600"} />
                      )}
                      <span className={`text-[10px] font-bold uppercase transition-colors ${dev.status ? 'text-white' : 'text-slate-500'}`}>
                        {dev.name}
                      </span>
                    </div>
                    <div className={`w-2 h-2 rounded-full transition-all duration-500 ${
                      dev.status 
                        ? 'bg-emerald-500 shadow-[0_0_12px_#10b981] animate-pulse' 
                        : 'bg-slate-800 shadow-none'
                    }`}></div>
                  </div>
                ))
              ) : (
                <p className="text-[9px] text-slate-600 font-bold uppercase text-center py-2">Sin dispositivos</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};