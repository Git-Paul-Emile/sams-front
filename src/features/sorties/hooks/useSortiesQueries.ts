import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  createSalesReq, createMatReq, getMatReqs, getSalesReqs,
  type NewSalesReqPayload, type NewMatReqPayload,
} from "../api/sortiesApi";
import { createNotification } from "../../notifications/api/notificationsApi";
import { notificationsKeys } from "../../notifications";

export const salesReqsKeys = { all: ["salesReqs"] as const };
export const matReqsKeys = { all: ["matReqs"] as const };

export function useSalesReqs(search?: string) {
  return useQuery({
    queryKey: [...salesReqsKeys.all, { search: search ?? "" }] as const,
    queryFn: () => getSalesReqs({ search }),
  });
}

export function useMatReqs(search?: string) {
  return useQuery({
    queryKey: [...matReqsKeys.all, { search: search ?? "" }] as const,
    queryFn: () => getMatReqs({ search }),
  });
}

export function useCreateSalesReq() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: NewSalesReqPayload) => {
      const req = await createSalesReq(payload);
      await createNotification({
        type: "validation",
        titre: "Nouvelle sortie vente",
        msg: `${req.num} – ${req.produit} attend votre validation`,
        heure: "À l'instant",
      });
      return req;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: salesReqsKeys.all });
      queryClient.invalidateQueries({ queryKey: notificationsKeys.all });
      toast.success("Demande de sortie vente soumise");
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useCreateMatReq() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: NewMatReqPayload) => {
      const req = await createMatReq(payload);
      await createNotification({
        type: "validation",
        titre: "Demande matières premières",
        msg: `${req.num} – ${req.matiere} attend validation`,
        heure: "À l'instant",
      });
      return req;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: matReqsKeys.all });
      queryClient.invalidateQueries({ queryKey: notificationsKeys.all });
      toast.success("Demande de sortie matières soumise");
    },
    onError: (err: Error) => toast.error(err.message),
  });
}
