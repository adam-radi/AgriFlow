import { Link } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import logoImg from "../../assets/logo.png";

/**
 * HomeBrandIdentity — Section identité de marque AgriFlow
 *
 * Positionnée entre HomeHero et HomeFeaturedProducts.
 * Design Samsung One UI : sections claires, espacées, hiérarchie simple.
 * Présente la mission B2B et les deux publics (agriculteurs / acheteurs).
 */
export default function HomeBrandIdentity() {
    return (
        <section
            id="brand-identity"
            style={{
                backgroundColor: "#15372F",
                padding: "80px 0",
                overflow: "hidden",
                position: "relative",
            }}
        >
            {/* Motif décoratif SVG subtil */}
            <div
                aria-hidden="true"
                style={{
                    position: "absolute",
                    inset: 0,
                    backgroundImage:
                        "radial-gradient(circle at 20% 50%, rgba(57, 133, 101, 0.18) 0%, transparent 60%), radial-gradient(circle at 80% 50%, rgba(57, 133, 101, 0.12) 0%, transparent 60%)",
                    pointerEvents: "none",
                }}
            />

            <Container style={{ position: "relative", zIndex: 1 }}>
                {/* ── Logo + Accroche centrale ─────────────────────── */}
                <div className="text-center mb-5">
                    <div className="d-flex justify-content-center mb-4">
                        <img
                            src={logoImg}
                            alt="AgriFlow"
                            style={{
                                height: "52px",
                                width: "auto",
                                objectFit: "contain",
                                filter: "brightness(0) invert(1)",
                                opacity: 0.95,
                            }}
                        />
                    </div>

                    <h2
                        className="fw-bold text-white mb-3"
                        style={{
                            fontSize: "clamp(1.7rem, 3.5vw, 2.6rem)",
                            lineHeight: 1.2,
                            letterSpacing: "-0.025em",
                        }}
                    >
                        La marketplace agricole du circuit court
                    </h2>

                    <p
                        style={{
                            color: "#A7D4BD",
                            fontSize: "1.05rem",
                            lineHeight: 1.7,
                            maxWidth: "600px",
                            margin: "0 auto",
                        }}
                    >
                        AgriFlow connecte directement les exploitants agricoles marocains
                        aux acheteurs professionnels — sans intermédiaire spéculatif,
                        sans délai inutile.
                    </p>
                </div>

                {/* ── Deux cartes publics ───────────────────────────── */}
                <Row className="g-4 justify-content-center mb-5">
                    {/* Carte Agriculteur */}
                    <Col md={5}>
                        <div
                            className="p-4 rounded-4 h-100 d-flex flex-column"
                            style={{
                                backgroundColor: "rgba(255,255,255,0.07)",
                                border: "1px solid rgba(255,255,255,0.14)",
                                backdropFilter: "blur(8px)",
                            }}
                        >
                            <div
                                className="mb-3 d-inline-flex align-items-center justify-content-center rounded-3"
                                style={{
                                    width: "48px",
                                    height: "48px",
                                    backgroundColor: "rgba(57,133,101,0.3)",
                                    fontSize: "1.5rem",
                                }}
                            >
                                🌱
                            </div>

                            <div
                                className="fw-bold mb-1"
                                style={{
                                    color: "#6EE8A8",
                                    fontSize: "0.75rem",
                                    textTransform: "uppercase",
                                    letterSpacing: "0.08em",
                                }}
                            >
                                Je suis agriculteur
                            </div>

                            <h3
                                className="fw-bold text-white mb-2"
                                style={{ fontSize: "1.25rem", lineHeight: 1.3 }}
                            >
                                Vendre mes récoltes au juste prix
                            </h3>

                            <p
                                className="mb-4"
                                style={{ color: "#A7D4BD", fontSize: "0.9rem", lineHeight: 1.65, flexGrow: 1 }}
                            >
                                Publiez vos produits, fixez vos prix, gérez vos disponibilités
                                et recevez des demandes directement des professionnels.
                                Votre exploitation, votre tarif.
                            </p>

                            <Link
                                to="/register/farmer"
                                className="text-decoration-none d-inline-flex align-items-center gap-2 rounded-pill px-4 py-2 fw-semibold"
                                style={{
                                    backgroundColor: "rgba(110, 232, 168, 0.15)",
                                    color: "#6EE8A8",
                                    border: "1px solid rgba(110, 232, 168, 0.3)",
                                    fontSize: "0.9rem",
                                    alignSelf: "flex-start",
                                    transition: "all 160ms ease",
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = "rgba(110, 232, 168, 0.25)";
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = "rgba(110, 232, 168, 0.15)";
                                }}
                            >
                                Proposer mes récoltes →
                            </Link>
                        </div>
                    </Col>

                    {/* Carte Acheteur */}
                    <Col md={5}>
                        <div
                            className="p-4 rounded-4 h-100 d-flex flex-column"
                            style={{
                                backgroundColor: "rgba(255,255,255,0.07)",
                                border: "1px solid rgba(255,255,255,0.14)",
                                backdropFilter: "blur(8px)",
                            }}
                        >
                            <div
                                className="mb-3 d-inline-flex align-items-center justify-content-center rounded-3"
                                style={{
                                    width: "48px",
                                    height: "48px",
                                    backgroundColor: "rgba(57,133,101,0.3)",
                                    fontSize: "1.5rem",
                                }}
                            >
                                🏪
                            </div>

                            <div
                                className="fw-bold mb-1"
                                style={{
                                    color: "#6EE8A8",
                                    fontSize: "0.75rem",
                                    textTransform: "uppercase",
                                    letterSpacing: "0.08em",
                                }}
                            >
                                Je suis acheteur professionnel
                            </div>

                            <h3
                                className="fw-bold text-white mb-2"
                                style={{ fontSize: "1.25rem", lineHeight: 1.3 }}
                            >
                                Sourcer directement à la ferme
                            </h3>

                            <p
                                className="mb-4"
                                style={{ color: "#A7D4BD", fontSize: "0.9rem", lineHeight: 1.65, flexGrow: 1 }}
                            >
                                Accédez à des exploitants vérifiés, comparez les disponibilités
                                par région et envoyez vos demandes d'approvisionnement en quelques
                                clics. Accord direct, traçabilité garantie.
                            </p>

                            <Link
                                to="/register/client"
                                className="text-decoration-none d-inline-flex align-items-center gap-2 rounded-pill px-4 py-2 fw-semibold"
                                style={{
                                    backgroundColor: "rgba(110, 232, 168, 0.15)",
                                    color: "#6EE8A8",
                                    border: "1px solid rgba(110, 232, 168, 0.3)",
                                    fontSize: "0.9rem",
                                    alignSelf: "flex-start",
                                    transition: "all 160ms ease",
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = "rgba(110, 232, 168, 0.25)";
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = "rgba(110, 232, 168, 0.15)";
                                }}
                            >
                                Accéder au catalogue →
                            </Link>
                        </div>
                    </Col>
                </Row>

                {/* ── 3 piliers ────────────────────────────────────── */}
                <Row className="g-3 justify-content-center">
                    {[
                        { icon: "🔗", label: "Circuit court", desc: "Zéro intermédiaire entre la ferme et l'acheteur." },
                        { icon: "✅", label: "Exploitants vérifiés", desc: "Chaque producteur est validé individuellement par notre équipe." },
                        { icon: "📊", label: "Prix transparents", desc: "Le producteur fixe ses prix. Pas de commission cachée sur le marché." },
                    ].map(({ icon, label, desc }) => (
                        <Col xs={12} sm={4} key={label}>
                            <div className="text-center px-2 py-3">
                                <div
                                    className="mb-2 mx-auto d-flex align-items-center justify-content-center rounded-3"
                                    style={{
                                        width: "44px",
                                        height: "44px",
                                        backgroundColor: "rgba(57,133,101,0.25)",
                                        fontSize: "1.3rem",
                                    }}
                                >
                                    {icon}
                                </div>
                                <div
                                    className="fw-bold mb-1"
                                    style={{ color: "#FFFFFF", fontSize: "0.95rem" }}
                                >
                                    {label}
                                </div>
                                <p
                                    className="mb-0"
                                    style={{ color: "#7DB89A", fontSize: "0.82rem", lineHeight: 1.5 }}
                                >
                                    {desc}
                                </p>
                            </div>
                        </Col>
                    ))}
                </Row>
            </Container>
        </section>
    );
}
