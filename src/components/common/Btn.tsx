import type React from "react";

export function Btn({ children, variant = "primary", onClick, sm, disabled }: {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "danger" | "success";
  onClick?: () => void;
  sm?: boolean;
  disabled?: boolean;
}) {
  const base = `inline-flex items-center gap-1.5 font-medium rounded-lg transition-colors ${sm ? "text-xs px-2.5 py-1.5" : "text-sm px-3.5 py-2"} ${disabled ? "opacity-50 pointer-events-none" : ""}`;
  const v = {
    primary: "bg-primary text-primary-foreground hover:bg-blue-800",
    secondary: "bg-muted text-foreground hover:bg-slate-200",
    ghost: "text-muted-foreground hover:bg-muted hover:text-foreground",
    danger: "bg-red-50 text-red-700 hover:bg-red-100",
    success: "bg-emerald-50 text-emerald-700 hover:bg-emerald-100",
  }[variant];
  return <button className={`${base} ${v}`} onClick={onClick} disabled={disabled}>{children}</button>;
}
