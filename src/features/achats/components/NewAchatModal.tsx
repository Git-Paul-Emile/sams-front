import { useState } from "react";
import { Modal, Field, Input, Btn } from "../../../components/common";
import { useCreateAchat } from "../hooks/useAchatsQueries";
import type { NewAchat } from "../../../types/achats.types";

const EMPTY_FORM = { fournisseur: "", livraison: "", montant: "", articles: "" };

export function NewAchatModal({ onClose }: { onClose: () => void }) {
  const [nf, setNf] = useState(EMPTY_FORM);
  const createAchat = useCreateAchat();

  function handleSave() {
    const payload: NewAchat = {
      fournisseur: nf.fournisseur,
      livraison: nf.livraison,
      montant: parseInt(nf.montant) || 0,
      articles: parseInt(nf.articles) || 0,
    };
    createAchat.mutate(payload, { onSuccess: onClose });
  }

  return (
    <Modal title="Nouveau bon de commande" onClose={onClose}>
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <Field label="Fournisseur" required><Input value={nf.fournisseur} onChange={(v) => setNf({ ...nf, fournisseur: v })} placeholder="Nom du fournisseur" /></Field>
        </div>
        <Field label="Livraison prévue" required><Input value={nf.livraison} onChange={(v) => setNf({ ...nf, livraison: v })} placeholder="JJ/MM/AAAA" /></Field>
        <Field label="Nombre d'articles" required><Input value={nf.articles} onChange={(v) => setNf({ ...nf, articles: v })} placeholder="3" /></Field>
        <div className="col-span-2">
          <Field label="Montant (F CFA)" required><Input value={nf.montant} onChange={(v) => setNf({ ...nf, montant: v })} placeholder="1500000" /></Field>
        </div>
        <div className="col-span-2 flex justify-end gap-3 pt-2">
          <Btn variant="secondary" onClick={onClose}>Annuler</Btn>
          <Btn onClick={handleSave} disabled={createAchat.isPending}>Enregistrer le BC</Btn>
        </div>
      </div>
    </Modal>
  );
}
