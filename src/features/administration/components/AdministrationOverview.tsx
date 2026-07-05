import { useState } from "react";
import { Edit2, Plus, Search, Upload } from "lucide-react";
import { SectionHeader, TabBar, Table, TR, TD, Badge, Btn } from "../../../components/common";
import { fmtM } from "../../../utils/format";
import { ROLE_COLORS } from "../constants";
import { useAdminUsers, useOperateurs, useCommerciaux, usePermissions, usePermissionModules, useSettings, useUpdateSettings, useUpdatePermission } from "../hooks/useAdministrationQueries";
import { useDebounce } from "../../../hooks/useDebounce";
import { NewOperateurModal } from "./NewOperateurModal";
import { NewCommercialModal } from "./NewCommercialModal";
import { NewAdminModal } from "./NewAdminModal";
import { ImportTeamModal } from "./ImportTeamModal";
import type { Settings } from "../../../types/administration.types";

function SearchInput({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div className="flex items-center gap-2 bg-input-background rounded-lg px-3 py-1.5 w-64">
      <Search className="w-3.5 h-3.5 text-muted-foreground" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder ?? "Rechercher…"}
        className="bg-transparent text-sm text-foreground placeholder-muted-foreground focus:outline-none flex-1"
      />
    </div>
  );
}

const NOTIF_TOGGLES: { key: keyof Settings; l: string }[] = [
  { key: "notifErpEnabled", l: "Notifications ERP internes" },
  { key: "notifEmailEnabled", l: "Notifications Email (Direction)" },
  { key: "notifWhatsappEnabled", l: "Notifications WhatsApp Business" },
  { key: "alertRuptureEnabled", l: "Alertes rupture de stock" },
  { key: "alertValidationEnabled", l: "Alertes validation en attente" },
];

