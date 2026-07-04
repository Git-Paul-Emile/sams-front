import { Download } from "lucide-react";
import { Btn } from "../../../components/common";
import { exportToExcel, exportToPdf } from "../../../utils/exportFile";
import { fmt, fmtM } from "../../../utils/format";
import type { ComputedProduct } from "../types";

const RENTABILITE_HEADERS = [
  "Produit", "Référence", "Catégorie", "Coût Mat.", "Coût Emb.", "Coût Prod.", "Coût/u",
  "Prix revient", "Prix vente", "Marge/u", "Marge %", "Profit total", "Qté vendue", "CA",
];

function toRentabiliteRows(products: ComputedProduct[]) {
  return products.map((p) => [
    p.designation, p.ref, p.categorie,
    Math.round(p.coutMat), Math.round(p.coutEmb), Math.round(p.coutProd), Math.round(p.coutUnit),
    Math.round(p.prixRevient), p.prixVente, Math.round(p.margeBrute), `${p.tauxMarge.toFixed(1)}%`,
    Math.round(p.profitTotal), p.qteVendue, Math.round(p.ca),
  ]);
}

function SortTH({ label, k, sortKey, sortDesc, onSort }: {
  label: string;
  k: string;
  sortKey: string;
  sortDesc: boolean;
  onSort: (k: string) => void;
}) {
  return (
    <th
      className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide py-3 px-3 first:pl-0 cursor-pointer hover:text-foreground"
      onClick={() => onSort(k)}
    >
      {label}{sortKey === k ? (sortDesc ? " ↓" : " ↑") : ""}
    </th>
  );
}

export function RentabiliteTab({ sorted, sortKey, sortDesc, onSort }: {
  sorted: ComputedProduct[];
  sortKey: string;
  sortDesc: boolean;
  onSort: (k: string) => void;
}) {
  return (
    <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <p className="font-semibold text-sm">Tableau de rentabilité – {sorted.length} produits</p>
        <div className="flex gap-2">
          <Btn variant="secondary" sm onClick={() => exportToPdf("Tableau de rentabilité", RENTABILITE_HEADERS, toRentabiliteRows(sorted))}><Download className="w-3.5 h-3.5" />PDF</Btn>
          <Btn variant="secondary" sm onClick={() => exportToExcel("Tableau de rentabilité", RENTABILITE_HEADERS, toRentabiliteRows(sorted))}><Download className="w-3.5 h-3.5" />Excel</Btn>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-border bg-muted/30">
            <SortTH label="Produit" k="designation" sortKey={sortKey} sortDesc={sortDesc} onSort={onSort} />
            <SortTH label="Coût Mat." k="coutMat" sortKey={sortKey} sortDesc={sortDesc} onSort={onSort} />
            <SortTH label="Coût Emb." k="coutEmb" sortKey={sortKey} sortDesc={sortDesc} onSort={onSort} />
            <SortTH label="Coût Prod." k="coutProd" sortKey={sortKey} sortDesc={sortDesc} onSort={onSort} />
            <SortTH label="Coût/u" k="coutUnit" sortKey={sortKey} sortDesc={sortDesc} onSort={onSort} />
            <SortTH label="Prix revient" k="prixRevient" sortKey={sortKey} sortDesc={sortDesc} onSort={onSort} />
            <SortTH label="Prix vente" k="prixVente" sortKey={sortKey} sortDesc={sortDesc} onSort={onSort} />
            <SortTH label="Marge/u" k="margeBrute" sortKey={sortKey} sortDesc={sortDesc} onSort={onSort} />
            <SortTH label="Marge %" k="tauxMarge" sortKey={sortKey} sortDesc={sortDesc} onSort={onSort} />
            <SortTH label="Profit total" k="profitTotal" sortKey={sortKey} sortDesc={sortDesc} onSort={onSort} />
            <SortTH label="Qté vendue" k="qteVendue" sortKey={sortKey} sortDesc={sortDesc} onSort={onSort} />
            <SortTH label="CA" k="ca" sortKey={sortKey} sortDesc={sortDesc} onSort={onSort} />
          </tr></thead>
          <tbody className="divide-y divide-border">
            {sorted.map((p) => {
              const neg = p.margeBrute < 0; const low = p.tauxMarge < 20 && !neg;
              return (
                <tr key={p.ref} className={`hover:bg-muted/30 transition-colors ${neg ? "bg-red-50/50" : low ? "bg-amber-50/30" : ""}`}>
                  <td className="py-3 px-3 first:pl-0"><div><p className="font-semibold text-sm">{p.designation}</p><p className="text-[10px] text-muted-foreground">{p.ref} · {p.categorie}</p></div></td>
                  <td className="py-3 px-3 font-mono text-xs">{fmt(Math.round(p.coutMat))} F</td>
                  <td className="py-3 px-3 font-mono text-xs">{fmt(Math.round(p.coutEmb))} F</td>
                  <td className="py-3 px-3 font-mono text-xs">{fmt(Math.round(p.coutProd))} F</td>
                  <td className="py-3 px-3 font-mono text-xs font-semibold">{fmt(Math.round(p.coutUnit))} F</td>
                  <td className="py-3 px-3 font-mono text-xs font-semibold text-amber-700">{fmt(Math.round(p.prixRevient))} F</td>
                  <td className="py-3 px-3 font-mono text-xs font-bold">{fmt(p.prixVente)} F</td>
                  <td className="py-3 px-3 font-mono text-xs font-semibold"><span className={neg ? "text-red-600" : low ? "text-amber-600" : "text-emerald-600"}>{fmt(Math.round(p.margeBrute))} F</span></td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-1.5">
                      <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden"><div className={`h-full rounded-full ${neg ? "bg-red-500" : low ? "bg-amber-500" : "bg-emerald-500"}`} style={{ width: `${Math.max(0, Math.min(100, p.tauxMarge))}%` }} /></div>
                      <span className={`font-mono text-xs font-bold ${neg ? "text-red-600" : low ? "text-amber-600" : "text-emerald-600"}`}>{p.tauxMarge.toFixed(1)}%</span>
                    </div>
                  </td>
                  <td className="py-3 px-3 font-mono text-xs font-semibold"><span className={p.profitTotal < 0 ? "text-red-600" : "text-emerald-700"}>{fmtM(p.profitTotal)} F</span></td>
                  <td className="py-3 px-3 font-mono text-xs">{fmt(p.qteVendue)}</td>
                  <td className="py-3 px-3 font-mono text-xs font-semibold">{fmtM(p.ca)} F</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
