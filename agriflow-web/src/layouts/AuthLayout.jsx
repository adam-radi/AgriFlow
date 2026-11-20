import { Outlet } from "react-router-dom";
import Navbar from "../components/layout/Navbar";

function AuthLayout() {
    return (
        <div>
            <Navbar />
            <Outlet />
        </div>
    );
}

export default AuthLayout;
