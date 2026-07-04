import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import { CheckCircle, ChevronRight, Clock, MessageSquare, ThumbsDown, ThumbsUp } from "lucide-react";
import { SectionHeader, TabBar, Table, TR, TD, Badge, Modal, Field, TextArea, Btn } from "../../../components/common";
import { fmt, fmtM } from "../../../utils/format";
import { useSalesReqs, useMatReqs } from "../../sorties";
import { useApprovalHist, useApproveRequest, useRejectRequest } from "../hooks/useValidationsQueries";
import type { SalesReq, MatReq } from "../../../types/sorties.types";

const PROCESS_STEPS = ["Demande créée", "Notification Direction", "Validation / Refus", "Notification demandeur", "Exécution"];

export function ValidationsOverview() {
  const { data: salesReqs = [] } = useSalesReqs();
  const { data: matReqs = [] } = useMatReqs();
  const { data: approvalHist = [] } = useApprovalHist();
  const approveRequest = useApproveRequest();
  const rejectRequest = useRejectRequest();
  const [searchParams] = useSearchParams();
  const focusId = searchParams.get("focus");

  const [tab, setTab] = useState("En attente");
  const [comment, setComment] = useState<Record<string, string>>({});
  const [showRejectModal, setShowRejectModal] = useState<{ type: "vente" | "matiere"; req: SalesReq | MatReq } | null>(null);
  const [motif, setMotif] = useState("");

  // Origine : lien de redirection reçu par la Direction dans la notification WhatsApp
  // d'autorisation (voir back/src/services/notification.service.ts) — amène directement sur la demande visée.
  useEffect(() => {
    if (!focusId) return;
    document.getElementById(`request-${focusId}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [focusId, salesReqs, matReqs]);

  const pendingSale = salesReqs.filter((r) => r.statut === "En attente de validation");
  const pendingMat = matReqs.filter((r) => r.statut === "En attente de validation");

  function doApprove(type: "vente" | "matiere", req: SalesReq | MatReq) {
    approveRequest.mutate(
      { type, req, comment: comment[req.num] || "" },
      { onSuccess: () => setComment({ ...comment, [req.num]: "" }) }
    );
  }

  function doReject() {
    if (!showRejectModal) return;
    rejectRequest.mutate(
      { type: showRejectModal.type, req: showRejectModal.req, motif },
      { onSuccess: () => { setShowRejectModal(null); setMotif(""); } }
    );
  }

  function RequestCard({ req, desc, sub, type, stockInfo }: { req: SalesReq | MatReq; desc: string; sub: string; type: "vente" | "matiere"; stockInfo?: string }) {
    const num = req.num;
    const isFocused = req.id === focusId;
    return (
      <div id={`request-${req.id}`} className={`bg-card border rounded-xl p-4 shadow-sm ${isFocused ? "border-primary ring-2 ring-primary/40" : "border-amber-200"}`}>
        <div className="flex items-start justify-between mb-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-sm font-bold text-foreground">{num}</span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${type === "vente" ? "bg-blue-100 text-blue-700" : "bg-violet-100 text-violet-700"}`}>{type === "vente" ? "Sortie vente" : "Sortie matières"}</span>
            </div>
            <p className="text-sm font-semibold text-foreground">{desc}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>
            {stockInfo && <p className="text-xs text-amber-600 mt-1 font-medium">{stockInfo}</p>}
          </div>
          <Clock className="w-4 h-4 text-amber-500 shrink-0" />
        </div>
        <div className="mb-3">
          <textarea rows={2} placeholder="Commentaire de validation (optionnel)…" value={comment[num] || ""} onChange={(e) => setComment({ ...comment, [num]: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-border bg-input-background text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none" />
        </div>
        <div className="flex gap-2">
          <button onClick={() => doApprove(type, req)} disabled={approveRequest.isPending} className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold transition-colors disabled:opacity-50"><ThumbsUp className="w-3.5 h-3.5" />Valider</button>
          <button onClick={() => { setShowRejectModal({ type, req }); setMotif(""); }} className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 text-xs font-semibold transition-colors border border-red-200"><ThumbsDown className="w-3.5 h-3.5" />Refuser</button>
          <button className="px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-semibold transition-colors border border-border"><MessageSquare className="w-3.5 h-3.5" /></button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <SectionHeader title="Workflow de validation" sub="Aucune sortie de stock sans validation Direction" />
      <div className="mb-5 bg-card border border-border rounded-xl p-4 flex items-center gap-3 overflow-x-auto">
        {PROCESS_STEPS.map((step, i, arr) => (
          <div key={step} className="flex items-center gap-2 shrink-0">
            <div className="flex flex-col items-center gap-1">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center"><span className="text-xs font-bold text-primary">{i + 1}</span></div>
              <p className="text-[10px] text-muted-foreground text-center max-w-[70px] leading-tight">{step}</p>
            </div>
            {i < arr.length - 1 && <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />}
          </div>
        ))}
      </div>

      <TabBar tabs={["En attente", "Historique"]} active={tab} onChange={setTab} />

      {tab === "En attente" && (
        <div>
          {pendingSale.length === 0 && pendingMat.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 bg-card rounded-xl border border-border shadow-sm gap-3">
              <CheckCircle className="w-12 h-12 text-emerald-400" />
              <p className="font-semibold text-foreground">Aucune validation en attente</p>
              <p className="text-sm text-muted-foreground">Toutes les demandes ont été traitées</p>
            </div>
          )}
          {(pendingSale.length > 0 || pendingMat.length > 0) && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {pendingSale.map((r) => (
                <RequestCard key={r.num} req={r} desc={r.produit} sub={`${r.client} · ${r.commercial} · ${fmt(r.qteDemandee)} unités · ${fmtM(r.montant)} F CFA`} type="vente" stockInfo={r.qteDemandee > r.stockDispo ? `⚠ Stock disponible: ${fmt(r.stockDispo)} – demande bloquante` : undefined} />
              ))}
              {pendingMat.map((r) => (
                <RequestCard key={r.num} req={r} desc={r.matiere} sub={`${r.produitFabrique} · ${r.of} · ${r.operateur} · ${fmt(r.qteDemandee)} unités`} type="matiere" />
              ))}
            </div>
          )}
        </div>
      )}

      {tab === "Historique" && (
        <div className="bg-card rounded-xl border border-border shadow-sm p-5">
          <Table headers={["ID", "Date", "Heure", "Valideur", "Action", "Type", "Référence", "Commentaire", "Motif refus"]}>
            {approvalHist.map((a) => (
              <TR key={a.id}>
                <TD mono>{a.id}</TD>
                <TD><span className="text-xs text-muted-foreground">{a.date}</span></TD>
                <TD><span className="text-xs font-mono text-muted-foreground">{a.heure}</span></TD>
                <TD><span className="font-medium text-sm">{a.valideur}</span></TD>
                <TD><span className={`text-xs px-2 py-0.5 rounded-full font-medium ${a.action === "Validé" ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>{a.action}</span></TD>
                <TD><span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium">{a.type}</span></TD>
                <TD mono>{a.ref}</TD>
                <TD><span className="text-xs text-muted-foreground max-w-[150px] block truncate">{a.commentaire || "—"}</span></TD>
                <TD><span className="text-xs text-red-600 max-w-[150px] block truncate">{a.motifRefus || "—"}</span></TD>
              </TR>
            ))}
          </Table>
        </div>
      )}

      {showRejectModal && (
        <Modal title="Motif de refus" onClose={() => setShowRejectModal(null)}>
          <div className="flex flex-col gap-4">
            <div className="p-3 bg-red-50 rounded-xl border border-red-200"><p className="text-sm text-red-700 font-medium">Refus de la demande <span className="font-mono">{showRejectModal.req.num}</span></p><p className="text-xs text-red-600 mt-0.5">Ce motif sera conservé dans l'historique et notifié au demandeur.</p></div>
            <Field label="Motif du refus" required><TextArea value={motif} onChange={setMotif} placeholder="Expliquez le motif du refus…" /></Field>
            <div className="flex justify-end gap-3"><Btn variant="secondary" onClick={() => setShowRejectModal(null)}>Annuler</Btn><Btn variant="danger" onClick={doReject} disabled={!motif.trim() || rejectRequest.isPending}>Confirmer le refus</Btn></div>
          </div>
        </Modal>
      )}
    </div>
  );
}
