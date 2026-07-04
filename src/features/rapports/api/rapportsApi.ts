import { get } from "../../../services/httpClient";
import type { AuditEntry } from "../types";

export function getAuditLog(params?: { search?: string }): Promise<AuditEntry[]> {
  return get<AuditEntry[]>("/audit-log", params);
}
