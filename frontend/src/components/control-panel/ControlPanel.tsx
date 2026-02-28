import { useState } from 'react';
import { Home, Layout, Zap } from 'lucide-react';
import { PropertyView } from './PropertyView';
import { PropertyModal } from './PropertyModal';
import { RoomModal } from './RoomModal';
import { DeviceModal } from './DeviceModal';

interface ControlPanelProps {
  properties: any[];
  users: any[];
  refresh: () => void;
  api: any;
}

export const ControlPanel = ({ properties, users, refresh, api }: ControlPanelProps) => {
  const [modals, setModals] = useState({ home: false, room: false, device: false });
  const [selection, setSelection] = useState({ homeId: null, roomId: null });

  // Funciones para abrir modales con datos pre-seleccionados
  const openRoomModal = (hId: any) => {
    setSelection({ homeId: hId, roomId: null });
    setModals(prev => ({ ...prev, room: true }));
  };

  const openDeviceModal = (hId: any, rId: any) => {
    setSelection({ homeId: hId, roomId: rId });
    setModals(prev => ({ ...prev, device: true }));
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      
      {/* --- SECCIÓN DE ACCIONES RÁPIDAS --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Botón Crear Casa */}
        <button 
          onClick={() => setModals(prev => ({ ...prev, home: true }))}
          className="bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500 text-emerald-500 hover:text-white p-8 rounded-[2.5rem] transition-all flex flex-col items-center gap-4 group shadow-xl hover:shadow-emerald-500/20"
        >
          <div className="p-4 bg-emerald-500/20 rounded-2xl group-hover:bg-white/20 transition-colors">
            <Home size={28} />
          </div>
          <span className="font-black uppercase italic text-xs tracking-widest">Registrar Casa</span>
        </button>

        {/* Botón Crear Habitación */}
        <button 
          onClick={() => setModals(prev => ({ ...prev, room: true }))}
          className="bg-purple-500/10 border border-purple-500/20 hover:bg-purple-500 text-purple-500 hover:text-white p-8 rounded-[2.5rem] transition-all flex flex-col items-center gap-4 group shadow-xl hover:shadow-purple-500/20"
        >
          <div className="p-4 bg-purple-500/20 rounded-2xl group-hover:bg-white/20 transition-colors">
            <Layout size={28} />
          </div>
          <span className="font-black uppercase italic text-xs tracking-widest">Añadir Estancia</span>
        </button>

        {/* Botón Crear Dispositivo */}
        <button 
          onClick={() => setModals(prev => ({ ...prev, device: true }))}
          className="bg-amber-500/10 border border-amber-500/20 hover:bg-amber-500 text-amber-500 hover:text-white p-8 rounded-[2.5rem] transition-all flex flex-col items-center gap-4 group shadow-xl hover:shadow-amber-500/20"
        >
          <div className="p-4 bg-amber-500/20 rounded-2xl group-hover:bg-white/20 transition-colors">
            <Zap size={28} />
          </div>
          <span className="font-black uppercase italic text-xs tracking-widest">Nuevo Dispositivo</span>
        </button>
      </div>

      {/* --- CONTENEDOR PRINCIPAL DE PROPIEDADES --- */}
      <div className="bg-[#1e293b]/20 p-6 rounded-[3.5rem] border border-white/5 backdrop-blur-md shadow-inner">
        <PropertyView 
          properties={properties} 
          onOpenRoomModal={openRoomModal}
          onOpenDeviceModal={openDeviceModal}
          api={api}     // Pasamos la API para el toggle
          refresh={refresh} // Pasamos refresh para actualizar tras el toggle
        />
      </div>

      {/* --- MODALES DE GESTIÓN --- */}
      
      {/* Modal Propiedad */}
      <PropertyModal 
        isOpen={modals.home} 
        onClose={() => setModals(prev => ({ ...prev, home: false }))} 
        onSuccess={refresh} 
        users={users} 
        api={api} 
      />
      
      {/* Modal Habitación */}
      <RoomModal 
        isOpen={modals.room} 
        onClose={() => setModals(prev => ({ ...prev, room: false }))} 
        onSuccess={refresh} 
        homeId={selection.homeId} 
        api={api} 
      />

      {/* Modal Dispositivo */}
      <DeviceModal 
        isOpen={modals.device} 
        onClose={() => setModals(prev => ({ ...prev, device: false }))} 
        onSuccess={refresh} 
        properties={properties} 
        api={api} 
        preSelectedHomeId={selection.homeId}
        preSelectedRoomId={selection.roomId}
      />
    </div>
  );
};