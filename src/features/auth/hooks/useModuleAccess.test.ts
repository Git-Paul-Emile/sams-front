import { describe, it, expect, vi } from "vitest";
import { renderHook } from "@testing-library/react";

const useAuthMock = vi.fn();
vi.mock("./useAuth", () => ({
  useAuth: () => useAuthMock(),
}));

const { useModuleAccess } = await import("./useModuleAccess");

describe("useModuleAccess", () => {
  it("autorise n'importe quel module quand l'utilisateur a le wildcard '*'", () => {
    useAuthMock.mockReturnValue({ user: { modules: ["*"] }, isLoading: false });

    const { result } = renderHook(() => useModuleAccess());

    expect(result.current.hasModule("Finance")).toBe(true);
    expect(result.current.hasModule("Stocks")).toBe(true);
  });

  it("autorise un module explicitement listé", () => {
    useAuthMock.mockReturnValue({ user: { modules: ["Stocks", "Achats"] }, isLoading: false });

    const { result } = renderHook(() => useModuleAccess());

    expect(result.current.hasModule("Stocks")).toBe(true);
  });

  it("refuse un module absent de la liste sans wildcard", () => {
    useAuthMock.mockReturnValue({ user: { modules: ["Stocks"] }, isLoading: false });

    const { result } = renderHook(() => useModuleAccess());

    expect(result.current.hasModule("Finance")).toBe(false);
  });

  it("refuse tout module quand l'utilisateur n'est pas chargé", () => {
    useAuthMock.mockReturnValue({ user: null, isLoading: false });

    const { result } = renderHook(() => useModuleAccess());

    expect(result.current.hasModule("Dashboard")).toBe(false);
  });
});
