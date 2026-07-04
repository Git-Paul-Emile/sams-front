import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  AlertTriangle, Building2, CheckCircle, CreditCard, Download, Edit2, Mail,
  MapPin, Phone, Target, UserCheck, Users, Ban,
} from "lucide-react";
import { get } from "../../../services/httpClient";
import { Badge, Btn, TabBar, Table, TR, TD } from "../../../components/common";
import { fmt, fmtM } from "../../../utils/format";
import { exportToPdf } from "../../../utils/exportFile";
import { useToggleClientStatus } from "../hooks/useClientsQueries";
import { FACTURE_HEADERS, factureRows } from "../../facturation";
import type { Client } from "../../../types/clients.types";
import type { Commande } from "../../../types/ventes.types";
import type { Facture } from "../../../types/facturation.types";

export function ClientDetail({ client, onEdit }: { client: Client | null; onEdit: () => void }) {
  const [clientTab, setClientTab] = useState("Informations");
  const toggleStatus = useToggleClientStatus();

  const { data: commandes = [] } = useQuery({ queryKey: ["commandes"], queryFn: () => get<Commande[]>("/commandes") });
  const { data: factures = [] } = useQuery({ queryKey: ["factures"], queryFn: () => get<Facture[]>("/factures") });

  if (!client) {
    return (
      <div className="bg-card rounded-xl border border-border shadow-sm h-64 flex flex-col items-center justify-center text-muted-foreground gap-2">
        <Users className="w-10 h-10 opacity-30" />
        <p className="text-sm">Sélectionnez un client</p>
      </div>
    );
  }

  const clientCommandes = commandes.filter((v) => v.client === client.raison);
  const clientFactures = factures.filter((f) => f.client === client.raison);

  return (
    <div className="bg-card rounded-xl border border-border shadow-sm">
      <div className="p-5 border-b border-border flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center"><span className="text-lg font-black text-primary">{client.raison.slice(0, 2).toUpperCase()}</span></div>
          <div><h3 className="font-bold text-foreground" style={{ fontFamily: "var(--font-family-heading)" }}>{client.raison}</h3><p className="text-xs text-muted-foreground">{client.code} · {client.zone} · {client.pays}</p></div>
        </div>
        <div className="flex items-center gap-2">
          <Badge label={client.statut} />
          <Btn variant="secondary" sm onClick={onEdit}><Edit2 className="w-3.5 h-3.5" />Modifier</Btn>
          <Btn
            variant="danger"
            sm
            disabled={toggleStatus.isPending}
            onClick={() => toggleStatus.mutate({ id: client.id, next: client.statut === "Actif" ? "Inactif" : "Actif" })}
          >
            <Ban className="w-3.5 h-3.5" />{client.statut === "Actif" ? "Désactiver" : "Activer"}
          </Btn>
        </div>
      </div>
      <div className="p-5">
        <TabBar tabs={["Informations", "Commandes", "Factures", "Encours"]} active={clientTab} onChange={setClientTab} />
        {clientTab === "Informations" && (
          <div className="grid grid-cols-2 gap-6">
            <div className="flex flex-col gap-3">
              {[
                { i: UserCheck, l: "Contact", v: client.contact },
                { i: Phone, l: "Téléphone", v: client.tel },
                { i: Mail, l: "Email", v: client.email },
                { i: MapPin, l: "Adresse", v: `${client.adresse}, ${client.ville}` },
                { i: Building2, l: "Commercial", v: client.commercial },
                { i: CreditCard, l: "Conditions paiement", v: client.conditions },
                { i: Target, l: "Plafond crédit", v: fmtM(client.plafond) + " F CFA" },
              ].map((r) => {
                const I = r.i;
                return (
                  <div key={r.l} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center shrink-0"><I className="w-3.5 h-3.5 text-muted-foreground" /></div>
                    <div><p className="text-[11px] text-muted-foreground">{r.l}</p><p className="text-sm font-medium">{r.v}</p></div>
                  </div>
                );
              })}
            </div>
            <div className="flex flex-col gap-3">
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-100">
                <p className="text-xs text-emerald-700 mb-1">CA Annuel YTD</p>
                <p className="text-2xl font-black text-emerald-700" style={{ fontFamily: "var(--font-family-heading)" }}>{fmtM(client.caYtd)} F</p>
                <p className="text-xs text-emerald-600 mt-1">{client.nbCmd} commandes</p>
              </div>
              <div className={`p-4 rounded-xl border ${client.encours > 0 ? "bg-amber-50 border-amber-100" : "bg-muted/40 border-border"}`}>
                <p className={`text-xs mb-1 ${client.encours > 0 ? "text-amber-700" : "text-muted-foreground"}`}>Encours client</p>
                <p className={`text-2xl font-black ${client.encours > 0 ? "text-amber-700" : "text-foreground"}`} style={{ fontFamily: "var(--font-family-heading)" }}>{client.encours > 0 ? fmtM(client.encours) + " F" : "À jour"}</p>
              </div>
            </div>
          </div>
        )}
        {clientTab === "Commandes" && (
          <Table headers={["N° CMD", "Date", "Montant", "Commercial", "Statut"]}>
            {clientCommandes.map((v) => (
              <TR key={v.num}><TD mono>{v.num}</TD><TD><span className="text-xs text-muted-foreground">{v.date}</span></TD><TD mono>{fmt(v.montant)} F</TD><TD>{v.commercial}</TD><TD><Badge label={v.statutActuel} /></TD></TR>
            ))}
            {clientCommandes.length === 0 && <tr><td colSpan={5} className="py-8 text-center text-sm text-muted-foreground">Aucune commande</td></tr>}
          </Table>
        )}
        {clientTab === "Factures" && (
          <Table headers={["N°", "Date émission", "Échéance", "Montant", "Payé", "Solde", "Statut", "PDF"]}>
            {clientFactures.map((f) => (
              <TR key={f.num}>
                <TD mono>{f.num}</TD>
                <TD><span className="text-xs text-muted-foreground">{f.date}</span></TD>
                <TD><span className={`text-xs ${f.statut === "En retard" ? "text-red-600 font-semibold" : "text-muted-foreground"}`}>{f.echeance}</span></TD>
                <TD mono>{fmt(f.montant)} F</TD>
                <TD mono>{fmt(f.paye)} F</TD>
                <TD><span className={`font-mono text-xs font-semibold ${f.montant - f.paye > 0 ? "text-red-600" : "text-emerald-600"}`}>{fmt(f.montant - f.paye)} F</span></TD>
                <TD><Badge label={f.statut} /></TD>
                <TD><Btn variant="ghost" sm onClick={() => exportToPdf(`Facture ${f.num}`, FACTURE_HEADERS, factureRows(f))}><Download className="w-3.5 h-3.5" /></Btn></TD>
              </TR>
            ))}
            {clientFactures.length === 0 && <tr><td colSpan={8} className="py-8 text-center text-sm text-muted-foreground">Aucune facture</td></tr>}
          </Table>
        )}
        {clientTab === "Encours" && (
          <div className="flex flex-col items-center justify-center py-12 gap-3">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center ${client.encours > 0 ? "bg-amber-100" : "bg-emerald-100"}`}>
              {client.encours > 0 ? <AlertTriangle className="w-7 h-7 text-amber-600" /> : <CheckCircle className="w-7 h-7 text-emerald-600" />}
            </div>
            <p className="text-3xl font-black" style={{ fontFamily: "var(--font-family-heading)" }}>{client.encours > 0 ? fmtM(client.encours) + " F CFA" : "Compte soldé"}</p>
            <p className="text-sm text-muted-foreground">{client.encours > 0 ? "d'encours à recouvrer" : "Aucun encours en cours"}</p>
          </div>
        )}
      </div>
    </div>
  );
}
