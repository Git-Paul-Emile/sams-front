import { useState } from "react";
import { AlertTriangle } from "lucide-react";
import { Btn, Field, Input, Modal, Sel } from "../../../components/common";
import { useBom, useCreateProdOrder, useOperateurs, useProductionStockProduits } from "../hooks/useProductionQueries";
import { BomFormModal } from "./BomFormModal";
import type { NewProdOrder } from "../../../types/production.types";

const LIGNES = ["Ligne A", "Ligne B", "Ligne C"];

const EMPTY_FORM = {
  produitId: "",
  ligne: LIGNES[0],
  qtePrev: "",
  debut: "",
  fin: "",
  responsableId: "",
};

export function NewProdOrderModal({ onClose }: { onClose: () => void }) {
  const [nf, setNf] = useState(EMPTY_FORM);
  const [showBomModal, setShowBomModal] = useState(false);
  const { data: operateurs = [] } = useOperateurs();
  const { data: stockProduits = [] } = useProductionStockProduits();
  const { data: bomEntries = [] } = useBom();
  const createProdOrder = useCreateProdOrder();

  const responsables = operateurs.filter((o) => o.poste === "Chef d'équipe" || o.statut === "Actif");

  const produitId = nf.produitId || stockProduits[0]?.id || "";
  const responsableId = nf.responsableId || responsables[0]?.id || "";
  const hasBom = bomEntries.some((b) => b.produitId === produitId);

  function handleSave() {
    const payload: NewProdOrder = {
      produitId,
      ligne: nf.ligne,
      qtePrev: parseInt(nf.qtePrev) || 0,
      debut: nf.debut,
      fin: nf.fin,
      responsableId: responsableId || undefined,
    };
    createProdOrder.mutate(payload, { onSuccess: onClose });
  }

  return (
    <Modal title="Nouvel ordre de fabrication" onClose={onClose}>
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <Field label="Produit" required>
            <select
              className="w-full px-3 py-2 rounded-lg border border-border bg-input-background text-sm focus:outline-none focus:ring-2 focus:ring-ring appearance-none"
              value={produitId}
              onChange={(e) => setNf({ ...nf, produitId: e.target.value })}
            >
              {stockProduits.map((p) => <option key={p.id} value={p.id}>{p.designation}</option>)}
            </select>
          </Field>
        </div>
        <Field label="Ligne de production" required><Sel options={LIGNES} value={nf.ligne} onChange={(v) => setNf({ ...nf, ligne: v })} /></Field>
        <Field label="Quantité prévue" required><Input value={nf.qtePrev} onChange={(v) => setNf({ ...nf, qtePrev: v })} placeholder="ex: 500" /></Field>
        <Field label="Date début" required><Input value={nf.debut} onChange={(v) => setNf({ ...nf, debut: v })} placeholder="jj/mm/aaaa" type="date" /></Field>
        <Field label="Date fin" required><Input value={nf.fin} onChange={(v) => setNf({ ...nf, fin: v })} placeholder="jj/mm/aaaa" type="date" /></Field>
        <div className="col-span-2">
          <Field label="Responsable" required>
            <select
              className="w-full px-3 py-2 rounded-lg border border-border bg-input-background text-sm focus:outline-none focus:ring-2 focus:ring-ring appearance-none"
              value={responsableId}
              onChange={(e) => setNf({ ...nf, responsableId: e.target.value })}
            >
              {responsables.map((o) => <option key={o.id} value={o.id}>{o.prenom[0]}. {o.nom}</option>)}
            </select>
          </Field>
        </div>
        {produitId && !hasBom && (
          <div className="col-span-2 flex items-center justify-between gap-3 p-3 rounded-lg bg-amber-50 border border-amber-100">
            <div className="flex items-center gap-2 text-amber-700">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <p className="text-xs font-medium">Aucune formule définie pour ce produit. Un ordre de fabrication ne peut pas être créé sans formule.</p>
            </div>
            <Btn variant="secondary" sm onClick={() => setShowBomModal(true)}>Créer la formule</Btn>
          </div>
        )}
        <div className="col-span-2 flex justify-end gap-3 pt-2">
          <Btn variant="secondary" onClick={onClose}>Annuler</Btn>
          <Btn onClick={handleSave} disabled={createProdOrder.isPending || !hasBom}>Créer l'OF</Btn>
        </div>
      </div>
      {showBomModal && (
        <BomFormModal produitId={produitId} onClose={() => setShowBomModal(false)} />
      )}
    </Modal>
  );
}
