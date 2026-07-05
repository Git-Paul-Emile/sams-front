import { del, get, post, put } from "../../../services/httpClient";
import type { BomEntry, Incident, NewBom, NewProdOrder, Operateur, ProdOrder, UpdateBom } from "../../../types/production.types";
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

export function createBom(payload: NewBom): Promise<BomEntry> {
  return post<BomEntry>("/boms", payload);
}

export function updateBom(id: string, payload: UpdateBom): Promise<BomEntry> {
  return put<BomEntry>(`/boms/${id}`, payload);
}

export function deleteBom(id: string): Promise<void> {
  return del(`/boms/${id}`);
}

export function getStockMatieres(): Promise<StockItem[]> {
  return get<StockItem[]>("/stock-items", { type: "MATIERE" });
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
