import type { Id } from "./common.types";

export interface StockItem {
  id: Id;
  code: string;
  designation: string;
  categorie: string;
  unite: string;
  stock: number;
  min: number;
  critique: number;
  valeurUnit: number;
}

export type StockMatiere = StockItem;
export type StockProduit = StockItem;

export interface Mouvement {
  id: Id;
  date: string;
  type: string;
  ref: string;
  designation: string;
  qte: number;
  user: string;
  motif: string;
}

export interface StockEntryPayload {
  cible: "matiere" | "produit";
  code: string;
  designation: string;
  qte: number;
  motif: string;
  user: string;
}
