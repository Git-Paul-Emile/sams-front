import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  createBom, createProdOrder, deleteBom, getBom, getIncidents, getOperateurs, getProdOrders, getStockMatieres,
  getStockProduits, updateBom,
} from "../api/productionApi";
import type { NewBom, NewProdOrder, UpdateBom } from "../../../types/production.types";

export const productionKeys = {
  orders: ["prodOrders"] as const,
  bom: ["bom"] as const,
  operateurs: ["operateurs"] as const,
  incidents: ["incidents"] as const,
};

export function useProdOrders(search?: string) {
  return useQuery({
    queryKey: [...productionKeys.orders, { search: search ?? "" }] as const,
    queryFn: () => getProdOrders({ search }),
  });
}

export function useBom() {
  return useQuery({
    queryKey: productionKeys.bom,
    queryFn: getBom,
  });
}

export function useOperateurs(search?: string) {
  return useQuery({
    queryKey: [...productionKeys.operateurs, { search: search ?? "" }] as const,
    queryFn: () => getOperateurs({ search }),
  });
}

export function useIncidents(search?: string) {
  return useQuery({
    queryKey: [...productionKeys.incidents, { search: search ?? "" }] as const,
    queryFn: () => getIncidents({ search }),
  });
}

export function useProductionStockProduits() {
  return useQuery({
    queryKey: ["stockProduits"],
    queryFn: getStockProduits,
  });
}

export function useStockMatieres() {
  return useQuery({
    queryKey: ["stockMatieres"],
    queryFn: getStockMatieres,
  });
}

export function useCreateBom() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: NewBom) => createBom(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productionKeys.bom });
      toast.success("Formule créée");
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useUpdateBom() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateBom }) => updateBom(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productionKeys.bom });
      toast.success("Formule mise à jour");
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useDeleteBom() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteBom(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productionKeys.bom });
      toast.success("Formule supprimée");
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useCreateProdOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: NewProdOrder) => createProdOrder(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productionKeys.orders });
      toast.success("Ordre de fabrication créé");
    },
    onError: (err: Error) => toast.error(err.message),
  });
}
