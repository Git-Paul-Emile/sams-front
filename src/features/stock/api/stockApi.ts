import { get, patch, post } from "../../../services/httpClient";
import type { Mouvement, StockItem } from "../../../types/stock.types";

export function getStockMatieres(): Promise<StockItem[]> {
  return get<StockItem[]>("/stock-items", { type: "MATIERE" });
}

export function getStockProduits(): Promise<StockItem[]> {
  return get<StockItem[]>("/stock-items", { type: "PRODUIT" });
}

export function getMouvements(): Promise<Mouvement[]> {
  return get<Mouvement[]>("/stock-movements");
}

export interface NewMouvement {
  stockItemId: string;
  type: string;
  qte: number;
  motif?: string;
}

export function createMouvement(payload: NewMouvement): Promise<Mouvement> {
  return post<Mouvement>("/stock-movements", payload);
}

// Action unifiée : remplace les anciens PATCH /stockMatieres/:id et /stockProduits/:id
// (les deux collections sont désormais une seule table StockItem côté backend).
export function updateStockItemQuantity(id: string, stock: number): Promise<StockItem> {
  return patch<StockItem>(`/stock-items/${id}/stock`, { stock });
}
