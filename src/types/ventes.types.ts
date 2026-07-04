import type { Id } from "./common.types";

export interface TimelineEvent {
  etat: string;
  date: string;
  user: string;
  commentaire?: string;
}

export interface Commande {
  id: Id;
  num: string;
  client: string;
  date: string;
  montant: number;
  commercial: string;
  statutActuel: string;
  timeline: TimelineEvent[];
}

export interface NewCommande {
  clientId: string;
  montant: number;
  commercialId: string;
}
