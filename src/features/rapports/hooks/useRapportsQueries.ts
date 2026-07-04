import { useQuery } from "@tanstack/react-query";
import { getAuditLog } from "../api/rapportsApi";

export const rapportsKeys = {
  auditLog: ["auditLog"] as const,
};

export function useAuditLog(search?: string) {
  return useQuery({
    queryKey: [...rapportsKeys.auditLog, { search: search ?? "" }] as const,
    queryFn: () => getAuditLog({ search }),
  });
}
