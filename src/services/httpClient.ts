// Point de bascule unique entre le frontend et l'API Express/Prisma réelle.
// Aucun autre fichier de l'application ne doit importer `fetch`/connaître l'URL du backend :
// tout passe par les fonctions get/post/patch/put/del ci-dessous.
const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8000/api/v1";

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

// Le token d'accès ne vit qu'en mémoire (jamais localStorage) pour limiter le
// risque de vol par XSS ; le refresh token, lui, est un cookie HttpOnly géré
// entièrement par le navigateur/serveur.
let accessToken: string | null = null;
let onAuthExpired: (() => void) | null = null;

export function setAccessToken(token: string | null): void {
  accessToken = token;
}

export function getAccessToken(): string | null {
  return accessToken;
}

export function setOnAuthExpired(callback: (() => void) | null): void {
  onAuthExpired = callback;
}

function getAuthHeader(): Record<string, string> {
  return accessToken ? { Authorization: `Bearer ${accessToken}` } : {};
}

function buildPath(path: string, params?: Record<string, string | number | boolean | undefined>) {
  const clean = path.replace(/^\//, "");
  if (!params) return clean;
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined) search.set(key, String(value));
  }
  const qs = search.toString();
  return qs ? `${clean}?${qs}` : clean;
}

interface Envelope<T> {
  status: "success" | "error" | "not_found" | "fail" | "unauthorized";
  message: string;
  data: T;
}

async function parseEnvelope<T>(res: Response): Promise<Envelope<T>> {
  if (res.status === 204) return { status: "success", message: "OK", data: undefined as T };
  try {
    return (await res.json()) as Envelope<T>;
  } catch {
    return { status: "error", message: res.statusText, data: undefined as T };
  }
}

async function rawRequest<T>(path: string, init?: RequestInit): Promise<{ res: Response; body: Envelope<T> }> {
  const res = await fetch(`${BASE_URL}/${path.replace(/^\//, "")}`, {
    ...init,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
      ...init?.headers,
    },
  });
  const body = await parseEnvelope<T>(res);
  return { res, body };
}

let refreshPromise: Promise<boolean> | null = null;

async function tryRefreshAccessToken(): Promise<boolean> {
  refreshPromise ??= (async () => {
    try {
      const { res, body } = await rawRequest<{ accessToken: string }>("auth/refresh", { method: "POST" });
      if (!res.ok) return false;
      setAccessToken(body.data.accessToken);
      return true;
    } catch {
      return false;
    } finally {
      refreshPromise = null;
    }
  })();
  return refreshPromise;
}

async function request<T>(path: string, init?: RequestInit, isRetry = false): Promise<T> {
  const { res, body } = await rawRequest<T>(path, init);

  const isAuthEndpoint = path === "auth/refresh" || path === "auth/login" || path === "auth/logout";
  if (res.status === 401 && !isRetry && !isAuthEndpoint) {
    const refreshed = await tryRefreshAccessToken();
    if (refreshed) return request<T>(path, init, true);
    setAccessToken(null);
    onAuthExpired?.();
  }

  if (!res.ok) {
    throw new ApiError(res.status, body.message ?? res.statusText);
  }

  return body.data;
}

export function get<T>(path: string, params?: Record<string, string | number | boolean | undefined>): Promise<T> {
  return request<T>(buildPath(path, params));
}

export function post<T>(path: string, body?: unknown): Promise<T> {
  return request<T>(path, { method: "POST", body: body !== undefined ? JSON.stringify(body) : undefined });
}

export function patch<T>(path: string, body: unknown): Promise<T> {
  return request<T>(path, { method: "PATCH", body: JSON.stringify(body) });
}

export function put<T>(path: string, body: unknown): Promise<T> {
  return request<T>(path, { method: "PUT", body: JSON.stringify(body) });
}

export function del(path: string): Promise<void> {
  return request<void>(path, { method: "DELETE" });
}
