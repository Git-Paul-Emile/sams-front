import { ArrowUpRight, ArrowDownRight, DollarSign } from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip, Legend, PieChart, Pie, Cell } from "recharts";
import { KpiCard, Table, TR, TD } from "../../../components/common";
import { fmtM } from "../../../utils/format";
import { PIE_COLORS } from "../../../utils/constants";
import { useCashChart, useFinanceVentesChart, useCommandesRentabilite } from "../hooks/useFinanceQueries";

export function CashFlowTab() {
  const { data: cashChart = [] } = useCashChart();
  const { data: ventesChart = [] } = useFinanceVentesChart();
  const { data: commandesRentabilite = [] } = useCommandesRentabilite();

  const cashIn = cashChart.reduce((s, c) => s + c.entrees, 0) * 1_000_000;
  const cashOut = cashChart.reduce((s, c) => s + c.sorties, 0) * 1_000_000;
  const solde = cashIn - cashOut;

  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-3 gap-4">
        <KpiCard label="Cash In" value={fmtM(cashIn) + " F"} sub="encaissements" icon={ArrowUpRight} color="bg-emerald-600"/>
        <KpiCard label="Cash Out" value={fmtM(cashOut) + " F"} sub="décaissements" icon={ArrowDownRight} color="bg-red-600"/>
        <KpiCard label="Solde net" value={fmtM(solde) + " F"} sub="trésorerie nette" icon={DollarSign} color="bg-primary"/>
      </div>
      <div className="bg-card rounded-xl border border-border p-5 shadow-sm">
        <h3 className="font-bold text-sm mb-4" style={{fontFamily:"var(--font-family-heading)"}}>Cash-flow hebdomadaire (M F CFA)</h3>
        <ResponsiveContainer width="100%" height={240}>
          <AreaChart data={cashChart}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0"/>
            <XAxis dataKey="semaine" tick={{fontSize:11,fill:"#64748B"}} axisLine={false} tickLine={false}/>
            <YAxis tick={{fontSize:11,fill:"#64748B"}} axisLine={false} tickLine={false} unit="M"/>
            <Tooltip contentStyle={{borderRadius:8,border:"1px solid #E2E8F0",fontSize:12}} formatter={(v:number)=>[`${v} M F CFA`]}/>
            <Area key="cf-in"  type="monotone" dataKey="entrees" name="Cash In"  stroke="#059669" fill="#D1FAE5" strokeWidth={2}/>
            <Area key="cf-out" type="monotone" dataKey="sorties" name="Cash Out" stroke="#DC2626" fill="#FEE2E2" strokeWidth={2}/>
            <Legend/>
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-card rounded-xl border border-border p-5 shadow-sm">
          <h3 className="font-bold text-sm mb-4" style={{fontFamily:"var(--font-family-heading)"}}>Répartition CA par zone</h3>
          <div className="flex items-center gap-6">
            <PieChart width={160} height={160}>
              <Pie data={ventesChart} dataKey="ventes" nameKey="zone" cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3}>
                {ventesChart.map((_,i)=><Cell key={`cfpie-${i}`} fill={PIE_COLORS[i%PIE_COLORS.length]}/>)}
              </Pie>
              <Tooltip contentStyle={{borderRadius:8,border:"1px solid #E2E8F0",fontSize:12}} formatter={(v:number)=>[`${v} M F CFA`]}/>
            </PieChart>
            <div className="flex flex-col gap-2 flex-1">{ventesChart.map((d,i)=><div key={d.zone} className="flex items-center justify-between text-xs"><div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full" style={{background:PIE_COLORS[i%PIE_COLORS.length]}}/><span className="text-muted-foreground">{d.zone}</span></div><span className="font-mono font-semibold">{d.ventes} M</span></div>)}</div>
          </div>
        </div>
        <div className="bg-card rounded-xl border border-border p-5 shadow-sm">
          <h3 className="font-bold text-sm mb-4" style={{fontFamily:"var(--font-family-heading)"}}>Rentabilité par commande</h3>
          <Table headers={["Commande","Montant","Marge","Taux","Niveau"]}>
            {commandesRentabilite.map(c=>(
              <TR key={c.num}>
                <TD mono>{c.num}</TD>
                <TD mono>{fmtM(c.montant)} F</TD>
                <TD><span className="font-mono font-semibold text-emerald-600">{fmtM(c.marge)} F</span></TD>
                <TD><span className="font-mono text-xs font-bold">{c.tauxMarge.toFixed(1)}%</span></TD>
                <TD>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${c.niveau==="Très rentable"?"bg-emerald-100 text-emerald-800":c.niveau==="Rentable"?"bg-blue-50 text-blue-700":c.niveau==="Faible marge"?"bg-amber-50 text-amber-700":"bg-red-50 text-red-700"}`}>{c.niveau}</span>
                </TD>
              </TR>
            ))}
          </Table>
        </div>
      </div>
    </div>
  );
}
