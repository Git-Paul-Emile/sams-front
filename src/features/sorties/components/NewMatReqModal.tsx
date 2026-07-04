import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { BadgeCheck } from "lucide-react";
import { get } from "../../../services/httpClient";
import { Modal, Field, Input, Sel, TextArea, DropZone, Btn } from "../../../components/common";
import { now } from "../../../utils/format";
import type { ProdOrder as ProdOrderBase, Operateur } from "../../../types/production.types";

// Le backend renvoie désormais un `num` métier (ex: "OF-2607-001") en plus de
// l'id opaque ; pas encore répercuté dans le type partagé production.types.ts.
type ProdOrder = ProdOrderBase & { num?: string };
import type { StockItem } from "../../../types/stock.types";
import { useCreateMatReq } from "../hooks/useSortiesQueries";

export function NewMatReqModal({ onClose }: { onClose: () => void }) {
  const { data: prodOrders = [] } = useQuery({ queryKey: ["prodOrders"], queryFn: () => get<ProdOrder[]>("/prod-orders") });
  const { data: operateurs = [] } = useQuery({ queryKey: ["operateurs"], queryFn: () => get<Operateur[]>("/operateurs") });
  const { data: stockMatieres = [] } = useQuery({ queryKey: ["stockItems", "MATIERE"], queryFn: () => get<StockItem[]>("/stock-items", { type: "MATIERE" }) });

  const createMatReq = useCreateMatReq();

  const [mf, setMf] = useState({
    prodOrderId: "", operateurId: "", ligne: "Ligne A", matiereId: "",
    qteDemandee: "", commentaires: "", docBC: null as string | null, docBL: null as string | null,
  });

  const prodOrderId = mf.prodOrderId || prodOrders[0]?.id || "";
  const matiereId = mf.matiereId || stockMatieres[0]?.id || "";
  const operateurActifs = operateurs.filter((o) => o.statut === "Actif");

  function handleSubmit() {
    const qte = parseInt(mf.qteDemandee) || 0;
    if (!qte || !prodOrderId || !matiereId) return;
    createMatReq.mutate(
      {
        prodOrderId,
        operateurId: mf.operateurId || undefined,
        ligne: mf.ligne,
        matiereId,
        qteDemandee: qte,
        commentaires: mf.commentaires || undefined,
      },
      { onSuccess: onClose }
    );
  }

  return (
    <Modal title="Nouvelle demande – Sortie matières premières" onClose={onClose} wide>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Date"><Input value={now()} readOnly /></Field>
        <div />
        <Field label="Ordre de fabrication" required>
          <select
            className="w-full px-3 py-2 rounded-lg border border-border bg-input-background text-sm focus:outline-none focus:ring-2 focus:ring-ring appearance-none"
            value={prodOrderId}
            onChange={(e) => setMf({ ...mf, prodOrderId: e.target.value })}
          >
            {prodOrders.map((o) => <option key={o.id} value={o.id}>{o.num ?? o.id} — {o.produit}</option>)}
          </select>
        </Field>
        <Field label="Opérateur demandeur">
          <select
            className="w-full px-3 py-2 rounded-lg border border-border bg-input-background text-sm focus:outline-none focus:ring-2 focus:ring-ring appearance-none"
            value={mf.operateurId}
            onChange={(e) => setMf({ ...mf, operateurId: e.target.value })}
          >
            <option value="">—</option>
            {operateurActifs.map((o) => <option key={o.id} value={o.id}>{o.prenom} {o.nom}</option>)}
          </select>
        </Field>
        <Field label="Ligne de production" required><Sel options={["Ligne A", "Ligne B", "Ligne C"]} value={mf.ligne} onChange={(v) => setMf({ ...mf, ligne: v })} /></Field>
        <Field label="Matière première" required>
          <select
            className="w-full px-3 py-2 rounded-lg border border-border bg-input-background text-sm focus:outline-none focus:ring-2 focus:ring-ring appearance-none"
            value={matiereId}
            onChange={(e) => setMf({ ...mf, matiereId: e.target.value })}
          >
            {stockMatieres.map((m) => <option key={m.id} value={m.id}>{m.designation}</option>)}
          </select>
        </Field>
        <Field label="Quantité demandée" required><Input value={mf.qteDemandee} onChange={(v) => setMf({ ...mf, qteDemandee: v })} placeholder="0" /></Field>
        <div className="col-span-2"><Field label="Commentaires"><TextArea value={mf.commentaires} onChange={(v) => setMf({ ...mf, commentaires: v })} placeholder="Précisions sur la demande…" /></Field></div>
        <Field label="Bon de commande"><DropZone label="Déposer le bon de commande" value={mf.docBC} onChange={(v) => setMf({ ...mf, docBC: v })} /></Field>
        <Field label="Bon de livraison"><DropZone label="Déposer le bon de livraison" value={mf.docBL} onChange={(v) => setMf({ ...mf, docBL: v })} /></Field>
        <div className="col-span-2 p-3 rounded-xl bg-amber-50 border border-amber-200 flex items-center gap-2"><BadgeCheck className="w-4 h-4 text-amber-600 shrink-0" /><p className="text-xs text-amber-700">Cette demande sera soumise à validation avant distribution à la production.</p></div>
        <div className="col-span-2 flex justify-end gap-3 pt-2">
          <Btn variant="secondary" onClick={onClose}>Annuler</Btn>
          <Btn onClick={handleSubmit} disabled={createMatReq.isPending}>Soumettre la demande</Btn>
        </div>
      </div>
    </Modal>
  );
}
