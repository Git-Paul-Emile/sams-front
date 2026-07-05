import { useRef, useState } from "react";
import { read, utils } from "xlsx";
import { Upload } from "lucide-react";
import { toast } from "sonner";
import { Btn, ImportReportView, Modal } from "../../../components/common";
import type { ImportReport, ImportRow } from "../../../components/common";
import { useImportCommerciaux, useImportOperateurs, useImportUsers } from "../hooks/useAdministrationQueries";

interface TeamReports {
  Users?: ImportReport;
  Commerciaux?: ImportReport;
  Operateurs?: ImportReport;
}

const SHEETS = ["Users", "Commerciaux", "Operateurs"] as const;

export function ImportTeamModal({ onClose }: { onClose: () => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [reports, setReports] = useState<TeamReports>({});
  const importUsers = useImportUsers();
  const importOperateurs = useImportOperateurs();
  const importCommerciaux = useImportCommerciaux();

  async function handleFile(file: File) {
    try {
      const buffer = await file.arrayBuffer();
      const workbook = read(buffer);
      const foundSheets = SHEETS.filter((name) => workbook.Sheets[name]);
      if (foundSheets.length === 0) {
        toast.error('Aucune feuille "Users", "Commerciaux" ou "Operateurs" trouvée dans ce fichier');
        return;
      }
      setFileName(file.name);
      setReports({});

      for (const name of foundSheets) {
        const rows = utils.sheet_to_json<ImportRow>(workbook.Sheets[name], { defval: undefined });
        if (rows.length === 0) continue;
        if (name === "Users") importUsers.mutate(rows, { onSuccess: (r) => setReports((prev) => ({ ...prev, Users: r })) });
        if (name === "Commerciaux") importCommerciaux.mutate(rows, { onSuccess: (r) => setReports((prev) => ({ ...prev, Commerciaux: r })) });
        if (name === "Operateurs") importOperateurs.mutate(rows, { onSuccess: (r) => setReports((prev) => ({ ...prev, Operateurs: r })) });
      }
    } catch {
      toast.error("Impossible de lire ce fichier (formats acceptés : .xlsx, .csv)");
    }
  }

  return (
    <Modal title="Importer des comptes équipe" onClose={onClose}>
      <div className="flex flex-col gap-4">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex flex-col items-center justify-center gap-2 py-8 rounded-xl border-2 border-dashed border-border hover:border-primary hover:bg-muted/40 transition-colors"
        >
          <Upload className="w-6 h-6 text-muted-foreground" />
          <span className="text-sm font-medium">{fileName ?? "Choisir un classeur .xlsx"}</span>
        </button>
        <input
          ref={inputRef}
          type="file"
          accept=".xlsx,.xls"
          className="hidden"
          onChange={(e) => { const file = e.target.files?.[0]; if (file) void handleFile(file); }}
        />
        <p className="text-xs text-muted-foreground">
          Classeur Excel avec jusqu'à 3 feuilles nommées <span className="font-mono">Users</span>, <span className="font-mono">Commerciaux</span>, <span className="font-mono">Operateurs</span> — colonnes identiques aux formulaires de création correspondants.
        </p>

        {reports.Users && (
          <div>
            <p className="text-xs font-semibold mb-1">Feuille "Users"</p>
            <ImportReportView report={reports.Users} />
          </div>
        )}
        {reports.Commerciaux && (
          <div>
            <p className="text-xs font-semibold mb-1">Feuille "Commerciaux"</p>
            <ImportReportView report={reports.Commerciaux} />
          </div>
        )}
        {reports.Operateurs && (
          <div>
            <p className="text-xs font-semibold mb-1">Feuille "Operateurs"</p>
            <ImportReportView report={reports.Operateurs} />
          </div>
        )}

        <div className="flex justify-end gap-3 pt-2">
          <Btn variant="secondary" onClick={onClose}>Fermer</Btn>
        </div>
      </div>
    </Modal>
  );
}
