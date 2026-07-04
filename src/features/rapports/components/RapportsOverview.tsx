import { Download } from "lucide-react";
import { SectionHeader, Table, TR, TD } from "../../../components/common";
import { exportToExcel, exportToPdf } from "../../../utils/exportFile";
import { raps } from "../constants";
import { useAuditLog } from "../hooks/useRapportsQueries";
import type { AuditEntry } from "../types";

const AUDIT_HEADERS = ["Date / Heure", "Action", "Module", "Référence", "Utilisateur", "Adresse IP"];

function auditRows(entries: AuditEntry[]) {
  return entries.map((a) => [a.date, a.action, a.module, a.ref, a.user, a.ip]);
}

export function RapportsOverview() {
  const { data: audit = [] } = useAuditLog();

  return (
    <div>
      <SectionHeader title="Rapports & Exports" sub="Générez et exportez vos rapports analytiques" />
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-6">
        {raps.map((r) => {
          const I = r.i;
          const entries = r.id === "audit" ? audit : audit.filter((a) => a.module.toLowerCase() === r.l.toLowerCase());
          const label = `Rapport ${r.l}`;
          return (
            <div key={r.id} className={`bg-card rounded-xl border p-4 shadow-sm cursor-pointer hover:shadow-md transition-shadow ${r.c}`}>
              <I className="w-5 h-5 mb-2" />
              <p className="font-bold text-xs mb-1" style={{ fontFamily: "var(--font-family-heading)" }}>{r.l}</p>
              <p className="text-[10px] opacity-70 mb-3">{r.d}</p>
              <div className="flex gap-1">
                <button onClick={() => exportToPdf(label, AUDIT_HEADERS, auditRows(entries))} className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg bg-white/60 hover:bg-white/90 text-xs font-semibold"><Download className="w-3 h-3" />PDF</button>
                <button onClick={() => exportToExcel(label, AUDIT_HEADERS, auditRows(entries))} className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg bg-white/60 hover:bg-white/90 text-xs font-semibold"><Download className="w-3 h-3" />Excel</button>
              </div>
            </div>
          );
        })}
      </div>
      <div className="bg-card rounded-xl border border-border shadow-sm p-5">
        <h3 className="font-bold text-sm mb-4" style={{ fontFamily: "var(--font-family-heading)" }}>Journal d'audit – Traçabilité complète</h3>
        <Table headers={["Date / Heure", "Action", "Module", "Référence", "Utilisateur", "Adresse IP"]}>
          {audit.map((a) => (
            <TR key={a.id}>
              <TD><span className="text-xs font-mono text-muted-foreground">{a.date}</span></TD>
              <TD><span className={`text-xs px-2 py-0.5 rounded-full font-medium ${a.action === "Création" ? "bg-emerald-50 text-emerald-700" : a.action === "Modification" ? "bg-blue-50 text-blue-700" : a.action === "Validation" ? "bg-indigo-50 text-indigo-700" : a.action === "Refus" ? "bg-red-50 text-red-700" : "bg-slate-100 text-slate-600"}`}>{a.action}</span></TD>
              <TD>{a.module}</TD>
              <TD mono>{a.ref}</TD>
              <TD>{a.user}</TD>
              <TD mono>{a.ip}</TD>
            </TR>
          ))}
        </Table>
      </div>
    </div>
  );
}
