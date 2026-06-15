import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import AuthLayout from "../../layouts/AuthLayout";
import ClientLayout from "../../layouts/ClientLayout";
import FarmerLayout from "../../layouts/FarmerLayout";
import PublicLayout from "../../layouts/PublicLayout";
import AdminLayout from "../../layouts/AdminLayout";
import ProtectedRoute from "../../components/common/ProtectedRoute";

// Auth pages
import LoginPage from "../../pages/LoginPage";
import RegisterClientPage from "../../pages/RegisterClient";
import RegisterFarmerPage from "../../pages/RegisterFarmerPage";

// Public product pages
import ProductsPage from "../../pages/public/ProductsPage";
import ProductDetailsPage from "../../pages/public/ProductDetailsPage";

// Farmer product pages
import FarmerProductsPage from "../../pages/farmer/products/FarmerProductsPage";
import CreateProductPage from "../../pages/farmer/products/CreateProductPage";
import EditProductPage from "../../pages/farmer/products/EditProductPage";

// Farmer harvest pages
import FarmerHarvestsPage from "../../pages/farmer/harvests/FarmerHarvestsPage";
import CreateHarvestPage from "../../pages/farmer/harvests/CreateHarvestPage";
import EditHarvestPage from "../../pages/farmer/harvests/EditHarvestPage";
import HarvestDetailsPage from "../../pages/farmer/harvests/HarvestDetailsPage";

// Admin pages
import AdminDashboard from "../../pages/admin/AdminDashboard";
import AdminUsersPage from "../../pages/admin/AdminUsersPage";
import AdminFarmersPage from "../../pages/admin/AdminFarmersPage";
import AdminProductsPage from "../../pages/admin/AdminProductsPage";
import AdminOrdersPage from "../../pages/admin/AdminOrdersPage";
import AdminHarvestsPage from "../../pages/admin/AdminHarvestsPage";

// Delivery pages
import DeliveryDashboard from "../../pages/delivery/DeliveryDashboard";
import DeliveryGroupsPage from "../../pages/delivery/DeliveryGroupsPage";
import DeliveryGroupDetails from "../../pages/delivery/DeliveryGroupDetails";

// Client order pages
import CartPage from "../../pages/client/cart/CartPage";
import CheckoutPage from "../../pages/client/checkout/CheckoutPage";
import OrdersPage from "../../pages/client/orders/OrdersPage";
import OrderDetailsPage from "../../pages/client/orders/OrderDetailsPage";

// Placeholder dashboard pages (will be replaced later)
const PlaceholderDashboard = ({ title, emoji }) => (
    <div style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg,#e8f5e9,#f0f7f4)",
        fontFamily: "Inter, sans-serif"
    }}>
        <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>{emoji}</div>
            <h1 style={{ color: "#2d6a4f", fontWeight: 700 }}>{title} Dashboard</h1>
            <p style={{ color: "#6c757d" }}>Coming soon...</p>
        </div>
    </div>
);

