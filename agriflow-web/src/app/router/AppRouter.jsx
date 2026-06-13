import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import PublicLayout from "../../layouts/PublicLayout";
import ClientLayout from "../../layouts/ClientLayout";
import AdminLayout from "../../layouts/AdminLayout";
import AuthLayout from "../../layouts/AuthLayout";
import ProtectedRoute from "../../components/common/ProtectedRoute";
import FarmerLayout from "../../layouts/FarmerLayout";
import RoleGuard from "../../components/common/RoleGuard";

import LoginPage from "../../pages/LoginPage";
import RegisterClientPage from "../../pages/RegisterClient";
import RegisterFarmerPage from "../../pages/RegisterFarmerPage";

function AppRouter() {
    return (
        <Router>
            <Routes>

                <Route path="/" element={<Navigate to="/login" replace />} />
                
                <Route element={<AuthLayout />}>
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register/client" element={<RegisterClientPage />} />
                  <Route path="/register/farmer" element={<RegisterFarmerPage />} />
                </Route>

                {/* <Route path="*" element={<Navigate to="/login" replace />} /> */}
             <Route path="/dashboard" element={
                    <ProtectedRoute>
                        <h1>Dashboard</h1>
                    </ProtectedRoute>
             }/>

                <Route element={<PublicLayout />} ></Route>

                <Route element={
                    <ProtectedRoute>

                        <RoleGuard allowedRoles={["client"]} >
                        <ClientLayout />
                        </RoleGuard>
                    </ProtectedRoute>
                }>
                </Route>

                <Route element={
                    <ProtectedRoute>
                        <RoleGuard allowedRoles={["admin"]} >
                        <AdminLayout />
                        </RoleGuard>
                    </ProtectedRoute>
                }>
                </Route>


                <Route element={
                    <ProtectedRoute>
                        <RoleGuard allowedRoles={["farmer"]} >
                            <FarmerLayout />
                        </RoleGuard>
                    </ProtectedRoute>
                }>
                <Route path="/unauthorized" element={"<Unauthorized />"} />
                </Route>
            </Routes>
        </Router>
    )
}
export default AppRouter;