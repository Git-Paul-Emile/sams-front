import type { ElementType } from "react";
import {
  BadgeCheck, ClipboardList, Factory, FileText, Package,
  PackageMinus, ShoppingCart, TrendingUp, Truck, Users,
} from "lucide-react";

// Métadonnées des tuiles de rapports : purement de la configuration UI côté
// frontend, ce n'est pas une ressource backend (contrairement à `auditLog`).
export interface RapportTile {
  id: string;
  l: string;
  d: string;
  i: ElementType;
  c: string;
}

export const raps: RapportTile[] = [
  { id: "prod", l: "Production", d: "OF, rendements, lots, opérateurs", i: Factory, c: "bg-blue-50 text-blue-700 border-blue-100" },
  { id: "stock", l: "Stocks", d: "Niveaux, mouvements, alertes, valeur", i: Package, c: "bg-indigo-50 text-indigo-700 border-indigo-100" },
  { id: "sorties", l: "Sorties stock", d: "Demandes vente et matières, validations", i: PackageMinus, c: "bg-violet-50 text-violet-700 border-violet-100" },
  { id: "achats", l: "Achats", d: "Bons de commande, fournisseurs, délais", i: Truck, c: "bg-amber-50 text-amber-700 border-amber-100" },
  { id: "ventes", l: "Ventes", d: "Commandes, pipeline, commerciaux, zones", i: ShoppingCart, c: "bg-emerald-50 text-emerald-700 border-emerald-100" },
  { id: "fact", l: "Factures", d: "Factures, paiements, encours, retards", i: FileText, c: "bg-teal-50 text-teal-700 border-teal-100" },
  { id: "clients", l: "Clients", d: "Fiche client, CA, historique, encours", i: Users, c: "bg-pink-50 text-pink-700 border-pink-100" },
  { id: "fin", l: "Finance", d: "CA, marges, cash-flow, résultat", i: TrendingUp, c: "bg-cyan-50 text-cyan-700 border-cyan-100" },
  { id: "valid", l: "Validations", d: "Workflow, historique, audit approvals", i: BadgeCheck, c: "bg-orange-50 text-orange-700 border-orange-100" },
  { id: "audit", l: "Journal d'audit", d: "Création, modification, suppression", i: ClipboardList, c: "bg-slate-50 text-slate-700 border-slate-200" },
];
