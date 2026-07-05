import { useState } from "react";
import { Download, FlaskConical, Plus, Edit2, Trash2, Search } from "lucide-react";
import { Btn, Table, TD, TR } from "../../../components/common";
import { useBom, useDeleteBom, useProductionStockProduits } from "../hooks/useProductionQueries";
import { BomFormModal } from "./BomFormModal";

export function BomTab() {
  const [selProduitId, setSelProduitId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState<"create" | "edit" | null>(null);
  const { data: bomEntries = [] } = useBom();
  const { data: stockProduits = [] } = useProductionStockProduits();
  const deleteBom = useDeleteBom();
  const produits = stockProduits.filter((p) => p.designation.toLowerCase().includes(search.toLowerCase()));
  const selEntry = selProduitId ? bomEntries.find((b) => b.produitId === selProduitId) : undefined;
  const selProduit = selProduitId ? stockProduits.find((p) => p.id === selProduitId) : undefined;

  function handleDelete() {
    if (!selEntry) return;
    if (!window.confirm(`Supprimer la formule de "${selEntry.produit}" ? Aucun ordre de fabrication ne pourra plus être créé pour ce produit tant qu'une nouvelle formule n'est pas définie.`)) return;
    deleteBom.mutate(selEntry.id);
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div className="bg-card rounded-xl border border-border shadow-sm p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-sm" style={{ fontFamily: "var(--font-family-heading)" }}>Produits SAMS</h3>
          <Btn variant="secondary" sm onClick={() => setModal("create")}><Plus className="w-3.5 h-3.5" />Nouvelle formule</Btn>
        </div>
        <div className="mb-3 flex items-center gap-2 bg-input-background rounded-lg px-3 py-1.5">
          <Search className="w-3.5 h-3.5 text-muted-foreground" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Rechercher un produit…" className="bg-transparent text-sm text-foreground placeholder-muted-foreground focus:outline-none flex-1" />
        </div>
        {produits.map((p) => {
          const hasBom = bomEntries.some((b) => b.produitId === p.id);
          return (
            <button
              key={p.id}
              onClick={() => setSelProduitId(p.id)}
              className={`w-full text-left px-3 py-2.5 rounded-lg text-sm mb-0.5 transition-colors flex items-center justify-between ${selProduitId === p.id ? "bg-primary text-white" : "hover:bg-muted text-foreground"}`}
            >
              <span>{p.designation}</span>
              {!hasBom && <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${selProduitId === p.id ? "bg-white/20" : "bg-amber-50 text-amber-700"}`}>Sans formule</span>}
            </button>
          );
        })}
      </div>
      <div className="lg:col-span-2 bg-card rounded-xl border border-border shadow-sm p-5">
        {selProduit && selEntry ? (
          <>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-sm" style={{ fontFamily: "var(--font-family-heading)" }}>{selEntry.produit}</h3>
                <p className="text-xs text-muted-foreground">{selEntry.items.length} composant(s)</p>
              </div>
              <div className="flex items-center gap-2">
                <Btn variant="secondary" sm onClick={() => setModal("edit")}><Edit2 className="w-3 h-3" />Modifier</Btn>
                <Btn variant="danger" sm onClick={handleDelete}><Trash2 className="w-3 h-3" />Supprimer</Btn>
                <Btn variant="secondary" sm><Download className="w-3 h-3" />Export</Btn>
              </div>
            </div>
            <Table headers={["Intrant", "Catégorie", "Qté/unité", "Unité"]}>
              {selEntry.items.map((r, i) => (
                <TR key={i}>
                  <TD><span className="font-medium">{r.intrant}</span></TD>
                  <TD>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${r.categorie === "Base chimique" ? "bg-blue-50 text-blue-700" : r.categorie === "Conservateur" ? "bg-violet-50 text-violet-700" : r.categorie === "Parfum" ? "bg-pink-50 text-pink-700" : r.categorie === "Additif" ? "bg-amber-50 text-amber-700" : "bg-slate-100 text-slate-600"}`}>{r.categorie}</span>
                  </TD>
                  <TD mono>{r.qte}</TD>
                  <TD>{r.unite}</TD>
                </TR>
              ))}
            </Table>
          </>
        ) : selProduit ? (
          <div className="flex flex-col items-center justify-center h-48 text-muted-foreground gap-3">
            <FlaskConical className="w-10 h-10 opacity-30" />
            <p className="text-sm">Aucune formule pour "{selProduit.designation}"</p>
            <Btn sm onClick={() => setModal("create")}><Plus className="w-3.5 h-3.5" />Créer la formule</Btn>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-48 text-muted-foreground">
            <FlaskConical className="w-10 h-10 mb-2 opacity-30" />
            <p className="text-sm">Sélectionnez un produit</p>
          </div>
        )}
      </div>

      {modal === "create" && (
        <BomFormModal produitId={selProduitId ?? undefined} onClose={() => setModal(null)} />
      )}
      {modal === "edit" && selEntry && (
        <BomFormModal entry={selEntry} onClose={() => setModal(null)} />
      )}
    </div>
  );
}
