import { useQuery } from "@tanstack/react-query";
import {
  getSalesReqs, getMatReqs, getFactures, getClients, getStockMatieres,
  getCommandes, getProdChart, getVentesChart, getCommerciaux,
  getEvolutionMarge, getProductCosts, getStockProduits, getMouvementsStock,
} from "../api/dashboardApi";

export function useDashboardSalesReqs(enabled: boolean) {
  return useQuery({ queryKey: ["salesReqs"], queryFn: getSalesReqs, enabled });
}

export function useDashboardMatReqs(enabled: boolean) {
  return useQuery({ queryKey: ["matReqs"], queryFn: getMatReqs, enabled });
}

export function useDashboardFactures(enabled: boolean) {
  return useQuery({ queryKey: ["factures"], queryFn: getFactures, enabled });
}

export function useDashboardClients(enabled: boolean) {
  return useQuery({ queryKey: ["clients"], queryFn: getClients, enabled });
}

export function useDashboardStockMatieres(enabled: boolean) {
  return useQuery({ queryKey: ["stockMatieres"], queryFn: getStockMatieres, enabled });
}

export function useDashboardCommandes(enabled: boolean) {
  return useQuery({ queryKey: ["commandes"], queryFn: getCommandes, enabled });
}

export function useDashboardProdChart(enabled: boolean) {
  return useQuery({ queryKey: ["prodChart"], queryFn: getProdChart, enabled });
}

export function useDashboardVentesChart(enabled: boolean) {
  return useQuery({ queryKey: ["ventesChart"], queryFn: getVentesChart, enabled });
}

export function useDashboardCommerciaux(enabled: boolean) {
  return useQuery({ queryKey: ["commerciaux"], queryFn: getCommerciaux, enabled });
}

export function useDashboardEvolutionMarge(enabled: boolean) {
  return useQuery({ queryKey: ["evolutionMarge"], queryFn: getEvolutionMarge, enabled });
}

export function useDashboardProductCosts(enabled: boolean) {
  return useQuery({ queryKey: ["productCosts"], queryFn: getProductCosts, enabled });
}

export function useDashboardStockProduits(enabled: boolean) {
  return useQuery({ queryKey: ["stockProduits"], queryFn: getStockProduits, enabled });
}

export function useDashboardMouvementsStock(enabled: boolean) {
  return useQuery({ queryKey: ["mouvementsStock"], queryFn: getMouvementsStock, enabled });
}
