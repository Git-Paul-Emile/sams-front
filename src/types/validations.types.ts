import type { Id } from "./common.types";

export interface ApprovalRecord {
  id: Id;
  date: string;
  heure: string;
  valideur: string;
  action: string;
  type: string;
  ref: string;
  module: string;
  commentaire: string;
  motifRefus: string | null;
}
