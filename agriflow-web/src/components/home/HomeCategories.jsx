import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";

const SECTORS = [
    {
        title: "Agrumes & Vergers",
        description: "Oranges, clémentines de Berkane, citrons et fruits de saison gorgés de soleil.",
        region: "Souss-Massa & Gharb",
        tag: "Filière 01",
        image: "https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=400&q=80",
    },
    {
        title: "Huiles d'Olive & Argan",
        description: "Huiles d'olive extra-vierges de terroir et huile d'argan pure pressée à froid.",
        region: "Meknès, Taza & Taroudant",
        tag: "Filière 02",
        image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&q=80",
    },
    {
        title: "Maraîchage & Primeurs",
        description: "Tomates, poivrons, courgettes et oignons récoltés à maturité optimale.",
        region: "Chtouka & Saïss",
        tag: "Filière 03",
        image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&q=80",
    },
    {
        title: "Terroir & Légumineuses",
        description: "Dattes Medjool, amandes de l'Atlas, safran pur et légumineuses de tradition.",
        region: "Drâa-Tafilalet & Atlas",
        tag: "Filière 04",
        image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&q=80",
    },
];

export default function HomeCategories() {
    return (
        <section
            id="categories"
            style={{
                backgroundColor: "var(--af-canvas, #F6F8F5)",
                padding: "96px 0",
            }}
        >
            <Container>
                <div className="text-center mb-5" style={{ maxWidth: "680px", margin: "0 auto" }}>
                    <div
                        className="text-uppercase fw-bold mb-2"
                        style={{
                            color: "#398565",
                            fontSize: "0.78rem",
                            letterSpacing: "0.08em",
                        }}
                    >
                        FILIÈRES AGRICOLES DU MAROC
                    </div>
                    <h2
                        className="fw-bold mb-2"
                        style={{
                            color: "#15372F",
                            letterSpacing: "-0.03em",
                            fontSize: "clamp(1.8rem, 3.4vw, 2.5rem)",
                        }}
                    >
                        Les terroirs et productions régionales
                    </h2>
                    <p style={{ color: "#68756E", fontSize: "1rem" }}>
                        Naviguez au cœur des bassins agricoles du Royaume pour approvisionner votre établissement.
                    </p>
                </div>

                <Row className="g-4">
                    {SECTORS.map((sector, index) => (
                        <Col key={index} xs={12} sm={6} lg={3}>
                            <Link
                                to="/products"
                                className="text-decoration-none d-block h-100"
                                style={{ color: "inherit" }}
                            >
                                <div
                                    className="p-3 h-100 d-flex flex-column"
                                    style={{
                                        backgroundColor: "#FFFFFF",
                                        borderRadius: "22px",
                                        border: "1px solid #E2E9E3",
                                        boxShadow: "0 2px 8px rgba(21, 55, 47, 0.04)",
                                        transition: "transform 180ms ease, box-shadow 180ms ease, border-color 180ms ease",
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = "translateY(-4px)";
                                        e.currentTarget.style.boxShadow = "0 14px 28px rgba(21, 55, 47, 0.08)";
                                        e.currentTarget.style.borderColor = "#CBD7CE";
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = "translateY(0)";
                                        e.currentTarget.style.boxShadow = "0 2px 8px rgba(21, 55, 47, 0.04)";
                                        e.currentTarget.style.borderColor = "#E2E9E3";
                                    }}
                                >
                                    {/* Thumbnail Image */}
                                    <div
                                        style={{
                                            width: "100%",
                                            height: "140px",
                                            borderRadius: "16px",
                                            overflow: "hidden",
                                            marginBottom: "16px",
                                            position: "relative",
                                            backgroundColor: "#E8F2EC",
                                        }}
                                    >
                                        <img
                                            src={sector.image}
                                            alt={sector.title}
                                            loading="lazy"
                                            style={{
                                                width: "100%",
                                                height: "100%",
                                                objectFit: "cover",
                                                display: "block",
                                            }}
                                        />
                                        <div
                                            style={{
                                                position: "absolute",
                                                top: "8px",
                                                left: "8px",
                                                padding: "3px 8px",
                                                backgroundColor: "rgba(21, 55, 47, 0.75)",
                                                backdropFilter: "blur(4px)",
                                                color: "#FFFFFF",
                                                borderRadius: "999px",
                                                fontSize: "0.68rem",
                                                fontWeight: 700,
                                            }}
                                        >
                                            {sector.tag}
                                        </div>
                                    </div>

                                    <h4
                                        className="fw-bold mb-2"
                                        style={{
                                            color: "#15372F",
                                            fontSize: "1.1rem",
                                            letterSpacing: "-0.01em",
                                        }}
                                    >
                                        {sector.title}
                                    </h4>

                                    <p
                                        className="small mb-3 flex-grow-1"
                                        style={{ color: "#68756E", lineHeight: 1.55 }}
                                    >
                                        {sector.description}
                                    </p>

                                    <div
                                        className="pt-2 border-top mt-auto d-flex justify-content-between align-items-center"
                                        style={{ borderColor: "#F0F3EF", fontSize: "0.8rem" }}
                                    >
                                        <span style={{ color: "#68756E" }}>{sector.region}</span>
                                        <span className="fw-semibold" style={{ color: "#398565" }}>
                                            Explorer →
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        </Col>
                    ))}
                </Row>
            </Container>
        </section>
    );
}
