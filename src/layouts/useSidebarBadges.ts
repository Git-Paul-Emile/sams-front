import { useQuery } from "@tanstack/react-query";
import { get } from "../services/httpClient";
import { getStockStatus } from "../utils/stock";
import type { StockItem } from "../types/stock.types";
import type { SalesReq, MatReq } from "../types/sorties.types";
import type { Incident } from "../types/production.types";

// Compteurs de badges de navigation : dérivés de vraies requêtes (pas de valeurs figées),
// même si ces ressources seront aussi consommées via des hooks dédiés par les features
// correspondantes plus tard — les query keys sont volontairement alignées sur ["<resource>"].
export function useSidebarBadges() {
  const stockMatieres = useQuery({ queryKey: ["stockItems", "MATIERE"], queryFn: () => get<StockItem[]>("/stock-items", { type: "MATIERE" }) });
  const stockProduits = useQuery({ queryKey: ["stockItems", "PRODUIT"], queryFn: () => get<StockItem[]>("/stock-items", { type: "PRODUIT" }) });
  const salesReqs = useQuery({ queryKey: ["salesReqs"], queryFn: () => get<SalesReq[]>("/sales-requests") });
  const matReqs = useQuery({ queryKey: ["matReqs"], queryFn: () => get<MatReq[]>("/material-requests") });
  const incidents = useQuery({ queryKey: ["incidents"], queryFn: () => get<Incident[]>("/incidents") });

  const alerteStock = (items: StockItem[] | undefined) =>
    (items ?? []).filter((i) => {
      const st = getStockStatus(i.stock, i.min, i.critique);
      return st === "critique" || st === "négatif";
    }).length;

  const pendingCount =
    (salesReqs.data ?? []).filter((r) => r.statut === "En attente de validation").length +
    (matReqs.data ?? []).filter((r) => r.statut === "En attente de validation").length;

  return {
    production: (incidents.data ?? []).filter((i) => i.statut === "Ouvert").length,
    stock: alerteStock(stockMatieres.data) + alerteStock(stockProduits.data),
    sorties: pendingCount,
    validations: pendingCount,
  };
}
