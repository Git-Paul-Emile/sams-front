import type { Id } from "./common.types";

export interface SalesReq {
  id: Id;
  num: string;
  date: string;
  client: string;
  commercial: string;
  produit: string;
  ref: string;
  qteDemandee: number;
  qteValidee: number;
  stockDispo: number;
  prixUnit: number;
  montant: number;
  entrepot: string;
  observation: string;
  statut: string;
  valideur: string | null;
  dateValidation: string | null;
  commentaire: string;
}

export interface NewSalesReq {
  client: string;
  commercial: string;
  produit: string;
  ref: string;
  qteDemandee: number;
  stockDispo: number;
  prixUnit: number;
  entrepot: string;
  observation: string;
}

export interface MatReq {
  id: Id;
  num: string;
  date: string;
  produitFabrique: string;
  of: string;
  operateur: string;
  ligne: string;
  matiere: string;
  qteDemandee: number;
  qteValidee: number;
  commentaires: string;
  statut: string;
  valideur: string | null;
  dateValidation: string | null;
  docBC: string | null;
  docBL: string | null;
}

export interface NewMatReq {
  produitFabrique: string;
  of: string;
  operateur: string;
  ligne: string;
  matiere: string;
  qteDemandee: number;
  commentaires: string;
}
