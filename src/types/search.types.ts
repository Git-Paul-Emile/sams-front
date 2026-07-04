export interface GlobalSearchResult {
  type: "client" | "commande" | "facture" | "achat";
  id: string;
  label: string;
  path: string;
}
