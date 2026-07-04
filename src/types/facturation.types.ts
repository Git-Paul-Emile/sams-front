import type { Id } from "./common.types";

export interface Facture {
  id: Id;
  num: string;
  client: string;
  date: string;
  echeance: string;
  montant: number;
  paye: number;
  statut: string;
  mode: string;
  commercial: string;
  type: string;
  dateReglPrev: string | null;
  dateReglEff: string | null;
}

export interface NewFacture {
  clientId: string;
  echeance: string;
  montant: number;
  commercialId: string;
  type: string;
  commandeId?: string;
}