function AppRouter() {
    return (
        <Router>
            <Routes>

                {/* Redirect root → login */}
                <Route path="/" element={<Navigate to="/login" replace />} />

                {/* ── Public Auth Routes ─────────────────────────────── */}
                <Route element={<AuthLayout />}>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register/client" element={<RegisterClientPage />} />
                    <Route path="/register/farmer" element={<RegisterFarmerPage />} />
                </Route>

                {/* ── Public Product Marketplace ─────────────────────── */}
                <Route element={<PublicLayout />}>
                    <Route path="/products" element={<ProductsPage />} />
                    <Route path="/products/:id" element={<ProductDetailsPage />} />
                </Route>

                {/* ── Protected Dashboards ───────────────────────────── */}
                <Route
                    path="/dashboard/client"
                    element={
                        <ProtectedRoute allowedRoles={["Client"]}>
                            <PlaceholderDashboard title="Client" emoji="🛒" />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/dashboard/farmer"
                    element={
                        <ProtectedRoute allowedRoles={["Farmer"]}>
                            <PlaceholderDashboard title="Farmer" emoji="🌾" />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/dashboard/delivery"
                    element={
                        <ProtectedRoute allowedRoles={["Livreur"]}>
                            <PlaceholderDashboard title="Delivery" emoji="🚚" />
                        </ProtectedRoute>
                    }
                />

                {/* Generic dashboard */}
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <PlaceholderDashboard title="Dashboard" emoji="📊" />
                        </ProtectedRoute>
                    }
                />

                {/* ── Farmer Product Management (Protected) ─────────── */}
                <Route
                    element={
                        <ProtectedRoute allowedRoles={["Farmer"]}>
                            <FarmerLayout />
                        </ProtectedRoute>
                    }
                >
                    <Route path="/farmer/products" element={<FarmerProductsPage />} />
                    <Route path="/farmer/products/new" element={<CreateProductPage />} />
                    <Route path="/farmer/products/:id/edit" element={<EditProductPage />} />
                </Route>

                {/* ── Farmer Harvest Management (Protected) ─────────── */}
                <Route
                    element={
                        <ProtectedRoute allowedRoles={["Farmer"]}>
                            <FarmerLayout />
                        </ProtectedRoute>
                    }
                >
                    <Route path="/farmer/harvests" element={<FarmerHarvestsPage />} />
                    <Route path="/farmer/harvests/create" element={<CreateHarvestPage />} />
                    <Route path="/farmer/harvests/:id" element={<HarvestDetailsPage />} />
                    <Route path="/farmer/harvests/:id/edit" element={<EditHarvestPage />} />
                </Route>

                {/* ── Admin Dashboard & Management (Protected) ──────── */}
                <Route
                    element={
                        <ProtectedRoute allowedRoles={["Admin"]}>
                            <AdminLayout />
                        </ProtectedRoute>
                    }
                >
                    <Route path="/admin" element={<AdminDashboard />} />
                    <Route path="/admin/users" element={<AdminUsersPage />} />
                    <Route path="/admin/farmers" element={<AdminFarmersPage />} />
                    <Route path="/admin/products" element={<AdminProductsPage />} />
                    <Route path="/admin/orders" element={<AdminOrdersPage />} />
                    <Route path="/admin/harvests" element={<AdminHarvestsPage />} />
                    <Route path="/admin/delivery" element={<DeliveryDashboard />} />
                    <Route path="/admin/delivery/groups" element={<DeliveryGroupsPage />} />
                    <Route path="/admin/delivery/groups/:id" element={<DeliveryGroupDetails />} />
                </Route>

                {/* ── Client Cart & Orders (Protected) ──────────────── */}
                <Route
                    element={
                        <ProtectedRoute allowedRoles={["Client"]}>
                            <ClientLayout />
                        </ProtectedRoute>
                    }
                >
                    <Route path="/client/cart" element={<CartPage />} />
                    <Route path="/client/checkout" element={<CheckoutPage />} />
                    <Route path="/client/orders" element={<OrdersPage />} />
                    <Route path="/client/orders/:id" element={<OrderDetailsPage />} />
                </Route>

                {/* ── Livreur Delivery Routes (Protected) ──────────── */}
                <Route
                    element={
                        <ProtectedRoute allowedRoles={["Livreur", "Admin"]}>
                            <ClientLayout />
                        </ProtectedRoute>
                    }
                >
                    <Route path="/delivery/dashboard" element={<DeliveryDashboard />} />
                    <Route path="/delivery/groups" element={<DeliveryGroupsPage />} />
                    <Route path="/delivery/groups/:id" element={<DeliveryGroupDetails />} />
                </Route>

                {/* ── Unauthorized ───────────────────────────────────── */}
                <Route path="/unauthorized" element={
                    <div style={{ textAlign: "center", padding: "4rem", fontFamily: "Inter,sans-serif" }}>
                        <div style={{ fontSize: "3rem" }}>🚫</div>
                        <h2 style={{ color: "#c0392b" }}>Access Denied</h2>
                        <p>You don't have permission to view this page.</p>
                        <a href="/login" style={{ color: "#2d6a4f", fontWeight: 600 }}>← Back to Login</a>
                    </div>
                } />

                {/* Catch-all */}
                <Route path="*" element={<Navigate to="/login" replace />} />

            </Routes>
        </Router>
    );
}

export default AppRouter;