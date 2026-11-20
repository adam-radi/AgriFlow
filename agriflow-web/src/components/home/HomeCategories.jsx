import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import { SectionHeader, Card, Badge } from "../common";

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
                {/* Standardized Centered Header */}
                <SectionHeader
                    eyebrow="Filières Agricoles du Maroc"
                    title="Les terroirs et productions régionales"
                    subtitle="Naviguez au cœur des bassins agricoles du Royaume pour approvisionner votre établissement."
                    align="center"
                    className="mb-5"
                />

                <Row className="g-4">
                    {SECTORS.map((sector, index) => (
                        <Col key={index} xs={12} sm={6} lg={3}>
                            <Link
                                to="/products"
                                className="text-decoration-none d-block h-100"
                                style={{ color: "inherit" }}
                            >
                                <Card
                                    variant="interactive"
                                    className="p-3 h-100 d-flex flex-column"
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
                                            backgroundColor: "var(--af-green-100, #E8F2EC)",
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
                                            }}
                                        >
                                            <Badge variant="green" size="sm">
                                                {sector.tag}
                                            </Badge>
                                        </div>
                                    </div>

                                    <Card.Title as="h4" className="mb-2" style={{ fontSize: "1.1rem" }}>
                                        {sector.title}
                                    </Card.Title>

                                    <p
                                        className="small mb-3 flex-grow-1"
                                        style={{ color: "var(--af-ink-600, #68756E)", lineHeight: 1.55 }}
                                    >
                                        {sector.description}
                                    </p>

                                    <Card.Footer className="d-flex justify-content-between align-items-center">
                                        <span style={{ color: "var(--af-ink-600, #68756E)", fontSize: "0.8rem" }}>
                                            {sector.region}
                                        </span>
                                        <span className="fw-semibold" style={{ color: "var(--af-green-600, #398565)", fontSize: "0.82rem" }}>
                                            Explorer →
                                        </span>
                                    </Card.Footer>
                                </Card>
                            </Link>
                        </Col>
                    ))}
                </Row>
            </Container>
        </section>
    );
}
