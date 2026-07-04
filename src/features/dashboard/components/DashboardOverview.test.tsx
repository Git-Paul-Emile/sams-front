import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

const useModuleAccessMock = vi.fn();
vi.mock("../../auth/hooks/useModuleAccess", () => ({
  useModuleAccess: () => useModuleAccessMock(),
}));

vi.mock("../hooks/useDashboardQueries", () => ({
  useDashboardSalesReqs: () => ({ data: [] }),
  useDashboardMatReqs: () => ({ data: [] }),
  useDashboardFactures: () => ({ data: [] }),
  useDashboardClients: () => ({ data: [] }),
  useDashboardStockMatieres: () => ({ data: [] }),
  useDashboardCommandes: () => ({ data: [] }),
  useDashboardProdChart: () => ({ data: [] }),
  useDashboardVentesChart: () => ({ data: [] }),
  useDashboardCommerciaux: () => ({ data: [] }),
  useDashboardEvolutionMarge: () => ({ data: [] }),
  useDashboardProductCosts: () => ({ data: [] }),
  useDashboardStockProduits: () => ({ data: [] }),
  useDashboardMouvementsStock: () => ({ data: [] }),
}));

const { DashboardOverview } = await import("./DashboardOverview");

describe("DashboardOverview", () => {
  it("n'affiche que les cartes correspondant aux modules autorisés (rôle Commercial)", () => {
    useModuleAccessMock.mockReturnValue({
      hasModule: (m: string) => ["Ventes", "Clients", "Sorties"].includes(m),
    });

    render(<DashboardOverview />);

    expect(screen.getByText("Commandes en cours")).toBeInTheDocument();
    expect(screen.getByText("Encours clients")).toBeInTheDocument();
    expect(screen.getAllByText("Validations en attente").length).toBeGreaterThan(0);
    expect(screen.queryByText("CA du mois")).not.toBeInTheDocument();
    expect(screen.queryByText("Alertes rupture")).not.toBeInTheDocument();
    expect(screen.queryByText("Valeur stock")).not.toBeInTheDocument();
  });

  it("affiche toutes les cartes quand tous les modules sont autorisés (wildcard admin)", () => {
    useModuleAccessMock.mockReturnValue({ hasModule: () => true });

    render(<DashboardOverview />);

    expect(screen.getByText("CA du mois")).toBeInTheDocument();
    expect(screen.getByText("Résultat opér.")).toBeInTheDocument();
    expect(screen.getByText("Alertes rupture")).toBeInTheDocument();
    expect(screen.getByText("Valeur stock")).toBeInTheDocument();
  });
});
