import { NavLink, Link } from "react-router-dom";
import Logo from "./Logo";

/**
 * RoleSidebar
 *
 * Sidebar réutilisable pour les espaces :
 * - Agriculteur
 * - Acheteur professionnel
 * - Administrateur
 */
export default function RoleSidebar({
  brand = "AgriFlow",
  subtitle = "Plateforme agricole",
  roleLabel = "Espace utilisateur",
  items = [],
  footer,
  className = "",
  onNavigate,
}) {
  return (
    <aside
      className={`af-sidebar ${className}`.trim()}
      aria-label={`Navigation ${roleLabel}`}
    >
      {/* Brand Header */}
      <div className="af-sidebar-brand">
        <Link
          to="/"
          className="af-sidebar-logo-link"
          aria-label="Retour à l'accueil AgriFlow"
        >
          <Logo height={32} />
        </Link>

        <div className="af-sidebar-brand-content">
          <strong>{brand}</strong>
          <span>{subtitle}</span>
        </div>
      </div>

      {/* Navigation List */}
      <nav className="af-sidebar-navigation">
        {items.map((item, index) => {
          if (item.type === "section") {
            return (
              <div key={`section-${index}`} className="af-sidebar-section">
                {item.label}
              </div>
            );
          }

          if (!item.to) {
            return null;
          }

          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end ?? false}
              onClick={onNavigate}
              className={({ isActive }) =>
                [
                  "af-sidebar-link",
                  isActive ? "is-active" : "",
                  item.disabled ? "is-disabled" : "",
                ]
                  .filter(Boolean)
                  .join(" ")
              }
              aria-disabled={item.disabled || undefined}
              tabIndex={item.disabled ? -1 : undefined}
            >
              {item.icon && (
                <span className="af-sidebar-link-icon">{item.icon}</span>
              )}

              <span className="af-sidebar-link-label">{item.label}</span>

              {item.badge !== undefined && (
                <span className="af-sidebar-link-badge">{item.badge}</span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Sidebar Footer or Default Mobile App Promo Card */}
      {footer ? (
        <div className="af-sidebar-footer">{footer}</div>
      ) : (
        <div className="af-sidebar-promo-card">
          <div className="af-sidebar-promo-content">
            <div className="af-sidebar-promo-icon-wrap">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 2v13M19 9l-7 7-7-7" />
                <path d="M2 17l.62 2.48A2 2 0 0 0 4.56 21h14.88a2 2 0 0 0 1.94-1.52L22 17" />
              </svg>
            </div>
            <strong className="af-sidebar-promo-title">
              Application Mobile
            </strong>
            <p className="af-sidebar-promo-desc">
              Gérez vos récoltes et commandes partout.
            </p>
            <button
              type="button"
              className="af-sidebar-promo-btn"
              onClick={() => alert("L'application mobile AgriFlow arrive bientôt sur iOS et Android.")}
            >
              Télécharger
            </button>
          </div>
        </div>
      )}
    </aside>
  );
}
