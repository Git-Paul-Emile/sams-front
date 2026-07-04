import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createFacture, getFactures, payFacture } from "../api/facturationApi";
import type { NewFacture } from "../../../types/facturation.types";

export const facturationKeys = {
  all: ["factures"] as const,
};

export function useFactures(search?: string) {
  return useQuery({
    queryKey: [...facturationKeys.all, { search: search ?? "" }] as const,
    queryFn: () => getFactures({ search }),
  });
}

export function useCreateFacture() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: NewFacture) => createFacture(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: facturationKeys.all });
      toast.success("Facture créée");
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function usePayFacture() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, montant }: { id: string; montant: number }) => payFacture(id, montant),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: facturationKeys.all });
      toast.success("Facture réglée");
    },
    onError: (err: Error) => toast.error(err.message),
  });
}
