import type { Role } from "./common.types";

export interface AppUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  initials: string;
  modules: string[];
}
