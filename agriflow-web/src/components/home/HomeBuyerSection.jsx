import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function HomeBuyerSection() {
    return (
        <section
            id="buyers"
            style={{
                backgroundColor: "#FFFFFF",
                padding: "96px 0",
                borderTop: "1px solid #E2E9E3",
                borderBottom: "1px solid #E2E9E3",
            }}
        >
            <Container>
                <Row className="align-items-center g-5">
                    {/* Left Column: Visual summary cards for buyers */}
                    <Col lg={5} className="order-2 order-lg-1">
                        <div
                            className="p-4 p-md-5 rounded-4"
                            style={{
                                backgroundColor: "#F6F8F5",
                                border: "1px solid #E2E9E3",
                                boxShadow: "0 10px 30px rgba(21, 55, 47, 0.05)",
                            }}
                        >
                            <span
                                className="px-3 py-1 rounded-pill fw-bold mb-4 d-inline-block"
                                style={{
                                    backgroundColor: "#E8F2EC",
                                    color: "#194638",
                                    fontSize: "0.76rem",
                                    letterSpacing: "0.06em",
                                }}
                            >
                                COMMERCES & RESTAURATION
                            </span>

                            <h3 className="fw-bold mb-4" style={{ color: "#15372F", fontSize: "1.6rem", lineHeight: 1.25 }}>
                                La fraîcheur de la terre dans vos rayons et cuisines.
                            </h3>

                            <div className="d-flex flex-column gap-3 mb-4">
                                <div className="p-3 rounded-3" style={{ backgroundColor: "#FFFFFF", border: "1px solid #E2E9E3" }}>
                                    <div className="d-flex justify-content-between align-items-center mb-1">
                                        <div className="fw-bold" style={{ color: "#15372F", fontSize: "0.95rem" }}>
                                            Épiceries fines & Primeurs
                                        </div>
                                        <span className="small text-muted">Lots calibrés</span>
                                    </div>
                                    <div className="small" style={{ color: "#68756E" }}>
                                        Accédez aux meilleures variétés saisonnières pour satisfaire une clientèle exigeante.
                                    </div>
                                </div>

                                <div className="p-3 rounded-3" style={{ backgroundColor: "#FFFFFF", border: "1px solid #E2E9E3" }}>
                                    <div className="d-flex justify-content-between align-items-center mb-1">
                                        <div className="fw-bold" style={{ color: "#15372F", fontSize: "0.95rem" }}>
                                            Restaurateurs & Traiteurs
                                        </div>
                                        <span className="small text-muted">Direct exploitation</span>
                                    </div>
                                    <div className="small" style={{ color: "#68756E" }}>
                                        Maîtrisez vos coûts de matière première et assurez la traçabilité de vos ingrédients.
                                    </div>
                                </div>

                                <div className="p-3 rounded-3" style={{ backgroundColor: "#FFFFFF", border: "1px solid #E2E9E3" }}>
                                    <div className="d-flex justify-content-between align-items-center mb-1">
                                        <div className="fw-bold" style={{ color: "#15372F", fontSize: "0.95rem" }}>
                                            Marchés & Demi-Grossistes
                                        </div>
                                        <span className="small text-muted">Gros volumes</span>
                                    </div>
                                    <div className="small" style={{ color: "#68756E" }}>
                                        Commandez par palettes ou caisses entières avec logistique mutualisée.
                                    </div>
                                </div>
                            </div>

                            <Link
                                to="/products"
                                className="btn btn-outline-dark rounded-pill w-100 py-2 fw-bold text-center"
                                style={{
                                    borderColor: "#CBD7CE",
                                    color: "#15372F",
                                    fontSize: "0.92rem",
                                }}
                            >
                                Explorer le catalogue de récoltes →
                            </Link>
                        </div>
                    </Col>

                    {/* Right Column: Narrative & 3 core features */}
                    <Col lg={7} className="order-1 order-lg-2">
                        <div
                            className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill mb-3"
                            style={{
                                backgroundColor: "#E8F2EC",
                                color: "#194638",
                                fontSize: "0.78rem",
                                fontWeight: 700,
                                letterSpacing: "0.06em",
                            }}
                        >
                            ESPACE ACHETEURS PROFESSIONNELS
                        </div>

                        <h2
                            className="fw-bold mb-3"
                            style={{
                                color: "#15372F",
                                fontSize: "clamp(2rem, 3.6vw, 2.7rem)",
                                lineHeight: 1.18,
                                letterSpacing: "-0.03em",
                            }}
                        >
                            Sécurisez vos approvisionnements sans surprise.
                        </h2>

                        <p
                            className="mb-4"
                            style={{
                                color: "#68756E",
                                fontSize: "1.05rem",
                                lineHeight: 1.7,
                                maxWidth: "620px",
                            }}
                        >
                            Fini les intermédiaires multiples qui augmentent vos coûts et réduisent la fraîcheur de vos
                            produits. Commandez directement auprès des exploitants agricoles avec une visibilité
                            totale sur les lots et les plannings d&apos;expédition.
                        </p>

                        <div className="d-flex flex-column gap-3 mb-4">
                            <div className="p-3 rounded-4" style={{ backgroundColor: "#F6F8F5", border: "1px solid #E2E9E3" }}>
                                <div className="d-flex align-items-start gap-3">
                                    <span
                                        className="d-inline-flex align-items-center justify-content-center rounded-circle flex-shrink-0"
                                        style={{
                                            width: "30px",
                                            height: "30px",
                                            backgroundColor: "#398565",
                                            color: "#FFFFFF",
                                            fontWeight: 700,
                                            fontSize: "0.85rem",
                                        }}
                                    >
                                        01
                                    </span>
                                    <div>
                                        <div className="fw-bold" style={{ color: "#15372F", fontSize: "0.98rem" }}>
                                            Traçabilité totale par exploitation
                                        </div>
                                        <div className="small" style={{ color: "#68756E", lineHeight: 1.5 }}>
                                            Identité du producteur, région de culture et date de récolte visibles sur chaque fiche lot.
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="p-3 rounded-4" style={{ backgroundColor: "#F6F8F5", border: "1px solid #E2E9E3" }}>
                                <div className="d-flex align-items-start gap-3">
                                    <span
                                        className="d-inline-flex align-items-center justify-content-center rounded-circle flex-shrink-0"
                                        style={{
                                            width: "30px",
                                            height: "30px",
                                            backgroundColor: "#398565",
                                            color: "#FFFFFF",
                                            fontWeight: 700,
                                            fontSize: "0.85rem",
                                        }}
                                    >
                                        02
                                    </span>
                                    <div>
                                        <div className="fw-bold" style={{ color: "#15372F", fontSize: "0.98rem" }}>
                                            Prix nets au conditionnement
                                        </div>
                                        <div className="small" style={{ color: "#68756E", lineHeight: 1.5 }}>
                                            Des tarifs clairs en MAD au pack ou au kilo, fixés directement par les producteurs partenaires.
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="p-3 rounded-4" style={{ backgroundColor: "#F6F8F5", border: "1px solid #E2E9E3" }}>
                                <div className="d-flex align-items-start gap-3">
                                    <span
                                        className="d-inline-flex align-items-center justify-content-center rounded-circle flex-shrink-0"
                                        style={{
                                            width: "30px",
                                            height: "30px",
                                            backgroundColor: "#398565",
                                            color: "#FFFFFF",
                                            fontWeight: 700,
                                            fontSize: "0.85rem",
                                        }}
                                    >
                                        03
                                    </span>
                                    <div>
                                        <div className="fw-bold" style={{ color: "#15372F", fontSize: "0.98rem" }}>
                                            Logistique groupée et suivie
                                        </div>
                                        <div className="small" style={{ color: "#68756E", lineHeight: 1.5 }}>
                                            Livraison optimisée par zone géographique pour garantir la chaîne du frais.
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="d-flex flex-wrap gap-3">
                            <Link
                                to="/register/client"
                                className="text-decoration-none d-inline-flex align-items-center gap-2 rounded-pill px-4 py-3"
                                style={{
                                    backgroundColor: "#194638",
                                    color: "#FFFFFF",
                                    fontSize: "0.96rem",
                                    fontWeight: 700,
                                    boxShadow: "0 4px 14px rgba(25, 70, 56, 0.22)",
                                }}
                            >
                                <span>Créer un compte Acheteur Pro</span>
                                <span>→</span>
                            </Link>

                            <Link
                                to="/products"
                                className="text-decoration-none d-inline-flex align-items-center rounded-pill px-4 py-3"
                                style={{
                                    backgroundColor: "#FFFFFF",
                                    color: "#15372F",
                                    fontSize: "0.96rem",
                                    fontWeight: 600,
                                    border: "1px solid #CBD7CE",
                                }}
                            >
                                Consulter les récoltes
                            </Link>
                        </div>
                    </Col>
                </Row>
            </Container>
        </section>
    );
}
