import { useState } from "react";
import { useSearchParams } from "react-router";
import { ClipboardList, Eye, Plus, Search, TrendingUp, Zap } from "lucide-react";
import { SectionHeader, Btn, KpiCard, Table, TR, TD, Badge, Timeline } from "../../../components/common";
import { fmt, fmtM } from "../../../utils/format";
import { useCommandes } from "../hooks/useVentesQueries";
import { useDebounce } from "../../../hooks/useDebounce";
import { ORDER_STATES } from "../constants";

export function VentesOverview({ onNew }: { onNew: () => void }) {
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("q") ?? "");
  const debouncedSearch = useDebounce(search, 300);
  const { data: commandes = [] } = useCommandes(debouncedSearch);
  const [sel, setSel] = useState<string | null>(null);
  const selCmd = commandes.find((v) => v.num === sel);

  const caCommandes = commandes.reduce((s, v) => s + v.montant, 0);
  const actives = commandes.filter((v) => !["Payée", "Annulée"].includes(v.statutActuel)).length;
  const conversion = commandes.length > 0
    ? ((commandes.length - commandes.filter((v) => v.statutActuel === "Devis").length) / commandes.length) * 100
    : 0;

  return (
    <div>
      <SectionHeader title="Ventes & Commandes" sub="Suivi complet du pipeline commercial" action={<Btn onClick={onNew}><Plus className="w-4 h-4" />Nouvelle commande</Btn>} />
      <div className="grid grid-cols-3 gap-4 mb-5">
        <KpiCard label="CA commandes" value={fmtM(caCommandes) + " F"} sub="ce mois" icon={TrendingUp} color="bg-emerald-600" />
        <KpiCard label="Commandes actives" value={String(actives)} sub="en cours" icon={ClipboardList} color="bg-primary" />
        <KpiCard label="Taux conversion" value={`${conversion.toFixed(0)} %`} sub="devis → commande" icon={Zap} color="bg-violet-600" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-card rounded-xl border border-border shadow-sm overflow-hidden">
          <div className="p-4 border-b border-border">
            <div className="flex items-center gap-2 bg-input-background rounded-lg px-3 py-1.5 w-64">
              <Search className="w-3.5 h-3.5 text-muted-foreground" />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Rechercher une commande…" className="bg-transparent text-sm text-foreground placeholder-muted-foreground focus:outline-none flex-1" />
            </div>
          </div>
          <Table headers={["N° CMD", "Client", "Date", "Montant", "Commercial", "État actuel", ""]}>
            {commandes.map((v) => (
              <TR key={v.num} onClick={() => setSel(sel === v.num ? null : v.num)}>
                <TD mono>{v.num}</TD>
                <TD><span className="font-medium">{v.client}</span></TD>
                <TD><span className="text-xs text-muted-foreground">{v.date}</span></TD>
                <TD><span className="font-mono font-semibold text-sm">{fmt(v.montant)} F</span></TD>
                <TD>{v.commercial}</TD>
                <TD><Badge label={v.statutActuel} /></TD>
                <TD><Eye className="w-4 h-4 text-muted-foreground" /></TD>
              </TR>
            ))}
          </Table>
        </div>

        {/* Timeline detail */}
        <div className="bg-card rounded-xl border border-border shadow-sm p-5">
          {selCmd ? (
            <>
              <div className="mb-4 pb-4 border-b border-border">
                <p className="font-bold text-sm" style={{ fontFamily: "var(--font-family-heading)" }}>{selCmd.num}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{selCmd.client}</p>
                <div className="flex items-center gap-2 mt-2"><Badge label={selCmd.statutActuel} /><span className="text-xs font-mono font-semibold text-foreground">{fmt(selCmd.montant)} F</span></div>
              </div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Historique de la commande</p>
              <Timeline events={selCmd.timeline} />
              {/* Remaining states */}
              {ORDER_STATES.filter((s) => !selCmd.timeline.map((e) => e.etat).includes(s) && s !== "Annulée").map((s) => (
                <div key={s} className="flex gap-3 mt-0">
                  <div className="flex flex-col items-center"><div className="w-7 h-7 rounded-full border-2 border-dashed border-border flex items-center justify-center"><div className="w-2 h-2 rounded-full bg-muted" /></div></div>
                  <div className="pb-4"><p className="text-sm text-muted-foreground">{s}</p></div>
                </div>
              ))}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-muted-foreground gap-2"><ClipboardList className="w-10 h-10 opacity-30" /><p className="text-sm">Sélectionnez une commande</p><p className="text-xs">pour voir la timeline</p></div>
          )}
        </div>
      </div>
    </div>
  );
}
