import { Navigate } from "react-router";
import { useAuth, LoginScreen } from "../features/auth";

export function LoginPage() {
  const { user, isLoading } = useAuth();
  if (isLoading) return null;
  if (user) return <Navigate to="/dashboard" replace />;
  return <LoginScreen />;
}
