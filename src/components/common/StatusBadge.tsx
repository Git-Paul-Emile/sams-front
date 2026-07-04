import { AlertCircle, AlertTriangle, CheckCircle } from "lucide-react";
import { getStockStatus } from "../../utils/stock";

const SC: Record<string, { bg: string; text: string; dot: string }> = {
  "Terminé": { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500" },
  "En cours": { bg: "bg-blue-50", text: "text-blue-700", dot: "bg-blue-500" },
  "Planifié": { bg: "bg-slate-100", text: "text-slate-600", dot: "bg-slate-400" },
  "Bloqué": { bg: "bg-red-50", text: "text-red-700", dot: "bg-red-500" },
  "Actif": { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500" },
  "Inactif": { bg: "bg-slate-100", text: "text-slate-500", dot: "bg-slate-400" },
  "Congé": { bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-400" },
  "Payée": { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500" },
  "Partiellement payée": { bg: "bg-blue-50", text: "text-blue-700", dot: "bg-blue-500" },
  "En retard": { bg: "bg-red-50", text: "text-red-700", dot: "bg-red-500" },
  "Émise": { bg: "bg-indigo-50", text: "text-indigo-700", dot: "bg-indigo-400" },
  "Brouillon": { bg: "bg-slate-100", text: "text-slate-600", dot: "bg-slate-400" },
  "Reçu": { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500" },
  "En attente": { bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-400" },
  "Partiellement reçu": { bg: "bg-indigo-50", text: "text-indigo-700", dot: "bg-indigo-400" },
  "Payé": { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500" },
  "Livré": { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500" },
  "En cours de livraison": { bg: "bg-blue-50", text: "text-blue-700", dot: "bg-blue-500" },
  "En préparation": { bg: "bg-indigo-50", text: "text-indigo-700", dot: "bg-indigo-400" },
  "En attente stock": { bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-400" },
  "Validé": { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500" },
  "Refusé": { bg: "bg-red-50", text: "text-red-700", dot: "bg-red-500" },
  "En attente de validation": { bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-400" },
  "Distribué à la production": { bg: "bg-blue-50", text: "text-blue-700", dot: "bg-blue-500" },
  "Commande reçue": { bg: "bg-slate-100", text: "text-slate-600", dot: "bg-slate-400" },
  "Devis": { bg: "bg-slate-100", text: "text-slate-500", dot: "bg-slate-300" },
  "Facturée": { bg: "bg-indigo-50", text: "text-indigo-700", dot: "bg-indigo-400" },
  "Annulée": { bg: "bg-red-50", text: "text-red-600", dot: "bg-red-400" },
  "Ouvert": { bg: "bg-red-50", text: "text-red-700", dot: "bg-red-500" },
  "Résolu": { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500" },
  "Critique": { bg: "bg-red-100", text: "text-red-800", dot: "bg-red-600" },
  "Bloquant": { bg: "bg-orange-100", text: "text-orange-800", dot: "bg-orange-600" },
  "Modéré": { bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-400" },
  "Impayée": { bg: "bg-red-50", text: "text-red-700", dot: "bg-red-500" },
};

export function Badge({ label }: { label: string }) {
  const c = SC[label] ?? { bg: "bg-slate-100", text: "text-slate-600", dot: "bg-slate-400" };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${c.bg} ${c.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
      {label}
    </span>
  );
}

export function StockBadge({ s, min, crit }: { s: number; min: number; crit: number }) {
  const st = getStockStatus(s, min, crit);
  if (st === "négatif") return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800"><AlertCircle className="w-3 h-3" />Négatif</span>;
  if (st === "critique") return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red-700"><AlertCircle className="w-3 h-3" />Critique</span>;
  if (st === "minimum") return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700"><AlertTriangle className="w-3 h-3" />Minimum</span>;
  return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700"><CheckCircle className="w-3 h-3" />Normal</span>;
}
