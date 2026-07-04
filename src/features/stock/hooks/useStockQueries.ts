import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  createMouvement,
  getMouvements,
  getStockMatieres,
  getStockProduits,
  updateStockItemQuantity,
} from "../api/stockApi";
import type { StockItem } from "../../../types/stock.types";

export const stockKeys = {
  matieres: ["stockMatieres"] as const,
  produits: ["stockProduits"] as const,
  mouvements: ["mouvementsStock"] as const,
};

export function useStockMatieres(search?: string) {
  return useQuery({
    queryKey: [...stockKeys.matieres, { search: search ?? "" }] as const,
    queryFn: () => getStockMatieres({ search }),
  });
}

export function useStockProduits(search?: string) {
  return useQuery({
    queryKey: [...stockKeys.produits, { search: search ?? "" }] as const,
    queryFn: () => getStockProduits({ search }),
  });
}

export function useMouvements(search?: string) {
  return useQuery({
    queryKey: [...stockKeys.mouvements, { search: search ?? "" }] as const,
    queryFn: () => getMouvements({ search }),
  });
}

export interface StockEntryInput {
  cible: "matiere" | "produit";
  item: StockItem;
  qte: number;
  motif: string;
  user: string;
}

// Orchestration explicite en deux étapes : (1) journaliser le mouvement, (2) incrémenter
// le stock de l'article concerné. Pas d'abstraction partagée pour l'instant — cf. la note
// de conception dans la fiche de tâche production/stock.
export function useStockEntry() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ cible, item, qte, motif, user }: StockEntryInput) => {
      await createMouvement({
        stockItemId: item.id,
        type: "Entrée stock",
        qte,
        motif,
      });
      return updateStockItemQuantity(item.id, item.stock + qte);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: stockKeys.mouvements });
      queryClient.invalidateQueries({ queryKey: variables.cible === "matiere" ? stockKeys.matieres : stockKeys.produits });
      toast.success("Entrée de stock enregistrée");
    },
    onError: (err: Error) => toast.error(err.message),
  });
}
