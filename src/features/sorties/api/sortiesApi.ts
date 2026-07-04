import { get, post } from "../../../services/httpClient";
import type { SalesReq, MatReq } from "../../../types/sorties.types";

export function getSalesReqs(params?: { search?: string }): Promise<SalesReq[]> {
  return get<SalesReq[]>("/sales-requests", params);
}

export interface NewSalesReqPayload {
  clientId: string;
  commercialId: string;
  produitId: string;
  qteDemandee: number;
  prixUnit: number;
  entrepot?: string;
  observation?: string;
}

export function createSalesReq(payload: NewSalesReqPayload): Promise<SalesReq> {
  return post<SalesReq>("/sales-requests", payload);
}

export function getMatReqs(params?: { search?: string }): Promise<MatReq[]> {
  return get<MatReq[]>("/material-requests", params);
}

export interface NewMatReqPayload {
  prodOrderId: string;
  operateurId?: string;
  ligne: string;
  matiereId: string;
  qteDemandee: number;
  commentaires?: string;
}

export function createMatReq(payload: NewMatReqPayload): Promise<MatReq> {
  return post<MatReq>("/material-requests", payload);
}
