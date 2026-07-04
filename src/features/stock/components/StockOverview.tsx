import { useState } from "react";
import { AlertTriangle, Plus } from "lucide-react";
import { Btn, SectionHeader, TabBar } from "../../../components/common";
import { getStockStatus } from "../../../utils/stock";
import { useStockMatieres } from "../hooks/useStockQueries";
import { MatieresTab } from "./MatieresTab";
import { MouvementsTab } from "./MouvementsTab";
import { ProduitsTab } from "./ProduitsTab";
import { StockEntryModal } from "./StockEntryModal";

const TABS = ["Matières premières", "Produits finis", "Mouvements"];

export function StockOverview() {
  const [tab, setTab] = useState(TABS[0]);
  const [showEntry, setShowEntry] = useState(false);
  const { data: stockMatieres = [] } = useStockMatieres();
  const alertes = stockMatieres.filter((m) => getStockStatus(m.stock, m.min, m.critique) !== "normal");

  return (
    <div>
      <SectionHeader
        title="Gestion des stocks"
        sub="Matières premières, produits finis, mouvements"
        action={<Btn sm onClick={() => setShowEntry(true)}><Plus className="w-4 h-4" />Entrée stock</Btn>}
      />
      {alertes.length > 0 && (
        <div className="mb-4 p-4 rounded-xl bg-red-50 border border-red-200 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-red-800">{alertes.length} alerte{alertes.length > 1 ? "s" : ""} de stock</p>
            <p className="text-xs text-red-600 mt-0.5">{alertes.map((a) => a.designation).join(", ")}</p>
          </div>
        </div>
      )}
      <TabBar tabs={TABS} active={tab} onChange={setTab} />

      {tab === "Matières premières" && <MatieresTab />}
      {tab === "Produits finis" && <ProduitsTab />}
      {tab === "Mouvements" && <MouvementsTab />}

      {showEntry && <StockEntryModal onClose={() => setShowEntry(false)} />}
    </div>
  );
}
