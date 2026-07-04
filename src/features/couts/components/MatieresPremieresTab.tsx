import { AlertTriangle } from "lucide-react";
import { Table, TR, TD } from "../../../components/common";
import type { MatierePrix, ProdCostDef } from "../../../types/couts.types";
import { fmt } from "../../../utils/format";

export function MatieresPremieresTab({ matieres, products }: {
  matieres: MatierePrix[];
  products: ProdCostDef[];
}) {
  return (
    <div className="flex flex-col gap-4">
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
        <p className="text-sm text-amber-800">En cas de modification du prix d'une matière première, l'ERP recalcule automatiquement les coûts de revient de tous les produits concernés.</p>
      </div>
      <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
        <Table headers={["Matière première", "Prix actuel (F/Kg)", "Dernier prix", "Prix moyen pondéré", "Évolution", "Produits concernés", "Impact marge estimé"]}>
          {matieres.map((m) => {
            const impactPcts = m.produits.map((ref) => {
              const prod = products.find((p) => p.ref === ref);
              if (!prod) return 0;
              const bomItem = prod.bom.find((b) => b.mat === m.mat);
              if (!bomItem) return 0;
              const deltaUnitCost = bomItem.qteKg * (m.prixActuel - m.dernierPrix);
              return prod.prixVente > 0 ? (deltaUnitCost / prod.prixVente) * 100 : 0;
            });
            const avgImpact = impactPcts.length > 0 ? impactPcts.reduce((s, v) => s + v, 0) / impactPcts.length : 0;
            return (
              <TR key={m.mat}>
                <TD><span className="font-semibold">{m.mat}</span></TD>
                <TD><span className="font-mono font-bold">{fmt(m.prixActuel)} F</span></TD>
                <TD><span className="font-mono text-muted-foreground">{fmt(m.dernierPrix)} F</span></TD>
                <TD><span className="font-mono text-muted-foreground">{fmt(m.prixMoyen)} F</span></TD>
                <TD>
                  <span className={`text-xs font-bold font-mono ${m.up ? "text-red-600" : "text-emerald-600"}`}>{m.up ? "↑" : "↓"} {m.evolution}</span>
                </TD>
                <TD>
                  <div className="flex gap-1 flex-wrap">{m.produits.map((r) => <span key={r} className="text-[10px] px-1.5 py-0.5 bg-blue-50 text-blue-700 rounded font-mono font-medium">{r}</span>)}</div>
                </TD>
                <TD>
                  <span className={`text-xs font-bold font-mono ${Math.abs(avgImpact) > 1 ? "text-red-600" : "text-amber-600"}`}>{avgImpact > 0 ? "-" : "+"}~{Math.abs(avgImpact).toFixed(2)}% marge</span>
                </TD>
              </TR>
            );
          })}
        </Table>
      </div>
    </div>
  );
}
