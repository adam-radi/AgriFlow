import { Nav } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";

const links = [
    { path: "/farmer/dashboard", label: "Dashboard", icon: "📊" },
    { path: "/farmer/products", label: "Products", icon: "📦" },
    { path: "/farmer/harvests", label: "Harvests", icon: "🌱" },
];

export default function FarmerSidebar() {
    const location = useLocation();

    return (
        <Nav className="flex-column gap-1 p-3">
            <div className="fw-bold fs-5 mb-3 px-2" style={{ color: "var(--agri-green)", fontFamily: "'Playfair Display', serif" }}>
                🌾 Farmer Panel
            </div>
            {links.map((link) => (
                <Nav.Link
                    key={link.path}
                    as={Link}
                    to={link.path}
                    active={location.pathname === link.path || location.pathname.startsWith(link.path + "/")}
                    className="rounded-3 fw-medium"
                    style={{
                        color: location.pathname === link.path || location.pathname.startsWith(link.path + "/")
                            ? "#fff" : "var(--text-dark)",
                        backgroundColor: location.pathname === link.path || location.pathname.startsWith(link.path + "/")
                            ? "var(--agri-green)" : "transparent",
                        transition: "all 0.2s",
                    }}
                >
                    <span className="me-2">{link.icon}</span>
                    {link.label}
                </Nav.Link>
            ))}
        </Nav>
    );
}
