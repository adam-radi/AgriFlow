import HomePage from "../pages/public/HomePage";
import ProductsPage from "../pages/public/ProductsPage";
import ProductDetailsPage from "../pages/public/ProductDetailsPage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import RegisterClientPage from "../pages/RegisterClient";
import RegisterFarmerPage from "../pages/RegisterFarmerPage";

const publicRoutes = [
    { path: "/", element: HomePage },
    { path: "/products", element: ProductsPage },
    { path: "/products/:id", element: ProductDetailsPage },
];

const authRoutes = [
    { path: "/login", element: LoginPage },
    { path: "/register", element: RegisterPage },
    { path: "/register/client", element: RegisterClientPage },
    { path: "/register/farmer", element: RegisterFarmerPage },
];

export const farmerRoutes = [
    { path: "/farmer/dashboard", role: "Farmer" },
    { path: "/farmer/products", role: "Farmer" },
    { path: "/farmer/products/new", role: "Farmer" },
    { path: "/farmer/products/:id/edit", role: "Farmer" },
    { path: "/farmer/harvests", role: "Farmer" },
    { path: "/farmer/harvests/create", role: "Farmer" },
    { path: "/farmer/harvests/:id", role: "Farmer" },
    { path: "/farmer/harvests/:id/edit", role: "Farmer" },
    { path: "/farmer/profile", role: "Farmer" },
    { path: "/farmer/verification", role: "Farmer" },
];

export const adminRoutes = [
    { path: "/admin", role: "Admin" },
    { path: "/admin/users", role: "Admin" },
    { path: "/admin/farmers", role: "Admin" },
    { path: "/admin/verifications", role: "Admin" },
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
    { path: "/client/profile", role: "Client" },
    { path: "/client/verification", role: "Client" },
];

export const deliveryLivreurRoutes = [
    { path: "/delivery/dashboard", role: "Livreur" },
    { path: "/delivery/groups", role: "Livreur" },
    { path: "/delivery/groups/:id", role: "Livreur" },
];

export { publicRoutes };

export default authRoutes;
