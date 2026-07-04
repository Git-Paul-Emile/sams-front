import { useState } from "react";
import { DollarSign, Layers, Package, TrendingUp } from "lucide-react";
import { KpiCard, SectionHeader, TabBar } from "../../../components/common";
import { calcCosts } from "../../../utils/costs";
import { fmtM } from "../../../utils/format";
import { useCommandesRentabilite, useMatieresPrix, useProductCosts } from "../hooks/useCoutsQueries";
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

  const { data: products = [] } = useProductCosts();
  const { data: matieres = [] } = useMatieresPrix();
  const { data: commandes = [] } = useCommandesRentabilite();

  const computed = products.map((p) => ({ ...p, ...calcCosts(p) }));
  const sorted = [...computed].sort((a, b) => {
    const va = (a as unknown as Record<string, number>)[sortKey] || 0;
    const vb = (b as unknown as Record<string, number>)[sortKey] || 0;
    return sortDesc ? vb - va : va - vb;
  });

  const totalCA = computed.reduce((s, p) => s + p.ca, 0);
  const totalMat = computed.reduce((s, p) => s + p.coutMat, 0);
  const totalEmb = computed.reduce((s, p) => s + p.coutEmb, 0);
  const totalMarge = computed.reduce((s, p) => s + p.profitTotal, 0);
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

      {tab === "Rentabilité" && (
        <RentabiliteTab sorted={sorted} sortKey={sortKey} sortDesc={sortDesc} onSort={handleSort} />
      )}

      {tab === "Analyse produit" && selProd && (
        <AnalyseProduitTab products={products} selProd={selProd} onSelect={setSelRef} />
      )}

      {tab === "Matières premières" && (
        <MatieresPremieresTab matieres={matieres} products={products} />
      )}

      {tab === "Commandes" && <CommandesTab commandes={commandes} />}

      {tab === "Variations" && <VariationsTab computed={computed} />}
    </div>
  );
}
