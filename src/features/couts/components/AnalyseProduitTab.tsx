import { Table, TR, TD } from "../../../components/common";
import type { ProdCostDef } from "../../../types/couts.types";
import { calcCosts } from "../../../utils/costs";
import { fmt, fmtM } from "../../../utils/format";

export function AnalyseProduitTab({ products, selProd, onSelect }: {
  products: ProdCostDef[];
  selProd: ProdCostDef;
  onSelect: (ref: string) => void;
}) {
  const selComp = calcCosts(selProd);
  const bomTotal = selProd.bom.reduce((s, b) => s + b.qteKg * b.prixAchat, 0);
  const embTotal = selProd.emballages.reduce((s, e) => s + e.qte * e.prix, 0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* Selector */}
      <div className="bg-card rounded-xl border border-border shadow-sm p-4">
        <p className="font-bold text-sm mb-3" style={{ fontFamily: "var(--font-family-heading)" }}>Sélection produit</p>
        {products.map((p) => {
          const c = calcCosts(p);
          return (
            <button key={p.ref} onClick={() => onSelect(p.ref)} className={`w-full text-left p-3 rounded-lg mb-1 transition-colors ${selProd.ref === p.ref ? "bg-primary text-white" : "hover:bg-muted"}`}>
              <p className={`text-sm font-semibold ${selProd.ref === p.ref ? "text-white" : "text-foreground"}`}>{p.designation}</p>
              <p className={`text-[11px] mt-0.5 ${selProd.ref === p.ref ? "text-blue-200" : "text-muted-foreground"}`}>Marge: {c.tauxMarge.toFixed(1)}% · {fmtM(c.profitTotal)} F profit</p>
            </button>
          );
        })}
      </div>

      {/* Detail */}
      <div className="lg:col-span-2 flex flex-col gap-4">
        {/* Header */}
        <div className="bg-card rounded-xl border border-border shadow-sm p-5">
          <div className="flex items-start justify-between mb-4">
            <div><h3 className="font-bold text-foreground" style={{ fontFamily: "var(--font-family-heading)" }}>{selProd.designation}</h3><p className="text-xs text-muted-foreground">{selProd.ref} · {selProd.categorie}</p></div>
            <span className={`text-xs px-3 py-1 rounded-full font-bold ${selComp.tauxMarge >= 30 ? "bg-emerald-100 text-emerald-800" : selComp.tauxMarge >= 20 ? "bg-blue-50 text-blue-700" : "bg-amber-50 text-amber-700"}`}>Marge {selComp.tauxMarge.toFixed(1)}%</span>
          </div>
          {/* Cost waterfall */}
          <div className="flex flex-col gap-2">
            {[
              { l: "Coût matières premières", v: selComp.coutMat, c: "bg-amber-400", pct: (selComp.coutMat / selProd.prixVente) * 100 },
              { l: "Coût emballages", v: selComp.coutEmb, c: "bg-slate-400", pct: (selComp.coutEmb / selProd.prixVente) * 100 },
              { l: "Main-d'œuvre directe", v: selProd.coutMO, c: "bg-blue-400", pct: (selProd.coutMO / selProd.prixVente) * 100 },
              { l: "Énergie + consommables", v: selProd.coutEnergie + selProd.coutConsommables, c: "bg-violet-400", pct: ((selProd.coutEnergie + selProd.coutConsommables) / selProd.prixVente) * 100 },
              { l: "Coûts indirects", v: selProd.coutIndirects, c: "bg-slate-300", pct: (selProd.coutIndirects / selProd.prixVente) * 100 },
              { l: "Frais logistiques + comm.", v: selProd.fraisLogistiques + selProd.fraisCommerciaux + selProd.fraisAdmin, c: "bg-indigo-400", pct: ((selProd.fraisLogistiques + selProd.fraisCommerciaux + selProd.fraisAdmin) / selProd.prixVente) * 100 },
              { l: "Marge brute", v: selComp.margeBrute, c: "bg-emerald-500", pct: selComp.tauxMarge },
            ].map((r) => (
              <div key={r.l} className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground w-48 shrink-0">{r.l}</span>
                <div className="flex-1 h-4 bg-muted rounded overflow-hidden"><div className={`h-full ${r.c} rounded`} style={{ width: `${Math.max(0, Math.min(100, r.pct))}%` }} /></div>
                <span className="text-xs font-mono font-semibold w-28 text-right shrink-0">{fmt(Math.round(r.v))} F ({r.pct.toFixed(1)}%)</span>
              </div>
            ))}
          </div>
        </div>

        {/* BOM detail */}
        <div className="bg-card rounded-xl border border-border shadow-sm p-5">
          <h3 className="font-bold text-sm mb-3" style={{ fontFamily: "var(--font-family-heading)" }}>Détail des intrants (BOM)</h3>
          <Table headers={["Matière", "Incorp. %", "Qté/u", "Prix achat/Kg", "Coût/u"]}>
            {selProd.bom.map((b) => (
              <TR key={b.mat}>
                <TD><span className="font-medium">{b.mat}</span></TD>
                <TD><span className="font-mono text-xs">{b.incorp}%</span></TD>
                <TD><span className="font-mono text-xs">{b.qteKg} Kg</span></TD>
                <TD><span className="font-mono text-xs">{fmt(b.prixAchat)} F</span></TD>
                <TD><span className="font-mono font-semibold text-xs text-amber-700">{fmt(Math.round(b.qteKg * b.prixAchat))} F</span></TD>
              </TR>
            ))}
            <tr className="bg-amber-50/50 font-bold"><td colSpan={4} className="py-2 px-3 text-xs text-amber-800">Total matières</td><td className="py-2 px-3 font-mono text-xs text-amber-700 font-bold">{fmt(Math.round(bomTotal))} F</td></tr>
          </Table>
          <h3 className="font-bold text-sm mb-3 mt-4" style={{ fontFamily: "var(--font-family-heading)" }}>Emballages</h3>
          <Table headers={["Type", "Qté/u", "Prix unit.", "Coût/u"]}>
            {selProd.emballages.map((e) => (
              <TR key={e.type}>
                <TD><span className="font-medium">{e.type}</span></TD>
                <TD mono>{e.qte}</TD>
                <TD mono>{fmt(e.prix)} F</TD>
                <TD><span className="font-mono font-semibold text-xs text-slate-700">{fmt(Math.round(e.qte * e.prix))} F</span></TD>
              </TR>
            ))}
            <tr className="bg-slate-50 font-bold"><td colSpan={3} className="py-2 px-3 text-xs text-slate-700">Total emballages</td><td className="py-2 px-3 font-mono text-xs text-slate-700 font-bold">{fmt(Math.round(embTotal))} F</td></tr>
          </Table>
        </div>

        {/* Pricing summary */}
        <div className="bg-card rounded-xl border border-border shadow-sm p-5">
          <h3 className="font-bold text-sm mb-3" style={{ fontFamily: "var(--font-family-heading)" }}>Récapitulatif prix & marges</h3>
          <div className="grid grid-cols-2 gap-4">
            {[
              { l: "Coût unitaire de production", v: `${fmt(Math.round(selComp.coutUnit))} F`, c: "text-foreground" },
              { l: "Prix de revient complet", v: `${fmt(Math.round(selComp.prixRevient))} F`, c: "text-amber-700" },
              { l: "Prix de vente HT", v: `${fmt(selProd.prixVente)} F`, c: "text-blue-700" },
              { l: "Marge brute unitaire", v: `${fmt(Math.round(selComp.margeBrute))} F`, c: selComp.margeBrute > 0 ? "text-emerald-700" : "text-red-600" },
              { l: "Taux de marge", v: `${selComp.tauxMarge.toFixed(2)}%`, c: selComp.tauxMarge > 30 ? "text-emerald-700" : selComp.tauxMarge > 20 ? "text-blue-700" : "text-amber-700" },
              { l: "Profit total", v: `${fmtM(selComp.profitTotal)} F CFA`, c: selComp.profitTotal > 0 ? "text-emerald-700" : "text-red-600" },
              { l: "Qté vendue", v: `${fmt(selProd.qteVendue)} unités`, c: "text-foreground" },
              { l: "CA réalisé", v: `${fmtM(selComp.ca)} F CFA`, c: "text-primary" },
            ].map((r) => (
              <div key={r.l} className="flex flex-col gap-0.5 p-3 rounded-lg bg-muted/40">
                <span className="text-[10px] text-muted-foreground uppercase tracking-wide">{r.l}</span>
                <span className={`text-sm font-black font-mono ${r.c}`} style={{ fontFamily: "var(--font-family-heading)" }}>{r.v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
