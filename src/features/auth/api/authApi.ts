import { get, post, setAccessToken } from "../../../services/httpClient";
import type { AppUser } from "../../../types/auth.types";

interface BackendUser {
  id: string;
  nom: string;
  email: string | null;
  role: AppUser["role"];
  initials: string;
  modules: string[];
}

function toAppUser(u: BackendUser): AppUser {
  return { id: u.id, name: u.nom, email: u.email ?? "", role: u.role, initials: u.initials, modules: u.modules };
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

export type OtpPurpose = "LOGIN" | "SIGNUP";

export function requestOtp(payload: { tel: string; purpose: OtpPurpose; nom?: string; role?: "Commercial" | "Production" }): Promise<{ sent: boolean; devCode?: string }> {
  return post("/auth/otp/request", payload);
}

interface VerifyOtpResult {
  accessToken: string;
  user: BackendUser;
}

// Login et signup renvoient la même forme : le compte invité est actif immédiatement,
// une session est ouverte dès la vérification du code (pas d'étape d'activation admin).
async function verifyOtp(payload: { tel: string; code: string; purpose: OtpPurpose; nom?: string; role?: "Commercial" | "Production" }): Promise<AppUser> {
  const data = await post<VerifyOtpResult>("/auth/otp/verify", payload);
  setAccessToken(data.accessToken);
  return toAppUser(data.user);
}

export function verifyOtpLogin(payload: { tel: string; code: string }): Promise<AppUser> {
  return verifyOtp({ ...payload, purpose: "LOGIN" });
}

export function verifyOtpSignup(payload: { tel: string; code: string; nom: string; role: "Commercial" | "Production" }): Promise<AppUser> {
  return verifyOtp({ ...payload, purpose: "SIGNUP" });
}
