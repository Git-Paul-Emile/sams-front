import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createCommande, getCommandes } from "../api/ventesApi";
import type { NewCommande } from "../../../types/ventes.types";

export const ventesKeys = {
  all: ["commandes"] as const,
};

export function useCommandes() {
  return useQuery({
    queryKey: ventesKeys.all,
    queryFn: getCommandes,
  });
}

export function useCreateCommande() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: NewCommande) => createCommande(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ventesKeys.all });
      toast.success("Commande créée");
    },
    onError: (err: Error) => toast.error(err.message),
  });
}
