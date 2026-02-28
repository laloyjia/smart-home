import { useState, useEffect } from "react";
import { Sidebar } from "./components/layout/Sidebar";
import { DashboardView } from "./components/dashboard/DashboardView";
import { UserManagement } from "./components/users/UserManagement";
import { ControlPanel } from "./components/control-panel/ControlPanel";
import { EventLogs } from "./components/logs/EventLogs";
import { Login } from "./components/layout/Login";
import api from "./api/axios";

function App() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
  
  // Estados Globales
  const [users, setUsers] = useState([]);
  const [properties, setProperties] = useState([]);
  const [logs, setLogs] = useState([]);
  const [stats, setStats] = useState({ totalUsers: 0, totalHomes: 0, totalRooms: 0, onlineUsers: 0 });
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const [uRes, pRes, lRes, sRes] = await Promise.all([
        api.get("/admin/users"),
        api.get("/admin/properties"),
        api.get("/admin/logs"),
        api.get("/admin/stats")
      ]);
      setUsers(uRes.data || []);
      setProperties(pRes.data || []);
      setLogs(lRes.data || []);
      setStats(sRes.data || { totalUsers: 0, totalHomes: 0, totalRooms: 0, onlineUsers: 0 });
    } catch (error) {
      console.error("Error de sincronización:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchData();
  }, [token]);

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard": 
        return <DashboardView stats={stats} />;
      case "users":     
        return <UserManagement users={users} refresh={fetchData} api={api} />;
      case "logs":      
        return <EventLogs logs={logs} />;
      case "control":   
        return <ControlPanel properties={properties} users={users} refresh={fetchData} api={api} />;
      default:          
        return <DashboardView stats={stats} />;
    }
  };

  if (!token) return <Login onLoginSuccess={(newToken: string) => setToken(newToken)} />;

  return (
    <div className="flex h-screen bg-[#070b14] text-white overflow-hidden">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1 overflow-y-auto p-10 relative bg-[radial-gradient(circle_at_50%_0%,_#1e1b4b_0%,_transparent_50%)]">
        {renderContent()}
      </main>
    </div>
  );
}

export default App;