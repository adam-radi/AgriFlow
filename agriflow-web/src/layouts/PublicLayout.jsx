import { Outlet } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

export default function PublicLayout() {
    return (
        <div
            style={{
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column",
                backgroundColor: "var(--af-canvas, #F6F8F5)",
            }}
        >
            <Navbar />
            <div style={{ flex: "1 0 auto", paddingTop: "88px" }}>
                <Outlet />
            </div>
            <Footer />
        </div>
    );
}
