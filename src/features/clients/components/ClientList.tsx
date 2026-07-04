import { useState } from "react";
import { Search } from "lucide-react";
import { Badge } from "../../../components/common";
import { fmtM } from "../../../utils/format";
import { useClients } from "../hooks/useClientsQueries";
import type { Client } from "../../../types/clients.types";

export function ClientList({ selectedId, onSelect }: { selectedId: string | null; onSelect: (c: Client) => void }) {
  const { data: clients = [], isLoading } = useClients();
  const [search, setSearch] = useState("");

  const filtered = clients.filter(
    (c) => c.raison.toLowerCase().includes(search.toLowerCase()) || c.code.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2 bg-input-background rounded-lg px-3 py-1.5">
          <Search className="w-3.5 h-3.5 text-muted-foreground" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Rechercher…" className="bg-transparent text-sm text-foreground placeholder-muted-foreground focus:outline-none flex-1" />
        </div>
      </div>
      <div className="divide-y divide-border max-h-[60vh] overflow-y-auto">
        {isLoading && <p className="p-4 text-sm text-muted-foreground">Chargement…</p>}
        {filtered.map((c) => (
          <button key={c.id} onClick={() => onSelect(c)} className={`w-full text-left p-4 hover:bg-muted/40 transition-colors ${selectedId === c.id ? "bg-blue-50 border-l-2 border-primary" : ""}`}>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0"><span className="text-xs font-bold text-primary">{c.raison.slice(0, 2).toUpperCase()}</span></div>
              <div className="min-w-0 flex-1"><p className="text-sm font-semibold truncate">{c.raison}</p><p className="text-xs text-muted-foreground">{c.zone} · {c.commercial}</p></div>
              <Badge label={c.statut} />
            </div>
            {c.encours > 0 && <div className="mt-2 ml-12 text-[11px] text-amber-600 font-medium">Encours: {fmtM(c.encours)} F</div>}
          </button>
        ))}
      </div>
    </div>
  );
}
