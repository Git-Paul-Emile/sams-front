import { useState } from "react";
import { Modal, Field, Input, Sel, Btn } from "../../../components/common";
import { useCreateAdminUser } from "../hooks/useAdministrationQueries";

const NIVEAUX = ["Administrateur", "Super Administrateur", "Lecture seule"];

export function NewAdminModal({ onClose }: { onClose: () => void }) {
  const createAdminUser = useCreateAdminUser();
  const [form, setForm] = useState({ nom: "", prenom: "", email: "", tel: "", niveau: NIVEAUX[0] });

  function handleSave() {
    // Le mot de passe temporaire est généré côté serveur et envoyé par email à la création.
    createAdminUser.mutate(
      { nom: `${form.prenom} ${form.nom}`.trim(), email: form.email, role: "Administrateur" },
      { onSuccess: onClose }
    );
  }

  return (
    <Modal title="Nouvel administrateur" onClose={onClose}>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Nom" required><Input value={form.nom} onChange={(v) => setForm({ ...form, nom: v })} placeholder="Nom de famille" /></Field>
        <Field label="Prénom" required><Input value={form.prenom} onChange={(v) => setForm({ ...form, prenom: v })} placeholder="Prénom" /></Field>
        <Field label="Email" required><Input value={form.email} onChange={(v) => setForm({ ...form, email: v })} placeholder="admin@sams.sn" /></Field>
        <Field label="Téléphone"><Input value={form.tel} onChange={(v) => setForm({ ...form, tel: v })} placeholder="+221 77 XXX XX XX" /></Field>
        <Field label="Niveau d'accès" required><Sel options={NIVEAUX} value={form.niveau} onChange={(v) => setForm({ ...form, niveau: v })} /></Field>
        <div className="col-span-2 flex justify-end gap-3 pt-2">
          <Btn variant="secondary" onClick={onClose}>Annuler</Btn>
          <Btn onClick={handleSave} disabled={!form.nom || !form.prenom || !form.email || createAdminUser.isPending}>Créer le compte</Btn>
        </div>
      </div>
    </Modal>
  );
}
