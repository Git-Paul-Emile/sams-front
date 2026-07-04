import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  approveMaterialRequest,
  approveSalesRequest,
  getApprovalHist,
  rejectMaterialRequest,
  rejectSalesRequest,
} from "../api/validationsApi";
import { notificationsKeys } from "../../notifications";
import { salesReqsKeys, matReqsKeys } from "../../sorties";
import type { SalesReq, MatReq } from "../../../types/sorties.types";

export const approvalHistKeys = { all: ["approvalHist"] as const };
const stockItemsKeys = { all: ["stockItems"] as const };

export function useApprovalHist() {
  return useQuery({ queryKey: approvalHistKeys.all, queryFn: getApprovalHist });
}

interface ApproveInput {
  type: "vente" | "matiere";
  req: SalesReq | MatReq;
  comment: string;
}

function invalidateAll(queryClient: ReturnType<typeof useQueryClient>) {
  queryClient.invalidateQueries({ queryKey: salesReqsKeys.all });
  queryClient.invalidateQueries({ queryKey: matReqsKeys.all });
  queryClient.invalidateQueries({ queryKey: stockItemsKeys.all });
  queryClient.invalidateQueries({ queryKey: approvalHistKeys.all });
  queryClient.invalidateQueries({ queryKey: notificationsKeys.all });
}

// L'approbation/refus est désormais une action atomique côté serveur (mise à
// jour de la demande + décrément stock + historique + notification Direction
// dans une seule transaction Postgres) — voir back/src/services/{salesRequests,materialRequests}.service.ts.
export function useApproveRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ type, req, comment }: ApproveInput) => {
      if (type === "vente") {
        return approveSalesRequest(req.id, { qteValidee: req.qteDemandee, commentaire: comment || undefined });
      }
      return approveMaterialRequest(req.id, { qteValidee: req.qteDemandee, commentaires: comment || undefined });
    },
    onSuccess: () => {
      invalidateAll(queryClient);
      toast.success("Demande validée");
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

interface RejectInput {
  type: "vente" | "matiere";
  req: SalesReq | MatReq;
  motif: string;
}

export function useRejectRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ type, req, motif }: RejectInput) => {
      if (type === "vente") return rejectSalesRequest(req.id, { motifRefus: motif });
      return rejectMaterialRequest(req.id, { motifRefus: motif });
    },
    onSuccess: () => {
      invalidateAll(queryClient);
      toast.success("Demande refusée");
    },
    onError: (err: Error) => toast.error(err.message),
  });
}
