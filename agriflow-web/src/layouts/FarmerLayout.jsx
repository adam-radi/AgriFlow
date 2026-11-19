import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import RoleWorkspaceLayout from "./RoleWorkspaceLayout";

/**
 * FarmerLayout — Layout de l'espace agriculteur (Phase 05)
 * Utilise RoleWorkspaceLayout (sidebar moderne + header rôle).
 * Un seul <Outlet /> — structure propre et unifiée.
 */

const farmerNavigation = [
    {
        type: "section",
        label: "Général",
    },
    {
        to: "/farmer/dashboard",
        label: "Tableau de bord",
        icon: "⌂",
        end: true,
    },
    {
        type: "section",
        label: "Gestion agricole",
    },
    {
        to: "/farmer/products",
        label: "Mes produits",
        icon: "◆",
    },
    {
        to: "/farmer/harvests",
        label: "Mes récoltes",
        icon: "✦",
    },
    {
        type: "section",
        label: "Activité",
    },
    {
        to: "/farmer/orders",
        label: "Commandes",
        icon: "◉",
    },
    {
        to: "/farmer/profile",
        label: "Mon profil",
        icon: "◎",
    },
];

function FarmerLayout() {
    const user = useSelector((state) => state.auth?.user);

    return (
        <RoleWorkspaceLayout
            brand="AgriFlow"
            subtitle="Plateforme agricole"
            roleLabel="Espace Agriculteur"
            navigationItems={farmerNavigation}
            pageTitle="Espace Agriculteur"
            breadcrumbs={["Accueil", "Agriculteur"]}
            user={{
                name: user?.name || "Agriculteur",
                roleLabel: "Exploitant agricole",
            }}
        >
            <Outlet />
        </RoleWorkspaceLayout>
    );
}

export default FarmerLayout;
