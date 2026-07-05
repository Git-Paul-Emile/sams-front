export interface ImportReport {
  created: number;
  errors: { index: number; message: string }[];
}

export function ImportReportView({ report }: { report: ImportReport }) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-sm font-medium text-emerald-700">{report.created} ligne(s) importée(s) avec succès</p>
      {report.errors.length > 0 && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 max-h-48 overflow-y-auto">
          <p className="text-xs font-semibold text-red-700 mb-1.5">{report.errors.length} ligne(s) en erreur :</p>
          <ul className="flex flex-col gap-1">
            {report.errors.map((e) => (
              <li key={e.index} className="text-xs text-red-600">
                Ligne {e.index + 1} : {e.message}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
