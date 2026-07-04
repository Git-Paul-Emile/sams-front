import { useQuery } from "@tanstack/react-query";
import { getAuditLog } from "../api/rapportsApi";

export const rapportsKeys = {
  auditLog: ["auditLog"] as const,
};

export function useAuditLog() {
  return useQuery({
    queryKey: rapportsKeys.auditLog,
    queryFn: getAuditLog,
  });
}
