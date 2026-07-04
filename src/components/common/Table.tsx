import type React from "react";

export function Table({ headers, children }: { headers: string[]; children: React.ReactNode }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border">
            {headers.map((h) => (
              <th key={h} className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide py-3 px-3 first:pl-0">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">{children}</tbody>
      </table>
    </div>
  );
}

export function TR({ children, onClick, highlight }: { children: React.ReactNode; onClick?: () => void; highlight?: boolean }) {
  return (
    <tr className={`${onClick ? "cursor-pointer" : ""} hover:bg-muted/40 transition-colors ${highlight ? "bg-amber-50/40" : ""}`} onClick={onClick}>
      {children}
    </tr>
  );
}

export function TD({ children, mono }: { children: React.ReactNode; mono?: boolean }) {
  return <td className={`py-3 px-3 first:pl-0 ${mono ? "font-mono text-xs" : ""}`}>{children}</td>;
}
