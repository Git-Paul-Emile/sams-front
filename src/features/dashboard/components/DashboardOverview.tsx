import {
  DollarSign, Factory, TrendingUp, Award, BadgeCheck, AlertCircle, CreditCard,
  AlertTriangle, ShoppingCart, Package, ArrowUpRight, Check,
} from "lucide-react";
import {
  ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, BarChart, Bar,
} from "recharts";
import { KpiCard } from "../../../components/common";
import { fmt, fmtM } from "../../../utils/format";
import { getStockStatus } from "../../../utils/stock";
import { useModuleAccess } from "../../auth/hooks/useModuleAccess";
import {
  useDashboardSalesReqs, useDashboardMatReqs, useDashboardFactures, useDashboardClients,
  useDashboardStockMatieres, useDashboardCommandes, useDashboardProdChart, useDashboardVentesChart,
  useDashboardCommerciaux, useDashboardEvolutionMarge, useDashboardProductCosts, useDashboardStockProduits,
  useDashboardMouvementsStock,
} from "../hooks/useDashboardQueries";

export function DashboardOverview() {
  const { hasModule } = useModuleAccess();
  const canSorties = hasModule("Sorties");
  const canFacturation = hasModule("Facturation");
  const canClients = hasModule("Clients");
  const canStocks = hasModule("Stocks");
  const canVentes = hasModule("Ventes");
  const canProduction = hasModule("Production");
  const canFinance = hasModule("Finance");
  const canCouts = hasModule("Couts");
  const canCommerciaux = hasModule("Admin");

  const { data: salesReqs = [] } = useDashboardSalesReqs(canSorties);
  const { data: matReqs = [] } = useDashboardMatReqs(canSorties);
  const { data: factures = [] } = useDashboardFactures(canFacturation);
  const { data: clients = [] } = useDashboardClients(canClients);
  const { data: stockMatieres = [] } = useDashboardStockMatieres(canStocks);
  const { data: commandes = [] } = useDashboardCommandes(canVentes);
  const { data: prodChart = [] } = useDashboardProdChart(canProduction);
  const { data: ventesChart = [] } = useDashboardVentesChart(canFinance);
  const { data: commerciaux = [] } = useDashboardCommerciaux(canCommerciaux);
  const { data: evolutionMarge = [] } = useDashboardEvolutionMarge(canFinance);
  const { data: productCosts = [] } = useDashboardProductCosts(canCouts);
  const { data: stockProduits = [] } = useDashboardStockProduits(canStocks);
  const { data: mouvementsStock = [] } = useDashboardMouvementsStock(canStocks);

  const pending    = salesReqs.filter(r=>r.statut==="En attente de validation").length + matReqs.filter(r=>r.statut==="En attente de validation").length;
  const impayees   = factures.filter(f=>f.statut==="En retard"||f.statut==="Impayée").length;
  const encours    = clients.reduce((s,c)=>s+c.encours,0);
  const ruptures   = stockMatieres.filter(m=>getStockStatus(m.stock,m.min,m.critique)!=="normal").length;
  const cmdEnCours = commandes.filter(v=>!["Payée","Annulée"].includes(v.statutActuel)).length;

  const lastMarge = evolutionMarge[evolutionMarge.length - 1];
  const prevMarge = evolutionMarge[evolutionMarge.length - 2];
  const caMois = (lastMarge?.ca ?? 0) * 1_000_000;
  const margeBrute = (lastMarge?.marge ?? 0) * 1_000_000;
  const caTrend = prevMarge && prevMarge.ca > 0 ? ((lastMarge!.ca - prevMarge.ca) / prevMarge.ca) * 100 : null;
  const margeTrend = prevMarge && prevMarge.marge > 0 ? ((lastMarge!.marge - prevMarge.marge) / prevMarge.marge) * 100 : null;

  const chargesExploitation = productCosts.reduce(
    (s, p) => s + (p.coutMO + p.coutEnergie + p.coutConsommables + p.coutIndirects + p.fraisLogistiques + p.fraisCommerciaux + p.fraisAdmin) * p.qteProduite,
    0
  );
  const resultatOp = margeBrute - chargesExploitation;

  const lastProd = prodChart[prodChart.length - 1];
  const prevProd = prodChart[prodChart.length - 2];
  const volumeTrend = prevProd && prevProd.production > 0 ? ((lastProd!.production - prevProd.production) / prevProd.production) * 100 : null;

  const valeurStock = stockMatieres.reduce((s,m)=>s+m.stock*m.valeurUnit,0) + stockProduits.reduce((s,p)=>s+p.stock*p.valeurUnit,0);
  const derniereEntree = mouvementsStock.find(m=>m.type==="Entrée réception");
  const derniereEntreeUnite = [...stockMatieres, ...stockProduits].find(s=>s.designation===derniereEntree?.designation)?.unite ?? "";
  const paiementsRecus = factures.filter(f=>["Wave","Virement"].includes(f.mode)).reduce((s,f)=>s+f.paye,0);

  // Chaque carte/section n'est affichée que si l'utilisateur a le module dont dépendent ses données :
  // afficher "0" pour une donnée invisible au rôle laisserait croire à tort qu'il n'y a rien à voir.
  const showValidations = canSorties;
  const showFactures = canFacturation;
  const showClients = canClients;
  const showStock = canStocks;
  const showCommandes = canVentes;
  const showFinanceKpis = canFinance;
  const showResultatOp = canFinance && canCouts;
  const showProdChart = canProduction;
  const showVentesChart = canFinance;

  const hasKpiRow1 = showFinanceKpis || showProdChart || showResultatOp;
  const hasKpiRow2 = showValidations || showFactures || showClients || showStock;
  const hasKpiRow3 = showCommandes || showStock;
  const hasCharts = showProdChart || showVentesChart;

  return (
    <div className="flex flex-col gap-5">
      {hasKpiRow1 && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {showFinanceKpis && <KpiCard label="CA du mois" value={fmtM(caMois)+" F"} sub={lastMarge ? `${lastMarge.mois} 2024` : undefined} icon={DollarSign} color="bg-primary" trend={caTrend!==null?{val:`${caTrend>=0?"+":""}${caTrend.toFixed(0)}%`,up:caTrend>=0}:undefined}/>}
          {showProdChart && <KpiCard label="Volume produit" value={`${fmt(lastProd?.production ?? 0)} u.`} sub={lastProd ? `${lastProd.mois} 2024` : undefined} icon={Factory} color="bg-indigo-600" trend={volumeTrend!==null?{val:`${volumeTrend>=0?"+":""}${volumeTrend.toFixed(0)}%`,up:volumeTrend>=0}:undefined}/>}
          {showFinanceKpis && <KpiCard label="Marge brute" value={fmtM(margeBrute)+" F"} sub={`Taux: ${(caMois>0?(margeBrute/caMois)*100:0).toFixed(1)}%`} icon={TrendingUp} color="bg-emerald-600" trend={margeTrend!==null?{val:`${margeTrend>=0?"+":""}${margeTrend.toFixed(0)}%`,up:margeTrend>=0}:undefined}/>}
          {showResultatOp && <KpiCard label="Résultat opér." value={fmtM(resultatOp)+" F"} sub="Net du mois" icon={Award} color="bg-violet-600"/>}
        </div>
      )}

      {hasKpiRow2 && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {showValidations && <KpiCard label="Validations en attente" value={String(pending)} sub="demandes à traiter" icon={BadgeCheck} color="bg-amber-500" alert={pending>0}/>}
          {showFactures && <KpiCard label="Factures en retard" value={String(impayees)} sub="règlements en souffrance" icon={AlertCircle} color="bg-red-600" alert={impayees>0}/>}
          {showClients && <KpiCard label="Encours clients" value={fmtM(encours)+" F"} sub="à recouvrer" icon={CreditCard} color="bg-orange-600"/>}
          {showStock && <KpiCard label="Alertes rupture" value={String(ruptures)} sub="matières sous seuil" icon={AlertTriangle} color="bg-red-500" alert={ruptures>0}/>}
        </div>
      )}
      {hasKpiRow3 && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {showCommandes && <KpiCard label="Commandes en cours" value={String(cmdEnCours)} sub="à livrer / facturer" icon={ShoppingCart} color="bg-blue-600"/>}
          {showStock && <KpiCard label="Valeur stock" value={fmtM(valeurStock)+" F"} sub="matières + produits" icon={Package} color="bg-slate-600"/>}
          {showStock && <KpiCard label="Entrées stock récentes" value={derniereEntree ? `${fmt(derniereEntree.qte)} ${derniereEntreeUnite}` : "—"} sub={derniereEntree ? `Réception ${derniereEntree.ref}` : undefined} icon={ArrowUpRight} color="bg-emerald-500"/>}
          {showFactures && <KpiCard label="Paiements reçus" value={fmtM(paiementsRecus)+" F"} sub="ce mois (Wave + Virement)" icon={Check} color="bg-teal-600"/>}
        </div>
      )}

      {/* Charts */}
      {hasCharts && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {showProdChart && (
            <div className="bg-card rounded-xl border border-border p-5 shadow-sm">
              <h3 className="font-bold text-sm mb-4" style={{fontFamily:"var(--font-family-heading)"}}>Production mensuelle vs objectif</h3>
              <ResponsiveContainer width="100%" height={180}>
                <LineChart data={prodChart}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0"/>
                  <XAxis dataKey="mois" tick={{fontSize:11,fill:"#64748B"}} axisLine={false} tickLine={false}/>
                  <YAxis tick={{fontSize:11,fill:"#64748B"}} axisLine={false} tickLine={false}/>
                  <Tooltip contentStyle={{borderRadius:8,border:"1px solid #E2E8F0",fontSize:12}}/>
                  <Line key="l-prod" type="monotone" dataKey="production" name="Production" stroke="#1D4ED8" strokeWidth={2.5} dot={{fill:"#1D4ED8",r:4}}/>
                  <Line key="l-obj"  type="monotone" dataKey="objectif"   name="Objectif"   stroke="#CBD5E1" strokeWidth={1.5} strokeDasharray="5 5" dot={false}/>
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
          {showVentesChart && (
            <div className="bg-card rounded-xl border border-border p-5 shadow-sm">
              <h3 className="font-bold text-sm mb-4" style={{fontFamily:"var(--font-family-heading)"}}>Ventes par zone (M F CFA)</h3>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={ventesChart} barSize={28}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false}/>
                  <XAxis dataKey="zone" tick={{fontSize:11,fill:"#64748B"}} axisLine={false} tickLine={false}/>
                  <YAxis tick={{fontSize:11,fill:"#64748B"}} axisLine={false} tickLine={false} unit="M"/>
                  <Tooltip contentStyle={{borderRadius:8,border:"1px solid #E2E8F0",fontSize:12}} formatter={(v:number)=>[`${v} M F CFA`,"Ventes"]}/>
                  <Bar key="b-ventes" dataKey="ventes" fill="#1D4ED8" radius={[4,4,0,0]}/>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      )}

      {/* Bottom widgets */}
      {(showValidations || showClients || canCommerciaux) && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Validation queue */}
          {showValidations && (
            <div className="bg-card rounded-xl border border-border p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <BadgeCheck className="w-4 h-4 text-amber-500"/>
                <h3 className="font-bold text-sm" style={{fontFamily:"var(--font-family-heading)"}}>Validations en attente</h3>
                <span className="ml-auto text-xs font-bold px-2 py-0.5 bg-amber-50 text-amber-700 rounded-full">{pending}</span>
              </div>
              {[...salesReqs.filter(r=>r.statut==="En attente de validation").map(r=>({ref:r.num,desc:r.produit,qui:r.commercial,type:"Sortie vente"})),
                ...matReqs.filter(r=>r.statut==="En attente de validation").map(r=>({ref:r.num,desc:r.matiere,qui:r.operateur,type:"Sortie matières"}))
              ].slice(0,4).map((p,i)=>(
                <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-amber-50/60 mb-2 last:mb-0">
                  <div className="min-w-0"><p className="text-xs font-semibold text-foreground truncate">{p.ref}</p><p className="text-[11px] text-muted-foreground truncate">{p.desc} · {p.qui}</p></div>
                  <span className="text-[10px] px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full font-medium shrink-0 ml-2">{p.type}</span>
                </div>
              ))}
              {pending===0&&<p className="text-sm text-muted-foreground text-center py-4">Aucune validation en attente</p>}
            </div>
          )}

          {/* Top clients */}
          {showClients && (
            <div className="bg-card rounded-xl border border-border p-5 shadow-sm">
              <h3 className="font-bold text-sm mb-4" style={{fontFamily:"var(--font-family-heading)"}}>Top clients – CA YTD</h3>
              {[...clients].sort((a,b)=>b.caYtd-a.caYtd).slice(0,5).map((c,i)=>(
                <div key={c.code} className="flex items-center gap-3 mb-3 last:mb-0">
                  <span className="text-xs font-bold text-muted-foreground w-5">{i+1}</span>
                  <div className="flex-1 min-w-0"><p className="text-xs font-semibold truncate">{c.raison}</p><div className="w-full h-1.5 bg-muted rounded-full mt-1"><div className="h-full bg-primary rounded-full" style={{width:`${(c.caYtd/24600000)*100}%`}}/></div></div>
                  <span className="text-xs font-mono font-bold text-foreground shrink-0">{fmtM(c.caYtd)} M</span>
                </div>
              ))}
            </div>
          )}

          {/* Commercial performance */}
          {canCommerciaux && (
            <div className="bg-card rounded-xl border border-border p-5 shadow-sm">
              <h3 className="font-bold text-sm mb-4" style={{fontFamily:"var(--font-family-heading)"}}>Performance commerciaux</h3>
              {commerciaux.map(a=>(
                <div key={a.matricule} className="flex items-center gap-3 mb-3 last:mb-0">
                  <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0"><span className="text-[10px] font-bold text-primary">{a.prenom[0]}{a.nom[0]}</span></div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between"><p className="text-xs font-semibold">{a.prenom} {a.nom}</p><span className={`text-[10px] font-bold ${a.caRealise/a.objectif>=0.9?"text-emerald-600":a.caRealise/a.objectif>=0.7?"text-amber-600":"text-red-600"}`}>{Math.round(a.caRealise/a.objectif*100)}%</span></div>
                    <div className="w-full h-1.5 bg-muted rounded-full mt-1"><div className={`h-full rounded-full ${a.caRealise/a.objectif>=0.9?"bg-emerald-500":a.caRealise/a.objectif>=0.7?"bg-amber-500":"bg-red-500"}`} style={{width:`${Math.min((a.caRealise/a.objectif)*100,100)}%`}}/></div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
