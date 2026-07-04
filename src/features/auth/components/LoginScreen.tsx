import { useState } from "react";
import { useNavigate } from "react-router";
import { FlaskConical } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { useLogin } from "../hooks/useLogin";

export function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();
  const loginMutation = useLogin();
  const navigate = useNavigate();

  function handleLogin() {
    setError(null);
    loginMutation.mutate(
      { email, password },
      {
        onSuccess: (user) => {
          login(user);
          navigate("/dashboard", { replace: true });
        },
        onError: (err: Error) => setError(err.message),
      }
    );
  }

  return (
    <div className="min-h-screen bg-[#0F2A60] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-500/20 border border-blue-400/30 mb-4"><FlaskConical className="w-8 h-8 text-blue-300" /></div>
          <h1 className="text-3xl font-black text-white tracking-tight" style={{ fontFamily: "var(--font-family-heading)" }}>SAMS ERP</h1>
          <p className="text-blue-300 text-sm mt-1">Savonnerie Moderne du Sénégal</p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
          <h2 className="text-white font-semibold mb-6" style={{ fontFamily: "var(--font-family-heading)" }}>Connexion</h2>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-blue-300 text-xs font-semibold uppercase tracking-wide">Identifiant</label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="utilisateur@sams.sn"
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                className="w-full px-3 py-2.5 rounded-lg bg-white/10 border border-white/20 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-blue-300 text-xs font-semibold uppercase tracking-wide">Mot de passe</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                className="w-full px-3 py-2.5 rounded-lg bg-white/10 border border-white/20 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            {error && <p className="text-red-300 text-xs font-medium bg-red-500/10 border border-red-400/30 rounded-lg px-3 py-2">{error}</p>}
            <button onClick={handleLogin} disabled={!email || !password || loginMutation.isPending} className="w-full py-3 bg-blue-500 hover:bg-blue-400 text-white font-semibold rounded-lg transition-colors mt-2 disabled:opacity-50" style={{ fontFamily: "var(--font-family-heading)" }}>Se connecter</button>
          </div>
        </div>
        <p className="text-center text-blue-400/60 text-xs mt-6">SAMS ERP v3.0 — Tous droits réservés © 2024</p>
      </div>
    </div>
  );
}
