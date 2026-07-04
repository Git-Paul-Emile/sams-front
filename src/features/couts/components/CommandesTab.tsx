import { Table, TR, TD } from "../../../components/common";
import type { CommandeRentabilite } from "../../../types/couts.types";
import { fmtM } from "../../../utils/format";

export function CommandesTab({ commandes }: { commandes: CommandeRentabilite[] }) {
  return (
    <div className="bg-card rounded-xl border border-border shadow-sm p-5">
      <h3 className="font-bold text-sm mb-4" style={{ fontFamily: "var(--font-family-heading)" }}>Analyse de rentabilité par commande</h3>
      <Table headers={["N° CMD", "Client", "CA", "Coût produits", "Marge brute", "Taux marge", "Rentabilité"]}>
        {commandes.map((c) => (
          <TR key={c.num}>
            <TD mono>{c.num}</TD>
            <TD><span className="font-medium">{c.client}</span></TD>
            <TD mono>{fmtM(c.montant)} F</TD>
            <TD mono>{fmtM(c.coutProduits)} F</TD>
            <TD><span className="font-mono font-semibold text-emerald-600">{fmtM(c.marge)} F</span></TD>
            <TD>
              <div className="flex items-center gap-2">
                <div className="w-20 h-1.5 bg-muted rounded-full overflow-hidden"><div className={`h-full rounded-full ${c.tauxMarge >= 35 ? "bg-emerald-500" : c.tauxMarge >= 25 ? "bg-blue-500" : "bg-amber-500"}`} style={{ width: `${c.tauxMarge}%` }} /></div>
                <span className="text-xs font-mono font-bold">{c.tauxMarge.toFixed(1)}%</span>
              </div>
            </TD>
            <TD>
              <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${c.niveau === "Très rentable" ? "bg-emerald-100 text-emerald-800" : c.niveau === "Rentable" ? "bg-blue-100 text-blue-800" : c.niveau === "Faible marge" ? "bg-amber-100 text-amber-800" : "bg-red-100 text-red-800"}`}>{c.niveau}</span>
            </TD>
          </TR>
        ))}
      </Table>
    </div>
  );
}
