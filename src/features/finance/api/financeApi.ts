import { get } from "../../../services/httpClient";
import type {
  VentesPeriodes, VentesCommercialRow, VentesChartPoint, VentesSegmentRow, EvolutionMargeRow, CashChartPoint,
} from "../../../types/finance.types";
import type { StockItem } from "../../../types/stock.types";
import type { CommandeRentabilite, ProdCostDef } from "../../../types/couts.types";

export function getVentesPeriodes(): Promise<VentesPeriodes> {
  return get<VentesPeriodes>("/finance/ventes-periodes");
}

export function getStockProduits(): Promise<StockItem[]> {
  return get<StockItem[]>("/stock-items", { type: "PRODUIT" });
}

export function getVentesCommercial(): Promise<VentesCommercialRow[]> {
  return get<VentesCommercialRow[]>("/finance/ventes-commercial");
}

export function getVentesChart(): Promise<VentesChartPoint[]> {
  return get<VentesChartPoint[]>("/finance/ventes-chart");
}

export function getVentesSegment(): Promise<VentesSegmentRow[]> {
  return get<VentesSegmentRow[]>("/finance/ventes-segment");
}

export function getEvolutionMarge(): Promise<EvolutionMargeRow[]> {
  return get<EvolutionMargeRow[]>("/finance/evolution-marge");
}

export function getCashChart(): Promise<CashChartPoint[]> {
  return get<CashChartPoint[]>("/finance/cash-chart");
}

export function getCommandesRentabilite(): Promise<CommandeRentabilite[]> {
  return get<CommandeRentabilite[]>("/commandes-rentabilite");
}

export function getProductCosts(): Promise<ProdCostDef[]> {
  return get<ProdCostDef[]>("/product-costs");
}
