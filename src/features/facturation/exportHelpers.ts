import { fmt } from "../../utils/format";
import type { Facture } from "../../types/facturation.types";

export const FACTURE_HEADERS = ["Champ", "Valeur"];

export function factureRows(f: Facture) {
  return [
    ["N° Facture", f.num],
    ["Client", f.client],
    ["Date émission", f.date],
    ["Échéance", f.echeance],
    ["Montant", `${fmt(f.montant)} F`],
    ["Payé", `${fmt(f.paye)} F`],
    ["Solde", `${fmt(f.montant - f.paye)} F`],
    ["Type", f.type],
    ["Statut", f.statut],
    ["Commercial", f.commercial],
    ["Mode paiement", f.mode],
  ];
}
