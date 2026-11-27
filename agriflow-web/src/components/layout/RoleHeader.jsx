import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { logoutUser } from "../../features/auth/authThunks";
import { selectUser } from "../../features/auth/authSelectors";
import { selectVerificationStatus } from "../../features/verification/verificationSelectors";
import NotificationBell from "../notifications/NotificationBell";
import Logo from "./Logo";

export default function RoleHeader({
  user: propUser = null,
  onMenuClick,
  onNotificationsClick,
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Prefer store user if prop is null/fallback
  const storeUser = useSelector(selectUser);
  const currentUser = propUser || storeUser;
  const verificationStatus = useSelector(selectVerificationStatus);

  const displayName = currentUser?.name || "Utilisateur AgriFlow";
  const userEmail = currentUser?.email || "";
  const userRole = currentUser?.role || "Utilisateur";

  const initials = displayName
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const query = searchQuery.trim();
    if (query) {
      navigate(`/products?search=${encodeURIComponent(query)}`);
    } else {
      navigate("/products");
    }
  };

  const handleLogout = async () => {
    setIsDropdownOpen(false);
    await dispatch(logoutUser());
    navigate("/login");
  };

  const profilePath =
    userRole === "Farmer"
      ? "/farmer/profile"
      : userRole === "Client"
      ? "/client/profile"
      : "/admin";

  const verificationPath =
    userRole === "Farmer"
      ? "/farmer/verification"
      : userRole === "Client"
      ? "/client/verification"
      : "/admin/verifications";

  const roleLabelMap = {
    Farmer: "Exploitant agricole",
    Client: "Acheteur professionnel",
    Admin: "Administrateur",
    Livreur: "Transporteur logistique",
  };

  return (
    <header className="af-role-header">
      {/* Left side: Hamburger menu (mobile) + Modern search bar */}
      <div className="af-role-header-left">
        <button
          type="button"
          className="af-role-header-menu-button"
          onClick={onMenuClick}
          aria-label="Ouvrir le menu de navigation"
        >
          ☰
        </button>

        <Link
          to="/"
          className="d-lg-none d-flex align-items-center text-decoration-none me-2"
          aria-label="Retour à l'accueil AgriFlow"
        >
          <Logo height={30} to={false} />
        </Link>

        <form
          className="af-role-header-search"
          onSubmit={handleSearchSubmit}
          role="search"
        >
          <svg
            className="af-search-icon"
            width="17"
            height="17"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>

          <input
            type="search"
            className="af-search-input"
            placeholder="Rechercher un produit, catégorie..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Rechercher dans le catalogue"
          />

          <button
            type="submit"
            style={{
              background: "none",
              border: "none",
              padding: 0,
              cursor: "pointer",
            }}
            title="Lancer la recherche"
          >
            <kbd className="af-search-kbd" title="Appuyez sur Entrée">
              ↵
            </kbd>
          </button>
        </form>
      </div>

      {/* Right side: Actions (Catalogue link, Notifications) + Interactive User Profile */}
      <div className="af-role-header-right">
        {/* Marketplace shortcut */}
        <Link
          to="/products"
          className="af-header-icon-btn"
          aria-label="Accéder au catalogue public"
          title="Explorer le catalogue agricole"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="9" cy="21" r="1" />
            <circle cx="20" cy="21" r="1" />
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
          </svg>
        </Link>

        {/* Notifications button */}
        <NotificationBell />

        {/* User Profile Chip with Interactive Dropdown */}
        <div className="af-header-user-wrapper" ref={dropdownRef}>
          <button
            type="button"
            className="af-header-user-chip-btn"
            onClick={() => setIsDropdownOpen((prev) => !prev)}
            aria-expanded={isDropdownOpen}
            aria-haspopup="true"
          >
            <div
              className="af-header-avatar"
              aria-label={`Profil de ${displayName}`}
            >
              {initials || "AF"}
            </div>

            <div className="af-header-user-info">
              <span className="af-header-user-name">{displayName}</span>
              <span className="af-header-user-email">
                {roleLabelMap[userRole] || userRole}
              </span>
            </div>

            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={`af-header-chevron ${isDropdownOpen ? "is-open" : ""}`}
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>

          {/* Floating Profile Dropdown Menu */}
          {isDropdownOpen && (
            <div className="af-header-dropdown" role="menu">
              <div className="af-dropdown-user-header">
                <strong>{displayName}</strong>
                <span>{userEmail || roleLabelMap[userRole]}</span>
                {verificationStatus && (
                  <div className="af-dropdown-verification-badge">
                    Statut : {verificationStatus === "approved" ? "Vérifié ✓" : verificationStatus === "pending" ? "En attente ⏳" : "Non vérifié"}
                  </div>
                )}
              </div>

              <div className="af-dropdown-divider" />

              <Link
                to={profilePath}
                className="af-dropdown-item"
                role="menuitem"
                onClick={() => setIsDropdownOpen(false)}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                Mon profil
              </Link>

              <Link
                to={verificationPath}
                className="af-dropdown-item"
                role="menuitem"
                onClick={() => setIsDropdownOpen(false)}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  <polyline points="9 12 11 14 15 10" />
                </svg>
                Vérification du compte
              </Link>

              <Link
                to="/products"
                className="af-dropdown-item"
                role="menuitem"
                onClick={() => setIsDropdownOpen(false)}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="9" cy="21" r="1" />
                  <circle cx="20" cy="21" r="1" />
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                </svg>
                Catalogue agricole
              </Link>

              <div className="af-dropdown-divider" />

              <button
                type="button"
                className="af-dropdown-item af-dropdown-item-danger"
                role="menuitem"
                onClick={handleLogout}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
                Se déconnecter
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
