import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  createCommercial, createOperateur, createUser, getCommerciaux, getOperateurs, getPermissionModules, getPermissions,
  getSettings, getUsers, importCommerciaux, importOperateurs, importUsers, updatePermission, updateSettings,
} from "../api/administrationApi";
import type { ImportRow } from "../../../components/common";
import type {
  NewAdminUserAccount, NewCommercial, NewOperateur, Settings,
} from "../../../types/administration.types";

export const usersKeys = { all: ["users"] as const };
export const operateursKeys = { all: ["operateurs"] as const };
export const commerciauxKeys = { all: ["commerciaux"] as const };
export const settingsKeys = { all: ["settings"] as const };
export const permissionsKeys = { all: ["permissions"] as const, modules: ["permissions", "modules"] as const };

export function usePermissions() {
  return useQuery({ queryKey: permissionsKeys.all, queryFn: getPermissions });
}

export function usePermissionModules() {
  return useQuery({ queryKey: permissionsKeys.modules, queryFn: getPermissionModules });
}

export function useUpdatePermission() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ role, modules }: { role: string; modules: string[] }) => updatePermission(role, modules),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: permissionsKeys.all }); },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useAdminUsers(search?: string) {
  return useQuery({
    queryKey: [...usersKeys.all, { search: search ?? "" }] as const,
    queryFn: () => getUsers({ search }),
  });
}

export function useCreateAdminUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: NewAdminUserAccount) => createUser(payload),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: usersKeys.all }); toast.success("Administrateur créé"); },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useOperateurs(search?: string) {
  return useQuery({
    queryKey: [...operateursKeys.all, { search: search ?? "" }] as const,
    queryFn: () => getOperateurs({ search }),
  });
}

export function useCreateOperateur() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: NewOperateur) => createOperateur(payload),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: operateursKeys.all }); toast.success("Opérateur créé"); },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useCommerciaux(search?: string) {
  return useQuery({
    queryKey: [...commerciauxKeys.all, { search: search ?? "" }] as const,
    queryFn: () => getCommerciaux({ search }),
  });
}

export function useCreateCommercial() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: NewCommercial) => createCommercial(payload),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: commerciauxKeys.all }); toast.success("Commercial créé"); },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useImportUsers() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (rows: ImportRow[]) => importUsers(rows),
    onSuccess: (report) => {
      queryClient.invalidateQueries({ queryKey: usersKeys.all });
      if (report.errors.length === 0) toast.success(`${report.created} compte(s) importé(s)`);
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useImportOperateurs() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (rows: ImportRow[]) => importOperateurs(rows),
    onSuccess: (report) => {
      queryClient.invalidateQueries({ queryKey: operateursKeys.all });
      if (report.errors.length === 0) toast.success(`${report.created} opérateur(s) importé(s)`);
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useImportCommerciaux() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (rows: ImportRow[]) => importCommerciaux(rows),
    onSuccess: (report) => {
      queryClient.invalidateQueries({ queryKey: commerciauxKeys.all });
      if (report.errors.length === 0) toast.success(`${report.created} commercial(aux) importé(s)`);
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useSettings() {
  return useQuery({ queryKey: settingsKeys.all, queryFn: getSettings });
}

export function useUpdateSettings() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<Settings>) => updateSettings(payload),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: settingsKeys.all }); },
    onError: (err: Error) => toast.error(err.message),
  });
}
