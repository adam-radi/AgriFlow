import { useState } from "react";
import RoleSidebar from "../components/layout/RoleSidebar";
import RoleHeader from "../components/layout/RoleHeader";
import "../assets/role-layout.css";

export default function RoleWorkspaceLayout({
  children,
  brand = "AgriFlow",
  subtitle = "Plateforme agricole",
  roleLabel = "Espace utilisateur",
  navigationItems = [],
  pageTitle = "Tableau de bord",
  breadcrumbs = [],
  user = null,
  sidebarFooter = null,
  onNotificationsClick,
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  const toggleSidebar = () => {
    setSidebarOpen((current) => !current);
  };

  return (
    <div className="af-workspace-outer">
      <div className="af-workspace">
        <RoleSidebar
          brand={brand}
          subtitle={subtitle}
          roleLabel={roleLabel}
          items={navigationItems}
          footer={sidebarFooter}
          className={sidebarOpen ? "is-open" : ""}
          onNavigate={closeSidebar}
        />

        <button
          type="button"
          className="af-workspace-overlay"
          hidden={!sidebarOpen}
          onClick={closeSidebar}
          aria-label="Fermer le menu"
          tabIndex={sidebarOpen ? 0 : -1}
        />

        <div className="af-workspace-main">
          <RoleHeader
            title={pageTitle}
            breadcrumbs={breadcrumbs}
            user={user}
            onMenuClick={toggleSidebar}
            onNotificationsClick={onNotificationsClick}
          />

          <main className="af-workspace-content">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
