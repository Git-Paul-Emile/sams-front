import { NavLink } from "react-router";
import { FlaskConical } from "lucide-react";
import type { AppUser } from "../types/auth.types";
import { NAV_ITEMS } from "./navItems";
import { useSidebarBadges } from "./useSidebarBadges";
import { useModuleAccess } from "../features/auth";

export function Sidebar({ user }: { user: AppUser }) {
  const badges = useSidebarBadges();
  const { hasModule } = useModuleAccess();
  const visibleItems = NAV_ITEMS.filter((item) => hasModule(item.module));
  const badgeByPath: Record<string, number | undefined> = {
    "/production": badges.production,
    "/stock": badges.stock,
    "/sorties": badges.sorties,
    "/validations": badges.validations,
  };

  return (
    <aside className="w-56 shrink-0 h-screen flex flex-col bg-sidebar border-r border-sidebar-border overflow-y-auto">
      <div className="flex items-center gap-3 px-4 py-5 border-b border-sidebar-border">
        <div className="w-9 h-9 rounded-xl bg-blue-500/25 flex items-center justify-center shrink-0"><FlaskConical className="w-5 h-5 text-blue-300" /></div>
        <div className="min-w-0"><p className="text-sm font-black text-white tracking-tight truncate" style={{ fontFamily: "var(--font-family-heading)" }}>SAMS ERP</p><p className="text-[10px] text-blue-400 truncate">Savonnerie du Sénégal</p></div>
      </div>
      <nav className="flex-1 py-3 px-2">
        {visibleItems.map((item) => {
          const Icon = item.icon;
          const badge = badgeByPath[item.path];
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg mb-0.5 transition-all text-left ${isActive ? "bg-blue-500/20 text-white border border-blue-500/30" : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-white"}`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-blue-300" : ""}`} />
                  <span className="text-sm font-medium flex-1 truncate">{item.label}</span>
                  {!!badge && <span className="w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center shrink-0">{badge}</span>}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>
      <div className="px-3 py-4 border-t border-sidebar-border">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-blue-500/30 flex items-center justify-center shrink-0"><span className="text-xs font-bold text-blue-300">{user.initials}</span></div>
          <div className="min-w-0 flex-1"><p className="text-xs font-semibold text-white truncate">{user.name}</p><p className="text-[10px] text-blue-400 truncate">{user.role}</p></div>
        </div>
      </div>
    </aside>
  );
}
