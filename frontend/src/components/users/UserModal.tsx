import React, { useState, useEffect } from 'react';
import { X, User, Mail, Shield, Loader2, UserPlus, Key, Save, Fingerprint, Database, FileSpreadsheet, ShieldCheck } from 'lucide-react';
import * as XLSX from 'xlsx';

export const UserModal = ({ isOpen, onClose, onSuccess, api, userToEdit }: any) => {
  const [tab, setTab] = useState<'manual' | 'excel'>('manual');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'USER' });

  useEffect(() => {
    if (userToEdit) {
      setFormData({
        name: userToEdit.name || '',
        email: userToEdit.email || '',
        password: '',
        role: userToEdit.role || 'USER'
      });
      setTab('manual');
    } else {
      setFormData({ name: '', email: '', password: '', role: 'USER' });
    }
  }, [userToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmitManual = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    try {
      if (userToEdit) {
        await api.put(`/admin/users/${userToEdit.id}`, {
          name: formData.name,
          email: formData.email,
          role: formData.role,
          ...(formData.password && { password: formData.password })
        });
      } else {
        await api.post('/admin/users', formData);
      }
      onClose(); // Cerramos primero
      onSuccess(); // Refrescamos después
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="bg-[#0f172a] w-full max-w-xl rounded-[2rem] border border-white/10 overflow-hidden shadow-2xl">
        
        <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/5">
          <h3 className="text-xl font-bold text-white uppercase tracking-tighter">
            {userToEdit ? 'Editar Usuario' : 'Nuevo Registro'}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white"><X size={24} /></button>
        </div>

        {!userToEdit && (
          <div className="flex p-4 gap-2">
            <button onClick={() => setTab('manual')} className={`flex-1 py-2 rounded-xl font-bold text-[10px] ${tab === 'manual' ? 'bg-sky-500 text-white' : 'bg-white/5 text-slate-500'}`}>MANUAL</button>
            <button onClick={() => setTab('excel')} className={`flex-1 py-2 rounded-xl font-bold text-[10px] ${tab === 'excel' ? 'bg-emerald-500 text-white' : 'bg-white/5 text-slate-500'}`}>EXCEL</button>
          </div>
        )}

        <div className="p-8">
          {tab === 'manual' ? (
            <form onSubmit={handleSubmitManual} className="space-y-4">
              <input 
                type="text" 
                placeholder="Nombre Completo"
                className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white outline-none focus:border-sky-500"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                required
              />
              <input 
                type="email" 
                placeholder="Correo Electrónico"
                className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white outline-none focus:border-sky-500"
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
                required
              />
              <div className="grid grid-cols-2 gap-4">
                <input 
                  type="password" 
                  placeholder={userToEdit ? "Nueva Clave (opcional)" : "Contraseña"}
                  className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white outline-none focus:border-sky-500"
                  value={formData.password}
                  onChange={e => setFormData({...formData, password: e.target.value})}
                  required={!userToEdit}
                />
                <select 
                  className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white outline-none focus:border-sky-500"
                  value={formData.role}
                  onChange={e => setFormData({...formData, role: e.target.value})}
                >
                  <option value="USER">USER</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
              </div>
              <button 
                disabled={loading}
                className="w-full bg-sky-500 hover:bg-sky-400 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                {userToEdit ? 'GUARDAR CAMBIOS' : 'CREAR USUARIO'}
              </button>
            </form>
          ) : (
             <div className="text-center p-10 border-2 border-dashed border-white/10 rounded-2xl">
                <p className="text-slate-400 text-sm mb-4">Carga masiva mediante Excel</p>
                <input type="file" accept=".xlsx, .xls" className="text-xs text-slate-500" />
             </div>
          )}
        </div>
      </div>
    </div>
  );
};