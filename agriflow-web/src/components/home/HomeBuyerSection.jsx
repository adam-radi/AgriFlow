import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Button, Card, Badge } from "../common";

/**
 * HomeBuyerSection — Espace dédié aux acheteurs professionnels
 * Stylisé selon le Design System AgriFlow (cartes unifiées, badges, boutons accessibles).
 */
export default function HomeBuyerSection() {
    return (
        <section
            id="buyers"
            style={{
                backgroundColor: "var(--af-surface, #FFFFFF)",
                padding: "96px 0",
                borderTop: "1px solid var(--af-border, #E2E9E3)",
                borderBottom: "1px solid var(--af-border, #E2E9E3)",
            }}
        >
            <Container>
                <Row className="align-items-center g-5">
                    {/* Left Column: Visual summary cards for buyers */}
                    <Col lg={5} className="order-2 order-lg-1">
                        <Card
                            className="p-4 p-md-5"
                            style={{
                                backgroundColor: "var(--af-canvas, #F6F8F5)",
                                border: "1px solid var(--af-border, #E2E9E3)",
                            }}
                        >
                            <div className="mb-4">
                                <Badge variant="green">
                                    COMMERCES & RESTAURATION
                                </Badge>
                            </div>

                            <h3
                                className="fw-bold mb-4"
                                style={{
                                    color: "var(--af-green-950, #15372F)",
                                    fontSize: "1.6rem",
                                    lineHeight: 1.25,
                                }}
                            >
                                La fraîcheur de la terre dans vos rayons et cuisines.
                            </h3>

                            <div className="d-flex flex-column gap-3 mb-4">
                                <Card className="p-3" style={{ backgroundColor: "var(--af-surface, #FFFFFF)" }}>
                                    <div className="d-flex justify-content-between align-items-center mb-1">
                                        <div className="fw-bold" style={{ color: "var(--af-green-950, #15372F)", fontSize: "0.95rem" }}>
                                            Épiceries fines & Primeurs
                                        </div>
                                        <span className="small text-muted">Lots calibrés</span>
                                    </div>
                                    <div className="small" style={{ color: "var(--af-ink-600, #68756E)" }}>
                                        Accédez aux meilleures variétés saisonnières pour satisfaire une clientèle exigeante.
                                    </div>
                                </Card>

                                <Card className="p-3" style={{ backgroundColor: "var(--af-surface, #FFFFFF)" }}>
                                    <div className="d-flex justify-content-between align-items-center mb-1">
                                        <div className="fw-bold" style={{ color: "var(--af-green-950, #15372F)", fontSize: "0.95rem" }}>
                                            Restaurateurs & Traiteurs
                                        </div>
                                        <span className="small text-muted">Direct exploitation</span>
                                    </div>
                                    <div className="small" style={{ color: "var(--af-ink-600, #68756E)" }}>
                                        Maîtrisez vos coûts de matière première et assurez la traçabilité de vos ingrédients.
                                    </div>
                                </Card>

                                <Card className="p-3" style={{ backgroundColor: "var(--af-surface, #FFFFFF)" }}>
                                    <div className="d-flex justify-content-between align-items-center mb-1">
                                        <div className="fw-bold" style={{ color: "var(--af-green-950, #15372F)", fontSize: "0.95rem" }}>
                                            Marchés & Demi-Grossistes
                                        </div>
                                        <span className="small text-muted">Gros volumes</span>
                                    </div>
                                    <div className="small" style={{ color: "var(--af-ink-600, #68756E)" }}>
                                        Commandez par palettes ou caisses entières avec logistique mutualisée.
                                    </div>
                                </Card>
                            </div>

                            <Button
                                as={Link}
                                to="/products"
                                variant="outline"
                                pill
                                className="w-100 py-2 text-center"
                            >
                                Explorer le catalogue de récoltes →
                            </Button>
                        </Card>
                    </Col>

                    {/* Right Column: Narrative & 3 core features */}
                    <Col lg={7} className="order-1 order-lg-2">
                        <div className="mb-3">
                            <Badge variant="green">
                                ESPACE ACHETEURS PROFESSIONNELS
                            </Badge>
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
                            Sécurisez vos approvisionnements sans surprise.
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
                            Fini les intermédiaires multiples qui augmentent vos coûts et réduisent la fraîcheur de vos
                            produits. Commandez directement auprès des exploitants agricoles avec une visibilité
                            totale sur les lots et les plannings d&apos;expédition.
                        </p>

                        <div className="d-flex flex-column gap-3 mb-4">
                            <Card className="p-3">
                                <div className="d-flex align-items-start gap-3">
                                    <span
                                        className="d-inline-flex align-items-center justify-content-center rounded-circle flex-shrink-0"
                                        style={{
                                            width: "30px",
                                            height: "30px",
                                            backgroundColor: "var(--af-green-700, #398565)",
                                            color: "#FFFFFF",
                                            fontWeight: 700,
                                            fontSize: "0.85rem",
                                        }}
                                    >
                                        01
                                    </span>
                                    <div>
                                        <div className="fw-bold" style={{ color: "var(--af-green-950, #15372F)", fontSize: "0.98rem" }}>
                                            Traçabilité totale par exploitation
                                        </div>
                                        <div className="small" style={{ color: "var(--af-ink-600, #68756E)", lineHeight: 1.5 }}>
                                            Identité du producteur, région de culture et date de récolte visibles sur chaque fiche lot.
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
                                            backgroundColor: "var(--af-green-700, #398565)",
                                            color: "#FFFFFF",
                                            fontWeight: 700,
                                            fontSize: "0.85rem",
                                        }}
                                    >
                                        02
                                    </span>
                                    <div>
                                        <div className="fw-bold" style={{ color: "var(--af-green-950, #15372F)", fontSize: "0.98rem" }}>
                                            Prix nets au conditionnement
                                        </div>
                                        <div className="small" style={{ color: "var(--af-ink-600, #68756E)", lineHeight: 1.5 }}>
                                            Des tarifs clairs en MAD au pack ou au kilo, fixés directement par les producteurs partenaires.
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
                                            backgroundColor: "var(--af-green-700, #398565)",
                                            color: "#FFFFFF",
                                            fontWeight: 700,
                                            fontSize: "0.85rem",
                                        }}
                                    >
                                        03
                                    </span>
                                    <div>
                                        <div className="fw-bold" style={{ color: "var(--af-green-950, #15372F)", fontSize: "0.98rem" }}>
                                            Logistique groupée et suivie
                                        </div>
                                        <div className="small" style={{ color: "var(--af-ink-600, #68756E)", lineHeight: 1.5 }}>
                                            Livraison optimisée par zone géographique pour garantir la chaîne du frais.
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </div>

                        <div className="d-flex flex-wrap gap-3">
                            <Button
                                as={Link}
                                to="/register/client"
                                variant="primary"
                                pill
                                size="lg"
                            >
                                Créer un compte Acheteur Pro →
                            </Button>

                            <Button
                                as={Link}
                                to="/products"
                                variant="secondary"
                                pill
                                size="lg"
                            >
                                Consulter les récoltes
                            </Button>
                        </div>
                    </Col>
                </Row>
            </Container>
        </section>
    );
}
