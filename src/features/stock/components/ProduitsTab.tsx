import { StockBadge, Table, TD, TR } from "../../../components/common";
import { fmt, fmtM } from "../../../utils/format";
import { useStockProduits } from "../hooks/useStockQueries";

export function ProduitsTab() {
  const { data: produits = [] } = useStockProduits();

  return (
    <div className="bg-card rounded-xl border border-border shadow-sm p-5">
      <Table headers={["Code", "Désignation", "Catégorie", "Stock", "Unité", "Min.", "Valeur unit.", "Valeur totale", "Statut"]}>
        {produits.map((p) => (
          <TR key={p.code}>
            <TD mono>{p.code}</TD>
            <TD><span className="font-medium">{p.designation}</span></TD>
            <TD><span className="text-xs px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-medium">{p.categorie}</span></TD>
            <TD>
              <span className={`font-mono font-semibold ${p.stock === 0 ? "text-red-600" : p.stock <= p.critique ? "text-red-500" : p.stock <= p.min ? "text-amber-600" : "text-foreground"}`}>{fmt(p.stock)}</span>
            </TD>
            <TD><span className="text-xs text-muted-foreground">{p.unite}</span></TD>
            <TD mono>{fmt(p.min)}</TD>
            <TD mono>{fmt(p.valeurUnit)} F</TD>
            <TD mono>{fmtM(p.stock * p.valeurUnit)} F</TD>
            <TD><StockBadge s={p.stock} min={p.min} crit={p.critique} /></TD>
          </TR>
        ))}
      </Table>
    </div>
  );
}
