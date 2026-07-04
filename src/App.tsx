import { QueryClientProvider } from "@tanstack/react-query";
import { createBrowserRouter, Navigate, RouterProvider } from "react-router";
import { Toaster } from "./components/ui/sonner";
import { queryClient } from "./services/queryClient";
import { AuthProvider, ProtectedRoute, ModuleRoute } from "./features/auth";
import { AppLayout } from "./layouts/AppLayout";
import { LoginPage } from "./pages/LoginPage";
import { DashboardPage } from "./pages/DashboardPage";
import { ProductionPage } from "./pages/ProductionPage";
import { StockPage } from "./pages/StockPage";
import { SortiesPage } from "./pages/SortiesPage";
import { ValidationsPage } from "./pages/ValidationsPage";
import { AchatsPage } from "./pages/AchatsPage";
import { VentesPage } from "./pages/VentesPage";
import { ClientsPage } from "./pages/ClientsPage";
import { FacturationPage } from "./pages/FacturationPage";
import { FinancePage } from "./pages/FinancePage";
import { CoutsPage } from "./pages/CoutsPage";
import { RapportsPage } from "./pages/RapportsPage";
import { AdministrationPage } from "./pages/AdministrationPage";

const router = createBrowserRouter([
  { path: "/login", element: <LoginPage /> },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { index: true, element: <Navigate to="/dashboard" replace /> },
          { element: <ModuleRoute module="Dashboard" />, children: [{ path: "dashboard", element: <DashboardPage /> }] },
          { element: <ModuleRoute module="Production" />, children: [{ path: "production", element: <ProductionPage /> }] },
          { element: <ModuleRoute module="Stocks" />, children: [{ path: "stock", element: <StockPage /> }] },
          { element: <ModuleRoute module="Sorties" />, children: [{ path: "sorties", element: <SortiesPage /> }] },
          { element: <ModuleRoute module="Validations" />, children: [{ path: "validations", element: <ValidationsPage /> }] },
          { element: <ModuleRoute module="Achats" />, children: [{ path: "achats", element: <AchatsPage /> }] },
          { element: <ModuleRoute module="Ventes" />, children: [{ path: "ventes", element: <VentesPage /> }] },
          { element: <ModuleRoute module="Clients" />, children: [{ path: "clients", element: <ClientsPage /> }] },
          { element: <ModuleRoute module="Facturation" />, children: [{ path: "facturation", element: <FacturationPage /> }] },
          { element: <ModuleRoute module="Finance" />, children: [{ path: "finance", element: <FinancePage /> }] },
          { element: <ModuleRoute module="Couts" />, children: [{ path: "couts", element: <CoutsPage /> }] },
          { element: <ModuleRoute module="Rapports" />, children: [{ path: "rapports", element: <RapportsPage /> }] },
          { element: <ModuleRoute module="Admin" />, children: [{ path: "administration", element: <AdministrationPage /> }] },
        ],
      },
    ],
  },
  { path: "*", element: <Navigate to="/dashboard" replace /> },
]);

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={router} />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}
