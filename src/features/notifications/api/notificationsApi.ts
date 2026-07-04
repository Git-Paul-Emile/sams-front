import { get, patch, post } from "../../../services/httpClient";
import type { EmailNotif, Notif, WhatsAppNotif } from "../../../types/notifications.types";

export function getNotifications(): Promise<Notif[]> {
  return get<Notif[]>("/notifications");
}

export function getEmailNotifs(): Promise<EmailNotif[]> {
  return get<EmailNotif[]>("/email-notifs");
}

export function getWhatsAppNotifs(): Promise<WhatsAppNotif[]> {
  return get<WhatsAppNotif[]>("/whatsapp-notifs");
}

export function markNotificationRead(id: string): Promise<Notif> {
  return patch<Notif>(`/notifications/${id}/read`, {});
}

export function createNotification(payload: Omit<Notif, "id" | "lu">): Promise<Notif> {
  return post<Notif>("/notifications", payload);
}
