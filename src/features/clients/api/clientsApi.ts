import { get, patch, post } from "../../../services/httpClient";
import type { Client, NewClient } from "../../../types/clients.types";

export function getClients(params?: { search?: string }): Promise<Client[]> {
  return get<Client[]>("/clients", params);
}

export function createClient(payload: NewClient): Promise<Client> {
  return post<Client>("/clients", payload);
}

export function updateClient(id: string, payload: Partial<Client>): Promise<Client> {
  return patch<Client>(`/clients/${id}`, payload);
}

export function setClientStatus(id: string, statut: "Actif" | "Inactif"): Promise<Client> {
  return patch<Client>(`/clients/${id}`, { statut });
}
