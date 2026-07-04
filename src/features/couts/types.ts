import type { ProdCostDef } from "../../types/couts.types";
import type { calcCosts } from "../../utils/costs";

// Un produit de coûts enrichi des champs dérivés calculés par calcCosts().
export type ComputedProduct = ProdCostDef & ReturnType<typeof calcCosts>;
