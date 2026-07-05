import { useState } from "react";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../../../components/ui/input-otp";
import { useAuth } from "../hooks/useAuth";
import { useRequestOtp, useVerifyOtpLogin, useVerifyOtpSignup } from "../hooks/useOtp";

type Mode = "login" | "signup";
type Step = "phone" | "code";

const SIGNUP_ROLES: { value: "Commercial" | "Production"; label: string }[] = [
  { value: "Commercial", label: "Équipe commerciale" },
  { value: "Production", label: "Équipe production" },
];

export function PhoneAuthPanel({ onDone }: { onDone: () => void }) {
  const [mode, setMode] = useState<Mode>("login");
  const [step, setStep] = useState<Step>("phone");
  const [tel, setTel] = useState("");
  const [nom, setNom] = useState("");
  const [role, setRole] = useState<"Commercial" | "Production">("Commercial");
  const [code, setCode] = useState("");
  const [devCode, setDevCode] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { login } = useAuth();
  const requestOtp = useRequestOtp();
  const verifyLogin = useVerifyOtpLogin();
  const verifySignup = useVerifyOtpSignup();

  function switchMode(next: Mode) {
    setMode(next);
    setStep("phone");
    setCode("");
    setDevCode(null);
    setError(null);
  }

  function handleRequestCode() {
    setError(null);
    requestOtp.mutate(
      { tel, purpose: mode === "login" ? "LOGIN" : "SIGNUP", ...(mode === "signup" ? { nom, role } : {}) },
      {
        onSuccess: (res) => {
          setDevCode(res.devCode ?? null);
          setStep("code");
        },
        onError: (err: Error) => setError(err.message),
      }
    );
  }

  function handleVerify() {
    setError(null);
    if (mode === "login") {
      verifyLogin.mutate(
        { tel, code },
        {
          onSuccess: (user) => { login(user); onDone(); },
          onError: (err: Error) => setError(err.message),
        }
      );
    } else {
      // Compte invité actif immédiatement : session ouverte dès la vérification,
      // pas d'étape d'activation admin (l'admin garde la main pour modifier l'accès ensuite).
      verifySignup.mutate(
        { tel, code, nom, role },
        {
          onSuccess: (user) => { login(user); onDone(); },
          onError: (err: Error) => setError(err.message),
        }
      );
    }
  }

  const isPending = requestOtp.isPending || verifyLogin.isPending || verifySignup.isPending;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2 text-xs">
        <button
          onClick={() => switchMode("login")}
          className={`flex-1 py-1.5 rounded-lg font-medium ${mode === "login" ? "bg-blue-500 text-white" : "bg-white/10 text-blue-300"}`}
        >
          Se connecter
        </button>
        <button
          onClick={() => switchMode("signup")}
          className={`flex-1 py-1.5 rounded-lg font-medium ${mode === "signup" ? "bg-blue-500 text-white" : "bg-white/10 text-blue-300"}`}
        >
          Créer un compte invité
        </button>
      </div>

      {step === "phone" && (
        <>
          {mode === "signup" && (
            <div className="flex flex-col gap-1.5">
              <label className="text-blue-300 text-xs font-semibold uppercase tracking-wide">Nom complet</label>
              <input
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                placeholder="Prénom Nom"
                className="w-full px-3 py-2.5 rounded-lg bg-white/10 border border-white/20 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
          )}
          <div className="flex flex-col gap-1.5">
            <label className="text-blue-300 text-xs font-semibold uppercase tracking-wide">Téléphone</label>
            <input
              value={tel}
              onChange={(e) => setTel(e.target.value)}
              placeholder="+221 77 XXX XX XX"
              className="w-full px-3 py-2.5 rounded-lg bg-white/10 border border-white/20 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          {mode === "signup" && (
            <div className="flex flex-col gap-1.5">
              <label className="text-blue-300 text-xs font-semibold uppercase tracking-wide">Équipe</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as "Commercial" | "Production")}
                className="w-full px-3 py-2.5 rounded-lg bg-white/10 border border-white/20 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                {SIGNUP_ROLES.map((r) => <option key={r.value} value={r.value} className="text-black">{r.label}</option>)}
              </select>
            </div>
          )}
          {error && <p className="text-red-300 text-xs font-medium bg-red-500/10 border border-red-400/30 rounded-lg px-3 py-2">{error}</p>}
          <button
            onClick={handleRequestCode}
            disabled={!tel || (mode === "signup" && !nom) || isPending}
            className="w-full py-3 bg-blue-500 hover:bg-blue-400 text-white font-semibold rounded-lg transition-colors disabled:opacity-50"
          >
            Recevoir le code
          </button>
        </>
      )}

      {step === "code" && (
        <>
          {devCode && (
            <p className="text-amber-300 text-xs bg-amber-500/10 border border-amber-400/30 rounded-lg px-3 py-2">
              Mode test — code : <span className="font-mono font-bold">{devCode}</span>
            </p>
          )}
          <div className="flex flex-col gap-1.5 items-center">
            <label className="text-blue-300 text-xs font-semibold uppercase tracking-wide self-start">Code reçu</label>
            <InputOTP maxLength={6} value={code} onChange={setCode}>
              <InputOTPGroup>
                {[0, 1, 2, 3, 4, 5].map((i) => <InputOTPSlot key={i} index={i} />)}
              </InputOTPGroup>
            </InputOTP>
          </div>
          {error && <p className="text-red-300 text-xs font-medium bg-red-500/10 border border-red-400/30 rounded-lg px-3 py-2">{error}</p>}
          <button
            onClick={handleVerify}
            disabled={code.length !== 6 || isPending}
            className="w-full py-3 bg-blue-500 hover:bg-blue-400 text-white font-semibold rounded-lg transition-colors disabled:opacity-50"
          >
            Valider
          </button>
          <button onClick={() => setStep("phone")} className="text-blue-300 text-xs underline">
            Changer de numéro
          </button>
        </>
      )}
    </div>
  );
}
