import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import DashboardPage from "./pages/DashboardPage";
import LoginPage from "./pages/LoginPage";
import ProductsPage from "./pages/ProductsPage";
import ReceiptsPage from "./pages/ReceiptsPage";
import DeliveryPage from "./pages/DeliveryPage";
import TransfersPage from "./pages/TransfersPage";
import AdjustmentsPage from "./pages/AdjustmentsPage";
import SettingsPage from "./pages/SettingsPage";
import HistoryPage from "./pages/HistoryPage";
import WarehousesPage from "./pages/WarehousesPage";
import LocationsPage from "./pages/LocationsPage";
import LogoutPage from "./pages/LogoutPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import ProfilePage from "./pages/ProfilePage";
import SignupPage from "./pages/SignupPage";

export default function App() {
  useEffect(() => {
    // Initialize theme on app load
    const stored = window.localStorage.getItem("coreinventory-theme");
    const preferDark = stored === "dark" || (!stored && window.matchMedia("(prefers-color-scheme: dark)").matches);
    document.documentElement.classList.toggle("dark", preferDark);
  }, []);

  return (
    <div className="min-h-screen bg-white text-secondary-900 dark:bg-surface-950 dark:text-secondary-100">
      <Routes>
        <Route path="/" element={<Navigate replace to="/login" />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/receipts" element={<ReceiptsPage />} />
        <Route path="/deliveries" element={<DeliveryPage />} />
        <Route path="/transfers" element={<TransfersPage />} />
        <Route path="/adjustments" element={<AdjustmentsPage />} />
        <Route path="/history" element={<HistoryPage />} />
        <Route path="/warehouses" element={<WarehousesPage />} />
        <Route path="/locations" element={<LocationsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/logout" element={<LogoutPage />} />
        <Route
          path="*"
          element={
            <div className="p-8 text-center">
              <h1 className="text-2xl font-semibold text-white">Page not found</h1>
              <p className="mt-2 text-sm text-secondary-300">Try selecting a page from the sidebar.</p>
            </div>
          }
        />
      </Routes>
    </div>
  );
}
