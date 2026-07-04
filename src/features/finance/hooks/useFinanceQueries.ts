import { useQuery } from "@tanstack/react-query";
import {
  getVentesPeriodes, getStockProduits, getVentesCommercial, getVentesChart,
  getVentesSegment, getEvolutionMarge, getCashChart, getCommandesRentabilite, getProductCosts,
} from "../api/financeApi";

export function useVentesPeriodes() {
  return useQuery({ queryKey: ["ventesPeriodes"], queryFn: getVentesPeriodes });
}

export function useFinanceStockProduits() {
  return useQuery({ queryKey: ["stockProduits"], queryFn: getStockProduits });
}

export function useVentesCommercial() {
  return useQuery({ queryKey: ["ventesCommercial"], queryFn: getVentesCommercial });
}

export function useFinanceVentesChart() {
  return useQuery({ queryKey: ["ventesChart"], queryFn: getVentesChart });
}

export function useVentesSegment() {
  return useQuery({ queryKey: ["ventesSegment"], queryFn: getVentesSegment });
}

export function useEvolutionMarge() {
  return useQuery({ queryKey: ["evolutionMarge"], queryFn: getEvolutionMarge });
}

export function useCashChart() {
  return useQuery({ queryKey: ["cashChart"], queryFn: getCashChart });
}

export function useCommandesRentabilite() {
  return useQuery({ queryKey: ["commandesRentabilite"], queryFn: getCommandesRentabilite });
}

export function useFinanceProductCosts() {
  return useQuery({ queryKey: ["productCosts"], queryFn: getProductCosts });
}
