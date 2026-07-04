import { get, post } from "../../../services/httpClient";
import type { ApprovalRecord } from "../../../types/validations.types";
import type { SalesReq, MatReq } from "../../../types/sorties.types";

export function getApprovalHist(): Promise<ApprovalRecord[]> {
  return get<ApprovalRecord[]>("/approval-history");
}

export function approveSalesRequest(id: string, payload: { qteValidee?: number; commentaire?: string }): Promise<SalesReq> {
  return post<SalesReq>(`/sales-requests/${id}/approve`, payload);
}

export function rejectSalesRequest(id: string, payload: { motifRefus: string }): Promise<SalesReq> {
  return post<SalesReq>(`/sales-requests/${id}/reject`, payload);
}

export function approveMaterialRequest(id: string, payload: { qteValidee?: number; commentaires?: string }): Promise<MatReq> {
  return post<MatReq>(`/material-requests/${id}/approve`, payload);
}

export function rejectMaterialRequest(id: string, payload: { motifRefus: string }): Promise<MatReq> {
  return post<MatReq>(`/material-requests/${id}/reject`, payload);
}
