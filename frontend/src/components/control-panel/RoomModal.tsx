import React, { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';

export const RoomModal = ({ isOpen, onClose, onSuccess, homeId, api, properties }: any) => {
  const [loading, setLoading] = useState(false);
  const [localHomeId, setLocalHomeId] = useState('');
  const [formData, setFormData] = useState({ name: '', type: 'LIVING' });

  useEffect(() => {
    if (homeId) setLocalHomeId(homeId.toString());
  }, [homeId]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!localHomeId) return alert("Selecciona una propiedad");
    setLoading(true);
    try {
      await api.post('/admin/rooms', { ...formData, homeId: Number(localHomeId) });
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
      <div className="bg-[#1e293b] w-full max-w-sm rounded-[2.5rem] border border-white/10 shadow-2xl animate-in zoom-in-95">
        <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/5">
          <h3 className="text-xl font-black uppercase italic text-white">Nueva Habitación</h3>
          <button onClick={onClose} className="text-slate-500 hover:text-white"><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-10 space-y-6">
          {!homeId && (
            <select required className="w-full bg-black/40 border border-white/5 rounded-2xl px-5 py-4 text-white font-bold outline-none" value={localHomeId} onChange={(e) => setLocalHomeId(e.target.value)}>
              <option value="">Seleccionar Propiedad...</option>
              {properties?.map((h: any) => <option key={h.id} value={h.id}>{h.name}</option>)}
            </select>
          )}
          <input required className="w-full bg-black/40 border border-white/5 rounded-2xl px-5 py-4 text-white font-bold outline-none" placeholder="Nombre (Ej: Cocina)" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
          <button type="submit" disabled={loading} className="w-full bg-purple-600 hover:bg-purple-500 text-white font-black py-5 rounded-2xl uppercase text-xs">
            {loading ? <Loader2 className="animate-spin mx-auto" /> : 'Añadir'}
          </button>
        </form>
      </div>
    </div>
  );
};