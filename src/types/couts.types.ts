import type { Id } from "./common.types";

export interface BomCostItem {
  mat: string;
  incorp: number;
  qteKg: number;
  prixAchat: number;
}

export interface EmbItem {
  type: string;
  qte: number;
  prix: number;
}

export interface ProdCostDef {
  id: Id;
  ref: string;
  designation: string;
  categorie: string;
  prixVente: number;
  qteVendue: number;
  qteProduite: number;
  qteReel: number;
  bom: BomCostItem[];
  emballages: EmbItem[];
  coutMO: number;
  coutEnergie: number;
  coutConsommables: number;
  coutIndirects: number;
  fraisLogistiques: number;
  fraisCommerciaux: number;
  fraisAdmin: number;
  coutTheoriqueUnit: number;
}

export interface MatierePrix {
  id: Id;
  mat: string;
  prixActuel: number;
  dernierPrix: number;
  prixMoyen: number;
  evolution: string;
  up: boolean;
  produits: string[];
}

export interface CommandeRentabilite {
  id: Id;
  num: string;
  client: string;
  montant: number;
  coutProduits: number;
  marge: number;
  tauxMarge: number;
  niveau: string;
}
