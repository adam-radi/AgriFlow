import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import AuthLayout from "../../layouts/AuthLayout";
import ClientLayout from "../../layouts/ClientLayout";
import ClientWorkspaceLayout from "../../layouts/ClientWorkspaceLayout";
import FarmerLayout from "../../layouts/FarmerLayout";
import PublicLayout from "../../layouts/PublicLayout";
import AdminLayout from "../../layouts/AdminLayout";
import ProtectedRoute from "../../components/common/ProtectedRoute";
import RequireVerificationRoute from "../../components/common/RequireVerificationRoute";

// Auth pages
import LoginPage from "../../pages/LoginPage";
import RegisterPage from "../../pages/RegisterPage";
import RegisterClientPage from "../../pages/RegisterClient";
import RegisterFarmerPage from "../../pages/RegisterFarmerPage";

// Public pages
import HomePage from "../../pages/public/HomePage";
import ProductsPage from "../../pages/public/ProductsPage";
import ProductDetailsPage from "../../pages/public/ProductDetailsPage";

// Farmer pages
import FarmerDashboard from "../../pages/farmer/FarmerDashboard";
import FarmerProductsPage from "../../pages/farmer/products/FarmerProductsPage";
import CreateProductPage from "../../pages/farmer/products/CreateProductPage";
import EditProductPage from "../../pages/farmer/products/EditProductPage";
import FarmerHarvestsPage from "../../pages/farmer/harvests/FarmerHarvestsPage";
import CreateHarvestPage from "../../pages/farmer/harvests/CreateHarvestPage";
import EditHarvestPage from "../../pages/farmer/harvests/EditHarvestPage";
import HarvestDetailsPage from "../../pages/farmer/harvests/HarvestDetailsPage";

// Client pages
import ClientDashboard from "../../pages/client/ClientDashboard";

// Admin pages
import AdminDashboard from "../../pages/admin/AdminDashboard";
import AdminUsersPage from "../../pages/admin/AdminUsersPage";
import AdminFarmersPage from "../../pages/admin/AdminFarmersPage";
import AdminProductsPage from "../../pages/admin/AdminProductsPage";
import AdminOrdersPage from "../../pages/admin/AdminOrdersPage";
import AdminOrderDetailsPage from "../../pages/admin/AdminOrderDetailsPage";
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

// Profile & Verification pages
import FarmerProfilePage from "../../pages/farmer/FarmerProfilePage";
import FarmerVerificationPage from "../../pages/farmer/FarmerVerificationPage";
import ClientProfilePage from "../../pages/client/ClientProfilePage";
import ClientVerificationPage from "../../pages/client/ClientVerificationPage";
import AdminVerificationsPage from "../../pages/admin/AdminVerificationsPage";

function AppRouter() {
    return (
        <Router>
            <Routes>

                {/* ── Public Marketplace & Home ───────────────────────── */}
                <Route element={<PublicLayout />}>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/products" element={<ProductsPage />} />
                    <Route path="/products/:id" element={<ProductDetailsPage />} />
                </Route>

                {/* ── Public Auth Routes ─────────────────────────────── */}
                <Route element={<AuthLayout />}>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/register/client" element={<RegisterClientPage />} />
                    <Route path="/register/farmer" element={<RegisterFarmerPage />} />
                </Route>

                {/* ── Protected Dashboards ───────────────────────────── */}

                {/* ── Farmer Dashboard & Management (Protected) ─────── */}
                <Route
                    element={
                        <ProtectedRoute allowedRoles={["Farmer"]}>
                            <FarmerLayout />
                        </ProtectedRoute>
                    }
                >
                    <Route path="/farmer/dashboard" element={<FarmerDashboard />} />
                    <Route path="/farmer/products" element={<FarmerProductsPage />} />
                    <Route
                        path="/farmer/products/new"
                        element={
                            <RequireVerificationRoute featureTitle="Ajout de produit" backUrl="/farmer/products">
                                <CreateProductPage />
                            </RequireVerificationRoute>
                        }
                    />
                    <Route
                        path="/farmer/products/:id/edit"
                        element={
                            <RequireVerificationRoute featureTitle="Modification de produit" backUrl="/farmer/products">
                                <EditProductPage />
                            </RequireVerificationRoute>
                        }
                    />
                    <Route path="/farmer/harvests" element={<FarmerHarvestsPage />} />
                    <Route
                        path="/farmer/harvests/create"
                        element={
                            <RequireVerificationRoute featureTitle="Nouvelle récolte" backUrl="/farmer/harvests">
                                <CreateHarvestPage />
                            </RequireVerificationRoute>
                        }
                    />
                    <Route path="/farmer/harvests/:id" element={<HarvestDetailsPage />} />
                    <Route
                        path="/farmer/harvests/:id/edit"
                        element={
                            <RequireVerificationRoute featureTitle="Modification de récolte" backUrl="/farmer/harvests">
                                <EditHarvestPage />
                            </RequireVerificationRoute>
                        }
                    />
                    <Route path="/farmer/profile" element={<FarmerProfilePage />} />
                    <Route path="/farmer/verification" element={<FarmerVerificationPage />} />
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
                    <Route path="/admin/verifications" element={<AdminVerificationsPage />} />
                    <Route path="/admin/products" element={<AdminProductsPage />} />
                    <Route path="/admin/orders" element={<AdminOrdersPage />} />
                    <Route path="/admin/orders/:id" element={<AdminOrderDetailsPage />} />
                    <Route path="/admin/harvests" element={<AdminHarvestsPage />} />
                    <Route path="/admin/delivery" element={<DeliveryDashboard />} />
                    <Route path="/admin/delivery/groups" element={<DeliveryGroupsPage />} />
                    <Route path="/admin/delivery/groups/:id" element={<DeliveryGroupDetails />} />
                </Route>

                {/* ── Client Cart, Orders & Workspace (Protected) ────────── */}
                <Route
                    element={
                        <ProtectedRoute allowedRoles={["Client"]}>
                            <ClientWorkspaceLayout />
                        </ProtectedRoute>
                    }
                >
                    <Route path="/client" element={<Navigate to="/client/dashboard" replace />} />
                    <Route path="/client/dashboard" element={<ClientDashboard />} />
                    <Route path="/client/cart" element={<CartPage />} />
                    <Route path="/client/checkout" element={<CheckoutPage />} />
                    <Route path="/client/orders" element={<OrdersPage />} />
                    <Route path="/client/orders/:id" element={<OrderDetailsPage />} />
                    <Route path="/client/profile" element={<ClientProfilePage />} />
                    <Route path="/client/verification" element={<ClientVerificationPage />} />
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