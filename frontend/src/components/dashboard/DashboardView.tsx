import { Users, Home, Layout, Activity, Radio } from "lucide-react";
import { StatCard } from "./StatCard";

export const DashboardView = ({ stats }: any) => {
  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      {/* 1. Resumen de Estadísticas solicitadas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Usuarios Registrados" value={stats.totalUsers} icon={<Users/>} color="sky" />
        <StatCard title="Casas Creadas" value={stats.totalHomes} icon={<Home/>} color="emerald" />
        <StatCard title="Dependencias" value={stats.totalRooms} icon={<Layout/>} color="purple" />
        <StatCard title="Usuarios en Línea" value={stats.onlineUsers} icon={<Activity/>} color="amber" />
      </div>

      {/* 2. Imagen Central de Control Domótico */}
      <div className="relative h-[450px] w-full rounded-[3rem] overflow-hidden border border-white/10 shadow-2xl group">
        <img 
          src="https://images.unsplash.com/photo-1558002038-1055907df827?q=80&w=2070" 
          alt="Smart Home Interface" 
          className="w-full h-full object-cover opacity-50 group-hover:opacity-70 transition-opacity duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#070b14] via-transparent to-transparent"></div>
        <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4">
            <div className="p-4 bg-sky-500/20 rounded-full border border-sky-500/50 animate-pulse">
                <Radio size={40} className="text-sky-400" />
            </div>
            <h2 className="text-6xl font-black uppercase italic tracking-tighter text-white drop-shadow-2xl">
                System Active
            </h2>
            <p className="text-slate-400 font-bold tracking-[0.4em] uppercase text-xs">Node Network Control Center</p>
        </div>
      </div>

      {/* 3. Sección de Gráficos y Noticias */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 bg-[#1e293b]/40 backdrop-blur-md p-8 rounded-[2.5rem] border border-white/5 h-80 flex items-center justify-center">
            <p className="text-slate-500 font-black uppercase italic">Área de Gráficos Estadísticos</p>
        </div>
        <div className="lg:col-span-4 bg-[#1e293b]/40 backdrop-blur-md p-8 rounded-[2.5rem] border border-white/5">
            <h3 className="text-white font-black uppercase italic mb-4">Noticias Relevantes</h3>
            <div className="space-y-4">
                <div className="p-4 bg-white/5 rounded-xl border-l-4 border-sky-500">
                    <p className="text-[10px] text-sky-400 font-bold">ACTUALIZACIÓN v3.2</p>
                    <p className="text-xs text-slate-300">Nuevos protocolos Zigbee integrados.</p>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};