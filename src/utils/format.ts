export const fmt = (n: number) => new Intl.NumberFormat("fr-FR").format(n);

export const fmtM = (n: number) => `${(n / 1_000_000).toFixed(1)} M`;

export const now = () => {
  const d = new Date();
  return `${d.toLocaleDateString("fr-FR")} ${d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}`;
};
