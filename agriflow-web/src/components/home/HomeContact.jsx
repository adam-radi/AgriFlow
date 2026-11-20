import { useState } from "react";
import { Container, Row, Col, Alert } from "react-bootstrap";
import { Button, Card, Badge, Input, Select } from "../common";

const PROFILE_OPTIONS = [
    { value: "buyer", label: "Acheteur Professionnel / Commerce" },
    { value: "farmer", label: "Agriculteur / Exploitant / Coopérative" },
    { value: "delivery", label: "Partenaire Logistique / Livreur" },
    { value: "other", label: "Autre demande" },
];

/**
 * HomeContact — Section Contact & Support
 * Intègre les composants partagés du Design System (Input, Select, Button, Card, Badge).
 */
export default function HomeContact() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        profileType: "buyer",
        subject: "",
        message: "",
    });
    const [status, setStatus] = useState({ state: "idle", message: "" });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formData.name || !formData.email || !formData.message) {
            setStatus({
                state: "error",
                message: "Veuillez renseigner tous les champs obligatoires (nom, email et message).",
            });
            return;
        }

        setIsSubmitting(true);
        // Simulation propre côté frontend (prêt pour raccordement API future POST /api/contact)
        setTimeout(() => {
            setIsSubmitting(false);
            setStatus({
                state: "success",
                message:
                    "Votre message a bien été envoyé. Notre équipe à Agadir vous répondra dans les plus brefs délais à l'adresse indiquée.",
            });
            setFormData({
                name: "",
                email: "",
                profileType: "buyer",
                subject: "",
                message: "",
            });
        }, 500);
    };

    return (
        <section
            id="contact"
            style={{
                backgroundColor: "var(--af-canvas, #F6F8F5)",
                padding: "88px 0",
            }}
        >
            <Container>
                <Row className="g-5">
                    {/* Left Column: Contact details & Support context */}
                    <Col lg={5}>
                        <div className="mb-3">
                            <Badge variant="green">
                                CONTACT & SUPPORT
                            </Badge>
                        </div>

                        <h2
                            className="fw-bold mb-3"
                            style={{
                                color: "var(--af-green-950, #15372F)",
                                fontSize: "clamp(1.9rem, 3.5vw, 2.5rem)",
                                lineHeight: 1.2,
                                letterSpacing: "-0.03em",
                            }}
                        >
                            Une question sur la plateforme ? Notre équipe vous accompagne.
                        </h2>

                        <p
                            className="mb-4"
                            style={{
                                color: "var(--af-ink-600, #68756E)",
                                fontSize: "1.05rem",
                                lineHeight: 1.65,
                            }}
                        >
                            Que vous souhaitiez inscrire votre exploitation, trouver des lots spécifiques
                            ou obtenir une assistance technique, nos équipes locales sont à votre écoute.
                        </p>

                        <div className="d-flex flex-column gap-3 mb-4">
                            <Card className="p-3" style={{ backgroundColor: "var(--af-surface, #FFFFFF)" }}>
                                <span className="small text-uppercase fw-bold" style={{ color: "var(--af-green-700, #398565)", fontSize: "0.75rem", letterSpacing: "0.05em" }}>
                                    Courriel Direct
                                </span>
                                <div className="fw-bold mt-1" style={{ color: "var(--af-green-950, #15372F)", fontSize: "0.95rem" }}>
                                    contact@agriflow.ma
                                </div>
                            </Card>

                            <Card className="p-3" style={{ backgroundColor: "var(--af-surface, #FFFFFF)" }}>
                                <span className="small text-uppercase fw-bold" style={{ color: "var(--af-green-700, #398565)", fontSize: "0.75rem", letterSpacing: "0.05em" }}>
                                    Siège & Région
                                </span>
                                <div className="fw-bold mt-1" style={{ color: "var(--af-green-950, #15372F)", fontSize: "0.95rem" }}>
                                    Agadir, Région Souss-Massa, Maroc
                                </div>
                            </Card>

                            <Card className="p-3" style={{ backgroundColor: "var(--af-surface, #FFFFFF)" }}>
                                <span className="small text-uppercase fw-bold" style={{ color: "var(--af-green-700, #398565)", fontSize: "0.75rem", letterSpacing: "0.05em" }}>
                                    Disponibilité du Support
                                </span>
                                <div className="fw-bold mt-1" style={{ color: "var(--af-green-950, #15372F)", fontSize: "0.95rem" }}>
                                    Du Lundi au Vendredi · 08h30 – 18h00
                                </div>
                            </Card>
                        </div>
                    </Col>

                    {/* Right Column: Contact & Support Form */}
                    <Col lg={7}>
                        <Card
                            className="p-4 p-md-5"
                            style={{
                                backgroundColor: "var(--af-surface, #FFFFFF)",
                                border: "1px solid var(--af-border, #E2E9E3)",
                                boxShadow: "0 10px 30px rgba(21, 55, 47, 0.05)",
                            }}
                        >
                            <h4 className="fw-bold mb-2" style={{ color: "var(--af-green-950, #15372F)" }}>
                                Envoyer un message
                            </h4>
                            <p className="small mb-4" style={{ color: "var(--af-ink-600, #68756E)" }}>
                                Remplissez le formulaire ci-dessous pour joindre notre service d&apos;assistance.
                            </p>

                            {status.state === "success" && (
                                <Alert
                                    variant="success"
                                    className="rounded-3 mb-4"
                                    style={{
                                        backgroundColor: "var(--af-green-100, #E8F2EC)",
                                        borderColor: "var(--af-green-300, #C4DFD1)",
                                        color: "var(--af-green-900, #194638)",
                                    }}
                                >
                                    {status.message}
                                </Alert>
                            )}

                            {status.state === "error" && (
                                <Alert
                                    variant="danger"
                                    className="rounded-3 mb-4"
                                    style={{
                                        backgroundColor: "#FFF0EF",
                                        borderColor: "#FED7AA",
                                        color: "#9A3412",
                                    }}
                                >
                                    {status.message}
                                </Alert>
                            )}

                            <form onSubmit={handleSubmit}>
                                <Row className="g-3">
                                    <Col sm={6}>
                                        <Input
                                            label="Nom et Prénom *"
                                            id="contactName"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            placeholder="Ex: Karim Benali"
                                            required
                                        />
                                    </Col>

                                    <Col sm={6}>
                                        <Input
                                            label="Adresse e-mail professionnelle *"
                                            id="contactEmail"
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            placeholder="votre@email.com"
                                            required
                                        />
                                    </Col>

                                    <Col sm={6}>
                                        <Select
                                            label="Vous êtes"
                                            id="contactProfile"
                                            name="profileType"
                                            value={formData.profileType}
                                            onChange={handleChange}
                                            options={PROFILE_OPTIONS}
                                        />
                                    </Col>

                                    <Col sm={6}>
                                        <Input
                                            label="Objet de la demande"
                                            id="contactSubject"
                                            name="subject"
                                            value={formData.subject}
                                            onChange={handleChange}
                                            placeholder="Ex: Demande d'information"
                                        />
                                    </Col>

                                    <Col xs={12}>
                                        <Input
                                            as="textarea"
                                            rows={4}
                                            label="Message *"
                                            id="contactMessage"
                                            name="message"
                                            value={formData.message}
                                            onChange={handleChange}
                                            placeholder="Décrivez votre besoin ou votre question..."
                                            required
                                        />
                                    </Col>

                                    <Col xs={12} className="pt-2">
                                        <Button
                                            type="submit"
                                            variant="primary"
                                            pill
                                            size="lg"
                                            isLoading={isSubmitting}
                                            className="w-100"
                                        >
                                            Envoyer le message →
                                        </Button>
                                    </Col>
                                </Row>
                            </form>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </section>
    );
}
