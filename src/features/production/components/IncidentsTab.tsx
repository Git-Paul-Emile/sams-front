import { Badge, Table, TD, TR } from "../../../components/common";
import { useIncidents } from "../hooks/useProductionQueries";

export function IncidentsTab() {
  const { data: incidents = [] } = useIncidents();

  return (
    <div className="bg-card rounded-xl border border-border shadow-sm p-5">
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
