import { useState } from "react";
import { useSearchParams } from "react-router";
import { AlertCircle, CheckCircle, Clock, CreditCard, Download, FileText, Plus, Search } from "lucide-react";
import { SectionHeader, Btn, KpiCard, TabBar, Table, TR, TD, Badge } from "../../../components/common";
import { fmt, fmtM } from "../../../utils/format";
import { exportToExcel, exportToPdf } from "../../../utils/exportFile";
import { useFactures, usePayFacture } from "../hooks/useFacturationQueries";
import { useDebounce } from "../../../hooks/useDebounce";
import { FACTURE_HEADERS, factureRows } from "../exportHelpers";

const TABS = ["Toutes", "Payées", "En attente", "En retard", "Brouillon", "Dépôt vente"];

export function FacturationOverview({ onNew }: { onNew: () => void }) {
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("q") ?? "");
  const debouncedSearch = useDebounce(search, 300);
  const { data: factures = [] } = useFactures(debouncedSearch);
  const payFacture = usePayFacture();
  const [selNum, setSelNum] = useState<string | null>(null);
  const [tab, setTab] = useState("Toutes");

  const sel = factures.find((f) => f.num === selNum) ?? null;

  const filtered = factures.filter((f) => {
    if (tab === "Toutes") return true;
    if (tab === "En attente") return f.statut === "Émise" || f.statut === "Partiellement payée";
    if (tab === "Dépôt vente") return f.type === "Dépôt vente";
    return f.statut === tab;
  });

  return (
    <div>
      <SectionHeader title="Facturation" sub="Factures SAMS et suivi des paiements" action={<Btn onClick={onNew}><Plus className="w-4 h-4" />Nouvelle facture</Btn>} />
      <div className="grid grid-cols-4 gap-4 mb-5">
        <KpiCard label="Total facturé" value={fmtM(factures.reduce((s, f) => s + f.montant, 0)) + " M F"} icon={FileText} color="bg-primary" />
        <KpiCard label="Encaissé" value={fmtM(factures.reduce((s, f) => s + f.paye, 0)) + " M F"} icon={CheckCircle} color="bg-emerald-600" />
        <KpiCard label="En attente" value={fmtM(factures.filter((f) => f.statut !== "Payée").reduce((s, f) => s + (f.montant - f.paye), 0)) + " M F"} icon={Clock} color="bg-amber-600" />
        <KpiCard label="En retard" value={fmtM(factures.filter((f) => f.statut === "En retard").reduce((s, f) => s + (f.montant - f.paye), 0)) + " M F"} icon={AlertCircle} color="bg-red-600" alert />
      </div>

      <TabBar tabs={TABS} active={tab} onChange={setTab} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-card rounded-xl border border-border shadow-sm p-5">
          <div className="mb-4 flex items-center gap-2 bg-input-background rounded-lg px-3 py-1.5 w-64">
            <Search className="w-3.5 h-3.5 text-muted-foreground" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Rechercher une facture…" className="bg-transparent text-sm text-foreground placeholder-muted-foreground focus:outline-none flex-1" />
          </div>
          <Table headers={["N° Facture", "Client", "Émission", "Échéance", "Montant", "Payé", "Type", "Statut", ""]}>
            {filtered.map((f) => (
              <TR key={f.num} onClick={() => setSelNum(selNum === f.num ? null : f.num)}>
                <TD mono>{f.num}</TD>
                <TD><span className="font-medium text-sm">{f.client}</span></TD>
                <TD><span className="text-xs text-muted-foreground">{f.date}</span></TD>
                <TD><span className={`text-xs ${f.statut === "En retard" ? "text-red-600 font-semibold" : "text-muted-foreground"}`}>{f.echeance}</span></TD>
                <TD mono>{fmt(f.montant)} F</TD>
                <TD>
                  <div className="flex items-center gap-1.5">
                    <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden"><div className="h-full bg-emerald-500 rounded-full" style={{ width: `${(f.paye / f.montant) * 100}%` }} /></div>
                    <span className="text-[10px] font-mono text-muted-foreground">{Math.round((f.paye / f.montant) * 100)}%</span>
                  </div>
                </TD>
                <TD><span className="text-xs text-muted-foreground">{f.type}</span></TD>
                <TD><Badge label={f.statut} /></TD>
                <TD><Btn variant="ghost" sm onClick={() => exportToPdf(`Facture ${f.num}`, FACTURE_HEADERS, factureRows(f))}><Download className="w-3.5 h-3.5" /></Btn></TD>
              </TR>
            ))}
          </Table>
        </div>

        <div>
          {sel ? (
            <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
              {/* Invoice preview */}
              <div className="p-4 bg-gradient-to-br from-slate-50 to-blue-50/30 border-b border-border">
                <div className="flex items-start justify-between mb-3">
                  <div><p className="font-black text-primary text-xl" style={{ fontFamily: "var(--font-family-heading)" }}>SAMS</p><p className="text-[10px] text-muted-foreground">Savonnerie Moderne du Sénégal</p></div>
                  <div className="text-right"><p className="text-xs font-bold text-muted-foreground">FACTURE</p><p className="font-mono text-sm font-bold">{sel.num}</p></div>
                </div>
                <p className="text-xs font-semibold text-foreground">{sel.client}</p>
              </div>
              <div className="p-4">
                <div className="flex justify-between mb-4"><Badge label={sel.statut} /><span className="font-mono font-bold text-sm">{fmt(sel.montant)} F CFA</span></div>
                <div className="flex flex-col divide-y divide-border text-xs gap-0">
                  {([["Date émission", sel.date], ["Échéance", sel.echeance], ["Commercial", sel.commercial], ["Mode paiement", sel.mode], ["Type", sel.type], ["Montant payé", fmt(sel.paye) + " F"], ["Solde restant", fmt(sel.montant - sel.paye) + " F"]] as [string, string][]).map(([l, v]) => <div key={l} className="flex justify-between py-1.5"><span className="text-muted-foreground">{l}</span><span className="font-semibold font-mono">{v}</span></div>)}
                </div>
                {/* Dépôt-vente section */}
                {sel.type === "Dépôt vente" && (
                  <div className="mt-4 p-3 rounded-xl bg-indigo-50 border border-indigo-100">
                    <p className="text-xs font-bold text-indigo-700 mb-2">Dépôt-Vente</p>
                    <div className="flex flex-col gap-1 text-xs">
                      <div className="flex justify-between"><span className="text-muted-foreground">Date règl. prévue</span><span className="font-mono font-semibold">{sel.dateReglPrev || "—"}</span></div>
                      <div className="flex justify-between"><span className="text-muted-foreground">Date règl. effective</span><span className="font-mono font-semibold">{sel.dateReglEff || "—"}</span></div>
                      <div className="flex justify-between"><span className="text-muted-foreground">Montant encaissé</span><span className="font-mono font-semibold text-emerald-600">{fmt(sel.paye)} F</span></div>
                      <div className="flex justify-between"><span className="text-muted-foreground">Solde restant</span><span className={`font-mono font-semibold ${sel.montant - sel.paye > 0 ? "text-amber-600" : "text-emerald-600"}`}>{fmt(sel.montant - sel.paye)} F</span></div>
                    </div>
                  </div>
                )}
                <div className="flex gap-2 mt-4">
                  <Btn variant="secondary" sm onClick={() => exportToPdf(`Facture ${sel.num}`, FACTURE_HEADERS, factureRows(sel))}><Download className="w-3.5 h-3.5" />PDF</Btn>
                  <Btn variant="secondary" sm onClick={() => exportToExcel(`Facture ${sel.num}`, FACTURE_HEADERS, factureRows(sel))}><Download className="w-3.5 h-3.5" />Excel</Btn>
                  <Btn sm disabled={sel.statut === "Payée" || payFacture.isPending} onClick={() => payFacture.mutate({ id: sel.id, montant: sel.montant })}><CreditCard className="w-3.5 h-3.5" />Paiement</Btn>
                </div>
              </div>
            </div>
          ) : <div className="bg-card rounded-xl border border-border shadow-sm h-48 flex flex-col items-center justify-center text-muted-foreground gap-2"><FileText className="w-8 h-8 opacity-30" /><p className="text-sm">Sélectionnez une facture</p></div>}
        </div>
      </div>
    </div>
  );
}
