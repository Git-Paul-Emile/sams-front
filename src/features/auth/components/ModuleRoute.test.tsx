import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes, Outlet } from "react-router";

const useModuleAccessMock = vi.fn();
vi.mock("../hooks/useModuleAccess", () => ({
  useModuleAccess: () => useModuleAccessMock(),
}));

const { ModuleRoute } = await import("./ModuleRoute");

function Protected() {
  return <div>Contenu protégé</div>;
}

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route element={<ModuleRoute module="Finance" />}>
          <Route path="/finance" element={<Protected />} />
        </Route>
        <Route path="/dashboard" element={<div>Dashboard</div>} />
      </Routes>
    </MemoryRouter>
  );
}

describe("ModuleRoute", () => {
  it("affiche l'Outlet quand l'utilisateur a le module requis", () => {
    useModuleAccessMock.mockReturnValue({ isLoading: false, hasModule: () => true });

    renderAt("/finance");

    expect(screen.getByText("Contenu protégé")).toBeInTheDocument();
  });

  it("redirige vers /dashboard quand le module est refusé", () => {
    useModuleAccessMock.mockReturnValue({ isLoading: false, hasModule: () => false });

    renderAt("/finance");

    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.queryByText("Contenu protégé")).not.toBeInTheDocument();
  });

  it("n'affiche rien pendant le chargement des droits", () => {
    useModuleAccessMock.mockReturnValue({ isLoading: true, hasModule: () => false });

    const { container } = renderAt("/finance");

    expect(container).toBeEmptyDOMElement();
  });
});