export function AdministrationOverview() {
  const [tab, setTab] = useState("Utilisateurs");
  const [showModal, setShowModal] = useState<"operateur" | "commercial" | "admin" | "import" | null>(null);

  const [userSearch, setUserSearch] = useState("");
  const [operateurSearch, setOperateurSearch] = useState("");
  const [commercialSearch, setCommercialSearch] = useState("");
  const debouncedUserSearch = useDebounce(userSearch, 300);
  const debouncedOperateurSearch = useDebounce(operateurSearch, 300);
  const debouncedCommercialSearch = useDebounce(commercialSearch, 300);

  const { data: users = [] } = useAdminUsers(debouncedUserSearch);
  const { data: operateurs = [] } = useOperateurs(debouncedOperateurSearch);
  const { data: commerciaux = [] } = useCommerciaux(debouncedCommercialSearch);
  const { data: settings } = useSettings();
  const updateSettings = useUpdateSettings();
  const { data: permissions = [] } = usePermissions();
  const { data: knownModules } = usePermissionModules();
  const updatePermission = useUpdatePermission();
  // Fallback sur l'union des modules déjà seedés tant que /permissions/modules n'a pas répondu,
  // pour ne pas régresser visuellement pendant le chargement.
  const allModules = knownModules ?? Array.from(new Set(permissions.flatMap((p) => p.modules)));

  function toggleModule(role: string, currentModules: string[], mod: string) {
    const modules = currentModules.includes(mod)
      ? currentModules.filter((m) => m !== mod)
      : [...currentModules, mod];
    updatePermission.mutate({ role, modules });
  }

  return (
    <div>
      <SectionHeader
        title="Administration système"
        sub="Utilisateurs, rôles, opérateurs et commerciaux"
        action={<Btn variant="secondary" sm onClick={() => setShowModal("import")}><Upload className="w-3.5 h-3.5" />Importer équipes</Btn>}
      />
      <TabBar tabs={["Utilisateurs", "Opérateurs", "Commerciaux", "Permissions"]} active={tab} onChange={setTab} />

      {tab === "Utilisateurs" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-card rounded-xl border border-border shadow-sm p-5">
            <div className="flex items-center justify-between mb-4"><h3 className="font-bold text-sm" style={{ fontFamily: "var(--font-family-heading)" }}>Comptes utilisateurs</h3><Btn sm onClick={() => setShowModal("admin")}><Plus className="w-3.5 h-3.5" />Nouveau compte</Btn></div>
            <div className="mb-4"><SearchInput value={userSearch} onChange={setUserSearch} placeholder="Rechercher un utilisateur…" /></div>
            <Table headers={["Utilisateur", "Email", "Rôle", "Dernière connexion", "Statut", ""]}>
              {users.map((u) => (
                <TR key={u.id}>
                  <TD><div className="flex items-center gap-2.5"><div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center"><span className="text-[10px] font-bold text-primary">{u.nom.split(" ").map((n) => n[0]).join("").slice(0, 2)}</span></div><span className="font-medium text-sm">{u.nom}</span></div></TD>
                  <TD><span className="text-xs font-mono text-muted-foreground">{u.email ?? u.tel ?? "—"}</span></TD>
                  <TD><span className={`text-xs px-2 py-0.5 rounded-full font-medium ${ROLE_COLORS[u.role]}`}>{u.role}</span></TD>
                  <TD><span className="text-xs text-muted-foreground">{u.connexion}</span></TD>
                  <TD><Badge label={u.statut} /></TD>
                  <TD><Btn variant="ghost" sm><Edit2 className="w-3.5 h-3.5" /></Btn></TD>
                </TR>
              ))}
            </Table>
          </div>
          <div className="bg-card rounded-xl border border-border shadow-sm p-5">
            <h3 className="font-bold text-sm mb-4" style={{ fontFamily: "var(--font-family-heading)" }}>Configuration notifications</h3>
            <div className="flex flex-col gap-3">
              {NOTIF_TOGGLES.map((n) => {
                const enabled = settings?.[n.key] ?? true;
                return (
                  <div key={n.key} className="flex items-center justify-between p-3 rounded-lg bg-muted/40">
                    <span className="text-sm font-medium">{n.l}</span>
                    <div
                      onClick={() => updateSettings.mutate({ [n.key]: !enabled })}
                      className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors ${enabled ? "bg-emerald-500" : "bg-slate-300"}`}
                    >
                      <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${enabled ? "right-0.5" : "left-0.5"}`} />
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-4 p-4 rounded-xl bg-blue-50 border border-blue-100">
              <p className="text-xs font-semibold text-blue-700 mb-2">Destinataires Direction</p>
              <p className="text-xs text-blue-600 font-mono">i.toure@sams.sn</p>
              <p className="text-xs text-blue-600 font-mono mt-1">+221 77 000 00 00 (WhatsApp)</p>
            </div>
          </div>
        </div>
      )}

      {tab === "Opérateurs" && (
        <div className="bg-card rounded-xl border border-border shadow-sm">
          <div className="p-5 border-b border-border flex items-center justify-between"><p className="font-semibold text-sm">{operateurs.length} opérateurs</p><div className="flex items-center gap-3"><SearchInput value={operateurSearch} onChange={setOperateurSearch} placeholder="Rechercher un opérateur…" /><Btn sm onClick={() => setShowModal("operateur")}><Plus className="w-3.5 h-3.5" />Nouvel opérateur</Btn></div></div>
          <div className="p-5">
            <Table headers={["Matricule", "Nom", "Téléphone", "Email", "Poste", "Ligne", "Embauche", "Rendement", "Statut", ""]}>
              {operateurs.map((o) => (
                <TR key={o.id}>
                  <TD mono>{o.matricule}</TD>
                  <TD><span className="font-medium">{o.prenom} {o.nom}</span></TD>
                  <TD><span className="text-xs text-muted-foreground">{o.tel}</span></TD>
                  <TD><span className="text-xs font-mono text-muted-foreground">{o.email}</span></TD>
                  <TD>{o.poste}</TD>
                  <TD>{o.ligne}</TD>
                  <TD><span className="text-xs text-muted-foreground">{o.embauche}</span></TD>
                  <TD><div className="flex items-center gap-1.5"><div className="w-14 h-1.5 bg-muted rounded-full overflow-hidden"><div className={`h-full rounded-full ${o.rendement >= 90 ? "bg-emerald-500" : o.rendement >= 80 ? "bg-amber-500" : "bg-red-500"}`} style={{ width: `${o.rendement}%` }} /></div><span className="text-xs font-mono font-semibold">{o.rendement}%</span></div></TD>
                  <TD><Badge label={o.statut} /></TD>
                  <TD><Btn variant="ghost" sm><Edit2 className="w-3.5 h-3.5" /></Btn></TD>
                </TR>
              ))}
            </Table>
          </div>
        </div>
      )}

      {tab === "Commerciaux" && (
        <div className="bg-card rounded-xl border border-border shadow-sm">
          <div className="p-5 border-b border-border flex items-center justify-between"><p className="font-semibold text-sm">{commerciaux.length} commerciaux</p><div className="flex items-center gap-3"><SearchInput value={commercialSearch} onChange={setCommercialSearch} placeholder="Rechercher un commercial…" /><Btn sm onClick={() => setShowModal("commercial")}><Plus className="w-3.5 h-3.5" />Nouveau commercial</Btn></div></div>
          <div className="p-5">
            <Table headers={["Matricule", "Nom", "Téléphone", "Email", "Zone", "Objectif", "CA réalisé", "Atteinte", "Statut", ""]}>
              {commerciaux.map((a) => (
                <TR key={a.id}>
                  <TD mono>{a.matricule}</TD>
                  <TD><span className="font-medium">{a.prenom} {a.nom}</span></TD>
                  <TD><span className="text-xs text-muted-foreground">{a.tel}</span></TD>
                  <TD><span className="text-xs font-mono text-muted-foreground">{a.email}</span></TD>
                  <TD>{a.zone}</TD>
                  <TD mono>{fmtM(a.objectif)} F</TD>
                  <TD mono>{fmtM(a.caRealise)} F</TD>
                  <TD><span className={`text-xs font-bold font-mono ${a.caRealise / a.objectif >= 0.9 ? "text-emerald-600" : a.caRealise / a.objectif >= 0.7 ? "text-amber-600" : "text-red-600"}`}>{a.objectif > 0 ? Math.round((a.caRealise / a.objectif) * 100) : 0}%</span></TD>
                  <TD><Badge label={a.statut} /></TD>
                  <TD><Btn variant="ghost" sm><Edit2 className="w-3.5 h-3.5" /></Btn></TD>
                </TR>
              ))}
            </Table>
          </div>
        </div>
      )}

      {tab === "Permissions" && (
        <div className="bg-card rounded-xl border border-border shadow-sm p-5">
          <h3 className="font-bold text-sm mb-4" style={{ fontFamily: "var(--font-family-heading)" }}>Matrice des permissions par rôle</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {permissions.map((p) => {
              const hasFullAccess = p.modules.includes("*");
              return (
                <div key={p.role} className="border border-border rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${ROLE_COLORS[p.role]}`}>{p.role}</span>
                    {hasFullAccess && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-700 font-medium">Accès total</span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-1 mt-3">
                    {allModules.map((mod) => (
                      <button
                        key={mod}
                        type="button"
                        disabled={hasFullAccess}
                        title={hasFullAccess ? "Ce rôle a un accès total (\"*\") ; retirez-le d'abord pour gérer les modules un par un" : undefined}
                        onClick={() => toggleModule(p.role, p.modules, mod)}
                        className={`text-[10px] px-1.5 py-0.5 rounded font-medium transition-colors ${hasFullAccess ? "cursor-not-allowed" : "cursor-pointer"} ${hasFullAccess || p.modules.includes(mod) ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200" : "bg-slate-100 text-slate-400 line-through hover:bg-slate-200"}`}
                      >
                        {mod}
                      </button>
                    ))}
                  </div>
                  {hasFullAccess && (
                    <button
                      type="button"
                      className="text-[10px] text-muted-foreground underline mt-2"
                      onClick={() => updatePermission.mutate({ role: p.role, modules: [] })}
                    >
                      Basculer en gestion module par module
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {showModal === "operateur" && <NewOperateurModal onClose={() => setShowModal(null)} />}
      {showModal === "commercial" && <NewCommercialModal onClose={() => setShowModal(null)} />}
      {showModal === "admin" && <NewAdminModal onClose={() => setShowModal(null)} />}
      {showModal === "import" && <ImportTeamModal onClose={() => setShowModal(null)} />}
    </div>
  );
}
