import { useState } from "react";
import { SectionHeader, TabBar } from "../../../components/common";
import { VentesRevenusTab } from "./VentesRevenusTab";
import { CockpitFinancierTab } from "./CockpitFinancierTab";
import { CashFlowTab } from "./CashFlowTab";

export function FinanceOverview() {
  const [tab, setTab] = useState("Ventes & Revenus");
  const [period, setPeriod] = useState<"jour" | "semaine" | "mois">("mois");

  return (
    <div>
      <SectionHeader title="Finance & Ventes" sub="Cockpit financier complet"/>
      <TabBar tabs={["Ventes & Revenus","Cockpit financier","Cash-flow"]} active={tab} onChange={setTab}/>

      {tab==="Ventes & Revenus" && <VentesRevenusTab period={period} onPeriodChange={setPeriod}/>}
      {tab==="Cockpit financier" && <CockpitFinancierTab/>}
      {tab==="Cash-flow" && <CashFlowTab/>}
    </div>
  );
}
