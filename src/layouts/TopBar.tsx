import { LogOut, Search } from "lucide-react";
import type { AppUser } from "../types/auth.types";
import { NotificationBell } from "../features/notifications";

export function TopBar({ user, onLogout }: { user: AppUser; onLogout: () => void }) {
  return (
    <header className="h-14 bg-card border-b border-border flex items-center justify-between px-5 shrink-0">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 bg-input-background rounded-lg px-3 py-1.5 w-60">
          <Search className="w-3.5 h-3.5 text-muted-foreground" />
          <input placeholder="Rechercher…" className="bg-transparent text-sm text-foreground placeholder-muted-foreground focus:outline-none flex-1" />
        </div>
      </div>
      <div className="flex items-center gap-3">
        <NotificationBell />
        <div className="flex items-center gap-2.5 pl-3 border-l border-border">
          <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center"><span className="text-[11px] font-bold text-white">{user.initials}</span></div>
          <div className="hidden sm:block"><p className="text-xs font-semibold text-foreground">{user.name}</p><p className="text-[10px] text-muted-foreground">{user.role}</p></div>
          <button onClick={onLogout} className="p-1.5 rounded-lg hover:bg-muted ml-1"><LogOut className="w-3.5 h-3.5 text-muted-foreground" /></button>
        </div>
      </div>
    </header>
  );
}
