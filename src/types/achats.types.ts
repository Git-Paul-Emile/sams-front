import type { Id } from "./common.types";

export interface Achat {
  id: Id;
  num: string;
  fournisseur: string;
  date: string;
  livraison: string;
  montant: number;
  statut: string;
  articles: number;
}

export interface NewAchat {
  fournisseur: string;
  livraison: string;
  montant: number;
  articles: number;
}
