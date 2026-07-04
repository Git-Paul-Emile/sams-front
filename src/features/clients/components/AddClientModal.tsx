import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { get } from "../../../services/httpClient";
import { Modal, Field, Input, Sel, Btn } from "../../../components/common";
import { useCreateClient } from "../hooks/useClientsQueries";
import type { Commercial } from "../../../types/administration.types";
import type { NewClient } from "../../../types/clients.types";

const VILLES = ["Dakar", "Thiès", "Saint-Louis", "Kaolack", "Ziguinchor", "Mbour", "Touba", "Diourbel", "Tambacounda"];
const PAYS = ["Sénégal", "Mali", "Guinée", "Mauritanie", "Côte d'Ivoire", "Gambie"];
const ZONES = ["Dakar", "Thiès", "Saint-Louis", "Kaolack", "Ziguinchor", "Export"];
const CONDITIONS = ["Comptant", "15 jours", "30 jours", "45 jours", "60 jours", "90 jours"];

const EMPTY_FORM = {
  code: "", raison: "", contact: "", tel: "", email: "", adresse: "",
  ville: "Dakar", pays: "Sénégal", zone: "Dakar", commercial: "A. Ndiaye",
  conditions: "30 jours", plafond: "5000000",
};

export function AddClientModal({ onClose }: { onClose: () => void }) {
  const [nf, setNf] = useState(EMPTY_FORM);
  const { data: commerciaux = [] } = useQuery({ queryKey: ["commerciaux"], queryFn: () => get<Commercial[]>("/commerciaux") });
  const createClient = useCreateClient();

  function handleSave() {
    const payload: NewClient = { ...nf, plafond: parseInt(nf.plafond) || 0 };
    createClient.mutate(payload, { onSuccess: onClose });
  }

  return (
    <Modal title="Nouveau client" onClose={onClose} wide>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Code client" required><Input value={nf.code} onChange={(v) => setNf({ ...nf, code: v })} placeholder="CLI-008" /></Field>
        <Field label="Raison sociale" required><Input value={nf.raison} onChange={(v) => setNf({ ...nf, raison: v })} placeholder="Nom de l'entreprise" /></Field>
        <Field label="Nom contact" required><Input value={nf.contact} onChange={(v) => setNf({ ...nf, contact: v })} placeholder="Prénom Nom" /></Field>
        <Field label="Téléphone" required><Input value={nf.tel} onChange={(v) => setNf({ ...nf, tel: v })} placeholder="+221 77 XXX XX XX" /></Field>
        <Field label="Email"><Input value={nf.email} onChange={(v) => setNf({ ...nf, email: v })} placeholder="contact@entreprise.sn" /></Field>
        <Field label="Adresse"><Input value={nf.adresse} onChange={(v) => setNf({ ...nf, adresse: v })} placeholder="Rue, quartier" /></Field>
        <Field label="Ville"><Sel options={VILLES} value={nf.ville} onChange={(v) => setNf({ ...nf, ville: v })} /></Field>
        <Field label="Pays"><Sel options={PAYS} value={nf.pays} onChange={(v) => setNf({ ...nf, pays: v })} /></Field>
        <Field label="Zone commerciale" required><Sel options={ZONES} value={nf.zone} onChange={(v) => setNf({ ...nf, zone: v })} /></Field>
        <Field label="Commercial affecté" required>
          <Sel options={commerciaux.map((a) => `${a.prenom} ${a.nom[0]}.`)} value={nf.commercial} onChange={(v) => setNf({ ...nf, commercial: v })} />
        </Field>
        <Field label="Conditions de paiement"><Sel options={CONDITIONS} value={nf.conditions} onChange={(v) => setNf({ ...nf, conditions: v })} /></Field>
        <Field label="Plafond crédit (F CFA)"><Input value={nf.plafond} onChange={(v) => setNf({ ...nf, plafond: v })} placeholder="5000000" /></Field>
        <div className="col-span-2 flex justify-end gap-3 pt-2">
          <Btn variant="secondary" onClick={onClose}>Annuler</Btn>
          <Btn onClick={handleSave} disabled={createClient.isPending}>Enregistrer le client</Btn>
        </div>
      </div>
    </Modal>
  );
}
