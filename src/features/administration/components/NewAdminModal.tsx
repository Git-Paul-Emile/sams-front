import { useState } from "react";
import { Modal, Field, Input, Sel, Btn } from "../../../components/common";
import { useCreateAdminUser } from "../hooks/useAdministrationQueries";
import type { Role } from "../../../types/common.types";

const ROLES: Role[] = ["Administrateur", "Direction", "Production", "Stock", "Commercial", "Finance"];

export function NewAdminModal({ onClose }: { onClose: () => void }) {
  const createAdminUser = useCreateAdminUser();
  const [form, setForm] = useState({ nom: "", prenom: "", email: "", tel: "", role: ROLES[0] as string });

  const hasContact = Boolean(form.email || form.tel);

  function handleSave() {
    // Le mot de passe temporaire est généré côté serveur et envoyé par email à la création
    // (uniquement si un email est fourni ; sinon le premier accès se fait par téléphone + OTP).
    createAdminUser.mutate(
      {
        nom: `${form.prenom} ${form.nom}`.trim(),
        email: form.email || undefined,
        tel: form.tel || undefined,
        role: form.role as Role,
      },
      { onSuccess: onClose }
    );
  }

  return (
    <Modal title="Nouveau compte" onClose={onClose}>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Nom" required><Input value={form.nom} onChange={(v) => setForm({ ...form, nom: v })} placeholder="Nom de famille" /></Field>
        <Field label="Prénom" required><Input value={form.prenom} onChange={(v) => setForm({ ...form, prenom: v })} placeholder="Prénom" /></Field>
        <Field label="Email"><Input value={form.email} onChange={(v) => setForm({ ...form, email: v })} placeholder="admin@sams.sn" /></Field>
        <Field label="Téléphone"><Input value={form.tel} onChange={(v) => setForm({ ...form, tel: v })} placeholder="+221 77 XXX XX XX" /></Field>
        <div className="col-span-2">
          <Field label="Rôle / équipe" required><Sel options={ROLES} value={form.role} onChange={(v) => setForm({ ...form, role: v })} /></Field>
        </div>
        {!hasContact && (
          <p className="col-span-2 text-xs text-amber-600">Renseignez au moins un email ou un numéro de téléphone.</p>
        )}
        <div className="col-span-2 flex justify-end gap-3 pt-2">
          <Btn variant="secondary" onClick={onClose}>Annuler</Btn>
          <Btn onClick={handleSave} disabled={!form.nom || !form.prenom || !hasContact || createAdminUser.isPending}>Créer le compte</Btn>
        </div>
      </div>
    </Modal>
  );
}
