import { useState } from "react";
import { FlaskConical, Paperclip, PackageMinus, Plus, Upload } from "lucide-react";
import { SectionHeader, TabBar, Table, TR, TD, Badge, Btn } from "../../../components/common";
import { fmt, fmtM } from "../../../utils/format";
import { useMatReqs, useSalesReqs } from "../hooks/useSortiesQueries";
import { NewSaleReqModal } from "./NewSaleReqModal";
import { NewMatReqModal } from "./NewMatReqModal";

export function SortiesOverview() {
  const { data: salesReqs = [] } = useSalesReqs();
  const { data: matReqs = [] } = useMatReqs();
  const [tab, setTab] = useState("Sortie vente");
  const [showSaleForm, setShowSaleForm] = useState(false);
  const [showMatForm, setShowMatForm] = useState(false);
  const [selDetail, setSelDetail] = useState<string | null>(null);

  const selSaleReq = salesReqs.find((r) => r.num === selDetail);
  const selMatReq = matReqs.find((r) => r.num === selDetail);

  return (
    <div>
      <SectionHeader title="Sorties de stock" sub="Sorties vente et sorties matières premières" />
      <TabBar tabs={["Sortie vente", "Sortie matières"]} active={tab} onChange={(t) => { setTab(t); setSelDetail(null); }} />

      {tab === "Sortie vente" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 bg-card rounded-xl border border-border shadow-sm">
            <div className="flex items-center justify-between p-5 border-b border-border">
              <p className="font-semibold text-sm">{salesReqs.length} demandes de sortie vente</p>
              <Btn sm onClick={() => setShowSaleForm(true)}><Plus className="w-3.5 h-3.5" />Nouvelle sortie</Btn>
            </div>
            <div className="p-5">
              <Table headers={["N° Sortie", "Date", "Client", "Produit", "Qté dem.", "Stock dispo", "Montant", "Statut"]}>
                {salesReqs.map((r) => (
                  <TR key={r.num} onClick={() => setSelDetail(selDetail === r.num ? null : r.num)} highlight={r.statut === "En attente de validation"}>
                    <TD mono>{r.num}</TD>
                    <TD><span className="text-xs text-muted-foreground">{r.date.split(" ")[0]}</span></TD>
                    <TD><span className="font-medium text-sm truncate max-w-[120px] block">{r.client}</span></TD>
                    <TD><span className="text-xs">{r.produit}</span></TD>
                    <TD mono>{fmt(r.qteDemandee)}</TD>
                    <TD><span className={`font-mono text-xs font-semibold ${r.stockDispo < r.qteDemandee ? "text-red-600" : "text-emerald-600"}`}>{fmt(r.stockDispo)}</span></TD>
                    <TD mono>{fmtM(r.montant)} F</TD>
                    <TD><Badge label={r.statut} /></TD>
                  </TR>
                ))}
              </Table>
            </div>
          </div>

          <div>
            {selSaleReq ? (
              <div className="bg-card rounded-xl border border-border shadow-sm p-5">
                <div className="flex items-center justify-between mb-4"><h3 className="font-bold text-sm" style={{ fontFamily: "var(--font-family-heading)" }}>{selSaleReq.num}</h3><Badge label={selSaleReq.statut} /></div>
                <div className="flex flex-col gap-2 text-sm divide-y divide-border">
                  {([
                    ["Client", selSaleReq.client], ["Commercial", selSaleReq.commercial], ["Produit", selSaleReq.produit],
                    ["Référence", selSaleReq.ref], ["Entrepôt", selSaleReq.entrepot], ["Qté demandée", fmt(selSaleReq.qteDemandee)],
                    ["Stock disponible", fmt(selSaleReq.stockDispo)], ["Prix unitaire", fmt(selSaleReq.prixUnit) + " F"],
                    ["Montant total", fmtM(selSaleReq.montant) + " F"],
                  ] as [string, string][]).map(([l, v]) => (
                    <div key={l} className="flex justify-between py-1.5"><span className="text-xs text-muted-foreground">{l}</span><span className="text-xs font-semibold font-mono">{v}</span></div>
                  ))}
                  {selSaleReq.observation && <div className="py-2"><p className="text-xs text-muted-foreground mb-1">Observation</p><p className="text-xs">{selSaleReq.observation}</p></div>}
                  {selSaleReq.valideur && (
                    <div className="py-2 bg-emerald-50 -mx-1 px-2 rounded-lg">
                      <p className="text-xs text-emerald-700 font-semibold">{selSaleReq.statut === "Validé" ? "✓ Validé" : "✗ Refusé"} par {selSaleReq.valideur}</p>
                      <p className="text-[11px] text-emerald-600 mt-0.5">{selSaleReq.dateValidation}</p>
                      {selSaleReq.commentaire && <p className="text-[11px] text-emerald-600 italic mt-0.5">"{selSaleReq.commentaire}"</p>}
                    </div>
                  )}
                </div>
              </div>
            ) : <div className="bg-card rounded-xl border border-border shadow-sm h-48 flex flex-col items-center justify-center text-muted-foreground gap-2"><PackageMinus className="w-8 h-8 opacity-30" /><p className="text-sm">Sélectionnez une demande</p></div>}
          </div>
        </div>
      )}

      {tab === "Sortie matières" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 bg-card rounded-xl border border-border shadow-sm">
            <div className="flex items-center justify-between p-5 border-b border-border">
              <p className="font-semibold text-sm">{matReqs.length} demandes de sortie matières</p>
              <Btn sm onClick={() => setShowMatForm(true)}><Plus className="w-3.5 h-3.5" />Nouvelle demande</Btn>
            </div>
            <div className="p-5">
              <Table headers={["N° Demande", "Date", "Produit à fabriquer", "OF", "Matière", "Qté dem.", "Opérateur", "Documents", "Statut"]}>
                {matReqs.map((r) => (
                  <TR key={r.num} onClick={() => setSelDetail(selDetail === r.num ? null : r.num)} highlight={r.statut === "En attente de validation"}>
                    <TD mono>{r.num}</TD>
                    <TD><span className="text-xs text-muted-foreground">{r.date.split(" ")[0]}</span></TD>
                    <TD><span className="text-xs font-medium">{r.produitFabrique}</span></TD>
                    <TD mono>{r.of}</TD>
                    <TD>{r.matiere}</TD>
                    <TD mono>{fmt(r.qteDemandee)}</TD>
                    <TD>{r.operateur}</TD>
                    <TD>
                      <div className="flex gap-1">
                        {r.docBC ? <span className="text-[10px] px-1.5 py-0.5 bg-blue-50 text-blue-700 rounded font-medium">BC</span> : <span className="text-[10px] px-1.5 py-0.5 bg-slate-100 text-slate-400 rounded">BC</span>}
                        {r.docBL ? <span className="text-[10px] px-1.5 py-0.5 bg-emerald-50 text-emerald-700 rounded font-medium">BL</span> : <span className="text-[10px] px-1.5 py-0.5 bg-slate-100 text-slate-400 rounded">BL</span>}
                      </div>
                    </TD>
                    <TD><Badge label={r.statut} /></TD>
                  </TR>
                ))}
              </Table>
            </div>
          </div>
          <div>
            {selMatReq ? (
              <div className="bg-card rounded-xl border border-border shadow-sm p-5">
                <div className="flex items-center justify-between mb-4"><h3 className="font-bold text-sm" style={{ fontFamily: "var(--font-family-heading)" }}>{selMatReq.num}</h3><Badge label={selMatReq.statut} /></div>
                <div className="flex flex-col gap-1 text-sm divide-y divide-border mb-4">
                  {([
                    ["Produit à fabriquer", selMatReq.produitFabrique], ["OF associé", selMatReq.of], ["Opérateur", selMatReq.operateur],
                    ["Ligne", selMatReq.ligne], ["Matière", selMatReq.matiere], ["Qté demandée", fmt(selMatReq.qteDemandee)],
                    ["Qté validée", selMatReq.qteValidee > 0 ? fmt(selMatReq.qteValidee) : "—"],
                  ] as [string, string][]).map(([l, v]) => <div key={l} className="flex justify-between py-1.5"><span className="text-xs text-muted-foreground">{l}</span><span className="text-xs font-semibold">{v}</span></div>)}
                </div>
                <div className="mb-4">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Documents archivés</p>
                  <div className="grid grid-cols-2 gap-2">
                    {selMatReq.docBC ? <div className="flex items-center gap-2 p-2 rounded-lg bg-blue-50 border border-blue-100 cursor-pointer hover:bg-blue-100"><Paperclip className="w-3.5 h-3.5 text-blue-600 shrink-0" /><span className="text-xs text-blue-700 truncate">{selMatReq.docBC}</span></div> : <div className="flex items-center gap-2 p-2 rounded-lg bg-muted border border-dashed border-border"><Upload className="w-3.5 h-3.5 text-muted-foreground shrink-0" /><span className="text-xs text-muted-foreground">Bon commande</span></div>}
                    {selMatReq.docBL ? <div className="flex items-center gap-2 p-2 rounded-lg bg-emerald-50 border border-emerald-100 cursor-pointer hover:bg-emerald-100"><Paperclip className="w-3.5 h-3.5 text-emerald-600 shrink-0" /><span className="text-xs text-emerald-700 truncate">{selMatReq.docBL}</span></div> : <div className="flex items-center gap-2 p-2 rounded-lg bg-muted border border-dashed border-border"><Upload className="w-3.5 h-3.5 text-muted-foreground shrink-0" /><span className="text-xs text-muted-foreground">Bon livraison</span></div>}
                  </div>
                </div>
                {selMatReq.valideur && <div className={`py-2 px-3 rounded-lg ${selMatReq.statut === "Validé" || selMatReq.statut === "Distribué à la production" ? "bg-emerald-50 border border-emerald-100" : "bg-red-50 border border-red-100"}`}><p className="text-xs font-semibold">{selMatReq.statut === "Refusé" ? "✗" : "✓"} {selMatReq.valideur}</p><p className="text-[11px] text-muted-foreground mt-0.5">{selMatReq.dateValidation}</p></div>}
              </div>
            ) : <div className="bg-card rounded-xl border border-border shadow-sm h-48 flex flex-col items-center justify-center text-muted-foreground gap-2"><FlaskConical className="w-8 h-8 opacity-30" /><p className="text-sm">Sélectionnez une demande</p></div>}
          </div>
        </div>
      )}

      {showSaleForm && <NewSaleReqModal onClose={() => setShowSaleForm(false)} />}
      {showMatForm && <NewMatReqModal onClose={() => setShowMatForm(false)} />}
    </div>
  );
}
