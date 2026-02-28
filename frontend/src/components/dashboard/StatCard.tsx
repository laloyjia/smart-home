interface StatCardProps {
  title: string;
  value: string | number;
  color?: string;
  isLive?: boolean;
}

export const StatCard = ({ title, value, color = "text-white", isLive }: StatCardProps) => (
  <div className="bg-[#1e293b] p-8 rounded-3xl border border-slate-700 hover:border-sky-500/30 transition-all shadow-xl">
    <div className="text-slate-400 text-sm uppercase font-medium tracking-wider">{title}</div>
    <div className={`text-5xl font-black mt-4 ${color} flex items-center gap-3`}>
      {value}
      {isLive && <span className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></span>}
    </div>
  </div>
);