import { Outlet } from "react-router-dom";
import { Row, Col } from "react-bootstrap";
import Navbar from "../components/layout/Navbar";
import FarmerSidebar from "../components/farmer/FarmerSidebar";
import RoleWorkspaceLayout from "./RoleWorkspaceLayout";

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
    icon: "▦",
  },
  {
    to: "/farmer/harvests",
    label: "Mes récoltes",
    icon: "♧",
  },
  {
    type: "section",
    label: "Activité",
  },
  {
    to: "/farmer/orders",
    label: "Commandes",
    icon: "▤",
  },
  {
    to: "/farmer/profile",
    label: "Mon profil",
    icon: "◉",
  },
];



function FarmerLayout() {
      const user = {
    name: "Agriculteur",
    roleLabel: "Espace agriculteur",
  };

    return (
        <div>
            <Navbar />
            <div className="container-fluid">
                <Row className="g-0" style={{ minHeight: "calc(100vh - 73px)" }}>
                    <Col xs={2} className="bg-light border-end" style={{ minWidth: 220 }}>
                        <FarmerSidebar />
                    </Col>
                    <Col style={{ overflow: "auto", backgroundColor: "#f8f9fa" }}>
                        <Outlet />
                    </Col>
                </Row>
            </div>
              <RoleWorkspaceLayout
      brand="AgriFlow"
      subtitle="Plateforme agricole"
      roleLabel="Agriculteur"
      navigationItems={farmerNavigation}
      pageTitle="Espace agriculteur"
      breadcrumbs={["Accueil", "Agriculteur"]}
      user={user}
    >
      <Outlet />
    </RoleWorkspaceLayout>

        </div>
    );
}

export default FarmerLayout;