import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createAchat, getAchats } from "../api/achatsApi";
import type { NewAchat } from "../../../types/achats.types";

export const achatsKeys = {
  all: ["achats"] as const,
};

export function useAchats(search?: string) {
  return useQuery({
    queryKey: [...achatsKeys.all, { search: search ?? "" }] as const,
    queryFn: () => getAchats({ search }),
  });
}

export function useCreateAchat() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: NewAchat) => createAchat(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: achatsKeys.all });
      toast.success("Bon de commande créé");
    },
    onError: (err: Error) => toast.error(err.message),
  });
}
