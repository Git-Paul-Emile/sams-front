import type { Id } from "./common.types";

export interface Client {
  id: Id;
  code: string;
  raison: string;
  contact: string;
  tel: string;
  email: string;
  adresse: string;
  ville: string;
  pays: string;
  zone: string;
  commercial: string;
  conditions: string;
  plafond: number;
  encours: number;
  caYtd: number;
  statut: "Actif" | "Inactif";
  nbCmd: number;
}

export interface NewClient {
  code: string;
  raison: string;
  contact: string;
  tel: string;
  email: string;
  adresse: string;
  ville: string;
  pays: string;
  zone: string;
  commercial: string;
  conditions: string;
  plafond: number;
}
