import { useState } from "react";
import { Search } from "lucide-react";
import { Badge, Table, TD, TR } from "../../../components/common";
import { useOperateurs } from "../hooks/useProductionQueries";
import { useDebounce } from "../../../hooks/useDebounce";

export function OperateursTab() {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);
  const { data: operateurs = [] } = useOperateurs(debouncedSearch);

  return (
    <div className="bg-card rounded-xl border border-border shadow-sm p-5">
      <div className="mb-4 flex items-center gap-2 bg-input-background rounded-lg px-3 py-1.5 w-64">
        <Search className="w-3.5 h-3.5 text-muted-foreground" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Rechercher un opérateur…" className="bg-transparent text-sm text-foreground placeholder-muted-foreground focus:outline-none flex-1" />
      </div>
      <Table headers={["Matricule", "Nom", "Poste", "Équipe", "Embauche", "Rendement", "OF réalisés", "Statut"]}>
        {operateurs.map((o) => (
          <TR key={o.matricule}>
            <TD mono>{o.matricule}</TD>
            <TD><span className="font-medium">{o.prenom} {o.nom}</span></TD>
            <TD>{o.poste}</TD>
            <TD>{o.ligne}</TD>
            <TD><span className="text-xs text-muted-foreground">{o.embauche}</span></TD>
            <TD>
              <div className="flex items-center gap-2">
                <div className="w-20 h-1.5 bg-muted rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${o.rendement >= 90 ? "bg-emerald-500" : o.rendement >= 80 ? "bg-amber-500" : "bg-red-500"}`} style={{ width: `${o.rendement}%` }} />
                </div>
                <span className={`text-xs font-mono font-semibold ${o.rendement >= 90 ? "text-emerald-600" : o.rendement >= 80 ? "text-amber-600" : "text-red-600"}`}>{o.rendement}%</span>
              </div>
            </TD>
            <TD mono>{o.ofRealises}</TD>
            <TD><Badge label={o.statut} /></TD>
          </TR>
        ))}
      </Table>
    </div>
  );
}
