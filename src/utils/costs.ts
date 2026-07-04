import type { ProdCostDef } from "../types/couts.types";

export function calcCosts(p: ProdCostDef) {
  const coutMat = p.bom.reduce((s, b) => s + b.qteKg * b.prixAchat, 0);
  const coutEmb = p.emballages.reduce((s, e) => s + e.qte * e.prix, 0);
  const coutProd = coutMat + coutEmb + p.coutMO + p.coutEnergie + p.coutConsommables + p.coutIndirects;
  const coutUnit = p.qteProduite > 0 ? coutProd / p.qteProduite : 0;
  const prixRevient = coutUnit + p.fraisLogistiques + p.fraisCommerciaux + p.fraisAdmin;
  const margeBrute = p.prixVente - prixRevient;
  const tauxMarge = p.prixVente > 0 ? (margeBrute / p.prixVente) * 100 : 0;
  const profitUnitaire = margeBrute;
  const profitTotal = margeBrute * p.qteVendue;
  const ca = p.prixVente * p.qteVendue;
  const ecartCout = p.coutTheoriqueUnit > 0 ? ((coutUnit - p.coutTheoriqueUnit) / p.coutTheoriqueUnit) * 100 : 0;
  return { coutMat, coutEmb, coutProd, coutUnit, prixRevient, margeBrute, tauxMarge, profitUnitaire, profitTotal, ca, ecartCout };
}
