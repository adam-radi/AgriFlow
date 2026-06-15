import LoginPage from "../pages/LoginPage";
import RegisterClientPage from "../pages/RegisterClient";
import RegisterFarmerPage from "../pages/RegisterFarmerPage";

const authRoutes = [
    { path: "/login", element: LoginPage },
    { path: "/register/client", element: RegisterClientPage },
    { path: "/register/farmer", element: RegisterFarmerPage },
];

export const farmerHarvestRoutes = [
    { path: "/farmer/harvests", role: "Farmer" },
    { path: "/farmer/harvests/create", role: "Farmer" },
    { path: "/farmer/harvests/:id", role: "Farmer" },
    { path: "/farmer/harvests/:id/edit", role: "Farmer" },
];

export const adminHarvestRoutes = [
    { path: "/admin/harvests", role: "Admin" },
];

export const clientOrderRoutes = [
    { path: "/client/cart", role: "Client" },
    { path: "/client/checkout", role: "Client" },
    { path: "/client/orders", role: "Client" },
    { path: "/client/orders/:id", role: "Client" },
];

export default authRoutes;
