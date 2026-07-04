import { DollarSign, Package, Layers, Factory, TrendingUp, Gauge, Award, Zap } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from "recharts";
import { KpiCard } from "../../../components/common";
import { fmt, fmtM } from "../../../utils/format";
import { useEvolutionMarge, useFinanceProductCosts } from "../hooks/useFinanceQueries";

function trendOf(current: number, previous: number | undefined) {
  if (previous === undefined || previous === 0) return undefined;
  const pct = ((current - previous) / previous) * 100;
  return { val: `${pct >= 0 ? "+" : ""}${pct.toFixed(0)}%`, up: pct >= 0 };
}

export function CockpitFinancierTab() {
  const { data: evolutionMarge = [] } = useEvolutionMarge();
  const { data: productCosts = [] } = useFinanceProductCosts();

  const last = evolutionMarge[evolutionMarge.length - 1];
  const prev = evolutionMarge[evolutionMarge.length - 2];
  const ca = (last?.ca ?? 0) * 1_000_000;
  const couts = (last?.couts ?? 0) * 1_000_000;
  const margeBrute = (last?.marge ?? 0) * 1_000_000;
  const margeMoyenne = ca > 0 ? (margeBrute / ca) * 100 : 0;

  // Répartition matières / emballages au prorata du poids réel de chaque produit (BOM × volume produit)
  const { matierePoids, embPoids } = productCosts.reduce((acc, p) => {
    const coutMatUnit = p.bom.reduce((s, b) => s + b.qteKg * b.prixAchat, 0);
    const coutEmbUnit = p.emballages.reduce((s, e) => s + e.qte * e.prix, 0);
    acc.matierePoids += coutMatUnit * p.qteProduite;
    acc.embPoids += coutEmbUnit * p.qteProduite;
    return acc;
  }, { matierePoids: 0, embPoids: 0 });
  const poidsTotal = matierePoids + embPoids;
  const coutMatiereTotal = poidsTotal > 0 ? couts * (matierePoids / poidsTotal) : 0;
  const coutEmballageTotal = poidsTotal > 0 ? couts * (embPoids / poidsTotal) : 0;

  const chargesExploitation = productCosts.reduce(
    (s, p) => s + (p.coutMO + p.coutEnergie + p.coutConsommables + p.coutIndirects + p.fraisLogistiques + p.fraisCommerciaux + p.fraisAdmin) * p.qteProduite,
    0
  );
  const resultatOperationnel = margeBrute - chargesExploitation;

  const COMPTE_RESULTAT = [
    { l: "Chiffre d'affaires", v: ca, c: "bg-primary" },
    { l: "Coût matières premières", v: coutMatiereTotal, c: "bg-amber-500" },
    { l: "Coût emballages", v: coutEmballageTotal, c: "bg-slate-400" },
    { l: "Marge brute", v: margeBrute, c: "bg-emerald-500" },
    { l: "Charges d'exploitation", v: chargesExploitation, c: "bg-slate-400" },
    { l: "Résultat opérationnel", v: resultatOperationnel, c: "bg-violet-500" },
  ];

  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard label="Chiffre d'affaires" value={fmtM(ca) + " F"} icon={DollarSign} color="bg-primary" trend={trendOf(last?.ca ?? 0, prev?.ca)}/>
        <KpiCard label="Coût matière total"  value={fmtM(coutMatiereTotal) + " F"} icon={Package}   color="bg-amber-600"/>
        <KpiCard label="Coût emballage total"value={fmtM(coutEmballageTotal) + " F"}  icon={Layers}    color="bg-slate-600"/>
        <KpiCard label="Coût production tot." value={fmtM(couts) + " F"} icon={Factory}  color="bg-indigo-600"/>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard label="Marge brute globale" value={fmtM(margeBrute) + " F"} icon={TrendingUp}  color="bg-emerald-600" trend={trendOf(last?.marge ?? 0, prev?.marge)}/>
        <KpiCard label="Marge moyenne"        value={`${margeMoyenne.toFixed(1)} %`}   icon={Gauge}       color="bg-teal-600"/>
        <KpiCard label="Résultat opérationnel"value={fmtM(resultatOperationnel) + " F"}  icon={Award}       color="bg-violet-600"/>
        <KpiCard label="Charges d'exploitation" value={fmtM(chargesExploitation) + " F"}         icon={Zap}         color="bg-blue-700"/>
      </div>
      <div className="bg-card rounded-xl border border-border p-5 shadow-sm">
        <h3 className="font-bold text-sm mb-4" style={{fontFamily:"var(--font-family-heading)"}}>Évolution mensuelle CA · Coûts · Marge (M F CFA)</h3>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={evolutionMarge}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false}/>
            <XAxis dataKey="mois" tick={{fontSize:11,fill:"#64748B"}} axisLine={false} tickLine={false}/>
            <YAxis tick={{fontSize:11,fill:"#64748B"}} axisLine={false} tickLine={false} unit="M"/>
            <Tooltip contentStyle={{borderRadius:8,border:"1px solid #E2E8F0",fontSize:12}} formatter={(v:number)=>[`${v} M F CFA`]}/>
            <Bar key="ev-ca"    dataKey="ca"    name="CA"    fill="#1D4ED8" radius={[4,4,0,0]} barSize={14}/>
            <Bar key="ev-couts" dataKey="couts" name="Coûts" fill="#94A3B8" radius={[4,4,0,0]} barSize={14}/>
            <Bar key="ev-marge" dataKey="marge" name="Marge" fill="#059669" radius={[4,4,0,0]} barSize={14}/>
            <Legend/>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="bg-card rounded-xl border border-border p-5 shadow-sm">
        <h3 className="font-bold text-sm mb-4" style={{fontFamily:"var(--font-family-heading)"}}>Compte de résultat simplifié</h3>
        <div className="flex flex-col divide-y divide-border">
          {COMPTE_RESULTAT.map(r=>(
            <div key={r.l} className="py-3"><div className="flex justify-between mb-1.5"><span className="text-xs text-muted-foreground">{r.l}</span><span className="text-xs font-mono font-semibold">{fmt(Math.round(r.v))} F</span></div><div className="w-full h-1.5 bg-muted rounded-full overflow-hidden"><div className={`h-full rounded-full ${r.c}`} style={{width:`${ca > 0 ? Math.max(0, Math.min(100, (r.v / ca) * 100)) : 0}%`}}/></div></div>
          ))}
        </div>
      </div>
    </div>
  );
}
