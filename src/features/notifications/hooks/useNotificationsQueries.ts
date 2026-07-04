import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createNotification, getEmailNotifs, getNotifications, getWhatsAppNotifs, markNotificationRead } from "../api/notificationsApi";
import type { Notif } from "../../../types/notifications.types";

export const notificationsKeys = {
  all: ["notifications"] as const,
  emailNotifs: ["emailNotifs"] as const,
  whatsappNotifs: ["whatsappNotifs"] as const,
};

export function useNotifications() {
  return useQuery({
    queryKey: notificationsKeys.all,
    queryFn: getNotifications,
  });
}

export function useEmailNotifs() {
  return useQuery({
    queryKey: notificationsKeys.emailNotifs,
    queryFn: getEmailNotifs,
  });
}

export function useWhatsAppNotifs() {
  return useQuery({
    queryKey: notificationsKeys.whatsappNotifs,
    queryFn: getWhatsAppNotifs,
  });
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => markNotificationRead(id),
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: notificationsKeys.all });
      const previous = queryClient.getQueryData<Notif[]>(notificationsKeys.all);
      queryClient.setQueryData<Notif[]>(notificationsKeys.all, (old) =>
        old?.map((n) => (n.id === id ? { ...n, lu: true } : n))
      );
      return { previous };
    },
    onError: (_err, _id, context) => {
      if (context?.previous) queryClient.setQueryData(notificationsKeys.all, context.previous);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: notificationsKeys.all });
    },
  });
}

export function useCreateNotification() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Omit<Notif, "id" | "lu">) => createNotification(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationsKeys.all });
    },
  });
}
