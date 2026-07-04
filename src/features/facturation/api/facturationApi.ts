import { get, post } from "../../../services/httpClient";
import type { Facture, NewFacture } from "../../../types/facturation.types";

export function getFactures(): Promise<Facture[]> {
  return get<Facture[]>("/factures");
}

export function createFacture(payload: NewFacture): Promise<Facture> {
  return post<Facture>("/factures", payload);
}

export function payFacture(id: string, montant: number): Promise<Facture> {
  return post<Facture>(`/factures/${id}/pay`, { montant });
}
