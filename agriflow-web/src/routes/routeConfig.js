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

export const adminRoutes = [
    { path: "/admin", role: "Admin" },
    { path: "/admin/users", role: "Admin" },
    { path: "/admin/farmers", role: "Admin" },
    { path: "/admin/products", role: "Admin" },
    { path: "/admin/orders", role: "Admin" },
    { path: "/admin/harvests", role: "Admin" },
];

export const adminDeliveryRoutes = [
    { path: "/admin/delivery", role: "Admin" },
    { path: "/admin/delivery/groups", role: "Admin" },
    { path: "/admin/delivery/groups/:id", role: "Admin" },
];

export const clientOrderRoutes = [
    { path: "/client/cart", role: "Client" },
    { path: "/client/checkout", role: "Client" },
    { path: "/client/orders", role: "Client" },
    { path: "/client/orders/:id", role: "Client" },
];

export default authRoutes;
