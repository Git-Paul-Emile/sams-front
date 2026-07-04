import { useState } from "react";
import { Modal, Field, Input, Sel, Btn } from "../../../components/common";
import { useCreateOperateur } from "../hooks/useAdministrationQueries";

const POSTES = ["Chef d'équipe", "Opérateur principal", "Assistant", "Technicien", "Stagiaire"];
const LIGNES = ["Ligne A", "Ligne B", "Ligne C"];

export function NewOperateurModal({ onClose }: { onClose: () => void }) {
  const createOperateur = useCreateOperateur();
  const [form, setForm] = useState({
    nom: "", prenom: "", tel: "", email: "", poste: POSTES[0], ligne: LIGNES[0],
  });

  function handleSave() {
    createOperateur.mutate(form, { onSuccess: onClose });
  }

  return (
    <Modal title="Nouvel opérateur" onClose={onClose} wide>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Nom" required><Input value={form.nom} onChange={(v) => setForm({ ...form, nom: v })} placeholder="Nom de famille" /></Field>
        <Field label="Prénom" required><Input value={form.prenom} onChange={(v) => setForm({ ...form, prenom: v })} placeholder="Prénom" /></Field>
        <Field label="Téléphone"><Input value={form.tel} onChange={(v) => setForm({ ...form, tel: v })} placeholder="+221 77 XXX XX XX" /></Field>
        <Field label="Email"><Input value={form.email} onChange={(v) => setForm({ ...form, email: v })} placeholder="operateur@sams.sn" /></Field>
        <Field label="Poste" required><Sel options={POSTES} value={form.poste} onChange={(v) => setForm({ ...form, poste: v })} /></Field>
        <Field label="Ligne de production" required><Sel options={LIGNES} value={form.ligne} onChange={(v) => setForm({ ...form, ligne: v })} /></Field>
        <div className="col-span-2 flex justify-end gap-3 pt-2">
          <Btn variant="secondary" onClick={onClose}>Annuler</Btn>
          <Btn onClick={handleSave} disabled={!form.nom || !form.prenom || createOperateur.isPending}>Enregistrer</Btn>
        </div>
      </div>
    </Modal>
  );
}
