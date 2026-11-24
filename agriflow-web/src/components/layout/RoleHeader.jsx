import { useState } from "react";

export default function RoleHeader({
  user = null,
  onMenuClick,
  onNotificationsClick,
}) {
  const [searchQuery, setSearchQuery] = useState("");

  const displayName = user?.name || "Karim Benali";
  const userEmail = user?.email || "karim.benali@agriflow.ma";
  const userRole = user?.roleLabel || "Exploitant agricole";

  const initials = displayName
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");

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

        <div className="af-role-header-search">
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
            placeholder="Rechercher une tâche, récolte, commande..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Rechercher dans l'espace"
          />

          <kbd className="af-search-kbd" title="Raccourci recherche">
            ⌘F
          </kbd>
        </div>
      </div>

      {/* Right side: Actions (Mail, Notifications) + User Profile */}
      <div className="af-role-header-right">
        {/* Messages / Mail */}
        <button
          type="button"
          className="af-header-icon-btn"
          aria-label="Messages et correspondance"
          title="Messagerie"
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
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
            <polyline points="22,6 12,13 2,6" />
          </svg>
        </button>

        {/* Notifications */}
        <button
          type="button"
          className="af-header-icon-btn"
          onClick={onNotificationsClick}
          aria-label="Notifications"
          title="Notifications"
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
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
          <span className="af-header-notif-dot" />
        </button>

        {/* User Profile Chip */}
        <div className="af-header-user-chip">
          <div
            className="af-header-avatar"
            aria-label={`Profil de ${displayName}`}
          >
            {initials || "AG"}
          </div>

          <div className="af-header-user-info">
            <span className="af-header-user-name">{displayName}</span>
            <span className="af-header-user-email">{userEmail || userRole}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
