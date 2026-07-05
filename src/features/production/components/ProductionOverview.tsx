import { useState } from "react";
import { Plus } from "lucide-react";
import { Btn, SectionHeader, TabBar } from "../../../components/common";
import { BomTab } from "./BomTab";
import { NewProdOrderModal } from "./NewProdOrderModal";
import { OperateursTab } from "./OperateursTab";
import { OrdersTab } from "./OrdersTab";

const TABS = ["Ordres de fabrication", "Formules (BOM)", "Opérateurs"];

export function ProductionOverview() {
  const [tab, setTab] = useState(TABS[0]);
  const [showOF, setShowOF] = useState(false);

  return (
    <div>
      <SectionHeader
        title="Production"
        sub="Ordres de fabrication et suivi atelier"
        action={<Btn onClick={() => setShowOF(true)}><Plus className="w-4 h-4" />Nouvel OF</Btn>}
      />
      <TabBar tabs={TABS} active={tab} onChange={setTab} />

      {tab === "Ordres de fabrication" && <OrdersTab />}
      {tab === "Formules (BOM)" && <BomTab />}
      {tab === "Opérateurs" && <OperateursTab />}

      {showOF && <NewProdOrderModal onClose={() => setShowOF(false)} />}
    </div>
  );
}
