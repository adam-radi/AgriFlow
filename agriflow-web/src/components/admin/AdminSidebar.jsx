import { Nav } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";

const links = [
    { path: "/admin", label: "Dashboard", icon: "📊" },
    { path: "/admin/users", label: "Users", icon: "👥" },
    { path: "/admin/farmers", label: "Farmers", icon: "🌾" },
    { path: "/admin/products", label: "Products", icon: "📦" },
    { path: "/admin/orders", label: "Orders", icon: "🛒" },
    { path: "/admin/harvests", label: "Harvests", icon: "🌿" },
    { path: "/admin/delivery", label: "Delivery", icon: "🚚" },
];

export default function AdminSidebar() {
    const location = useLocation();

    return (
        <Nav className="flex-column gap-1 p-3">
            {links.map((link) => (
                <Nav.Link
                    key={link.path}
                    as={Link}
                    to={link.path}
                    active={location.pathname === link.path || location.pathname.startsWith(link.path + "/")}
                    className="rounded-3 fw-medium"
                    style={{
                        color: location.pathname === link.path || location.pathname.startsWith(link.path + "/")
                            ? "#fff"
                            : "#2d6a4f",
                        backgroundColor: location.pathname === link.path || location.pathname.startsWith(link.path + "/")
                            ? "#2d6a4f"
                            : "transparent",
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
