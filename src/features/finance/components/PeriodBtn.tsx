export function PeriodBtn({ value, current, onChange }: {
  value: "jour" | "semaine" | "mois";
  current: string;
  onChange: (v: "jour" | "semaine" | "mois") => void;
}) {
  return (
    <button onClick={() => onChange(value)} className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors capitalize ${current === value ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>
      {value.charAt(0).toUpperCase() + value.slice(1)}
    </button>
  );
}
