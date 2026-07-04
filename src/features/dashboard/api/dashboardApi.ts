import { get } from "../../../services/httpClient";
import type { SalesReq, MatReq } from "../../../types/sorties.types";
import type { Facture } from "../../../types/facturation.types";
import type { Client } from "../../../types/clients.types";
import type { Mouvement, StockItem } from "../../../types/stock.types";
import type { Commande } from "../../../types/ventes.types";
import type { EvolutionMargeRow, ProdChartPoint, VentesChartPoint } from "../../../types/finance.types";
import type { Commercial } from "../../../types/administration.types";
import type { ProdCostDef } from "../../../types/couts.types";

export function getSalesReqs(): Promise<SalesReq[]> {
  return get<SalesReq[]>("/sales-requests");
}

export function getMatReqs(): Promise<MatReq[]> {
  return get<MatReq[]>("/material-requests");
}

export function getFactures(): Promise<Facture[]> {
  return get<Facture[]>("/factures");
}

// Toujours un tableau plat dans `data` (aucune des listes de démo ne dépasse la
// pagination par défaut de 100 lignes côté serveur) : pas de `pageSize` nécessaire ici,
// même pattern que `features/clients/api/clientsApi.ts`.
export function getClients(): Promise<Client[]> {
  return get<Client[]>("/clients");
}

export function getStockMatieres(): Promise<StockItem[]> {
  return get<StockItem[]>("/stock-items", { type: "MATIERE" });
}

export function getCommandes(): Promise<Commande[]> {
  return get<Commande[]>("/commandes");
}

export function getProdChart(): Promise<ProdChartPoint[]> {
  return get<ProdChartPoint[]>("/prod-orders/chart");
}

export function getVentesChart(): Promise<VentesChartPoint[]> {
  return get<VentesChartPoint[]>("/finance/ventes-chart");
}

export function getCommerciaux(): Promise<Commercial[]> {
  return get<Commercial[]>("/commerciaux");
}

export function getEvolutionMarge(): Promise<EvolutionMargeRow[]> {
  return get<EvolutionMargeRow[]>("/finance/evolution-marge");
}

export function getProductCosts(): Promise<ProdCostDef[]> {
  return get<ProdCostDef[]>("/product-costs");
}

export function getStockProduits(): Promise<StockItem[]> {
  return get<StockItem[]>("/stock-items", { type: "PRODUIT" });
}

export function getMouvementsStock(): Promise<Mouvement[]> {
  return get<Mouvement[]>("/stock-movements");
}
