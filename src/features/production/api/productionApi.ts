import { get, post } from "../../../services/httpClient";
import type { BomEntry, Incident, NewProdOrder, Operateur, ProdOrder } from "../../../types/production.types";
import type { StockItem } from "../../../types/stock.types";

export function getProdOrders(params?: { search?: string }): Promise<ProdOrder[]> {
  return get<ProdOrder[]>("/prod-orders", params);
}

export function createProdOrder(payload: NewProdOrder): Promise<ProdOrder> {
  return post<ProdOrder>("/prod-orders", payload);
}

export function getBom(): Promise<BomEntry[]> {
  return get<BomEntry[]>("/boms");
}

export function getOperateurs(params?: { search?: string }): Promise<Operateur[]> {
  return get<Operateur[]>("/operateurs", params);
}

export function getIncidents(params?: { search?: string }): Promise<Incident[]> {
  return get<Incident[]>("/incidents", params);
}

export function getStockProduits(): Promise<StockItem[]> {
  return get<StockItem[]>("/stock-items", { type: "PRODUIT" });
}
