import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AlertCircle, BadgeCheck } from "lucide-react";
import { get } from "../../../services/httpClient";
import { Modal, Field, Input, Sel, TextArea, Btn } from "../../../components/common";
import { fmt } from "../../../utils/format";
import { now } from "../../../utils/format";
import { useClients } from "../../clients";
import type { Commercial } from "../../../types/administration.types";
import type { StockItem } from "../../../types/stock.types";
import { useCreateSalesReq } from "../hooks/useSortiesQueries";

export function NewSaleReqModal({ onClose }: { onClose: () => void }) {
  const { data: clients = [] } = useClients();
  const { data: commerciaux = [] } = useQuery({ queryKey: ["commerciaux"], queryFn: () => get<Commercial[]>("/commerciaux") });
  const { data: stockProduits = [] } = useQuery({ queryKey: ["stockItems", "PRODUIT"], queryFn: () => get<StockItem[]>("/stock-items", { type: "PRODUIT" }) });
  const createSalesReq = useCreateSalesReq();

  const [sf, setSf] = useState({
    clientId: "", commercialId: "", produitId: "",
    qteDemandee: "", prixUnit: "", entrepot: "Entrepôt Principal", observation: "",
  });

  const clientId = sf.clientId || clients[0]?.id || "";
  const commercialId = sf.commercialId || commerciaux[0]?.id || "";
  const produitId = sf.produitId || stockProduits[0]?.id || "";
  const selProd = stockProduits.find((p) => p.id === produitId);
  const qteDem = parseInt(sf.qteDemandee) || 0;
  const prixUnit = sf.prixUnit ? parseInt(sf.prixUnit) || 0 : selProd?.valeurUnit || 0;
  const stockOk = selProd ? qteDem <= selProd.stock : false;
  const montantSale = qteDem * prixUnit;

  function handleSubmit() {
    if (!stockOk || qteDem <= 0 || !selProd || !clientId || !commercialId) return;
    createSalesReq.mutate(
      {
        clientId,
        commercialId,
        produitId,
        qteDemandee: qteDem,
        prixUnit,
        entrepot: sf.entrepot,
        observation: sf.observation,
      },
      { onSuccess: onClose }
    );
  }

  return (
    <Modal title="Nouvelle sortie de stock – Vente" onClose={onClose} wide>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Date"><Input value={now()} readOnly /></Field>
        <div />
        <Field label="Client" required>
          <select
            className="w-full px-3 py-2 rounded-lg border border-border bg-input-background text-sm focus:outline-none focus:ring-2 focus:ring-ring appearance-none"
            value={clientId}
            onChange={(e) => setSf({ ...sf, clientId: e.target.value })}
          >
            {clients.map((c) => <option key={c.id} value={c.id}>{c.raison}</option>)}
          </select>
        </Field>
        <Field label="Commercial" required>
          <select
            className="w-full px-3 py-2 rounded-lg border border-border bg-input-background text-sm focus:outline-none focus:ring-2 focus:ring-ring appearance-none"
            value={commercialId}
            onChange={(e) => setSf({ ...sf, commercialId: e.target.value })}
          >
            {commerciaux.map((a) => <option key={a.id} value={a.id}>{a.prenom} {a.nom[0]}.</option>)}
          </select>
        </Field>
        <Field label="Produit" required>
          <select
            className="w-full px-3 py-2 rounded-lg border border-border bg-input-background text-sm focus:outline-none focus:ring-2 focus:ring-ring appearance-none"
            value={produitId}
            onChange={(e) => setSf({ ...sf, produitId: e.target.value, prixUnit: "" })}
          >
            {stockProduits.map((p) => <option key={p.id} value={p.id}>{p.designation} (stock: {fmt(p.stock)})</option>)}
          </select>
        </Field>
        <Field label="Référence produit"><Input value={selProd?.code ?? ""} readOnly /></Field>
        <Field label="Quantité demandée" required>
          <Input value={sf.qteDemandee} onChange={(v) => setSf({ ...sf, qteDemandee: v })} placeholder="0" />
          {selProd && qteDem > 0 && !stockOk && <p className="text-xs text-red-600 mt-1">⚠ Stock insuffisant ({fmt(selProd.stock)} disponibles)</p>}
          {selProd && qteDem > 0 && stockOk && <p className="text-xs text-emerald-600 mt-1">✓ Stock suffisant</p>}
        </Field>
        <Field label="Prix unitaire (F CFA)" required><Input value={sf.prixUnit || String(prixUnit)} onChange={(v) => setSf({ ...sf, prixUnit: v })} /></Field>
        <Field label="Montant total"><Input value={montantSale > 0 ? fmt(montantSale) + " F CFA" : ""} readOnly /></Field>
        <Field label="Entrepôt de sortie" required><Sel options={["Entrepôt Principal", "Entrepôt B", "Entrepôt C"]} value={sf.entrepot} onChange={(v) => setSf({ ...sf, entrepot: v })} /></Field>
        <div className="col-span-2"><Field label="Observation"><TextArea value={sf.observation} onChange={(v) => setSf({ ...sf, observation: v })} placeholder="Informations complémentaires…" /></Field></div>
        {!stockOk && qteDem > 0 && <div className="col-span-2 p-3 rounded-xl bg-red-50 border border-red-200 flex items-center gap-2"><AlertCircle className="w-4 h-4 text-red-600 shrink-0" /><p className="text-xs text-red-700">La quantité demandée dépasse le stock disponible. La demande sera bloquée.</p></div>}
        <div className="col-span-2 p-3 rounded-xl bg-amber-50 border border-amber-200 flex items-center gap-2"><BadgeCheck className="w-4 h-4 text-amber-600 shrink-0" /><p className="text-xs text-amber-700">Cette demande sera soumise à validation de la Direction avant exécution.</p></div>
        <div className="col-span-2 flex justify-end gap-3 pt-2">
          <Btn variant="secondary" onClick={onClose}>Annuler</Btn>
          <Btn onClick={handleSubmit} disabled={!stockOk || qteDem <= 0 || createSalesReq.isPending}>Soumettre la demande</Btn>
        </div>
      </div>
    </Modal>
  );
}
