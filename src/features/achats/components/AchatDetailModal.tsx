import { Modal, Badge } from "../../../components/common";
import { fmt } from "../../../utils/format";
import type { Achat } from "../../../types/achats.types";

export function AchatDetailModal({ achat, onClose }: { achat: Achat; onClose: () => void }) {
  const rows: [string, string][] = [
    ["N° BC", achat.num],
    ["Fournisseur", achat.fournisseur],
    ["Date de commande", achat.date],
    ["Livraison prévue", achat.livraison],
    ["Nombre d'articles", String(achat.articles)],
    ["Montant", `${fmt(achat.montant)} F CFA`],
  ];

  return (
    <Modal title={`Bon de commande – ${achat.num}`} onClose={onClose}>
      <div className="flex items-center justify-between mb-4 pb-4 border-b border-border">
        <span className="text-sm font-semibold text-foreground">{achat.fournisseur}</span>
        <Badge label={achat.statut} />
      </div>
      <div className="flex flex-col divide-y divide-border text-sm">
        {rows.map(([l, v]) => (
          <div key={l} className="flex justify-between py-2">
            <span className="text-muted-foreground">{l}</span>
            <span className="font-semibold font-mono">{v}</span>
          </div>
        ))}
      </div>
    </Modal>
  );
}
