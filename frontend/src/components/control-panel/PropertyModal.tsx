import React, { useState } from 'react';
import { X, Loader2 } from 'lucide-react';

export const PropertyModal = ({ isOpen, onClose, onSuccess, users, api }: any) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ name: '', address: '', userId: '' });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.userId) return alert("Por favor, selecciona un dueño para la propiedad.");

    setLoading(true);
    try {
      // Ahora la ruta /admin/properties coincidirá con el Backend
      await api.post('/admin/properties', { 
        name: formData.name.trim(),
        address: formData.address.trim(),
        userId: Number(formData.userId) // Convertimos a número para Prisma
      });

      onSuccess(); // Refresca la lista
      onClose();   // Cierra el modal
      setFormData({ name: '', address: '', userId: '' });
    } catch (error: any) {
      console.error("Error al crear propiedad:", error.response?.data || error.message);
      alert(error.response?.data?.error || "Error al conectar con el servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
      <div className="bg-[#1e293b] w-full max-w-md rounded-[2.5rem] border border-white/10 shadow-2xl overflow-hidden animate-in zoom-in-95">
        <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/5">
          <h3 className="text-xl font-black uppercase text-white italic">Registrar Propiedad</h3>
          <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-10 space-y-5">
          <div className="space-y-4">
            <input 
              required 
              className="w-full bg-black/40 border border-white/5 rounded-2xl px-6 py-5 text-white font-bold outline-none focus:border-emerald-500/50 transition-all" 
              placeholder="Nombre (Ej: Mansión Stark)" 
              value={formData.name} 
              onChange={(e) => setFormData({...formData, name: e.target.value})} 
            />
            
            <input 
              className="w-full bg-black/40 border border-white/5 rounded-2xl px-6 py-5 text-white font-bold outline-none focus:border-emerald-500/50 transition-all" 
              placeholder="Dirección Física" 
              value={formData.address} 
              onChange={(e) => setFormData({...formData, address: e.target.value})} 
            />

            <select 
              required 
              className="w-full bg-black/40 border border-white/5 rounded-2xl px-6 py-5 text-white font-bold outline-none focus:border-emerald-500/50 transition-all" 
              value={formData.userId} 
              onChange={(e) => setFormData({...formData, userId: e.target.value})}
            >
              <option value="">Seleccionar Dueño...</option>
              {users?.map((u: any) => (
                <option key={u.id} value={u.id}>
                  {u.name.toUpperCase()} ({u.email})
                </option>
              ))}
            </select>
          </div>

          <button 
            type="submit" 
            disabled={loading} 
            className="w-full bg-emerald-500 hover:bg-emerald-400 text-white font-black py-6 rounded-2xl transition-all shadow-lg shadow-emerald-500/20 uppercase text-xs tracking-widest"
          >
            {loading ? <Loader2 className="animate-spin mx-auto" /> : 'Sincronizar Propiedad'}
          </button>
        </form>
      </div>
    </div>
  );
};