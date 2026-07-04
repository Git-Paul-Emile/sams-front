import { Navigate, Outlet } from "react-router";
import { useModuleAccess } from "../hooks/useModuleAccess";

export function ModuleRoute({ module }: { module: string }) {
  const { hasModule, isLoading } = useModuleAccess();
  if (isLoading) return null;
  if (!hasModule(module)) return <Navigate to="/dashboard" replace />;
  return <Outlet />;
}
