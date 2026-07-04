import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createProdOrder, getBom, getIncidents, getOperateurs, getProdOrders, getStockProduits } from "../api/productionApi";
import type { NewProdOrder } from "../../../types/production.types";

export const productionKeys = {
  orders: ["prodOrders"] as const,
  bom: ["bom"] as const,
  operateurs: ["operateurs"] as const,
  incidents: ["incidents"] as const,
};

export function useProdOrders() {
  return useQuery({
    queryKey: productionKeys.orders,
    queryFn: getProdOrders,
  });
}

export function useBom() {
  return useQuery({
    queryKey: productionKeys.bom,
    queryFn: getBom,
  });
}

export function useOperateurs() {
  return useQuery({
    queryKey: productionKeys.operateurs,
    queryFn: getOperateurs,
  });
}

export function useIncidents() {
  return useQuery({
    queryKey: productionKeys.incidents,
    queryFn: getIncidents,
  });
}

export function useProductionStockProduits() {
  return useQuery({
    queryKey: ["stockProduits"],
    queryFn: getStockProduits,
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
