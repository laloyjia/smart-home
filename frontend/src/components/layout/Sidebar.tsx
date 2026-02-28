import { 
  LayoutDashboard, 
  Users, 
  ClipboardList, 
  Settings, 
  LogOut,
  Cpu
} from "lucide-react";

export const Sidebar = ({ activeTab, setActiveTab }: any) => {
  const menuItems = [
    { id: "dashboard", label: "Panel Principal", icon: <LayoutDashboard size={20} /> },
    { id: "users", label: "Registro de Usuarios", icon: <Users size={20} /> },
    { id: "logs", label: "Historial de Eventos", icon: <ClipboardList size={20} /> },
    { id: "control", label: "Control Domicilios", icon: <Settings size={20} /> },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };

  return (
    <aside className="w-80 bg-[#0a0f1a] border-r border-white/5 flex flex-col h-full">
      <div className="p-10">
        <div className="flex items-center gap-3 mb-10">
          <div className="p-2 bg-sky-500 rounded-lg">
            <Cpu className="text-white" size={24} />
          </div>
          <h1 className="text-2xl font-black italic tracking-tighter text-white uppercase">
            Smart<span className="text-sky-500">Admin</span>
          </h1>
        </div>

        <nav className="space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all ${
                activeTab === item.id 
                ? "bg-sky-500 text-white shadow-lg shadow-sky-500/20 scale-105" 
                : "text-slate-500 hover:text-slate-300 hover:bg-white/5"
              }`}
            >
              {item.icon}
              <span className="text-sm uppercase tracking-widest">{item.label}</span>
            </button>
          ))}
        </nav>
      </div>

      <div className="mt-auto p-10">
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold text-red-400 hover:bg-red-500/10 transition-all border border-transparent hover:border-red-500/20"
        >
          <LogOut size={20} />
          <span className="text-sm uppercase tracking-widest">Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  );
};