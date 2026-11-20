import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Button, Card } from "../common";

export default function HomeFarmerSection() {
    return (
        <section
            id="farmers"
            style={{
                backgroundColor: "var(--af-canvas, #F6F8F5)",
                padding: "96px 0",
            }}
        >
            <Container>
                <Row className="align-items-center g-5">
                    <Col lg={7}>
                        <div
                            className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill mb-3"
                            style={{
                                backgroundColor: "var(--af-green-100, #E8F2EC)",
                                color: "var(--af-green-900, #194638)",
                                fontSize: "0.78rem",
                                fontWeight: 700,
                                letterSpacing: "0.06em",
                            }}
                        >
                            ESPACE AGRICULTEURS & COOPÉRATIVES
                        </div>

                        <h2
                            className="fw-bold mb-3"
                            style={{
                                color: "var(--af-green-950, #15372F)",
                                fontSize: "clamp(2rem, 3.6vw, 2.7rem)",
                                lineHeight: 1.18,
                                letterSpacing: "-0.03em",
                            }}
                        >
                            Reprenez le contrôle sur la commercialisation de vos récoltes.
                        </h2>

                        <p
                            className="mb-4"
                            style={{
                                color: "var(--af-ink-600, #68756E)",
                                fontSize: "1.05rem",
                                lineHeight: 1.7,
                                maxWidth: "620px",
                            }}
                        >
                            AgriFlow donne aux exploitants et coopératives agricoles marocaines une vitrine numérique
                            directe pour publier leurs récoltes, définir leurs conditions de vente et toucher
                            des professionnels solvables sans dépendre des négociants informels.
                        </p>

                        <div className="d-flex flex-column gap-3 mb-4">
                            <Card className="p-3">
                                <div className="d-flex align-items-start gap-3">
                                    <span
                                        className="d-inline-flex align-items-center justify-content-center rounded-circle flex-shrink-0"
                                        style={{
                                            width: "30px",
                                            height: "30px",
                                            backgroundColor: "var(--af-green-900, #194638)",
                                            color: "#FFFFFF",
                                            fontWeight: 700,
                                            fontSize: "0.85rem",
                                        }}
                                    >
                                        01
                                    </span>
                                    <div>
                                        <div className="fw-bold" style={{ color: "var(--af-green-950, #15372F)", fontSize: "0.98rem" }}>
                                            Fixation 100% autonome des tarifs
                                        </div>
                                        <div className="small" style={{ color: "var(--af-ink-600, #68756E)", lineHeight: 1.5 }}>
                                            Fixez vos prix nets par cagette, kilo ou palette selon vos coûts réels de production.
                                        </div>
                                    </div>
                                </div>
                            </Card>

                            <Card className="p-3">
                                <div className="d-flex align-items-start gap-3">
                                    <span
                                        className="d-inline-flex align-items-center justify-content-center rounded-circle flex-shrink-0"
                                        style={{
                                            width: "30px",
                                            height: "30px",
                                            backgroundColor: "var(--af-green-900, #194638)",
                                            color: "#FFFFFF",
                                            fontWeight: 700,
                                            fontSize: "0.85rem",
                                        }}
                                    >
                                        02
                                    </span>
                                    <div>
                                        <div className="fw-bold" style={{ color: "var(--af-green-950, #15372F)", fontSize: "0.98rem" }}>
                                            Publication en temps réel des récoltes
                                        </div>
                                        <div className="small" style={{ color: "var(--af-ink-600, #68756E)", lineHeight: 1.5 }}>
                                            Mettez en ligne vos stocks immédiatement disponibles ou planifiez des pré-commandes de récoltes à venir.
                                        </div>
                                    </div>
                                </div>
                            </Card>

                            <Card className="p-3">
                                <div className="d-flex align-items-start gap-3">
                                    <span
                                        className="d-inline-flex align-items-center justify-content-center rounded-circle flex-shrink-0"
                                        style={{
                                            width: "30px",
                                            height: "30px",
                                            backgroundColor: "var(--af-green-900, #194638)",
                                            color: "#FFFFFF",
                                            fontWeight: 700,
                                            fontSize: "0.85rem",
                                        }}
                                    >
                                        03
                                    </span>
                                    <div>
                                        <div className="fw-bold" style={{ color: "var(--af-green-950, #15372F)", fontSize: "0.98rem" }}>
                                            Validation et garantie de profil
                                        </div>
                                        <div className="small" style={{ color: "var(--af-ink-600, #68756E)", lineHeight: 1.5 }}>
                                            Notre équipe vérifie votre statut agricole pour sécuriser vos relations commerciales.
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </div>

                        <Button
                            as={Link}
                            to="/register/farmer"
                            variant="primary"
                            pill
                            size="lg"
                        >
                            <span>Créer un compte Producteur</span>
                            <span className="ms-1">→</span>
                        </Button>
                    </Col>

                    {/* Right Column: Visual Summary Card */}
                    <Col lg={5}>
                        <div
                            className="p-4 p-md-5 rounded-4 text-white"
                            style={{
                                backgroundColor: "var(--af-green-950, #15372F)",
                                border: "1px solid rgba(226, 233, 227, 0.2)",
                                boxShadow: "0 18px 40px rgba(21, 55, 47, 0.16)",
                                position: "relative",
                                overflow: "hidden",
                            }}
                        >
                            <span
                                className="px-3 py-1 rounded-pill fw-bold mb-4 d-inline-block"
                                style={{
                                    backgroundColor: "rgba(255, 255, 255, 0.12)",
                                    color: "#A7F3D0",
                                    fontSize: "0.76rem",
                                    letterSpacing: "0.06em",
                                }}
                            >
                                ENGAGEMENT PRODUCTEUR
                            </span>

                            <h3 className="fw-bold mb-4" style={{ fontSize: "1.7rem", lineHeight: 1.25 }}>
                                Une relation commerciale saine et équitable.
                            </h3>

                            <div className="d-flex flex-column gap-3 mb-4">
                                <div className="border-bottom pb-3" style={{ borderColor: "rgba(255,255,255,0.12)" }}>
                                    <div className="text-uppercase fw-bold" style={{ color: "#A7F3D0", fontSize: "0.75rem" }}>
                                        Commission intermédiaire
                                    </div>
                                    <div className="fw-bold fs-4">0% de marge cachée</div>
                                    <div className="small" style={{ color: "#B8CFC3" }}>Le prix affiché est celui que vous percevez.</div>
                                </div>

                                <div className="border-bottom pb-3" style={{ borderColor: "rgba(255,255,255,0.12)" }}>
                                    <div className="text-uppercase fw-bold" style={{ color: "#A7F3D0", fontSize: "0.75rem" }}>
                                        Délai de validation
                                    </div>
                                    <div className="fw-bold fs-4">Moins de 24 heures</div>
                                    <div className="small" style={{ color: "#B8CFC3" }}>Examen rapide pour démarrer vos premières ventes.</div>
                                </div>

                                <div>
                                    <div className="text-uppercase fw-bold" style={{ color: "#A7F3D0", fontSize: "0.75rem" }}>
                                        Couverture territoriale
                                    </div>
                                    <div className="fw-bold fs-4">Toutes régions du Maroc</div>
                                    <div className="small" style={{ color: "#B8CFC3" }}>Connexion avec des acheteurs partout au Royaume.</div>
                                </div>
                            </div>

                            <div className="pt-2">
                                <Button
                                    as={Link}
                                    to="/register/farmer"
                                    variant="secondary"
                                    block
                                    pill
                                >
                                    Rejoindre le réseau de producteurs →
                                </Button>
                            </div>
                        </div>
                    </Col>
                </Row>
            </Container>
        </section>
    );
}
