import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import heroImg from "../../assets/hero.png";

export default function HomeHero() {
    return (
        <section
            id="hero"
            style={{
                backgroundColor: "var(--af-canvas, #F6F8F5)",
                padding: "8px 0 24px",
                maxHeight: "100vh",
                overflow: "hidden",
            }}
        >
            <Container>
                {/* Widescreen Hero Container strictly constrained within 100vh */}
                <div
                    style={{
                        position: "relative",
                        width: "100%",
                        height: "calc(100vh - 120px)",
                        maxHeight: "calc(100vh - 120px)",
                        minHeight: "520px",
                        borderRadius: "clamp(20px, 2.5vw, 32px)",
                        overflow: "hidden",
                        border: "1px solid rgba(226, 233, 227, 0.9)",
                        boxShadow: "0 18px 45px rgba(21, 55, 47, 0.1)",
                        backgroundColor: "#15372F",
                    }}
                >
                    {/* Background Agricultural Photograph */}
                    <img
                        src={heroImg}
                        alt="Exploitation agricole marocaine et récoltes en direct"
                        loading="eager"
                        style={{
                            position: "absolute",
                            inset: 0,
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            objectPosition: "center 38%",
                            display: "block",
                        }}
                    />

                    {/* Gradient Overlay for high text contrast and editorial polish */}
                    <div
                        style={{
                            position: "absolute",
                            inset: 0,
                            background:
                                "linear-gradient(180deg, rgba(21, 55, 47, 0.25) 0%, rgba(21, 55, 47, 0.65) 50%, rgba(21, 55, 47, 0.92) 100%)",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-between",
                            padding: "clamp(24px, 4vw, 48px)",
                        }}
                    >
                        {/* Top Tag */}
                        <div className="d-flex justify-content-between align-items-center">
                            <span
                                className="px-3 py-1 rounded-pill fw-bold"
                                style={{
                                    backgroundColor: "rgba(255, 255, 255, 0.2)",
                                    backdropFilter: "blur(12px)",
                                    WebkitBackdropFilter: "blur(12px)",
                                    color: "#FFFFFF",
                                    fontSize: "0.78rem",
                                    letterSpacing: "0.08em",
                                    border: "1px solid rgba(255, 255, 255, 0.25)",
                                }}
                            >
                                MAROC · CIRCUIT COURT AGRICOLE
                            </span>

                            <span
                                className="d-none d-md-inline-block px-3 py-1 rounded-pill"
                                style={{
                                    backgroundColor: "rgba(21, 55, 47, 0.4)",
                                    backdropFilter: "blur(10px)",
                                    color: "#A7F3D0",
                                    fontSize: "0.8rem",
                                    fontWeight: 600,
                                    border: "1px solid rgba(167, 243, 208, 0.2)",
                                }}
                            >
                                Souss-Massa · Saïss · Gharb · Haouz
                            </span>
                        </div>

                        {/* Bottom Content : Title, Subtitle, CTA Actions */}
                        <Row className="align-items-end g-4">
                            <Col lg={8} xl={7}>
                                <h1
                                    className="fw-bold text-white mb-3"
                                    style={{
                                        fontSize: "clamp(2rem, 4.2vw, 3.4rem)",
                                        lineHeight: 1.12,
                                        letterSpacing: "-0.035em",
                                        textShadow: "0 2px 10px rgba(0,0,0,0.3)",
                                    }}
                                >
                                    Le circuit court direct entre la terre et les professionnels.
                                </h1>

                                <p
                                    className="mb-4"
                                    style={{
                                        color: "#E2EDE6",
                                        fontSize: "clamp(0.95rem, 1.4vw, 1.12rem)",
                                        lineHeight: 1.6,
                                        maxWidth: "620px",
                                        textShadow: "0 1px 4px rgba(0,0,0,0.25)",
                                    }}
                                >
                                    AgriFlow relie les exploitants agricoles du Maroc aux commerçants,
                                    restaurateurs et acheteurs professionnels. Récoltes fraîches au juste prix,
                                    sans intermédiaire.
                                </p>

                                <div className="d-flex flex-wrap gap-3">
                                    <Link
                                        to="/products"
                                        className="text-decoration-none d-inline-flex align-items-center gap-2 rounded-pill px-4 py-3"
                                        style={{
                                            backgroundColor: "#FFFFFF",
                                            color: "#15372F",
                                            fontSize: "0.96rem",
                                            fontWeight: 700,
                                            boxShadow: "0 6px 18px rgba(0, 0, 0, 0.25)",
                                            transition: "all 180ms ease",
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.backgroundColor = "#F3F8F4";
                                            e.currentTarget.style.transform = "translateY(-1px)";
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.backgroundColor = "#FFFFFF";
                                            e.currentTarget.style.transform = "translateY(0)";
                                        }}
                                    >
                                        <span>Explorer les récoltes</span>
                                        <span style={{ fontSize: "1.1rem" }}>→</span>
                                    </Link>

                                    <Link
                                        to="/register/farmer"
                                        className="text-decoration-none d-inline-flex align-items-center rounded-pill px-4 py-3"
                                        style={{
                                            backgroundColor: "rgba(255, 255, 255, 0.15)",
                                            backdropFilter: "blur(10px)",
                                            WebkitBackdropFilter: "blur(10px)",
                                            color: "#FFFFFF",
                                            fontSize: "0.96rem",
                                            fontWeight: 600,
                                            border: "1px solid rgba(255, 255, 255, 0.35)",
                                            transition: "all 180ms ease",
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.28)";
                                            e.currentTarget.style.borderColor = "#FFFFFF";
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.15)";
                                            e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.35)";
                                        }}
                                    >
                                        Vendre mes récoltes
                                    </Link>
                                </div>
                            </Col>

                            <Col lg={4} xl={5} className="d-none d-lg-flex justify-content-end">
                                <div
                                    className="p-3 rounded-4"
                                    style={{
                                        backgroundColor: "rgba(255, 255, 255, 0.12)",
                                        backdropFilter: "blur(14px)",
                                        WebkitBackdropFilter: "blur(14px)",
                                        border: "1px solid rgba(255, 255, 255, 0.2)",
                                        color: "#FFFFFF",
                                        maxWidth: "280px",
                                    }}
                                >
                                    <div
                                        className="fw-bold mb-1"
                                        style={{ color: "#A7F3D0", fontSize: "0.82rem", textTransform: "uppercase", letterSpacing: "0.06em" }}
                                    >
                                        Garantie AgriFlow
                                    </div>
                                    <div className="small mb-0" style={{ color: "#E8F2EC", lineHeight: 1.5 }}>
                                        Exploitants vérifiés individuellement. Prix directs fixés par les producteurs.
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </div>
                </div>
            </Container>
        </section>
    );
}
