import { useState } from "react";
import { Btn, ImportDropZone, ImportReportView, Modal } from "../../../components/common";
import type { ImportReport, ImportRow } from "../../../components/common";
import { useImportStockItems } from "../hooks/useStockQueries";

const COLUMNS = ["code (optionnel)", "designation", "type (MATIERE|PRODUIT)", "categorie", "unite", "stock", "min", "critique", "valeurUnit"];

export function ImportStockModal({ onClose }: { onClose: () => void }) {
  const [report, setReport] = useState<ImportReport | null>(null);
  const importStockItems = useImportStockItems();

  function handleRows(rows: ImportRow[]) {
    importStockItems.mutate(rows, { onSuccess: setReport });
  }

  return (
    <Modal title="Importer des articles de stock" onClose={onClose}>
      <div className="flex flex-col gap-4">
        <ImportDropZone columns={COLUMNS} onRows={handleRows} />
        {report && <ImportReportView report={report} />}
        <div className="flex justify-end gap-3 pt-2">
          <Btn variant="secondary" onClick={onClose}>Fermer</Btn>
        </div>
      </div>
    </Modal>
  );
}
