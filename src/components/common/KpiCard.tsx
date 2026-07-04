import type React from "react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";

export function KpiCard({ label, value, sub, icon: Icon, trend, color, alert }: {
  label: string;
  value: string;
  sub?: string;
  icon: React.ElementType;
  trend?: { val: string; up: boolean };
  color: string;
  alert?: boolean;
}) {
  return (
    <div className={`bg-card rounded-xl border p-4 flex flex-col gap-2.5 shadow-sm ${alert ? "border-red-200 bg-red-50/30" : "border-border"}`}>
      <div className="flex items-start justify-between">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide leading-tight">{label}</p>
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${color}`}><Icon className="w-4 h-4 text-white" /></div>
      </div>
      <p className="text-xl font-black text-foreground" style={{ fontFamily: "var(--font-family-heading)" }}>{value}</p>
      {sub && <p className="text-xs text-muted-foreground -mt-1">{sub}</p>}
      {trend && (
        <div className={`flex items-center gap-1 text-xs font-medium ${trend.up ? "text-emerald-600" : "text-red-600"}`}>
          {trend.up ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
          {trend.val} vs mois préc.
        </div>
      )}
    </div>
  );
}
