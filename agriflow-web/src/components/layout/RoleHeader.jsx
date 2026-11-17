
import React from "react";

export default function RoleHeader({
  title = "Tableau de bord",
  breadcrumbs = [],
  user = null,
  onMenuClick,
  onNotificationsClick,
}) {
  const displayName = user?.name || "Utilisateur";
  const userRole = user?.roleLabel || "Compte AgriFlow";

  const initials = displayName
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");

  return (
    <header className="af-role-header">
      <div className="af-role-header-left">
        <button
          type="button"
          className="af-role-header-menu-button"
          onClick={onMenuClick}
          aria-label="Ouvrir le menu de navigation"
          aria-controls="af-role-sidebar"
        >
          ☰
        </button>

        <div className="af-role-header-heading">
          <h1 className="af-role-header-title">
            {title}
          </h1>

          {breadcrumbs.length > 0 && (
            <nav
              className="af-role-header-breadcrumb"
              aria-label="Fil d'Ariane"
            >
              {breadcrumbs.map((item, index) => (
                <React.Fragment key={`${item}-${index}`}>
                  {index > 0 && <span aria-hidden="true">/</span>}

                  <span>{item}</span>
                </React.Fragment>
              ))}
            </nav>
          )}
        </div>
      </div>

      <div className="af-role-header-right">
        <button
          type="button"
          className="af-role-header-icon-button"
          onClick={onNotificationsClick}
          aria-label="Notifications"
          title="Notifications"
        >
          ♧
        </button>

        <div className="af-role-header-profile">
          <div
            className="af-role-header-avatar"
            aria-label={`Profil de ${displayName}`}
          >
            {initials || "U"}
          </div>

          <div className="af-role-header-user">
            <strong>{displayName}</strong>
            <span>{userRole}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
