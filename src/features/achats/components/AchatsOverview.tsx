import { useState } from "react";
import { useSearchParams } from "react-router";
import { Building2, Eye, Plus, Search, ShoppingCart, Truck } from "lucide-react";
import { SectionHeader, Btn, KpiCard, Table, TR, TD, Badge } from "../../../components/common";
import { fmt, fmtM } from "../../../utils/format";
import { useAchats } from "../hooks/useAchatsQueries";
import { useDebounce } from "../../../hooks/useDebounce";
import type { Achat } from "../../../types/achats.types";

export function AchatsOverview({ onNew, onView }: { onNew: () => void; onView: (achat: Achat) => void }) {
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("q") ?? "");
  const debouncedSearch = useDebounce(search, 300);
  const { data: achats = [] } = useAchats(debouncedSearch);

  const totalAchats = achats.reduce((s, a) => s + a.montant, 0);
  const enCours = achats.filter((a) => a.statut !== "Reçu").length;
  const fournisseurs = new Set(achats.map((a) => a.fournisseur)).size;

  return (
    <div>
      <SectionHeader title="Achats & Approvisionnements" sub="Bons de commande fournisseurs" action={<Btn onClick={onNew}><Plus className="w-4 h-4" />Nouveau BC</Btn>} />
      <div className="grid grid-cols-3 gap-4 mb-5">
        <KpiCard label="Achats du mois" value={fmtM(totalAchats) + " F"} icon={ShoppingCart} color="bg-primary" />
        <KpiCard label="Commandes en cours" value={String(enCours)} sub="en attente livraison" icon={Truck} color="bg-amber-600" />
        <KpiCard label="Fournisseurs actifs" value={String(fournisseurs)} sub="sur ce périmètre" icon={Building2} color="bg-slate-600" />
      </div>
      <div className="bg-card rounded-xl border border-border shadow-sm p-5">
        <div className="mb-4 flex items-center gap-2 bg-input-background rounded-lg px-3 py-1.5 w-64">
          <Search className="w-3.5 h-3.5 text-muted-foreground" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Rechercher un BC…" className="bg-transparent text-sm text-foreground placeholder-muted-foreground focus:outline-none flex-1" />
        </div>
        <Table headers={["N° BC", "Fournisseur", "Date", "Livraison prévue", "Articles", "Montant", "Statut", ""]}>
          {achats.map((a) => (
            <TR key={a.id}>
              <TD mono>{a.num}</TD>
              <TD><span className="font-medium">{a.fournisseur}</span></TD>
              <TD><span className="text-xs text-muted-foreground">{a.date}</span></TD>
              <TD><span className="text-xs text-muted-foreground">{a.livraison}</span></TD>
              <TD mono>{a.articles}</TD>
              <TD><span className="font-mono font-semibold text-sm">{fmt(a.montant)} F</span></TD>
              <TD><Badge label={a.statut} /></TD>
              <TD><Btn variant="ghost" sm onClick={() => onView(a)}><Eye className="w-3.5 h-3.5" />Voir</Btn></TD>
            </TR>
          ))}
        </Table>
      </div>
    </div>
  );
}
