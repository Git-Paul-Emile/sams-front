import { get } from "../../../services/httpClient";
import type { GlobalSearchResult } from "../../../types/search.types";

export function getGlobalSearch(q: string): Promise<GlobalSearchResult[]> {
  return get<GlobalSearchResult[]>("/search/global", { q });
}
