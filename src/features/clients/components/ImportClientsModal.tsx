import { useState } from "react";
import { Btn, ImportDropZone, ImportReportView, Modal } from "../../../components/common";
import type { ImportReport, ImportRow } from "../../../components/common";
import { useImportClients } from "../hooks/useClientsQueries";

const COLUMNS = ["code (optionnel)", "raison", "contact", "tel", "email", "adresse", "ville", "pays", "zone", "commercialId (optionnel)"];

export function ImportClientsModal({ onClose }: { onClose: () => void }) {
  const [report, setReport] = useState<ImportReport | null>(null);
  const importClients = useImportClients();

  function handleRows(rows: ImportRow[]) {
    importClients.mutate(rows, { onSuccess: setReport });
  }

  return (
    <Modal title="Importer des clients" onClose={onClose}>
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
