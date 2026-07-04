export type StockStatus = "négatif" | "critique" | "minimum" | "normal";

export function getStockStatus(s: number, min: number, crit: number): StockStatus {
  if (s <= 0) return "négatif";
  if (s <= crit) return "critique";
  if (s <= min) return "minimum";
  return "normal";
}
