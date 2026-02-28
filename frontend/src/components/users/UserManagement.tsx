import { useState } from "react";
import { UserPlus, Search, Shield } from "lucide-react";
import { UserTable } from "./UserTable";
import { UserModal } from "./UserModal";

export const UserManagement = ({ users, refresh, api }: any) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const handleEdit = (user: any) => {
    setUserToEdit(user);
    setIsModalOpen(true);
  };

  const filteredUsers = users?.filter((u: any) => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
      {/* Header de Gestión */}
      <div className="bg-[#1e293b]/40 backdrop-blur-xl p-10 rounded-[3rem] border border-white/5 shadow-2xl flex flex-col lg:flex-row justify-between items-center gap-8">
        <div className="flex items-center gap-6">
          <div className="p-5 bg-sky-500/10 rounded-[1.5rem] border border-sky-500/20">
            <Shield className="text-sky-400" size={32} />
          </div>
          <div>
            <h3 className="text-4xl font-black text-white uppercase italic tracking-tighter">Database</h3>
            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.4em]">Control de Acceso y Usuarios</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
          <div className="relative group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-sky-400 transition-colors" size={18} />
            <input 
              type="text"
              placeholder="Buscar por nombre o email..."
              className="bg-black/40 border border-white/5 rounded-2xl py-4 pl-14 pr-6 text-sm text-white focus:outline-none focus:border-sky-500/50 w-full lg:w-80 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button 
            onClick={() => { setUserToEdit(null); setIsModalOpen(true); }}
            className="bg-sky-500 hover:bg-sky-400 text-white px-8 py-4 rounded-2xl font-black flex items-center justify-center gap-3 transition-all shadow-lg shadow-sky-500/20 uppercase text-[10px] tracking-widest"
          >
            <UserPlus size={18} /> Nuevo Registro
          </button>
        </div>
      </div>

      {/* Contenedor de Tabla */}
      <div className="bg-[#1e293b]/20 backdrop-blur-md rounded-[3rem] border border-white/5 overflow-hidden shadow-2xl">
        <UserTable 
          users={filteredUsers} 
          onEdit={handleEdit} 
          onDelete={async (id: any) => {
            if(confirm("¿Confirmar revocación de acceso para este usuario?")) {
              await api.delete(`/admin/users/${id}`);
              refresh();
            }
          }} 
        />
      </div>

      <UserModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={refresh} 
        api={api} 
        userToEdit={userToEdit} 
      />
    </div>
  );
};