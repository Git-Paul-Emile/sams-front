import { useAuth } from "./useAuth";

export function useModuleAccess() {
  const { user, isLoading } = useAuth();
  const allowedModules = user?.modules ?? [];

  return {
    isLoading,
    allowedModules,
    hasModule: (module: string) => allowedModules.includes("*") || allowedModules.includes(module),
  };
}
