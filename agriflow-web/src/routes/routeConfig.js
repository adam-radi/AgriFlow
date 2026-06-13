import LoginPage from "../pages/LoginPage";
import RegisterClientPage from "../pages/RegisterClient";
import RegisterFarmerPage from "../pages/RegisterFarmerPage";

const authRoutes = [
    { path: "/login", element: LoginPage },
    { path: "/register/client", element: RegisterClientPage },
    { path: "/register/farmer", element: RegisterFarmerPage },
];

export default authRoutes;
