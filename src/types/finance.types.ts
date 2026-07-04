import type { Id } from "./common.types";

export interface PeriodeFinanciere {
  ca: number;
  cash: number;
  depot: number;
  creance: number;
}

export interface VentesPeriodes {
  jour: PeriodeFinanciere;
  semaine: PeriodeFinanciere;
  mois: PeriodeFinanciere;
}

export interface VentesCommercialRow {
  id: Id;
  commercial: string;
  zone: string;
  ca: number;
  nbCmd: number;
  marge: number;
}

export interface VentesSegmentRow {
  id: Id;
  segment: string;
  ca: number;
  pct: number;
  couleur: string;
}

export interface EvolutionMargeRow {
  id: Id;
  mois: string;
  ca: number;
  couts: number;
  marge: number;
}

export interface ProdChartPoint {
  id: Id;
  mois: string;
  production: number;
  objectif: number;
}

export interface VentesChartPoint {
  id: Id;
  zone: string;
  ventes: number;
}

export interface CashChartPoint {
  id: Id;
  semaine: string;
  entrees: number;
  sorties: number;
}
