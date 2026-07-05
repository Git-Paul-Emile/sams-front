import { useRef, useState } from "react";
import { read, utils } from "xlsx";
import { Upload } from "lucide-react";
import { toast } from "sonner";

export type ImportRow = Record<string, unknown>;

/** Lit un fichier .xlsx/.csv côté navigateur (aucun envoi de fichier au backend) et renvoie les lignes en JSON. */
export function ImportDropZone({ columns, onRows }: { columns: string[]; onRows: (rows: ImportRow[]) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  async function handleFile(file: File) {
    try {
      const buffer = await file.arrayBuffer();
      const workbook = read(buffer);
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows = utils.sheet_to_json<ImportRow>(sheet, { defval: undefined });
      if (rows.length === 0) {
        toast.error("Le fichier ne contient aucune ligne de données");
        return;
      }
      setFileName(file.name);
      onRows(rows);
    } catch {
      toast.error("Impossible de lire ce fichier (formats acceptés : .xlsx, .csv)");
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="flex flex-col items-center justify-center gap-2 py-8 rounded-xl border-2 border-dashed border-border hover:border-primary hover:bg-muted/40 transition-colors"
      >
        <Upload className="w-6 h-6 text-muted-foreground" />
        <span className="text-sm font-medium">{fileName ?? "Choisir un fichier .xlsx ou .csv"}</span>
      </button>
      <input
        ref={inputRef}
        type="file"
        accept=".xlsx,.xls,.csv"
        className="hidden"
        onChange={(e) => { const file = e.target.files?.[0]; if (file) void handleFile(file); }}
      />
      <p className="text-xs text-muted-foreground">
        Colonnes attendues : <span className="font-mono">{columns.join(", ")}</span>
      </p>
    </div>
  );
}
