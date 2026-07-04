import { Badge, Table, TD, TR } from "../../../components/common";
import { useOperateurs } from "../hooks/useProductionQueries";

export function OperateursTab() {
  const { data: operateurs = [] } = useOperateurs();

  return (
    <div className="bg-card rounded-xl border border-border shadow-sm p-5">
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
