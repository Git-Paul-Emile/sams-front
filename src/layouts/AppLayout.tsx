import { useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router";
import { ChevronRight, Menu } from "lucide-react";
import { useAuth } from "../features/auth";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";
import { NAV_ITEMS } from "./navItems";

export function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  if (!user) return null; // ProtectedRoute garantit déjà la présence d'un user ici

  const moduleLabel = NAV_ITEMS.find((n) => location.pathname.startsWith(n.path))?.label ?? "";

  return (
    <div className="flex h-screen bg-background overflow-hidden" style={{ fontFamily: "var(--font-family-body)" }}>
      {sidebarOpen && <Sidebar user={user} />}
      <div className="flex flex-col flex-1 min-w-0">
        <TopBar user={user} onLogout={logout} />
        <div className="flex items-center gap-2 px-6 py-2 border-b border-border bg-card text-xs text-muted-foreground shrink-0">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1 rounded hover:bg-muted transition-colors mr-1"><Menu className="w-3.5 h-3.5" /></button>
          <span className="hover:text-foreground cursor-pointer" onClick={() => navigate("/dashboard")}>SAMS</span>
          <ChevronRight className="w-3 h-3" />
          <span className="text-foreground font-medium">{moduleLabel}</span>
        </div>
        <main className="flex-1 overflow-y-auto p-6"><Outlet /></main>
      </div>
    </div>
  );
}
