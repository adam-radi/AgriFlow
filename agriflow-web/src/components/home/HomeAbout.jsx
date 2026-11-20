import { Container, Row, Col } from "react-bootstrap";
import heroImg from "../../assets/hero.png";
import { Card } from "../common";

export default function HomeAbout() {
    return (
        <section
            id="about"
            style={{
                backgroundColor: "#FFFFFF",
                padding: "96px 0",
                borderTop: "1px solid var(--af-border, #E2E9E3)",
                borderBottom: "1px solid var(--af-border, #E2E9E3)",
            }}
        >
            <Container>
                <Row className="g-5 align-items-center">
                    {/* Left Column: Heading, manifesto, and 2 visual photo cards */}
                    <Col lg={5}>
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
                            NOTRE MISSION
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
                            Ce qui rend AgriFlow différent.
                        </h2>

                        <p
                            className="mb-4"
                            style={{
                                color: "var(--af-ink-600, #68756E)",
                                fontSize: "1.05rem",
                                lineHeight: 1.7,
                            }}
                        >
                            Nous éliminons les intermédiaires spéculatifs pour créer un lien direct et équitable
                            entre les exploitants agricoles marocains et les professionnels de l&apos;alimentation.
                        </p>

                        {/* 2 Authentic Photo Thumbnails */}
                        <div className="d-flex gap-3 pt-2">
                            <div
                                style={{
                                    width: "140px",
                                    height: "105px",
                                    borderRadius: "18px",
                                    overflow: "hidden",
                                    position: "relative",
                                    boxShadow: "0 6px 16px rgba(21, 55, 47, 0.08)",
                                    border: "1px solid var(--af-border, #E2E9E3)",
                                }}
                            >
                                <img
                                    src={heroImg}
                                    alt="Terroir maraîcher marocain"
                                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                />
                                <div
                                    style={{
                                        position: "absolute",
                                        bottom: 0,
                                        insetInline: 0,
                                        padding: "4px 8px",
                                        backgroundColor: "rgba(21, 55, 47, 0.8)",
                                        color: "#FFFFFF",
                                        fontSize: "0.72rem",
                                        fontWeight: 600,
                                        textAlign: "center",
                                    }}
                                >
                                    Plein champ
                                </div>
                            </div>

                            <div
                                style={{
                                    width: "140px",
                                    height: "105px",
                                    borderRadius: "18px",
                                    overflow: "hidden",
                                    position: "relative",
                                    boxShadow: "0 6px 16px rgba(21, 55, 47, 0.08)",
                                    border: "1px solid var(--af-border, #E2E9E3)",
                                }}
                            >
                                <img
                                    src="https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=400&q=80"
                                    alt="Cagettes de récoltes fraîches calibrées"
                                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                />
                                <div
                                    style={{
                                        position: "absolute",
                                        bottom: 0,
                                        insetInline: 0,
                                        padding: "4px 8px",
                                        backgroundColor: "rgba(21, 55, 47, 0.8)",
                                        color: "#FFFFFF",
                                        fontSize: "0.72rem",
                                        fontWeight: 600,
                                        textAlign: "center",
                                    }}
                                >
                                    Lots calibrés
                                </div>
                            </div>
                        </div>
                    </Col>

                    {/* Right Column: 4 Distinctive Cards using shared Card */}
                    <Col lg={7}>
                        <Row className="g-3">
                            <Col sm={6}>
                                <Card variant="muted" className="p-4 h-100">
                                    <div
                                        className="fw-bold mb-1"
                                        style={{ color: "var(--af-green-600, #398565)", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.06em" }}
                                    >
                                        01 · Transparence
                                    </div>
                                    <h4 className="fw-bold mb-2" style={{ color: "var(--af-green-950, #15372F)", fontSize: "1.1rem" }}>
                                        Origine Directe Producteur
                                    </h4>
                                    <p className="small mb-0" style={{ color: "var(--af-ink-600, #68756E)", lineHeight: 1.6 }}>
                                        Chaque lot est rattaché à une exploitation réelle certifiée par notre équipe. Pas d&apos;intermédiaire dissimulé.
                                    </p>
                                </Card>
                            </Col>

                            <Col sm={6}>
                                <Card variant="muted" className="p-4 h-100">
                                    <div
                                        className="fw-bold mb-1"
                                        style={{ color: "var(--af-green-600, #398565)", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.06em" }}
                                    >
                                        02 · Équité
                                    </div>
                                    <h4 className="fw-bold mb-2" style={{ color: "var(--af-green-950, #15372F)", fontSize: "1.1rem" }}>
                                        Tarification Libre & Juste
                                    </h4>
                                    <p className="small mb-0" style={{ color: "var(--af-ink-600, #68756E)", lineHeight: 1.6 }}>
                                        Les agriculteurs fixent eux-mêmes leurs prix au pack ou au kilo. La marge commerciale reste entre les acteurs réels.
                                    </p>
                                </Card>
                            </Col>

                            <Col sm={6}>
                                <Card variant="muted" className="p-4 h-100">
                                    <div
                                        className="fw-bold mb-1"
                                        style={{ color: "var(--af-green-600, #398565)", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.06em" }}
                                    >
                                        03 · Qualité
                                    </div>
                                    <h4 className="fw-bold mb-2" style={{ color: "var(--af-green-950, #15372F)", fontSize: "1.1rem" }}>
                                        Fraîcheur à Maturité
                                    </h4>
                                    <p className="small mb-0" style={{ color: "var(--af-ink-600, #68756E)", lineHeight: 1.6 }}>
                                        Les récoltes sont cueillies au bon moment et acheminées sans passage prolongé par des hangars de stockage spéculatifs.
                                    </p>
                                </Card>
                            </Col>

                            <Col sm={6}>
                                <Card variant="muted" className="p-4 h-100">
                                    <div
                                        className="fw-bold mb-1"
                                        style={{ color: "var(--af-green-600, #398565)", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.06em" }}
                                    >
                                        04 · Logistique
                                    </div>
                                    <h4 className="fw-bold mb-2" style={{ color: "var(--af-green-950, #15372F)", fontSize: "1.1rem" }}>
                                        Groupage par Zone
                                    </h4>
                                    <p className="small mb-0" style={{ color: "var(--af-ink-600, #68756E)", lineHeight: 1.6 }}>
                                        Organisation intelligente des tournées par zone géographique pour réduire les coûts d&apos;acheminement et les délais.
                                    </p>
                                </Card>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Container>
        </section>
    );
}
