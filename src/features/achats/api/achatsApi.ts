import { get, post } from "../../../services/httpClient";
import type { Achat, NewAchat } from "../../../types/achats.types";

export function getAchats(params?: { search?: string }): Promise<Achat[]> {
  return get<Achat[]>("/achats", params);
}

export function createAchat(payload: NewAchat): Promise<Achat> {
  return post<Achat>("/achats", payload);
}
