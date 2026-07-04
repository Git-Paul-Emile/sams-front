import type { Id, Role } from "./common.types";

export interface AdminUserAccount {
  id: Id;
  nom: string;
  email: string;
  tel?: string;
  role: Role;
  connexion: string;
  statut: string;
}

export interface NewAdminUserAccount {
  nom: string;
  email: string;
  role: Role;
}

export interface Commercial {
  id: Id;
  matricule: string;
  nom: string;
  prenom: string;
  tel: string;
  email: string;
  zone: string;
  objectif: number;
  caRealise: number;
  statut: string;
  nbClients: number;
  nbCmd: number;
}

export interface NewCommercial {
  nom: string;
  prenom: string;
  tel: string;
  email: string;
  zone: string;
  objectif: number;
}

export interface NewOperateur {
  nom: string;
  prenom: string;
  tel: string;
  email: string;
  poste: string;
  ligne: string;
}

export interface RolePermissions {
  id: Role;
  role: Role;
  modules: string[];
}

export interface Settings {
  notifErpEnabled: boolean;
  notifEmailEnabled: boolean;
  notifWhatsappEnabled: boolean;
  alertRuptureEnabled: boolean;
  alertValidationEnabled: boolean;
}
