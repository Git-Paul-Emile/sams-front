import { Table, TR, TD } from "../../../components/common";
import type { ComputedProduct } from "../types";
import { fmt } from "../../../utils/format";

export function VariationsTab({ computed }: { computed: ComputedProduct[] }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="bg-card rounded-xl border border-border shadow-sm p-5">
        <h3 className="font-bold text-sm mb-4" style={{ fontFamily: "var(--font-family-heading)" }}>Analyse des écarts – Théorique vs Réel</h3>
        <Table headers={["Produit", "Coût théorique/u", "Coût réel/u", "Écart F", "Écart %", "Rendement", "Statut"]}>
          {computed.map((p) => {
            const ecartF = Math.round(p.coutUnit) - p.coutTheoriqueUnit;
            const ecartPct = p.coutTheoriqueUnit > 0 ? ((p.coutUnit - p.coutTheoriqueUnit) / p.coutTheoriqueUnit) * 100 : 0;
            const rend = p.qteProduite > 0 ? (p.qteReel / p.qteProduite) * 100 : 0;
            return (
              <TR key={p.ref}>
                <TD><div><p className="font-semibold">{p.designation}</p><p className="text-[10px] text-muted-foreground">{p.ref}</p></div></TD>
                <TD mono>{fmt(p.coutTheoriqueUnit)} F</TD>
                <TD mono>{fmt(Math.round(p.coutUnit))} F</TD>
                <TD>
                  <span className={`font-mono text-xs font-semibold ${ecartF > 0 ? "text-red-600" : ecartF < 0 ? "text-emerald-600" : "text-muted-foreground"}`}>{ecartF > 0 ? "+" : ""}{fmt(ecartF)} F</span>
                </TD>
                <TD>
                  <span className={`font-mono text-xs font-bold ${Math.abs(ecartPct) > 5 ? "text-red-600" : Math.abs(ecartPct) > 2 ? "text-amber-600" : "text-emerald-600"}`}>{ecartPct > 0 ? "+" : ""}{ecartPct.toFixed(2)}%</span>
                </TD>
                <TD>
                  <div className="flex items-center gap-1.5">
                    <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden"><div className={`h-full rounded-full ${rend >= 95 ? "bg-emerald-500" : rend >= 80 ? "bg-amber-500" : "bg-red-500"}`} style={{ width: `${Math.min(100, rend)}%` }} /></div>
                    <span className="font-mono text-xs font-semibold">{rend.toFixed(0)}%</span>
                  </div>
                </TD>
                <TD>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${Math.abs(ecartPct) <= 2 ? "bg-emerald-50 text-emerald-700" : Math.abs(ecartPct) <= 5 ? "bg-amber-50 text-amber-700" : "bg-red-50 text-red-700"}`}>{Math.abs(ecartPct) <= 2 ? "Conforme" : Math.abs(ecartPct) <= 5 ? "Attention" : "Hors norme"}</span>
                </TD>
              </TR>
            );
          })}
        </Table>
      </div>
      <div className="bg-card rounded-xl border border-border p-5 shadow-sm">
        <h3 className="font-bold text-sm mb-4" style={{ fontFamily: "var(--font-family-heading)" }}>Top produits les plus rentables vs moins rentables</h3>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <p className="text-xs font-semibold text-emerald-700 mb-3 uppercase tracking-wide">🏆 Top rentables</p>
            {[...computed].sort((a, b) => b.tauxMarge - a.tauxMarge).slice(0, 3).map((p, i) => (
              <div key={p.ref} className="flex items-center gap-3 mb-2 p-2 rounded-lg bg-emerald-50">
                <span className="text-xs font-bold text-emerald-700 w-4">{i + 1}</span>
                <div className="flex-1 min-w-0"><p className="text-xs font-semibold truncate">{p.designation}</p></div>
                <span className="text-xs font-bold font-mono text-emerald-700">{p.tauxMarge.toFixed(1)}%</span>
              </div>
            ))}
          </div>
          <div>
            <p className="text-xs font-semibold text-red-700 mb-3 uppercase tracking-wide">⚠ Moins rentables</p>
            {[...computed].sort((a, b) => a.tauxMarge - b.tauxMarge).slice(0, 3).map((p, i) => (
              <div key={p.ref} className="flex items-center gap-3 mb-2 p-2 rounded-lg bg-red-50">
                <span className="text-xs font-bold text-red-700 w-4">{i + 1}</span>
                <div className="flex-1 min-w-0"><p className="text-xs font-semibold truncate">{p.designation}</p></div>
                <span className="text-xs font-bold font-mono text-red-700">{p.tauxMarge.toFixed(1)}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
