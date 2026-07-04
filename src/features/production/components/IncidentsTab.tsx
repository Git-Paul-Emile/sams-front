import { useState } from "react";
import { Search } from "lucide-react";
import { Badge, Table, TD, TR } from "../../../components/common";
import { useIncidents } from "../hooks/useProductionQueries";
import { useDebounce } from "../../../hooks/useDebounce";

export function IncidentsTab() {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);
  const { data: incidents = [] } = useIncidents(debouncedSearch);

  return (
    <div className="bg-card rounded-xl border border-border shadow-sm p-5">
      <div className="mb-4 flex items-center gap-2 bg-input-background rounded-lg px-3 py-1.5 w-64">
        <Search className="w-3.5 h-3.5 text-muted-foreground" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Rechercher un incident…" className="bg-transparent text-sm text-foreground placeholder-muted-foreground focus:outline-none flex-1" />
      </div>
      <Table headers={["ID", "OF", "Catégorie", "Description", "Date", "Opérateur", "Gravité", "Statut"]}>
        {incidents.map((i) => (
          <TR key={i.id}>
            <TD mono>{i.id}</TD>
            <TD mono>{i.of}</TD>
            <TD>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${i.categorie === "Panne machine" ? "bg-red-50 text-red-700" : i.categorie === "Manque matière" ? "bg-amber-50 text-amber-700" : "bg-violet-50 text-violet-700"}`}>{i.categorie}</span>
            </TD>
            <TD><span className="text-xs">{i.description}</span></TD>
            <TD><span className="text-xs text-muted-foreground">{i.date}</span></TD>
            <TD>{i.operateur}</TD>
            <TD><Badge label={i.gravite} /></TD>
            <TD><Badge label={i.statut} /></TD>
          </TR>
        ))}
      </Table>
    </div>
  );
}
