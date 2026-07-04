import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { get } from "../../../services/httpClient";
import { Modal, Field, Input, Sel, Btn } from "../../../components/common";
import { useCreateFacture } from "../hooks/useFacturationQueries";
import type { Client } from "../../../types/clients.types";
import type { Commercial } from "../../../types/administration.types";
import type { NewFacture } from "../../../types/facturation.types";

const TYPES = ["Vente directe", "Dépôt vente"];

export function NewFactureModal({ onClose }: { onClose: () => void }) {
  const { data: clients = [] } = useQuery({ queryKey: ["clients"], queryFn: () => get<Client[]>("/clients") });
  const { data: commerciaux = [] } = useQuery({ queryKey: ["commerciaux"], queryFn: () => get<Commercial[]>("/commerciaux") });
  const [nf, setNf] = useState({ clientId: "", echeance: "", montant: "", commercialId: "", type: TYPES[0] });
  const createFacture = useCreateFacture();

  const clientId = nf.clientId || clients[0]?.id || "";
  const commercialId = nf.commercialId || commerciaux[0]?.id || "";

  function handleSave() {
    const payload: NewFacture = {
      clientId,
      echeance: nf.echeance,
      montant: parseInt(nf.montant) || 0,
      commercialId,
      type: nf.type,
    };
    createFacture.mutate(payload, { onSuccess: onClose });
  }

  return (
    <Modal title="Nouvelle facture" onClose={onClose}>
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <Field label="Client" required>
            <select
              className="w-full px-3 py-2 rounded-lg border border-border bg-input-background text-sm focus:outline-none focus:ring-2 focus:ring-ring appearance-none"
              value={clientId}
              onChange={(e) => setNf({ ...nf, clientId: e.target.value })}
            >
              {clients.map((c) => <option key={c.id} value={c.id}>{c.raison}</option>)}
            </select>
          </Field>
        </div>
        <Field label="Commercial" required>
          <select
            className="w-full px-3 py-2 rounded-lg border border-border bg-input-background text-sm focus:outline-none focus:ring-2 focus:ring-ring appearance-none"
            value={commercialId}
            onChange={(e) => setNf({ ...nf, commercialId: e.target.value })}
          >
            {commerciaux.map((a) => <option key={a.id} value={a.id}>{a.prenom} {a.nom[0]}.</option>)}
          </select>
        </Field>
        <Field label="Type" required><Sel options={TYPES} value={nf.type} onChange={(v) => setNf({ ...nf, type: v })} /></Field>
        <Field label="Échéance" required><Input value={nf.echeance} onChange={(v) => setNf({ ...nf, echeance: v })} placeholder="JJ/MM/AAAA" /></Field>
        <Field label="Montant (F CFA)" required><Input value={nf.montant} onChange={(v) => setNf({ ...nf, montant: v })} placeholder="1250000" /></Field>
        <div className="col-span-2 flex justify-end gap-3 pt-2">
          <Btn variant="secondary" onClick={onClose}>Annuler</Btn>
          <Btn onClick={handleSave} disabled={createFacture.isPending}>Enregistrer la facture</Btn>
        </div>
      </div>
    </Modal>
  );
}
