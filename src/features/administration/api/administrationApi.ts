import { get, patch, post } from "../../../services/httpClient";
import type { ImportReport, ImportRow } from "../../../components/common";
import type {
  AdminUserAccount, NewAdminUserAccount, Commercial, NewCommercial, NewOperateur, RolePermissions, Settings,
} from "../../../types/administration.types";
import type { Operateur } from "../../../types/production.types";

export function getUsers(params?: { search?: string }): Promise<AdminUserAccount[]> {
  return get<AdminUserAccount[]>("/users", params);
}

// `connexion`/`statut` sont désormais posés côté serveur (statut par défaut "Actif",
// connexion nulle tant qu'aucun login n'a eu lieu) : le frontend ne fait plus que
// transmettre les champs saisis par l'utilisateur.
export function createUser(payload: NewAdminUserAccount): Promise<AdminUserAccount> {
  return post<AdminUserAccount>("/users", payload);
}

export function getOperateurs(params?: { search?: string }): Promise<Operateur[]> {
  return get<Operateur[]>("/operateurs", params);
}

// `matricule` (séquence serveur), `embauche`, `statut`, ainsi que les compteurs
// calculés (`rendement`/`ofRealises`/`vol`/`incidents`) sont désormais gérés côté serveur.
export function createOperateur(payload: NewOperateur): Promise<Operateur> {
  return post<Operateur>("/operateurs", payload);
}

export function getCommerciaux(params?: { search?: string }): Promise<Commercial[]> {
  return get<Commercial[]>("/commerciaux", params);
}

// `matricule` (séquence serveur), `statut`, ainsi que les compteurs calculés
// (`caRealise`/`nbClients`/`nbCmd`) sont désormais gérés côté serveur.
export function createCommercial(payload: NewCommercial): Promise<Commercial> {
  return post<Commercial>("/commerciaux", payload);
}

export function getPermissions(): Promise<RolePermissions[]> {
  return get<RolePermissions[]>("/permissions");
}

export function getPermissionModules(): Promise<string[]> {
  return get<string[]>("/permissions/modules");
}

export function updatePermission(role: string, modules: string[]): Promise<RolePermissions> {
  return patch<RolePermissions>(`/permissions/${role}`, { modules });
}

export function importUsers(rows: ImportRow[]): Promise<ImportReport> {
  return post<ImportReport>("/users/import", { rows });
}

export function importOperateurs(rows: ImportRow[]): Promise<ImportReport> {
  return post<ImportReport>("/operateurs/import", { rows });
}

export function importCommerciaux(rows: ImportRow[]): Promise<ImportReport> {
  return post<ImportReport>("/commerciaux/import", { rows });
}

export function getSettings(): Promise<Settings> {
  return get<Settings>("/settings");
}

export function updateSettings(payload: Partial<Settings>): Promise<Settings> {
  return patch<Settings>("/settings", payload);
}
