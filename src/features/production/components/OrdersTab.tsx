import { Activity, AlertCircle, Factory, Gauge, Package } from "lucide-react";
import { Badge, Table, TD, TR } from "../../../components/common";
import { fmt } from "../../../utils/format";
import { useIncidents, useProdOrders } from "../hooks/useProductionQueries";

export function OrdersTab() {
  const { data: orders = [] } = useProdOrders();
  const { data: incidents = [] } = useIncidents();

  const enCours = orders.filter((o) => o.statut === "En cours");
  const productionJour = enCours.reduce((s, o) => s + o.qteReel, 0);
  const rendements = orders.filter((o) => o.rendement > 0).map((o) => o.rendement);
  const rendementMoyen = rendements.length > 0 ? rendements.reduce((s, r) => s + r, 0) / rendements.length : 0;
  const incidentsOuverts = incidents.filter((i) => i.statut === "Ouvert").length;
  const lotsProduits = orders.filter((o) => o.statut === "Terminé").length;

  const KPIS = [
    { l: "OF en cours", v: String(enCours.length), i: Activity, c: "text-blue-600" },
    { l: "Production du jour", v: `${fmt(productionJour)} u.`, i: Factory, c: "text-indigo-600" },
    { l: "Rendement moyen", v: `${rendementMoyen.toFixed(0)} %`, i: Gauge, c: "text-emerald-600" },
    { l: "Incidents ouverts", v: String(incidentsOuverts), i: AlertCircle, c: "text-red-600" },
    { l: "Lots produits", v: String(lotsProduits), i: Package, c: "text-slate-600" },
  ];

  return (
    <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
      <div className="grid grid-cols-5 divide-x divide-border border-b border-border">
        {KPIS.map((k) => {
          const I = k.i;
          return (
            <div key={k.l} className="flex items-center gap-3 p-4">
              <I className={`w-5 h-5 ${k.c} shrink-0`} />
              <div>
                <p className="text-lg font-bold" style={{ fontFamily: "var(--font-family-heading)" }}>{k.v}</p>
                <p className="text-[11px] text-muted-foreground">{k.l}</p>
              </div>
            </div>
          );
        })}
      </div>
      <div className="p-5">
        <Table headers={["OF", "Produit", "Ligne", "Qté prév.", "Qté réelle", "Rend.", "Responsable", "Début", "Fin", "Statut"]}>
          {orders.map((o) => (
            <TR key={o.id}>
              <TD mono>{o.id}</TD>
              <TD><span className="font-medium">{o.produit}</span></TD>
              <TD>{o.ligne}</TD>
              <TD mono>{fmt(o.qtePrev)}</TD>
              <TD mono>{o.qteReel > 0 ? fmt(o.qteReel) : "—"}</TD>
              <TD>
                {o.rendement > 0 ? (
                  <span className={`font-semibold font-mono text-xs ${o.rendement >= 90 ? "text-emerald-600" : o.rendement >= 75 ? "text-amber-600" : "text-red-600"}`}>{o.rendement}%</span>
                ) : (
                  <span className="text-muted-foreground text-xs">—</span>
                )}
              </TD>
              <TD>{o.responsable}</TD>
              <TD><span className="text-xs text-muted-foreground">{o.debut}</span></TD>
              <TD><span className="text-xs text-muted-foreground">{o.fin}</span></TD>
              <TD><Badge label={o.statut} /></TD>
            </TR>
          ))}
        </Table>
      </div>
    </div>
  );
}
