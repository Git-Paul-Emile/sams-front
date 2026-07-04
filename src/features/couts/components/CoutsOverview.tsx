import { useState } from "react";
import { DollarSign, Layers, Package, Search, TrendingUp } from "lucide-react";
import { KpiCard, SectionHeader, TabBar } from "../../../components/common";
import { calcCosts } from "../../../utils/costs";
import { fmtM } from "../../../utils/format";
import { useCommandesRentabilite, useMatieresPrix, useProductCosts } from "../hooks/useCoutsQueries";
import { useDebounce } from "../../../hooks/useDebounce";
import { AnalyseProduitTab } from "./AnalyseProduitTab";
import { CommandesTab } from "./CommandesTab";
import { MatieresPremieresTab } from "./MatieresPremieresTab";
import { RentabiliteTab } from "./RentabiliteTab";
import { VariationsTab } from "./VariationsTab";

const TABS = ["Rentabilité", "Analyse produit", "Matières premières", "Commandes", "Variations"];

export function CoutsOverview() {
  const [tab, setTab] = useState(TABS[0]);
  const [selRef, setSelRef] = useState<string | null>(null);
  const [sortKey, setSortKey] = useState<string>("tauxMarge");
  const [sortDesc, setSortDesc] = useState(true);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);
  const q = debouncedSearch.toLowerCase();

  const { data: products = [] } = useProductCosts();
  const { data: matieres = [] } = useMatieresPrix();
  const { data: commandes = [] } = useCommandesRentabilite();

  const filteredProducts = products.filter((p) => p.designation.toLowerCase().includes(q) || p.ref.toLowerCase().includes(q));
  const filteredMatieres = matieres.filter((m) => m.mat.toLowerCase().includes(q));
  const filteredCommandes = commandes.filter((c) => c.num.toLowerCase().includes(q) || c.client.toLowerCase().includes(q));

  const allComputed = products.map((p) => ({ ...p, ...calcCosts(p) }));
  const computed = filteredProducts.map((p) => ({ ...p, ...calcCosts(p) }));
  const sorted = [...computed].sort((a, b) => {
    const va = (a as unknown as Record<string, number>)[sortKey] || 0;
    const vb = (b as unknown as Record<string, number>)[sortKey] || 0;
    return sortDesc ? vb - va : va - vb;
  });

  const totalCA = allComputed.reduce((s, p) => s + p.ca, 0);
  const totalMat = allComputed.reduce((s, p) => s + p.coutMat, 0);
  const totalEmb = allComputed.reduce((s, p) => s + p.coutEmb, 0);
  const totalMarge = allComputed.reduce((s, p) => s + p.profitTotal, 0);
  const avgMarge = totalCA > 0 ? (totalMarge / totalCA) * 100 : 0;

  const selProd = products.find((p) => p.ref === selRef) ?? products[0];

  function handleSort(k: string) {
    if (sortKey === k) setSortDesc(!sortDesc);
    else { setSortKey(k); setSortDesc(true); }
  }

  return (
    <div>
      <SectionHeader title="Coûts & Marges" sub="Moteur de calcul automatique du coût de revient" />

      {/* Cockpit KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        <KpiCard label="CA total produits" value={fmtM(totalCA) + " F"} icon={DollarSign} color="bg-primary" />
        <KpiCard label="Coût matières total" value={fmtM(totalMat) + " F"} icon={Package} color="bg-amber-600" />
        <KpiCard label="Coût emballages" value={fmtM(totalEmb) + " F"} icon={Layers} color="bg-slate-600" />
        <KpiCard label="Marge brute totale" value={fmtM(totalMarge) + " F"} sub={`Taux moy: ${avgMarge.toFixed(1)}%`} icon={TrendingUp} color="bg-emerald-600" />
      </div>

      <TabBar tabs={TABS} active={tab} onChange={setTab} />

      <div className="mb-4 flex items-center gap-2 bg-input-background rounded-lg px-3 py-1.5 w-64">
        <Search className="w-3.5 h-3.5 text-muted-foreground" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Rechercher…" className="bg-transparent text-sm text-foreground placeholder-muted-foreground focus:outline-none flex-1" />
      </div>

      {tab === "Rentabilité" && (
        <RentabiliteTab sorted={sorted} sortKey={sortKey} sortDesc={sortDesc} onSort={handleSort} />
      )}

      {tab === "Analyse produit" && selProd && (
        <AnalyseProduitTab products={filteredProducts} selProd={selProd} onSelect={setSelRef} />
      )}

      {tab === "Matières premières" && (
        <MatieresPremieresTab matieres={filteredMatieres} products={products} />
      )}

      {tab === "Commandes" && <CommandesTab commandes={filteredCommandes} />}

      {tab === "Variations" && <VariationsTab computed={computed} />}
    </div>
  );
}
