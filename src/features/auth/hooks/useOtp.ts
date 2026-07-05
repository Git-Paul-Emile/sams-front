import { useMutation } from "@tanstack/react-query";
import { requestOtp, verifyOtpLogin, verifyOtpSignup } from "../api/authApi";
import type { OtpPurpose } from "../api/authApi";

export function useRequestOtp() {
  return useMutation({
    mutationFn: (payload: { tel: string; purpose: OtpPurpose; nom?: string; role?: "Commercial" | "Production" }) => requestOtp(payload),
  });
}

export function useVerifyOtpLogin() {
  return useMutation({
    mutationFn: (payload: { tel: string; code: string }) => verifyOtpLogin(payload),
  });
}

export function useVerifyOtpSignup() {
  return useMutation({
    mutationFn: (payload: { tel: string; code: string; nom: string; role: "Commercial" | "Production" }) => verifyOtpSignup(payload),
  });
}
