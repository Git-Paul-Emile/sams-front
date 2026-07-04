import { useState } from "react";
import { Btn, Field, Input, Modal, Sel } from "../../../components/common";
import { useAuth } from "../../auth";
import { useStockEntry, useStockMatieres, useStockProduits } from "../hooks/useStockQueries";

const CIBLES = ["Matière première", "Produit fini"] as const;

export function StockEntryModal({ onClose }: { onClose: () => void }) {
  const { user } = useAuth();
  const { data: matieres = [] } = useStockMatieres();
  const { data: produits = [] } = useStockProduits();
  const stockEntry = useStockEntry();

  const [cibleLabel, setCibleLabel] = useState<(typeof CIBLES)[number]>(CIBLES[0]);
  const [code, setCode] = useState("");
  const [qte, setQte] = useState("");
  const [motif, setMotif] = useState("");

  const cible: "matiere" | "produit" = cibleLabel === CIBLES[0] ? "matiere" : "produit";
  const items = cible === "matiere" ? matieres : produits;
  const selected = items.find((i) => i.code === code) ?? items[0];

  function handleCibleChange(v: string) {
    setCibleLabel(v as (typeof CIBLES)[number]);
    setCode("");
  }

  function handleSave() {
    if (!selected) return;
    stockEntry.mutate(
      { cible, item: selected, qte: parseInt(qte) || 0, motif, user: user?.name ?? "" },
      { onSuccess: onClose }
    );
  }

  return (
    <Modal title="Entrée stock" onClose={onClose}>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Type de stock" required>
          <Sel options={[...CIBLES]} value={cibleLabel} onChange={handleCibleChange} />
        </Field>
        <Field label="Article" required>
          <Sel
            options={items.map((i) => i.designation)}
            value={selected?.designation}
            onChange={(v) => {
              const it = items.find((i) => i.designation === v);
              if (it) setCode(it.code);
            }}
          />
        </Field>
        <Field label="Quantité" required><Input value={qte} onChange={setQte} placeholder="ex: 100" /></Field>
        <Field label="Motif" required><Input value={motif} onChange={setMotif} placeholder="ex: Réception fournisseur" /></Field>
        <div className="col-span-2 flex justify-end gap-3 pt-2">
          <Btn variant="secondary" onClick={onClose}>Annuler</Btn>
          <Btn onClick={handleSave} disabled={stockEntry.isPending || !selected}>Enregistrer l'entrée</Btn>
        </div>
      </div>
    </Modal>
  );
}
