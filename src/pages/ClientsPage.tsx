import { useState } from "react";
import { Download, Plus } from "lucide-react";
import { SectionHeader, Btn } from "../components/common";
import { ClientList, ClientDetail, AddClientModal, EditClientModal, useClients } from "../features/clients";
import { exportToExcel, exportToPdf } from "../utils/exportFile";
import { fmt } from "../utils/format";
import type { Client } from "../types/clients.types";

const CLIENTS_HEADERS = ["Code", "Raison sociale", "Contact", "Téléphone", "Email", "Ville", "Zone", "Commercial", "Encours", "CA YTD", "Statut"];

function clientsRows(clients: Client[]) {
  return clients.map((c) => [
    c.code, c.raison, c.contact, c.tel, c.email, c.ville, c.zone, c.commercial,
    `${fmt(c.encours)} F`, `${fmt(c.caYtd)} F`, c.statut,
  ]);
}

export function ClientsPage() {
  const { data: clients = [] } = useClients();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);

  const sel: Client | null = clients.find((c) => c.id === selectedId) ?? null;

  return (
    <div>
      <SectionHeader
        title="Clients & CRM"
        sub={`${clients.length} clients enregistrés`}
        action={
          <div className="flex gap-2">
            <Btn variant="secondary" sm onClick={() => exportToExcel("Clients", CLIENTS_HEADERS, clientsRows(clients))}><Download className="w-3.5 h-3.5" />Excel</Btn>
            <Btn variant="secondary" sm onClick={() => exportToPdf("Clients", CLIENTS_HEADERS, clientsRows(clients))}><Download className="w-3.5 h-3.5" />PDF</Btn>
            <Btn onClick={() => setShowAdd(true)}><Plus className="w-4 h-4" />Nouveau client</Btn>
          </div>
        }
      />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <ClientList selectedId={selectedId} onSelect={(c) => setSelectedId(c.id)} />
        <div className="lg:col-span-2">
          <ClientDetail client={sel} onEdit={() => setShowEdit(true)} />
        </div>
      </div>

      {showAdd && <AddClientModal onClose={() => setShowAdd(false)} />}
      {showEdit && sel && <EditClientModal client={sel} onClose={() => setShowEdit(false)} />}
    </div>
  );
}
