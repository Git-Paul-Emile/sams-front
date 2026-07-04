import { useState } from "react";
import { Search } from "lucide-react";
import { StockBadge, Table, TD, TR } from "../../../components/common";
import { fmt } from "../../../utils/format";
import { getStockStatus } from "../../../utils/stock";
import { useStockMatieres } from "../hooks/useStockQueries";
import { useDebounce } from "../../../hooks/useDebounce";

export function MatieresTab() {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);
  const { data: matieres = [] } = useStockMatieres(debouncedSearch);

  return (
    <div className="bg-card rounded-xl border border-border shadow-sm p-5">
      <div className="mb-4 flex items-center gap-2 bg-input-background rounded-lg px-3 py-1.5 w-64">
        <Search className="w-3.5 h-3.5 text-muted-foreground" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Rechercher une matière…" className="bg-transparent text-sm text-foreground placeholder-muted-foreground focus:outline-none flex-1" />
      </div>
      <Table headers={["Code", "Désignation", "Catégorie", "Stock", "Unité", "Min.", "Critique", "Valeur unit.", "Statut"]}>
        {matieres.map((m) => (
          <TR key={m.code}>
            <TD mono>{m.code}</TD>
            <TD><span className="font-medium">{m.designation}</span></TD>
            <TD>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${m.categorie === "Base chimique" ? "bg-blue-50 text-blue-700" : m.categorie === "Conservateur" ? "bg-violet-50 text-violet-700" : m.categorie === "Parfum" ? "bg-pink-50 text-pink-700" : m.categorie === "Additif" ? "bg-amber-50 text-amber-700" : "bg-slate-100 text-slate-600"}`}>{m.categorie}</span>
            </TD>
            <TD>
              <span className={`font-mono font-semibold ${getStockStatus(m.stock, m.min, m.critique) === "critique" ? "text-red-600" : getStockStatus(m.stock, m.min, m.critique) === "minimum" ? "text-amber-600" : "text-foreground"}`}>{fmt(m.stock)}</span>
            </TD>
            <TD><span className="text-xs text-muted-foreground">{m.unite}</span></TD>
            <TD mono>{fmt(m.min)}</TD>
            <TD mono>{fmt(m.critique)}</TD>
            <TD mono>{fmt(m.valeurUnit)} F</TD>
            <TD><StockBadge s={m.stock} min={m.min} crit={m.critique} /></TD>
          </TR>
        ))}
      </Table>
    </div>
  );
}
