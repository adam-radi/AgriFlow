import { useState, useEffect } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { selectIsAuthenticated, selectUser } from "../../features/auth/authSelectors";
import { logoutUser } from "../../features/auth/authThunks";
import Logo from "./Logo";

const MAIN_NAV_LINKS = [
    { to: "/", label: "Accueil", end: true },
    { to: "/products", label: "Catalogue" },
    { to: "/#about", label: "À propos", isHash: true },
    { to: "/#farmers", label: "Producteurs", isHash: true },
    { to: "/#buyers", label: "Acheteurs Pro", isHash: true },
    { to: "/#contact", label: "Contact", isHash: true },
];

function getRoleLinks(role) {
    switch (role) {
        case "Client":
            return [
                { to: "/client/orders", label: "Commandes" },
                { to: "/client/cart", label: "Panier", hasCartBadge: true },
            ];
        case "Admin":
            return [
                { to: "/admin", label: "Administration" },
            ];
        case "Farmer":
            return [
                { to: "/farmer/products", label: "Espace Producteur" },
            ];
        case "Livreur":
            return [
                { to: "/delivery/dashboard", label: "Espace Livraisons" },
            ];
        default:
            return [];
    }
}

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [accountOpen, setAccountOpen] = useState(false);

    const isAuthenticated = useSelector(selectIsAuthenticated);
    const user = useSelector(selectUser);
    const cartCount = useSelector((state) => state.cart?.count ?? 0);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 20) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const closeMenus = () => {
        setMobileOpen(false);
        setAccountOpen(false);
    };

    const handleLogout = () => {
        dispatch(logoutUser());
        closeMenus();
        navigate("/");
    };

    const handleHashClick = (e, hash) => {
        if (location.pathname === "/") {
            e.preventDefault();
            const id = hash.replace("#", "");
            const elem = document.getElementById(id);
            if (elem) {
                elem.scrollIntoView({ behavior: "smooth" });
                closeMenus();
            }
        }
    };

    const roleLinks = isAuthenticated ? getRoleLinks(user?.role) : [];

    const pillGlassStyle = {
        backgroundColor: scrolled
            ? "rgba(255, 255, 255, 0.96)"
            : "rgba(255, 255, 255, 0.88)",
        backdropFilter: "blur(18px)",
        WebkitBackdropFilter: "blur(18px)",
        border: "1px solid rgba(226, 233, 227, 0.85)",
        borderRadius: "999px",
        boxShadow: scrolled
            ? "0 10px 30px rgba(21, 55, 47, 0.12)"
            : "0 6px 22px rgba(21, 55, 47, 0.06)",
        transition: "all 250ms cubic-bezier(0.16, 1, 0.3, 1)",
    };

    return (
        <header
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                zIndex: 1050,
                display: "flex",
                justifyContent: "center",
                padding: "16px 24px",
                pointerEvents: "none",
            }}
        >
            <div
                style={{
                    pointerEvents: "auto",
                    width: "100%",
                    maxWidth: "1240px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "14px",
                    position: "relative",
                }}
            >
                {/* ── 1. GAUCHE (LEFT) : Brand Logo Pill ───────────────────── */}
                <div
                    style={{
                        ...pillGlassStyle,
                        padding: "8px 18px",
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        flexShrink: 0,
                    }}
                >
                    <Link
                        to="/"
                        onClick={closeMenus}
                        className="text-decoration-none d-flex align-items-center gap-2"
                        style={{ color: "#15372F" }}
                    >
                        <Logo height={30} alt="AgriFlow Logo" />
                        <span
                            style={{
                                fontWeight: 800,
                                fontSize: "1.25rem",
                                letterSpacing: "-0.03em",
                                color: "#15372F",
                            }}
                        >
                            Agri<span style={{ color: "#398565" }}>Flow</span>
                        </span>
                    </Link>
                </div>

                {/* ── 2. CENTRE (CENTER) : Desktop Navigation Pill ─────────── */}
                <nav
                    className="d-none d-lg-flex align-items-center gap-1"
                    aria-label="Navigation principale"
                    style={{
                        ...pillGlassStyle,
                        padding: "6px 10px",
                        margin: "0 auto",
                    }}
                >
                    {MAIN_NAV_LINKS.map((link) => {
                        if (link.isHash) {
                            return (
                                <a
                                    key={link.to}
                                    href={link.to}
                                    onClick={(e) => handleHashClick(e, link.to.replace("/", ""))}
                                    className="text-decoration-none px-3 py-1 rounded-pill"
                                    style={{
                                        fontSize: "0.88rem",
                                        fontWeight: 500,
                                        color: "#34413A",
                                        transition: "background 150ms ease, color 150ms ease",
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.backgroundColor = "rgba(45, 115, 86, 0.08)";
                                        e.currentTarget.style.color = "#15372F";
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.backgroundColor = "transparent";
                                        e.currentTarget.style.color = "#34413A";
                                    }}
                                >
                                    {link.label}
                                </a>
                            );
                        }

                        return (
                            <NavLink
                                key={link.to}
                                to={link.to}
                                end={link.end}
                                className="text-decoration-none px-3 py-1 rounded-pill"
                                style={({ isActive }) => ({
                                    fontSize: "0.88rem",
                                    fontWeight: isActive ? 600 : 500,
                                    color: isActive ? "#15372F" : "#34413A",
                                    backgroundColor: isActive ? "#E8F2EC" : "transparent",
                                    transition: "background 150ms ease, color 150ms ease",
                                })}
                            >
                                {link.label}
                            </NavLink>
                        );
                    })}

                    {roleLinks.map((link) => (
                        <NavLink
                            key={link.to}
                            to={link.to}
                            className="text-decoration-none px-3 py-1 rounded-pill position-relative"
                            style={({ isActive }) => ({
                                fontSize: "0.88rem",
                                fontWeight: isActive ? 600 : 500,
                                color: isActive ? "#15372F" : "#34413A",
                                backgroundColor: isActive ? "#E8F2EC" : "transparent",
                                transition: "background 150ms ease, color 150ms ease",
                            })}
                        >
                            {link.label}
                            {link.hasCartBadge && cartCount > 0 && (
                                <span
                                    className="badge rounded-pill ms-1"
                                    style={{
                                        backgroundColor: "#194638",
                                        color: "#ffffff",
                                        fontSize: "0.68rem",
                                        verticalAlign: "middle",
                                        padding: "0.25em 0.55em",
                                    }}
                                >
                                    {cartCount}
                                </span>
                            )}
                        </NavLink>
                    ))}
                </nav>

                {/* ── 3. DROITE (RIGHT) : Actions Pill / Mobile Toggle ─────── */}
                <div
                    style={{
                        ...pillGlassStyle,
                        padding: "6px 8px 6px 14px",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        flexShrink: 0,
                    }}
                >
                    {isAuthenticated ? (
                        <div className="position-relative">
                            <button
                                type="button"
                                onClick={() => setAccountOpen(!accountOpen)}
                                className="btn d-flex align-items-center gap-2 rounded-pill px-3 py-1 border-0"
                                style={{
                                    backgroundColor: "#E8F2EC",
                                    color: "#15372F",
                                    fontSize: "0.88rem",
                                    fontWeight: 600,
                                }}
                            >
                                <span>{user?.name || user?.email || "Mon compte"}</span>
                                <span style={{ fontSize: "0.72rem", opacity: 0.7 }}>▼</span>
                            </button>

                            {accountOpen && (
                                <div
                                    style={{
                                        position: "absolute",
                                        top: "calc(100% + 10px)",
                                        right: 0,
                                        width: "220px",
                                        backgroundColor: "#ffffff",
                                        border: "1px solid #E2E9E3",
                                        borderRadius: "18px",
                                        boxShadow: "0 14px 34px rgba(21, 55, 47, 0.14)",
                                        padding: "8px",
                                        zIndex: 1060,
                                    }}
                                >
                                    <div className="px-3 py-2 border-bottom mb-1" style={{ fontSize: "0.8rem", color: "#68756E" }}>
                                        Rôle : <strong style={{ color: "#15372F" }}>{user?.role || "Membre"}</strong>
                                    </div>
                                    <Link
                                        to={roleLinks[roleLinks.length - 1]?.to || "/"}
                                        className="d-block px-3 py-2 text-decoration-none rounded"
                                        style={{ color: "#1D2924", fontSize: "0.88rem" }}
                                        onClick={closeMenus}
                                    >
                                        Tableau de bord
                                    </Link>
                                    <button
                                        type="button"
                                        onClick={handleLogout}
                                        className="w-100 text-start px-3 py-2 btn btn-link text-danger text-decoration-none rounded"
                                        style={{ fontSize: "0.88rem" }}
                                    >
                                        Déconnexion
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="d-none d-sm-flex align-items-center gap-2">
                            <Link
                                to="/login"
                                className="text-decoration-none px-3 py-1 rounded-pill"
                                style={{
                                    color: "#34413A",
                                    fontSize: "0.88rem",
                                    fontWeight: 600,
                                    transition: "color 150ms ease",
                                }}
                            >
                                Connexion
                            </Link>
                            <Link
                                to="/register/client"
                                className="text-decoration-none d-inline-flex align-items-center gap-1 rounded-pill px-3 py-1"
                                style={{
                                    backgroundColor: "#194638",
                                    color: "#ffffff",
                                    fontSize: "0.88rem",
                                    fontWeight: 600,
                                    paddingTop: "6px",
                                    paddingBottom: "6px",
                                    boxShadow: "0 2px 8px rgba(25, 70, 56, 0.2)",
                                    transition: "background 150ms ease, transform 150ms ease",
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = "#15372F";
                                    e.currentTarget.style.transform = "translateY(-1px)";
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = "#194638";
                                    e.currentTarget.style.transform = "translateY(0)";
                                }}
                            >
                                <span>S&apos;inscrire</span>
                                <span style={{ fontSize: "0.95rem" }}>→</span>
                            </Link>
                        </div>
                    )}

                    {/* Mobile Hamburger Button */}
                    <button
                        type="button"
                        className="btn d-lg-none p-1 border-0 rounded-circle"
                        onClick={() => setMobileOpen(!mobileOpen)}
                        aria-label="Ouvrir le menu de navigation"
                        aria-expanded={mobileOpen}
                        style={{
                            width: "36px",
                            height: "36px",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "4px",
                            backgroundColor: mobileOpen ? "#E8F2EC" : "transparent",
                        }}
                    >
                        <span
                            style={{
                                display: "block",
                                width: "18px",
                                height: "2px",
                                backgroundColor: "#15372F",
                                transition: "all 200ms ease",
                                transform: mobileOpen ? "translateY(6px) rotate(45deg)" : "none",
                            }}
                        />
                        <span
                            style={{
                                display: "block",
                                width: "18px",
                                height: "2px",
                                backgroundColor: "#15372F",
                                transition: "all 200ms ease",
                                opacity: mobileOpen ? 0 : 1,
                            }}
                        />
                        <span
                            style={{
                                display: "block",
                                width: "18px",
                                height: "2px",
                                backgroundColor: "#15372F",
                                transition: "all 200ms ease",
                                transform: mobileOpen ? "translateY(-6px) rotate(-45deg)" : "none",
                            }}
                        />
                    </button>
                </div>

                {/* ── Menu Mobile Déroulant ───────────────────────────────── */}
                {mobileOpen && (
                    <div
                        style={{
                            position: "absolute",
                            top: "calc(100% + 12px)",
                            left: 0,
                            right: 0,
                            backgroundColor: "rgba(255, 255, 255, 0.98)",
                            backdropFilter: "blur(22px)",
                            WebkitBackdropFilter: "blur(22px)",
                            border: "1px solid rgba(226, 233, 227, 0.9)",
                            borderRadius: "24px",
                            boxShadow: "0 18px 40px rgba(21, 55, 47, 0.16)",
                            padding: "20px 24px",
                            display: "flex",
                            flexDirection: "column",
                            gap: "12px",
                            zIndex: 1060,
                        }}
                    >
                        <div className="d-flex flex-column gap-1 border-bottom pb-3">
                            {MAIN_NAV_LINKS.map((link) => {
                                if (link.isHash) {
                                    return (
                                        <a
                                            key={link.to}
                                            href={link.to}
                                            onClick={(e) => handleHashClick(e, link.to.replace("/", ""))}
                                            className="text-decoration-none py-2 px-3 rounded"
                                            style={{
                                                fontSize: "0.95rem",
                                                fontWeight: 500,
                                                color: "#1D2924",
                                            }}
                                        >
                                            {link.label}
                                        </a>
                                    );
                                }
                                return (
                                    <NavLink
                                        key={link.to}
                                        to={link.to}
                                        end={link.end}
                                        onClick={closeMenus}
                                        className="text-decoration-none py-2 px-3 rounded"
                                        style={({ isActive }) => ({
                                            fontSize: "0.95rem",
                                            fontWeight: isActive ? 700 : 500,
                                            color: isActive ? "#15372F" : "#1D2924",
                                            backgroundColor: isActive ? "#E8F2EC" : "transparent",
                                        })}
                                    >
                                        {link.label}
                                    </NavLink>
                                );
                            })}

                            {roleLinks.map((link) => (
                                <NavLink
                                    key={link.to}
                                    to={link.to}
                                    onClick={closeMenus}
                                    className="text-decoration-none py-2 px-3 rounded"
                                    style={({ isActive }) => ({
                                        fontSize: "0.95rem",
                                        fontWeight: isActive ? 700 : 500,
                                        color: isActive ? "#15372F" : "#1D2924",
                                        backgroundColor: isActive ? "#E8F2EC" : "transparent",
                                    })}
                                >
                                    {link.label}
                                    {link.hasCartBadge && cartCount > 0 && (
                                        <span className="badge bg-success ms-2">{cartCount}</span>
                                    )}
                                </NavLink>
                            ))}
                        </div>

                        {!isAuthenticated && (
                            <div className="d-flex flex-column gap-2 pt-1">
                                <Link
                                    to="/login"
                                    onClick={closeMenus}
                                    className="btn btn-outline-dark rounded-pill py-2 text-center"
                                    style={{
                                        borderColor: "#CBD7CE",
                                        color: "#1D2924",
                                        fontSize: "0.92rem",
                                        fontWeight: 600,
                                    }}
                                >
                                    Connexion
                                </Link>
                                <Link
                                    to="/register/client"
                                    onClick={closeMenus}
                                    className="btn rounded-pill py-2 text-center"
                                    style={{
                                        backgroundColor: "#194638",
                                        color: "#ffffff",
                                        fontSize: "0.92rem",
                                        fontWeight: 600,
                                    }}
                                >
                                    S&apos;inscrire sur AgriFlow →
                                </Link>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </header>
    );
}
