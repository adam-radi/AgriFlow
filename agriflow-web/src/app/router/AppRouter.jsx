import { BrowserRouter as Router, Routes, Route } from "reatc-router-dom";
import AppProvider from "./providers/AppProvider";
import PublicLayout from "../layouts/PublicLayout";
import ClientLayout from "../layouts/ClientLayout";
import AdminLayout from "../layouts/AdminLayout";

import ProtectedRoute from "../../components/common/ProtectedRoute";
import FarmerLayout from "../../layouts/FarmerLayout";

function AppRouter() {
    return (
        <Router>
            <Routes>
                <Route element={<PublicLayout />} ></Route>

                <Route element={
                    <ProtectedRoute>
                        <ClientLayout />
                    </ProtectedRoute>
                }>
                </Route>

                <Route element={
                    <ProtectedRoute>
                        <AdminLAyout />
                    </ProtectedRoute>
                }>
                </Route>


                <Route element={
                    <ProtectedRoute>
                        <FarmerLayout/>
                    </ProtectedRoute>
                }>

                </Route>
            </Routes>
        </Router>
    )
}
export default AppRouter;