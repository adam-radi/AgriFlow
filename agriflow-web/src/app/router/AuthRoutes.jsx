import { Routes, Route } from "react-router-dom";

import AuthLayout from "../../layouts/AuthLayout";

import LoginPage from "../../pages/loginPage";
import RegisterClientPage from "../../pages/RegisterClient";
import RegisterFarmerPage from "../../pages/RegisterFarmerPage";

export default function AuthRoutes() {
    return (
        <Route element={<AuthLayout />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register/client" element={<RegisterClientPage />} />
            <Route path="/register/farmer" element={<RegisterFarmerPage />} />
        </Route>
    );
}

