import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import Logo from "./Logo";

export default function Footer() {
    return (
        <footer
            style={{
                backgroundColor: "#15372F",
                color: "#E8F2EC",
                borderTop: "1px solid rgba(255, 255, 255, 0.08)",
            }}
        >
            <Container className="py-5">
                <Row className="g-4">
                    <Col md={5} lg={4}>
                        <div className="d-flex align-items-center gap-2 mb-3">
                            <Logo height={30} alt="AgriFlow Logo" />
                            <span
                                style={{
                                    fontSize: "1.25rem",
                                    fontWeight: 800,
                                    letterSpacing: "-0.02em",
                                    color: "#FFFFFF",
                                }}
                            >
                                Agri<span style={{ color: "#398565" }}>Flow</span>
                            </span>
                        </div>
                        <p
                            style={{
                                fontSize: "0.9rem",
                                color: "#B8CFC3",
                                lineHeight: 1.65,
                                maxWidth: 360,
                            }}
                        >
                            La plateforme marocaine qui relie directement les producteurs agricoles locaux
                            aux acheteurs professionnels. Produits frais, prix transparents et logistique optimisée.
                        </p>
                        <div
                            className="d-inline-flex align-items-center px-3 py-1 rounded-pill"
                            style={{
                                backgroundColor: "rgba(255, 255, 255, 0.06)",
                                fontSize: "0.78rem",
                                color: "#A5C2B3",
                                border: "1px solid rgba(255, 255, 255, 0.1)",
                            }}
                        >
                            <span>Déployé au Maroc · Agadir, Souss-Massa & Régions</span>
                        </div>
                    </Col>

                    <Col sm={6} md={3} lg={3}>
                        <h6
                            className="fw-bold mb-3"
                            style={{
                                fontSize: "0.85rem",
                                textTransform: "uppercase",
                                letterSpacing: "0.08em",
                                color: "#FFFFFF",
                            }}
                        >
                            Navigation
                        </h6>
                        <ul className="list-unstyled d-flex flex-column gap-2 mb-0" style={{ fontSize: "0.9rem" }}>
                            <li>
                                <Link to="/" style={{ color: "#C8DED4", textDecoration: "none" }}>
                                    Accueil
                                </Link>
                            </li>
                            <li>
                                <Link to="/products" style={{ color: "#C8DED4", textDecoration: "none" }}>
                                    Catalogue des récoltes
                                </Link>
                            </li>
                            <li>
                                <Link to="/register/farmer" style={{ color: "#C8DED4", textDecoration: "none" }}>
                                    Rejoindre comme Agriculteur
                                </Link>
                            </li>
                            <li>
                                <Link to="/register/client" style={{ color: "#C8DED4", textDecoration: "none" }}>
                                    Créer un compte Acheteur
                                </Link>
                            </li>
                            <li>
                                <Link to="/login" style={{ color: "#C8DED4", textDecoration: "none" }}>
                                    Espace de connexion
                                </Link>
                            </li>
                        </ul>
                    </Col>

                    <Col sm={6} md={4} lg={3}>
                        <h6
                            className="fw-bold mb-3"
                            style={{
                                fontSize: "0.85rem",
                                textTransform: "uppercase",
                                letterSpacing: "0.08em",
                                color: "#FFFFFF",
                            }}
                        >
                            Engagements & Confiance
                        </h6>
                        <ul className="list-unstyled d-flex flex-column gap-2 mb-0" style={{ fontSize: "0.88rem", color: "#B8CFC3" }}>
                            <li className="d-flex align-items-start gap-2">
                                <span style={{ color: "#398565", fontWeight: 700 }}>—</span>
                                <span>Producteurs et exploitations validés</span>
                            </li>
                            <li className="d-flex align-items-start gap-2">
                                <span style={{ color: "#398565", fontWeight: 700 }}>—</span>
                                <span>Circuits courts directs, zéro intermédiaire</span>
                            </li>
                            <li className="d-flex align-items-start gap-2">
                                <span style={{ color: "#398565", fontWeight: 700 }}>—</span>
                                <span>Regroupement et expédition par zone</span>
                            </li>
                        </ul>
                    </Col>

                    <Col md={12} lg={2}>
                        <h6
                            className="fw-bold mb-3"
                            style={{
                                fontSize: "0.85rem",
                                textTransform: "uppercase",
                                letterSpacing: "0.08em",
                                color: "#FFFFFF",
                            }}
                        >
                            Support
                        </h6>
                        <div style={{ fontSize: "0.88rem", color: "#B8CFC3", lineHeight: 1.7 }}>
                            <div>contact@agriflow.ma</div>
                            <div className="mt-1">Agadir, Maroc</div>
                            <div className="mt-2" style={{ fontSize: "0.8rem", color: "#8DA89B" }}>
                                Lun – Ven · 08h30 – 18h00
                            </div>
                        </div>
                    </Col>
                </Row>
            </Container>

            <div style={{ borderTop: "1px solid rgba(255, 255, 255, 0.08)", fontSize: "0.82rem", color: "#8DA89B" }}>
                <Container className="py-3 d-flex flex-column flex-sm-row justify-content-between align-items-center gap-2">
                    <div>
                        &copy; {new Date().getFullYear()} AgriFlow Maroc. Tous droits réservés.
                    </div>
                    <div className="d-flex gap-3">
                        <Link to="/products" style={{ color: "#8DA89B", textDecoration: "none" }}>
                            Catalogue
                        </Link>
                        <span>·</span>
                        <Link to="/login" style={{ color: "#8DA89B", textDecoration: "none" }}>
                            Connexion
                        </Link>
                    </div>
                </Container>
            </div>
        </footer>
    );
}
