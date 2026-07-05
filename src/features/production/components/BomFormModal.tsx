import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Btn, Field, Input, Modal } from "../../../components/common";
import { useCreateBom, useProductionStockProduits, useStockMatieres, useUpdateBom } from "../hooks/useProductionQueries";
import type { BomEntry, NewBomLine } from "../../../types/production.types";

const EMPTY_LINE: NewBomLine = { matiereId: "", qte: 0, unite: "" };

export function BomFormModal({ entry, produitId, onClose, onSaved }: {
  entry?: BomEntry;
  produitId?: string;
  onClose: () => void;
  onSaved?: () => void;
}) {
  const { data: stockProduits = [] } = useProductionStockProduits();
  const { data: matieres = [] } = useStockMatieres();
  const createBom = useCreateBom();
  const updateBom = useUpdateBom();

  const [selProduitId, setSelProduitId] = useState(entry?.produitId ?? produitId ?? stockProduits[0]?.id ?? "");
  const [lines, setLines] = useState<NewBomLine[]>(
    entry ? entry.items.map((i) => ({ matiereId: i.matiereId, qte: i.qte, unite: i.unite })) : [{ ...EMPTY_LINE }]
  );

  const isEdit = Boolean(entry);
  const isPending = createBom.isPending || updateBom.isPending;

  function updateLine(index: number, patch: Partial<NewBomLine>) {
    setLines((prev) => prev.map((l, i) => (i === index ? { ...l, ...patch } : l)));
  }

  function addLine() {
    setLines((prev) => [...prev, { ...EMPTY_LINE }]);
  }

  function removeLine(index: number) {
    setLines((prev) => prev.filter((_, i) => i !== index));
  }

  function handleSave() {
    const items = lines
      .filter((l) => l.matiereId)
      .map((l) => ({ ...l, qte: Number(l.qte) || 0 }));
    if (!selProduitId || items.length === 0) return;

    const onSuccess = () => { onSaved?.(); onClose(); };
    if (isEdit && entry) {
      updateBom.mutate({ id: entry.id, payload: { items } }, { onSuccess });
    } else {
      createBom.mutate({ produitId: selProduitId, items }, { onSuccess });
    }
  }

  return (
    <Modal title={isEdit ? "Modifier la formule" : "Nouvelle formule"} onClose={onClose} wide>
      <div className="flex flex-col gap-4">
        <Field label="Produit fini" required>
          <select
            className="w-full px-3 py-2 rounded-lg border border-border bg-input-background text-sm focus:outline-none focus:ring-2 focus:ring-ring appearance-none disabled:opacity-60"
            value={selProduitId}
            disabled={isEdit}
            onChange={(e) => setSelProduitId(e.target.value)}
          >
            {stockProduits.map((p) => <option key={p.id} value={p.id}>{p.designation}</option>)}
          </select>
        </Field>

        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Composants</span>
            <Btn variant="secondary" sm onClick={addLine}><Plus className="w-3.5 h-3.5" />Ajouter une ligne</Btn>
          </div>
          {lines.map((line, i) => (
            <div key={i} className="grid grid-cols-[1fr_100px_100px_auto] gap-2 items-end">
              <Field label="Matière">
                <select
                  className="w-full px-3 py-2 rounded-lg border border-border bg-input-background text-sm focus:outline-none focus:ring-2 focus:ring-ring appearance-none"
                  value={line.matiereId}
                  onChange={(e) => updateLine(i, { matiereId: e.target.value })}
                >
                  <option value="">Choisir…</option>
                  {matieres.map((m) => <option key={m.id} value={m.id}>{m.designation}</option>)}
                </select>
              </Field>
              <Field label="Qté">
                <Input value={String(line.qte)} onChange={(v) => updateLine(i, { qte: Number(v) || 0 })} />
              </Field>
              <Field label="Unité">
                <Input value={line.unite} onChange={(v) => updateLine(i, { unite: v })} placeholder="kg" />
              </Field>
              <Btn variant="ghost" sm onClick={() => removeLine(i)} disabled={lines.length === 1}>
                <Trash2 className="w-3.5 h-3.5" />
              </Btn>
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Btn variant="secondary" onClick={onClose}>Annuler</Btn>
          <Btn onClick={handleSave} disabled={isPending}>Enregistrer</Btn>
        </div>
      </div>
    </Modal>
  );
}
