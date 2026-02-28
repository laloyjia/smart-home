import React, { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';

export const DeviceModal = ({ isOpen, onClose, onSuccess, properties, api, preSelectedHomeId, preSelectedRoomId }: any) => {
  const [loading, setLoading] = useState(false);
  const [selectedHomeId, setSelectedHomeId] = useState('');
  const [availableRooms, setAvailableRooms] = useState<any[]>([]);
  const [formData, setFormData] = useState({ name: '', type: 'LIGHT', roomId: '' });

  useEffect(() => {
    if (isOpen) {
      if (preSelectedHomeId) {
        setSelectedHomeId(preSelectedHomeId.toString());
        if (preSelectedRoomId) {
          setFormData(prev => ({ ...prev, roomId: preSelectedRoomId.toString() }));
        }
      } else {
        setSelectedHomeId('');
        setFormData({ name: '', type: 'LIGHT', roomId: '' });
      }
    }
  }, [isOpen, preSelectedHomeId, preSelectedRoomId]);

  useEffect(() => {
    if (selectedHomeId) {
      const home = properties?.find((h: any) => h.id === Number(selectedHomeId));
      const roomsFound = home ? (home.rooms || home.Rooms || []) : [];
      setAvailableRooms(roomsFound);
      
      // Si cambiamos de casa y el roomId actual no pertenece a esa casa, lo reseteamos
      if (!preSelectedRoomId && !roomsFound.find((r: any) => r.id === Number(formData.roomId))) {
        setFormData(prev => ({ ...prev, roomId: '' }));
      }
    }
  }, [selectedHomeId, properties]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.roomId) return alert("Selecciona una habitación");
    
    setLoading(true);
    try {
      await api.post('/admin/devices', { 
        name: formData.name,
        type: formData.type,
        roomId: Number(formData.roomId) 
      });
      onSuccess();
      onClose();
      setFormData({ name: '', type: 'LIGHT', roomId: '' });
    } catch (error) {
      console.error("Error al crear dispositivo");
      alert("Error al guardar el dispositivo");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-950/95 backdrop-blur-xl">
      <div className="bg-[#1e293b] w-full max-w-md rounded-[3rem] border border-white/10 shadow-2xl animate-in zoom-in-95">
        <div className="p-8 border-b border-white/5 flex justify-between items-center">
          <h3 className="text-xl font-black uppercase italic text-white">Nuevo Dispositivo</h3>
          <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors"><X size={24} /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-10 space-y-6">
          <select 
            disabled={!!preSelectedHomeId} 
            className="w-full bg-black/40 border border-white/5 rounded-2xl px-5 py-4 text-white font-bold outline-none" 
            value={selectedHomeId} 
            onChange={(e) => setSelectedHomeId(e.target.value)}
          >
            <option value="">Seleccionar Casa...</option>
            {properties?.map((h: any) => <option key={h.id} value={h.id}>{h.name}</option>)}
          </select>

          <select 
            disabled={!!preSelectedRoomId || !selectedHomeId} 
            required 
            className="w-full bg-black/40 border border-white/5 rounded-2xl px-5 py-4 text-white font-bold outline-none" 
            value={formData.roomId} 
            onChange={(e) => setFormData({...formData, roomId: e.target.value})}
          >
            <option value="">Seleccionar Habitación...</option>
            {availableRooms.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
          </select>

          <input 
            required 
            className="w-full bg-black/40 border border-white/5 rounded-2xl px-5 py-4 text-white font-bold outline-none" 
            placeholder="Nombre Dispositivo" 
            value={formData.name} 
            onChange={(e) => setFormData({...formData, name: e.target.value})} 
          />

          <button 
            type="submit" 
            disabled={loading} 
            className="w-full bg-amber-500 hover:bg-amber-400 text-black font-black py-5 rounded-[2rem] uppercase text-xs transition-all shadow-lg shadow-amber-500/20"
          >
            {loading ? <Loader2 className="animate-spin mx-auto" /> : 'Confirmar Instalación'}
          </button>
        </form>
      </div>
    </div>
  );
};