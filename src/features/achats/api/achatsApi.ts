import { get, post } from "../../../services/httpClient";
import type { Achat, NewAchat } from "../../../types/achats.types";

export function getAchats(): Promise<Achat[]> {
  return get<Achat[]>("/achats");
}

export function createAchat(payload: NewAchat): Promise<Achat> {
  return post<Achat>("/achats", payload);
}
