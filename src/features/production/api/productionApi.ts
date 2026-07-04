import { get, post } from "../../../services/httpClient";
import type { BomEntry, Incident, NewProdOrder, Operateur, ProdOrder } from "../../../types/production.types";
import type { StockItem } from "../../../types/stock.types";

export function getProdOrders(): Promise<ProdOrder[]> {
  return get<ProdOrder[]>("/prod-orders");
}

export function createProdOrder(payload: NewProdOrder): Promise<ProdOrder> {
  return post<ProdOrder>("/prod-orders", payload);
}

export function getBom(): Promise<BomEntry[]> {
  return get<BomEntry[]>("/boms");
}

export function getOperateurs(): Promise<Operateur[]> {
  return get<Operateur[]>("/operateurs");
}

export function getIncidents(): Promise<Incident[]> {
  return get<Incident[]>("/incidents");
}

export function getStockProduits(): Promise<StockItem[]> {
  return get<StockItem[]>("/stock-items", { type: "PRODUIT" });
}
