import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { AppUser } from "../../../types/auth.types";
import { fetchMe, logout as logoutApi } from "../api/authApi";
import { setOnAuthExpired } from "../../../services/httpClient";

interface AuthContextValue {
  user: AppUser | null;
  isLoading: boolean;
  login: (u: AppUser) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setOnAuthExpired(() => setUser(null));

    // Au chargement (ou rechargement de page) : pas de token en mémoire, mais
    // un cookie refresh HttpOnly a pu survivre — httpClient tente un refresh
    // silencieux automatiquement sur le 401 de ce premier appel.
    fetchMe()
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setIsLoading(false));

    return () => setOnAuthExpired(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isLoading,
      login: (u: AppUser) => setUser(u),
      logout: () => {
        setUser(null);
        void logoutApi();
      },
    }),
    [user, isLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth doit être utilisé sous <AuthProvider>");
  return ctx;
}
