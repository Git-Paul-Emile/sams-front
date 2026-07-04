import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createClient, getClients, setClientStatus, updateClient } from "../api/clientsApi";
import type { Client, NewClient } from "../../../types/clients.types";
import { toast } from "sonner";

export const clientsKeys = {
  all: ["clients"] as const,
};

export function useClients(search?: string) {
  return useQuery({
    queryKey: [...clientsKeys.all, { search: search ?? "" }] as const,
    queryFn: () => getClients({ search }),
  });
}

export function useCreateClient() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: NewClient) => createClient(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: clientsKeys.all });
      toast.success("Client créé");
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useUpdateClient() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<Client> }) => updateClient(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: clientsKeys.all });
      toast.success("Client mis à jour");
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useToggleClientStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, next }: { id: string; next: "Actif" | "Inactif" }) => setClientStatus(id, next),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: clientsKeys.all });
    },
    onError: (err: Error) => toast.error(err.message),
  });
}
