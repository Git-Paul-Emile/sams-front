import { get } from "../../../services/httpClient";
import type { CommandeRentabilite, MatierePrix, ProdCostDef } from "../../../types/couts.types";

export function getProductCosts(): Promise<ProdCostDef[]> {
  return get<ProdCostDef[]>("/product-costs");
}

export function getMatieresPrix(): Promise<MatierePrix[]> {
  return get<MatierePrix[]>("/matieres-prix");
}

export function getCommandesRentabilite(): Promise<CommandeRentabilite[]> {
  return get<CommandeRentabilite[]>("/commandes-rentabilite");
}
