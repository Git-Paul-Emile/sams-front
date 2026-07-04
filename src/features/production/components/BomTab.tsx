import { useState } from "react";
import { Download, FlaskConical } from "lucide-react";
import { Btn, Table, TD, TR } from "../../../components/common";
import { useBom, useProductionStockProduits } from "../hooks/useProductionQueries";

export function BomTab() {
  const [selBom, setSelBom] = useState<string | null>(null);
  const { data: bomEntries = [] } = useBom();
  const { data: stockProduits = [] } = useProductionStockProduits();
  const produits = stockProduits.map((p) => p.designation);
  const selEntry = selBom ? bomEntries.find((b) => b.produit === selBom) : undefined;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div className="bg-card rounded-xl border border-border shadow-sm p-5">
        <h3 className="font-bold text-sm mb-3" style={{ fontFamily: "var(--font-family-heading)" }}>Produits SAMS</h3>
        {produits.map((p) => (
          <button
            key={p}
            onClick={() => setSelBom(p)}
            className={`w-full text-left px-3 py-2.5 rounded-lg text-sm mb-0.5 transition-colors ${selBom === p ? "bg-primary text-white" : "hover:bg-muted text-foreground"}`}
          >
            {p}
          </button>
        ))}
      </div>
      <div className="lg:col-span-2 bg-card rounded-xl border border-border shadow-sm p-5">
        {selBom && selEntry ? (
          <>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-sm" style={{ fontFamily: "var(--font-family-heading)" }}>{selBom}</h3>
                <p className="text-xs text-muted-foreground">Formule v2.1 – Validée 01/01/2024</p>
              </div>
              <Btn variant="secondary" sm><Download className="w-3 h-3" />Export</Btn>
            </div>
            <Table headers={["Intrant", "Catégorie", "Qté/unité", "Unité"]}>
              {selEntry.items.map((r, i) => (
                <TR key={i}>
                  <TD><span className="font-medium">{r.intrant}</span></TD>
                  <TD>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${r.categorie === "Base chimique" ? "bg-blue-50 text-blue-700" : r.categorie === "Conservateur" ? "bg-violet-50 text-violet-700" : r.categorie === "Parfum" ? "bg-pink-50 text-pink-700" : r.categorie === "Additif" ? "bg-amber-50 text-amber-700" : "bg-slate-100 text-slate-600"}`}>{r.categorie}</span>
                  </TD>
                  <TD mono>{r.qte}</TD>
                  <TD>{r.unite}</TD>
                </TR>
              ))}
            </Table>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-48 text-muted-foreground">
            <FlaskConical className="w-10 h-10 mb-2 opacity-30" />
            <p className="text-sm">Sélectionnez un produit</p>
          </div>
        )}
      </div>
    </div>
  );
}
