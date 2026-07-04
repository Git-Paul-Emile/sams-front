import {
  LayoutDashboard, Factory, Package, PackageMinus, BadgeCheck, Truck,
  ShoppingCart, Users, ReceiptText, TrendingUp, BarChart2, ClipboardList, Settings,
} from "lucide-react";
import type React from "react";

export interface NavItem {
  path: string;
  label: string;
  icon: React.ElementType;
  module: string;
}

export const NAV_ITEMS: NavItem[] = [
  { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard, module: "Dashboard" },
  { path: "/production", label: "Production", icon: Factory, module: "Production" },
  { path: "/stock", label: "Stocks", icon: Package, module: "Stocks" },
  { path: "/sorties", label: "Sorties Stock", icon: PackageMinus, module: "Sorties" },
  { path: "/validations", label: "Validations", icon: BadgeCheck, module: "Validations" },
  { path: "/achats", label: "Achats", icon: Truck, module: "Achats" },
  { path: "/ventes", label: "Ventes", icon: ShoppingCart, module: "Ventes" },
  { path: "/clients", label: "Clients", icon: Users, module: "Clients" },
  { path: "/facturation", label: "Facturation", icon: ReceiptText, module: "Facturation" },
  { path: "/finance", label: "Finance", icon: TrendingUp, module: "Finance" },
  { path: "/couts", label: "Coûts & Marges", icon: BarChart2, module: "Couts" },
  { path: "/rapports", label: "Rapports", icon: ClipboardList, module: "Rapports" },
  { path: "/administration", label: "Administration", icon: Settings, module: "Admin" },
];
