import type { Id } from "./common.types";

export interface Notif {
  id: Id;
  type: string;
  titre: string;
  msg: string;
  heure: string;
  lu: boolean;
}

export interface EmailNotif {
  id: Id;
  to: string;
  sujet: string;
  heure: string;
  statut: string;
}

export type WhatsAppCategory = "authorization" | "information";

export interface WhatsAppNotif {
  id: Id;
  to: string;
  msg: string;
  heure: string;
  eventType?: string;
  category?: WhatsAppCategory;
  deepLink?: string;
}
