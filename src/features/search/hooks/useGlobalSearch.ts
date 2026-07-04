import { useQuery } from "@tanstack/react-query";
import { getGlobalSearch } from "../api/searchApi";

export function useGlobalSearch(q: string) {
  return useQuery({
    queryKey: ["globalSearch", q] as const,
    queryFn: () => getGlobalSearch(q),
    enabled: q.trim().length > 1,
  });
}
