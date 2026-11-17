
import React from "react";
import { NavLink } from "react-router-dom";
import Logo from "./Logo";

/**
 * RoleSidebar
 *
 * Sidebar réutilisable pour les espaces :
 * - Agriculteur
 * - Acheteur professionnel
 * - Administrateur
 *
 * Les routes sont transmises depuis le Layout parent.
 * Ce composant ne définit aucune route métier.
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
      {/* Brand */}
      <div className="af-sidebar-brand">
        <div className="af-sidebar-logo" aria-hidden="true">
          <Logo height={32} round className="sidebar-logo-img" />
        </div>

        <div className="af-sidebar-brand-content">
          <strong>{brand}</strong>
          <span>{subtitle}</span>
        </div>
      </div>

      {/* Role indicator */}
      <div className="af-sidebar-role">
        <span className="af-sidebar-role-label">
          ESPACE ACTUEL
        </span>

        <span className="af-sidebar-role-value">
          {roleLabel}
        </span>
      </div>

      {/* Navigation */}
      <nav className="af-sidebar-navigation">
        {items.map((item, index) => {
          if (item.type === "section") {
            return (
              <div
                key={`section-${index}`}
                className="af-sidebar-section"
              >
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
                <span className="af-sidebar-link-icon">
                  {item.icon}
                </span>
              )}

              <span className="af-sidebar-link-label">
                {item.label}
              </span>

              {item.badge !== undefined && (
                <span className="af-sidebar-link-badge">
                  {item.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer */}
      {footer && (
        <div className="af-sidebar-footer">
          {footer}
        </div>
      )}
    </aside>
  );
}
