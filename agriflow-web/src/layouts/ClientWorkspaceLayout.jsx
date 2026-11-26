import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import RoleWorkspaceLayout from "./RoleWorkspaceLayout";
import { selectUser } from "../features/auth/authSelectors";
import { selectCartCount } from "../features/orders/orderSelectors";

/**
 * ClientWorkspaceLayout — Layout dédié à l'espace Acheteur Professionnel (Phase 08)
 * Offre une expérience B2B moderne pour le sourcing direct auprès des exploitants agricoles.
 */
export default function ClientWorkspaceLayout() {
  const user = useSelector(selectUser);
  const cartCount = useSelector(selectCartCount);

  const clientNavigation = [
    {
      type: "section",
      label: "ACHATS & SOURCING",
    },
    {
      to: "/client/dashboard",
      label: "Tableau de bord",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="7" height="7" rx="1.5" />
          <rect x="14" y="3" width="7" height="7" rx="1.5" />
          <rect x="14" y="14" width="7" height="7" rx="1.5" />
          <rect x="3" y="14" width="7" height="7" rx="1.5" />
        </svg>
      ),
      end: true,
    },
    {
      to: "/products",
      label: "Catalogue agricole",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2L2 7l10 5 10-5-10-5z" />
          <path d="M2 17l10 5 10-5" />
          <path d="M2 12l10 5 10-5" />
        </svg>
      ),
    },
    {
      to: "/client/orders",
      label: "Mes commandes",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
          <line x1="3" y1="6" x2="21" y2="6" />
          <path d="M16 10a4 4 0 0 1-8 0" />
        </svg>
      ),
    },
    {
      to: "/client/inquiries",
      label: "Demandes & Négociations",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      ),
    },
    {
      to: "/client/cart",
      label: "Mon panier",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="9" cy="21" r="1" />
          <circle cx="20" cy="21" r="1" />
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
        </svg>
      ),
      badge: cartCount > 0 ? cartCount : undefined,
    },
    {
      type: "section",
      label: "ENTREPRISE & PROFIL",
    },
    {
      to: "/client/verification",
      label: "Vérification B2B",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <polyline points="9 12 11 14 15 10" />
        </svg>
      ),
    },
    {
      to: "/client/profile",
      label: "Profil entreprise",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      ),
    },
  ];

  return (
    <RoleWorkspaceLayout
      brand="AgriFlow"
      subtitle="Sourcing & Achats Pro"
      roleLabel="Acheteur Professionnel"
      navigationItems={clientNavigation}
      user={user}
    >
      <Outlet />
    </RoleWorkspaceLayout>
  );
}
