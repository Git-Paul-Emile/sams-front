// Type feature-spécifique : la ressource `auditLog` de json-server n'est utilisée
// que par le module Rapports, elle n'a donc pas sa place dans src/types/*.
export interface AuditEntry {
  id: string;
  date: string;
  action: string;
  module: string;
  ref: string;
  user: string;
  ip: string;
}
