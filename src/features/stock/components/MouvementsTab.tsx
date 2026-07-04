import { useState } from "react";
import { Search } from "lucide-react";
import { Table, TD, TR } from "../../../components/common";
import { fmt } from "../../../utils/format";
import { useMouvements } from "../hooks/useStockQueries";
import { useDebounce } from "../../../hooks/useDebounce";

export function MouvementsTab() {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);
  const { data: mouvements = [] } = useMouvements(debouncedSearch);

  return (
    <div className="bg-card rounded-xl border border-border shadow-sm p-5">
      <div className="mb-4 flex items-center gap-2 bg-input-background rounded-lg px-3 py-1.5 w-64">
        <Search className="w-3.5 h-3.5 text-muted-foreground" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Rechercher un mouvement…" className="bg-transparent text-sm text-foreground placeholder-muted-foreground focus:outline-none flex-1" />
      </div>
      <Table headers={["Date", "Type", "Référence", "Désignation", "Quantité", "Utilisateur", "Motif"]}>
        {mouvements.map((m) => (
          <TR key={m.id}>
            <TD><span className="text-xs font-mono text-muted-foreground">{m.date}</span></TD>
            <TD>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${m.type.includes("Entrée") ? "bg-emerald-50 text-emerald-700" : m.type.includes("Sortie") ? "bg-red-50 text-red-700" : "bg-amber-50 text-amber-700"}`}>{m.type}</span>
            </TD>
            <TD mono>{m.ref}</TD>
            <TD><span className="font-medium">{m.designation}</span></TD>
            <TD><span className={`font-mono font-semibold text-sm ${m.qte > 0 ? "text-emerald-600" : "text-red-600"}`}>{m.qte > 0 ? "+" : ""}{fmt(m.qte)}</span></TD>
            <TD>{m.user}</TD>
            <TD><span className="text-xs text-muted-foreground">{m.motif}</span></TD>
          </TR>
        ))}
      </Table>
    </div>
  );
}
