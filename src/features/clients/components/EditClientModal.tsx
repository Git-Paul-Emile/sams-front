import { useState } from "react";
import { Modal, Field, Input, Sel, Btn } from "../../../components/common";
import { useUpdateClient } from "../hooks/useClientsQueries";
import type { Client } from "../../../types/clients.types";

const CONDITIONS = ["Comptant", "15 jours", "30 jours", "45 jours", "60 jours", "90 jours"];

export function EditClientModal({ client, onClose }: { client: Client; onClose: () => void }) {
  const [form, setForm] = useState({
    raison: client.raison,
    contact: client.contact,
    tel: client.tel,
    email: client.email,
    adresse: client.adresse,
    conditions: client.conditions,
    plafond: String(client.plafond),
  });
  const updateClient = useUpdateClient();

  function handleSave() {
    updateClient.mutate(
      { id: client.id, payload: { ...form, plafond: parseInt(form.plafond) || 0 } },
      { onSuccess: onClose }
    );
  }

  return (
    <Modal title={`Modifier – ${client.raison}`} onClose={onClose} wide>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Code client"><Input value={client.code} readOnly /></Field>
        <Field label="Raison sociale"><Input value={form.raison} onChange={(v) => setForm({ ...form, raison: v })} /></Field>
        <Field label="Contact"><Input value={form.contact} onChange={(v) => setForm({ ...form, contact: v })} /></Field>
        <Field label="Téléphone"><Input value={form.tel} onChange={(v) => setForm({ ...form, tel: v })} /></Field>
        <Field label="Email"><Input value={form.email} onChange={(v) => setForm({ ...form, email: v })} /></Field>
        <Field label="Adresse"><Input value={form.adresse} onChange={(v) => setForm({ ...form, adresse: v })} /></Field>
        <Field label="Conditions paiement"><Sel options={CONDITIONS} value={form.conditions} onChange={(v) => setForm({ ...form, conditions: v })} /></Field>
        <Field label="Plafond crédit"><Input value={form.plafond} onChange={(v) => setForm({ ...form, plafond: v })} /></Field>
        <div className="col-span-2 flex justify-end gap-3 pt-2">
          <Btn variant="secondary" onClick={onClose}>Annuler</Btn>
          <Btn onClick={handleSave} disabled={updateClient.isPending}>Enregistrer</Btn>
        </div>
      </div>
    </Modal>
  );
}
