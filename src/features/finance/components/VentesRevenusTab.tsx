import {
  DollarSign, CheckCircle, Truck, AlertCircle, ArrowUpRight, ArrowDownRight,
} from "lucide-react";
import {
  ResponsiveContainer, BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, PieChart, Pie, Cell,
} from "recharts";
import { fmt, fmtM } from "../../../utils/format";
import { PeriodBtn } from "./PeriodBtn";
import {
  useVentesPeriodes, useFinanceStockProduits, useVentesCommercial, useFinanceVentesChart, useVentesSegment,
} from "../hooks/useFinanceQueries";

export function VentesRevenusTab({ period, onPeriodChange }: {
  period: "jour" | "semaine" | "mois";
  onPeriodChange: (v: "jour" | "semaine" | "mois") => void;
}) {
  const { data: ventesPeriodes } = useVentesPeriodes();
  const { data: stockProduits = [] } = useFinanceStockProduits();
  const { data: ventesCommercial = [] } = useVentesCommercial();
  const { data: ventesChart = [] } = useFinanceVentesChart();
  const { data: ventesSegment = [] } = useVentesSegment();

  const p = ventesPeriodes?.[period];

  return (
    <div className="flex flex-col gap-5">
      {/* Period selector */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground font-medium">Affichage par période</p>
        <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
          <PeriodBtn value="jour"    current={period} onChange={onPeriodChange}/>
          <PeriodBtn value="semaine" current={period} onChange={onPeriodChange}/>
          <PeriodBtn value="mois"    current={period} onChange={onPeriodChange}/>
        </div>
      </div>

      {p && (
        <>
          {/* KPI row – 4 main metrics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-card rounded-xl border border-border p-5 shadow-sm">
              <div className="flex items-start justify-between mb-3">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">CA Total des ventes</p>
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center"><DollarSign className="w-4 h-4 text-white"/></div>
              </div>
              <p className="text-2xl font-black text-foreground" style={{fontFamily:"var(--font-family-heading)"}}>{fmtM(p.ca)} F</p>
              <p className="text-xs text-muted-foreground mt-1">par {period}</p>
              <div className="flex items-center gap-1 mt-2 text-xs text-emerald-600 font-medium"><ArrowUpRight className="w-3.5 h-3.5"/>+14% vs période préc.</div>
            </div>
            <div className="bg-card rounded-xl border border-border p-5 shadow-sm">
              <div className="flex items-start justify-between mb-3">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Ventes au comptant</p>
                <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center"><CheckCircle className="w-4 h-4 text-white"/></div>
              </div>
              <p className="text-2xl font-black text-foreground" style={{fontFamily:"var(--font-family-heading)"}}>{fmtM(p.cash)} F</p>
              <p className="text-xs text-muted-foreground mt-1">par {period} · {Math.round(p.cash/p.ca*100)}% du CA</p>
              <div className="w-full h-1.5 bg-muted rounded-full mt-2 overflow-hidden"><div className="h-full bg-emerald-500 rounded-full" style={{width:`${Math.round(p.cash/p.ca*100)}%`}}/></div>
            </div>
            <div className="bg-card rounded-xl border border-border p-5 shadow-sm">
              <div className="flex items-start justify-between mb-3">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Volume Dépôt-Vente</p>
                <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center"><Truck className="w-4 h-4 text-white"/></div>
              </div>
              <p className="text-2xl font-black text-foreground" style={{fontFamily:"var(--font-family-heading)"}}>{fmtM(p.depot)} F</p>
              <p className="text-xs text-muted-foreground mt-1">par {period} · {Math.round(p.depot/p.ca*100)}% du CA</p>
              <div className="w-full h-1.5 bg-muted rounded-full mt-2 overflow-hidden"><div className="h-full bg-indigo-500 rounded-full" style={{width:`${Math.round(p.depot/p.ca*100)}%`}}/></div>
            </div>
            <div className="bg-card rounded-xl border border-border p-5 shadow-sm border-amber-200 bg-amber-50/20">
              <div className="flex items-start justify-between mb-3">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Créances non recouvrées</p>
                <div className="w-8 h-8 rounded-lg bg-red-500 flex items-center justify-center"><AlertCircle className="w-4 h-4 text-white"/></div>
              </div>
              <p className="text-2xl font-black text-red-600" style={{fontFamily:"var(--font-family-heading)"}}>{fmtM(p.creance)} F</p>
              <p className="text-xs text-muted-foreground mt-1">par {period} · à recouvrer</p>
              <div className="flex items-center gap-1 mt-2 text-xs text-red-600 font-medium"><ArrowDownRight className="w-3.5 h-3.5"/>Taux recouvrement: {Math.round((1-p.creance/p.ca)*100)}%</div>
            </div>
          </div>
        </>
      )}

      {/* Volume marchandise disponible */}
      <div className="bg-card rounded-xl border border-border p-5 shadow-sm">
        <h3 className="font-bold text-sm mb-4" style={{fontFamily:"var(--font-family-heading)"}}>Volume de marchandise disponible</h3>
        <div className="grid grid-cols-5 gap-3">
          {stockProduits.map(p=>{
            const valeur=p.stock*p.valeurUnit;
            return (
              <div key={p.code} className={`p-3 rounded-xl border ${p.stock===0?"bg-red-50 border-red-200":p.stock<=p.critique?"bg-amber-50 border-amber-200":p.stock<=p.min?"bg-yellow-50 border-yellow-200":"bg-emerald-50 border-emerald-100"}`}>
                <p className="text-xs font-semibold text-foreground leading-tight mb-2">{p.designation}</p>
                <p className={`text-xl font-black ${p.stock===0?"text-red-600":p.stock<=p.critique?"text-amber-600":"text-emerald-700"}`} style={{fontFamily:"var(--font-family-heading)"}}>{fmt(p.stock)}</p>
                <p className="text-[10px] text-muted-foreground">{p.unite}</p>
                <p className="text-[10px] font-mono font-semibold text-foreground mt-1">{fmtM(valeur)} F</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Ventes par commercial */}
        <div className="bg-card rounded-xl border border-border p-5 shadow-sm">
          <h3 className="font-bold text-sm mb-4" style={{fontFamily:"var(--font-family-heading)"}}>Ventes réalisées par commercial</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={ventesCommercial} layout="vertical" barSize={18}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" horizontal={false}/>
              <XAxis type="number" tick={{fontSize:10,fill:"#64748B"}} axisLine={false} tickLine={false} tickFormatter={v=>`${(v/1000000).toFixed(1)}M`}/>
              <YAxis type="category" dataKey="commercial" tick={{fontSize:11,fill:"#64748B"}} axisLine={false} tickLine={false} width={80}/>
              <Tooltip contentStyle={{borderRadius:8,border:"1px solid #E2E8F0",fontSize:12}} formatter={(v:number)=>[`${fmtM(v)} F CFA`,"CA"]}/>
              <Bar key="bc-ca" dataKey="ca" name="CA" fill="#1D4ED8" radius={[0,4,4,0]}/>
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-3 flex flex-col gap-1.5">
            {ventesCommercial.map(c=>(
              <div key={c.commercial} className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">{c.commercial} · {c.zone}</span>
                <div className="flex items-center gap-3">
                  <span className="font-mono font-semibold">{fmtM(c.ca)} F</span>
                  <span className="text-emerald-600 font-medium">Marge: {fmtM(c.marge)} F</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Ventes par zone */}
        <div className="bg-card rounded-xl border border-border p-5 shadow-sm">
          <h3 className="font-bold text-sm mb-4" style={{fontFamily:"var(--font-family-heading)"}}>Ventes réalisées par zone</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={ventesChart} barSize={28}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false}/>
              <XAxis dataKey="zone" tick={{fontSize:11,fill:"#64748B"}} axisLine={false} tickLine={false}/>
              <YAxis tick={{fontSize:11,fill:"#64748B"}} axisLine={false} tickLine={false} unit="M"/>
              <Tooltip contentStyle={{borderRadius:8,border:"1px solid #E2E8F0",fontSize:12}} formatter={(v:number)=>[`${v} M F CFA`,"Ventes"]}/>
              <Bar key="bz-v" dataKey="ventes" fill="#059669" radius={[4,4,0,0]}/>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Segment client */}
      <div className="bg-card rounded-xl border border-border p-5 shadow-sm">
        <h3 className="font-bold text-sm mb-4" style={{fontFamily:"var(--font-family-heading)"}}>Ventes par segment client</h3>
        <div className="flex items-center gap-8">
          <PieChart width={180} height={180}>
            <Pie data={ventesSegment} dataKey="ca" nameKey="segment" cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={2}>
              {ventesSegment.map((d,i)=><Cell key={`seg-${i}`} fill={d.couleur}/>)}
            </Pie>
            <Tooltip contentStyle={{borderRadius:8,border:"1px solid #E2E8F0",fontSize:12}} formatter={(v:number)=>[`${fmtM(v)} F CFA`]}/>
          </PieChart>
          <div className="flex-1 flex flex-col gap-2">
            {ventesSegment.map(s=>(
              <div key={s.segment} className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full shrink-0" style={{background:s.couleur}}/>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between mb-1"><span className="text-xs font-medium">{s.segment}</span><span className="text-xs font-mono font-semibold">{fmtM(s.ca)} F · {s.pct}%</span></div>
                  <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden"><div className="h-full rounded-full" style={{width:`${s.pct}%`,background:s.couleur}}/></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
