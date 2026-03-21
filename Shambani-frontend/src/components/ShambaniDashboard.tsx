import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { useAuth } from "../contexts/AuthContext";
import {
  Leaf,
  Users,
  Truck,
  ShoppingCart,
  Warehouse,
  Bird,
  TrendingUp,
  Activity,
  DollarSign,
  Calendar,
  Bell,
  Settings,
  LogOut,
  User,
  Building,
  Package,
  Heart,
  FileText,
  MessageSquare,
} from "lucide-react";
import { Logo } from "./Logo";
import { motion, AnimatePresence } from "framer-motion";

// Dashboard Components for each role
import { UnifiedFarmerDashboardFinal } from "./dashboards/UnifiedFarmerDashboardFinal";
import { FarmerDashboard } from "./dashboards/FarmerDashboard";
import { ExtensionOfficerDashboard } from "./dashboards/ExtensionOfficerDashboard";
import { AgrovetDashboard } from "./dashboards/AgrovetDashboard";
import { LogisticsDashboard } from "./dashboards/LogisticsDashboard";
import { MachineryDealerDashboard } from "./dashboards/MachineryDealerDashboard";
import { BuyerDashboard } from "./dashboards/BuyerDashboard";
import { SuperAdminDashboard } from "./dashboards/SuperAdminDashboard";
import { CasualLabourerDashboard } from "./dashboards/CasualLabourerDashboard";

