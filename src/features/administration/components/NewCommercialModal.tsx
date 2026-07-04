import { useState } from "react";
import { Modal, Field, Input, Sel, Btn } from "../../../components/common";
import { useCreateCommercial } from "../hooks/useAdministrationQueries";

const ZONES = ["Dakar", "Thiès", "Saint-Louis", "Kaolack", "Ziguinchor", "Export", "Multi-zones"];

export function NewCommercialModal({ onClose }: { onClose: () => void }) {
  const createCommercial = useCreateCommercial();
  const [form, setForm] = useState({
    nom: "", prenom: "", tel: "", email: "", zone: ZONES[0], objectif: "",
  });

  function handleSave() {
    createCommercial.mutate(
      { ...form, objectif: parseInt(form.objectif) || 0 },
      { onSuccess: onClose }
    );
  }

  return (
    <Modal title="Nouveau commercial" onClose={onClose} wide>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Nom" required><Input value={form.nom} onChange={(v) => setForm({ ...form, nom: v })} placeholder="Nom de famille" /></Field>
        <Field label="Prénom" required><Input value={form.prenom} onChange={(v) => setForm({ ...form, prenom: v })} placeholder="Prénom" /></Field>
        <Field label="Téléphone"><Input value={form.tel} onChange={(v) => setForm({ ...form, tel: v })} placeholder="+221 77 XXX XX XX" /></Field>
        <Field label="Email"><Input value={form.email} onChange={(v) => setForm({ ...form, email: v })} placeholder="commercial@sams.sn" /></Field>
        <Field label="Zone commerciale" required><Sel options={ZONES} value={form.zone} onChange={(v) => setForm({ ...form, zone: v })} /></Field>
        <Field label="Objectif mensuel (F CFA)"><Input value={form.objectif} onChange={(v) => setForm({ ...form, objectif: v })} placeholder="15000000" /></Field>
        <div className="col-span-2 flex justify-end gap-3 pt-2">
          <Btn variant="secondary" onClick={onClose}>Annuler</Btn>
          <Btn onClick={handleSave} disabled={!form.nom || !form.prenom || createCommercial.isPending}>Enregistrer</Btn>
        </div>
      </div>
    </Modal>
  );
}
