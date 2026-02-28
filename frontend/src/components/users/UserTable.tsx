import { Edit2, Trash2, Mail, ShieldCheck, User as UserIcon, Calendar } from "lucide-react";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

interface UserTableProps {
  users: User[];
  onDelete: (id: number) => void;
  onEdit: (user: User) => void;
}

export const UserTable = ({ users, onDelete, onEdit }: UserTableProps) => {
  // Si no hay usuarios, mostramos el estado vacío de inmediato
  if (!users || users.length === 0) {
    return (
      <div className="p-20 text-center bg-[#1e293b]/20 rounded-[2rem] border-2 border-dashed border-white/5 m-8">
        <UserIcon size={48} className="mx-auto mb-4 text-slate-700" />
        <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">No entries found in database</p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto p-4">
      <table className="w-full text-left border-separate border-spacing-y-3">
        <thead>
          <tr className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">
            <th className="px-8 py-4">Identity</th>
            <th className="px-8 py-4">Security Level</th>
            <th className="px-8 py-4">Registry Date</th>
            <th className="px-8 py-4 text-right">Operations</th>
          </tr>
        </thead>
        <tbody className="text-slate-300">
          {users.map((user) => (
            <tr key={`user-row-${user.id}`} className="group transition-all">
              <td className="bg-[#1e293b]/30 backdrop-blur-sm px-8 py-5 rounded-l-[1.5rem] border-y border-l border-white/5 group-hover:bg-[#1e293b]/60 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white font-black text-sm shadow-lg group-hover:scale-110 transition-transform shrink-0">
                    {user.name ? user.name.charAt(0).toUpperCase() : '?'}
                  </div>
                  <div className="min-w-0">
                    <p className="font-black text-white tracking-tight truncate">{user.name}</p>
                    <p className="text-xs text-slate-500 flex items-center gap-1 truncate">
                      <Mail size={12} className="shrink-0" /> {user.email}
                    </p>
                  </div>
                </div>
              </td>
              
              <td className="bg-[#1e293b]/30 backdrop-blur-sm px-8 py-5 border-y border-white/5 group-hover:bg-[#1e293b]/60 transition-colors">
                <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black tracking-tighter ${
                  user.role === 'ADMIN' 
                    ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' 
                    : 'bg-sky-500/10 text-sky-400 border border-sky-500/20'
                }`}>
                  <ShieldCheck size={12} />
                  {user.role}
                </span>
              </td>
              
              <td className="bg-[#1e293b]/30 backdrop-blur-sm px-8 py-5 border-y border-white/5 group-hover:bg-[#1e293b]/60 transition-colors">
                <p className="text-xs font-bold text-slate-400 flex items-center gap-2 whitespace-nowrap">
                  <Calendar size={14} className="text-slate-600" />
                  {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                </p>
              </td>
              
              <td className="bg-[#1e293b]/30 backdrop-blur-sm px-8 py-5 rounded-r-[1.5rem] border-y border-r border-white/5 group-hover:bg-[#1e293b]/60 transition-colors text-right">
                <div className="flex justify-end gap-2">
                  <button 
                    onClick={() => onEdit(user)} 
                    className="p-3 bg-white/5 hover:bg-sky-500 hover:text-white rounded-xl text-sky-400 transition-all active:scale-90"
                    title="Editar Usuario"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button 
                    onClick={() => onDelete(user.id)} 
                    className="p-3 bg-white/5 hover:bg-red-500 hover:text-white rounded-xl text-red-400 transition-all active:scale-90"
                    title="Eliminar Usuario"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};