export function ShambaniDashboard() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Please login to access dashboard</p>
          <Button onClick={() => window.location.href = "/"}>
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  // Get role-specific dashboard component
  const getRoleDashboard = () => {
    switch (user.role) {
      case "FARMER":
        return <UnifiedFarmerDashboardFinal user={user} />;
      case "EXTENSION_OFFICER":
        return <ExtensionOfficerDashboard user={user} activeTab={activeTab} setActiveTab={setActiveTab} />;
      case "AGROVET_OWNER":
        return <AgrovetDashboard user={user} activeTab={activeTab} setActiveTab={setActiveTab} />;
      case "LOGISTICS_PROVIDER":
        return <LogisticsDashboard user={user} activeTab={activeTab} setActiveTab={setActiveTab} />;
      case "MACHINERY_DEALER":
        return <MachineryDealerDashboard user={user} activeTab={activeTab} setActiveTab={setActiveTab} />;
      case "BUYER_AGGREGATOR":
        return <BuyerDashboard user={user} activeTab={activeTab} setActiveTab={setActiveTab} />;
      case "SUPER_ADMIN":
        return <SuperAdminDashboard user={user} activeTab={activeTab} setActiveTab={setActiveTab} />;
      case "CASUAL_LABOURER":
        return <CasualLabourerDashboard user={user} activeTab={activeTab} setActiveTab={setActiveTab} />;
      default:
        return <div className="p-6">Role not supported</div>;
    }
  };

  // Get role-specific navigation items
  const getNavigationItems = () => {
    const baseItems = [
      { id: "overview", label: "Overview", icon: User },
      { id: "profile", label: "Profile", icon: User },
    ];

    switch (user.role) {
      case "FARMER":
        return [
          ...baseItems,
          { id: "production", label: "Production", icon: Bird },
          { id: "feeding", label: "Feeding", icon: Leaf },
          { id: "health", label: "Health", icon: Heart },
          { id: "financial", label: "Financial", icon: DollarSign },
          { id: "services", label: "Services", icon: MessageSquare },
          { id: "notifications", label: "Notifications", icon: Bell },
        ];
      case "EXTENSION_OFFICER":
        return [
          ...baseItems,
          { id: "services", label: "Services", icon: MessageSquare },
          { id: "appointments", label: "Appointments", icon: Calendar },
          { id: "reports", label: "Reports", icon: FileText },
          { id: "notifications", label: "Notifications", icon: Bell },
        ];
      case "AGROVET_OWNER":
        return [
          ...baseItems,
          { id: "products", label: "Products", icon: Package },
          { id: "orders", label: "Orders", icon: ShoppingCart },
          { id: "inventory", label: "Inventory", icon: Warehouse },
          { id: "financial", label: "Financial", icon: DollarSign },
          { id: "notifications", label: "Notifications", icon: Bell },
        ];
      case "LOGISTICS_PROVIDER":
        return [
          ...baseItems,
          { id: "deliveries", label: "Deliveries", icon: Truck },
          { id: "routes", label: "Routes", icon: Activity },
          { id: "schedule", label: "Schedule", icon: Calendar },
          { id: "financial", label: "Financial", icon: DollarSign },
          { id: "notifications", label: "Notifications", icon: Bell },
        ];
      case "MACHINERY_DEALER":
        return [
          ...baseItems,
          { id: "equipment", label: "Equipment", icon: Package },
          { id: "rentals", label: "Rentals", icon: Truck },
          { id: "maintenance", label: "Maintenance", icon: Settings },
          { id: "financial", label: "Financial", icon: DollarSign },
          { id: "notifications", label: "Notifications", icon: Bell },
        ];
      case "BUYER_AGGREGATOR":
        return [
          ...baseItems,
          { id: "marketplace", label: "Marketplace", icon: ShoppingCart },
          { id: "orders", label: "Orders", icon: Package },
          { id: "suppliers", label: "Suppliers", icon: Building },
          { id: "financial", label: "Financial", icon: DollarSign },
          { id: "notifications", label: "Notifications", icon: Bell },
        ];
      case "SUPER_ADMIN":
        return [
          ...baseItems,
          { id: "users", label: "Users", icon: Users },
          { id: "analytics", label: "Analytics", icon: TrendingUp },
          { id: "system", label: "System", icon: Settings },
          { id: "logs", label: "Logs", icon: FileText },
          { id: "notifications", label: "Notifications", icon: Bell },
        ];
      case "CASUAL_LABOURER":
        return [
          ...baseItems,
          { id: "jobs", label: "Jobs", icon: Activity },
          { id: "schedule", label: "Schedule", icon: Calendar },
          { id: "earnings", label: "Earnings", icon: DollarSign },
          { id: "notifications", label: "Notifications", icon: Bell },
        ];
      default:
        return baseItems;
    }
  };

  const navigationItems = getNavigationItems();

  return (
    <>
      {user.role === "FARMER" ? (
        // For FARMER role, render dashboard directly (no sidebar/header)
        <UnifiedFarmerDashboardFinal user={user} />
      ) : user.role === "EXTENSION_OFFICER" ? (
        // For EXTENSION_OFFICER role, render dashboard directly
        <ExtensionOfficerDashboard user={user} activeTab={activeTab} setActiveTab={setActiveTab} />
      ) : user.role === "AGROVET_OWNER" ? (
        // For AGROVET_OWNER role, render dashboard directly
        <AgrovetDashboard user={user} activeTab={activeTab} setActiveTab={setActiveTab} />
      ) : user.role === "LOGISTICS_PROVIDER" ? (
        // For LOGISTICS_PROVIDER role, render dashboard directly
        <LogisticsDashboard user={user} activeTab={activeTab} setActiveTab={setActiveTab} />
      ) : user.role === "MACHINERY_DEALER" ? (
        // For MACHINERY_DEALER role, render dashboard directly
        <MachineryDealerDashboard user={user} activeTab={activeTab} setActiveTab={setActiveTab} />
      ) : user.role === "BUYER_AGGREGATOR" ? (
        // For BUYER_AGGREGATOR role, render dashboard directly
        <BuyerDashboard user={user} activeTab={activeTab} setActiveTab={setActiveTab} />
      ) : user.role === "SUPER_ADMIN" ? (
        // For SUPER_ADMIN role, render dashboard directly
        <SuperAdminDashboard user={user} activeTab={activeTab} setActiveTab={setActiveTab} />
      ) : user.role === "CASUAL_LABOURER" ? (
        // For CASUAL_LABOURER role, render dashboard directly
        <CasualLabourerDashboard user={user} activeTab={activeTab} setActiveTab={setActiveTab} />
      ) : (
        // Fallback for unsupported roles
        <div className="min-h-screen bg-gray-50">
          <div className="p-6">Role not supported</div>
        </div>
      )}
    </>
  );
}
