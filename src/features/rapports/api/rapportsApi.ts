import { get } from "../../../services/httpClient";
import type { AuditEntry } from "../types";

export function getAuditLog(): Promise<AuditEntry[]> {
  return get<AuditEntry[]>("/audit-log");
}
