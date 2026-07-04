import { get, post, setAccessToken } from "../../../services/httpClient";
import type { AppUser } from "../../../types/auth.types";

interface BackendUser {
  id: string;
  nom: string;
  email: string;
  role: AppUser["role"];
  initials: string;
  modules: string[];
}

function toAppUser(u: BackendUser): AppUser {
  return { id: u.id, name: u.nom, email: u.email, role: u.role, initials: u.initials, modules: u.modules };
}

export async function login(email: string, password: string): Promise<AppUser> {
  const data = await post<{ accessToken: string; user: BackendUser }>("/auth/login", { email, password });
  setAccessToken(data.accessToken);
  return toAppUser(data.user);
}

export async function fetchMe(): Promise<AppUser> {
  const user = await get<BackendUser>("/auth/me");
  return toAppUser(user);
}

export async function logout(): Promise<void> {
  await post("/auth/logout");
  setAccessToken(null);
}
