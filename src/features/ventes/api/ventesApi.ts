import { get, post } from "../../../services/httpClient";
import type { Commande, NewCommande } from "../../../types/ventes.types";

export function getCommandes(params?: { search?: string }): Promise<Commande[]> {
  return get<Commande[]>("/commandes", params);
}

export function createCommande(payload: NewCommande): Promise<Commande> {
  return post<Commande>("/commandes", payload);
}
