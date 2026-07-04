import type { Id } from "./common.types";

export interface ProdOrder {
  id: Id;
  produit: string;
  ligne: string;
  qtePrev: number;
  qteReel: number;
  debut: string;
  fin: string;
  responsable: string;
  statut: string;
  rendement: number;
}

export interface NewProdOrder {
  produitId: string;
  ligne: string;
  qtePrev: number;
  debut: string;
  fin: string;
  responsableId?: string;
}

export interface BomItem {
  intrant: string;
  categorie: string;
  qte: number;
  unite: string;
}

export interface BomEntry {
  id: Id;
  produit: string;
  items: BomItem[];
}

export interface Operateur {
  id: Id;
  matricule: string;
  nom: string;
  prenom: string;
  tel: string;
  email: string;
  poste: string;
  ligne: string;
  embauche: string;
  statut: string;
  rendement: number;
  ofRealises: number;
  vol: number;
  incidents: number;
}

export interface Incident {
  id: Id;
  of: string;
  categorie: string;
  description: string;
  date: string;
  statut: string;
  gravite: string;
  operateur: string;
}
