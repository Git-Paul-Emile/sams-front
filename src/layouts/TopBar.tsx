import { useState } from "react";
import { useNavigate } from "react-router";
import { LogOut, Search } from "lucide-react";
import type { AppUser } from "../types/auth.types";
import { NotificationBell } from "../features/notifications";
import { useDebounce } from "../hooks/useDebounce";
import { useGlobalSearch } from "../features/search/hooks/useGlobalSearch";

const TYPE_LABELS: Record<string, string> = {
  client: "Client",
  commande: "Commande",
  facture: "Facture",
  achat: "Achat",
};

export function TopBar({ user, onLogout }: { user: AppUser; onLogout: () => void }) {
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const debouncedQ = useDebounce(q, 300);
  const { data: results = [] } = useGlobalSearch(debouncedQ);

  function handleSelect(path: string) {
    setOpen(false);
    setQ("");
    navigate(path);
  }

  return (
    <header className="h-14 bg-card border-b border-border flex items-center justify-between px-5 shrink-0">
      <div className="flex items-center gap-3 relative">
        <div className="flex items-center gap-2 bg-input-background rounded-lg px-3 py-1.5 w-60">
          <Search className="w-3.5 h-3.5 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => { setQ(e.target.value); setOpen(true); }}
            onFocus={() => setOpen(true)}
            onBlur={() => setTimeout(() => setOpen(false), 150)}
            placeholder="Rechercher…"
            className="bg-transparent text-sm text-foreground placeholder-muted-foreground focus:outline-none flex-1"
          />
        </div>
        {open && debouncedQ.trim().length > 1 && (
          <div className="absolute top-full left-0 mt-1 w-80 bg-card border border-border rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
            {results.length === 0 ? (
              <p className="p-3 text-xs text-muted-foreground">Aucun résultat</p>
            ) : (
              results.map((r) => (
                <button
                  key={`${r.type}-${r.id}`}
                  onMouseDown={() => handleSelect(r.path)}
                  className="w-full text-left px-3 py-2 hover:bg-muted/40 flex items-center gap-2 border-b border-border last:border-0"
                >
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-primary/10 text-primary font-medium shrink-0">{TYPE_LABELS[r.type]}</span>
                  <span className="text-sm truncate">{r.label}</span>
                </button>
              ))
            )}
          </div>
        )}
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
