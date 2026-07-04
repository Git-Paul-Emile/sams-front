import { useQuery } from "@tanstack/react-query";
import { getCommandesRentabilite, getMatieresPrix, getProductCosts } from "../api/coutsApi";

export const coutsKeys = {
  productCosts: ["productCosts"] as const,
  matieresPrix: ["matieresPrix"] as const,
  commandesRentabilite: ["commandesRentabilite"] as const,
};

export function useProductCosts() {
  return useQuery({
    queryKey: coutsKeys.productCosts,
    queryFn: getProductCosts,
  });
}

export function useMatieresPrix() {
  return useQuery({
    queryKey: coutsKeys.matieresPrix,
    queryFn: getMatieresPrix,
  });
}

export function useCommandesRentabilite() {
  return useQuery({
    queryKey: coutsKeys.commandesRentabilite,
    queryFn: getCommandesRentabilite,
  });
}
