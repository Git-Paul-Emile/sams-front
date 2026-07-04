import { get, post } from "../../../services/httpClient";
import type { Commande, NewCommande } from "../../../types/ventes.types";

export function getCommandes(): Promise<Commande[]> {
  return get<Commande[]>("/commandes");
}

export function createCommande(payload: NewCommande): Promise<Commande> {
  return post<Commande>("/commandes", payload);
}
