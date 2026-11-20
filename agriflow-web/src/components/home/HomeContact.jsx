import { useState } from "react";
import { Container, Row, Col, Form, Button, Alert } from "react-bootstrap";

/**
 * HomeContact — Contact & Support Section
 * Note technique : Le formulaire gère actuellement l'état et la validation côté frontend.
 * Endpoint backend recommandé pour la connexion future : POST /api/contact
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

        // Feedback utilisateur propre côté client
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
                            CONTACT & SUPPORT
                        </div>

                        <h2
                            className="fw-bold mb-3"
                            style={{
                                color: "#15372F",
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
                                color: "#68756E",
                                fontSize: "1.05rem",
                                lineHeight: 1.65,
                            }}
                        >
                            Que vous souhaitiez inscrire votre exploitation, trouver des lots spécifiques
                            ou obtenir une assistance technique, nos équipes locales sont à votre écoute.
                        </p>

                        <div className="d-flex flex-column gap-3 mb-4">
                            <div
                                className="p-3 rounded-3"
                                style={{
                                    backgroundColor: "#FFFFFF",
                                    border: "1px solid #E2E9E3",
                                }}
                            >
                                <span className="small text-uppercase fw-bold" style={{ color: "#398565", fontSize: "0.75rem", letterSpacing: "0.05em" }}>
                                    Courriel Direct
                                </span>
                                <div className="fw-bold mt-1" style={{ color: "#15372F", fontSize: "0.95rem" }}>
                                    contact@agriflow.ma
                                </div>
                            </div>

                            <div
                                className="p-3 rounded-3"
                                style={{
                                    backgroundColor: "#FFFFFF",
                                    border: "1px solid #E2E9E3",
                                }}
                            >
                                <span className="small text-uppercase fw-bold" style={{ color: "#398565", fontSize: "0.75rem", letterSpacing: "0.05em" }}>
                                    Siège & Région
                                </span>
                                <div className="fw-bold mt-1" style={{ color: "#15372F", fontSize: "0.95rem" }}>
                                    Agadir, Région Souss-Massa, Maroc
                                </div>
                            </div>

                            <div
                                className="p-3 rounded-3"
                                style={{
                                    backgroundColor: "#FFFFFF",
                                    border: "1px solid #E2E9E3",
                                }}
                            >
                                <span className="small text-uppercase fw-bold" style={{ color: "#398565", fontSize: "0.75rem", letterSpacing: "0.05em" }}>
                                    Disponibilité du Support
                                </span>
                                <div className="fw-bold mt-1" style={{ color: "#15372F", fontSize: "0.95rem" }}>
                                    Du Lundi au Vendredi · 08h30 – 18h00
                                </div>
                            </div>
                        </div>
                    </Col>

                    {/* Right Column: Contact & Support Form */}
                    <Col lg={7}>
                        <div
                            className="p-4 p-md-5 rounded-4"
                            style={{
                                backgroundColor: "#FFFFFF",
                                border: "1px solid #E2E9E3",
                                boxShadow: "0 10px 30px rgba(21, 55, 47, 0.05)",
                            }}
                        >
                            <h4 className="fw-bold mb-2" style={{ color: "#15372F" }}>
                                Envoyer un message
                            </h4>
                            <p className="small mb-4" style={{ color: "#68756E" }}>
                                Remplissez le formulaire ci-dessous pour joindre notre service d&apos;assistance.
                            </p>

                            {status.state === "success" && (
                                <Alert
                                    variant="success"
                                    className="rounded-3 mb-4"
                                    style={{
                                        backgroundColor: "#E8F2EC",
                                        borderColor: "#C4DFD1",
                                        color: "#194638",
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

                            <Form onSubmit={handleSubmit}>
                                <Row className="g-3">
                                    <Col sm={6}>
                                        <Form.Group controlId="contactName">
                                            <Form.Label className="small fw-semibold" style={{ color: "#1D2924" }}>
                                                Nom et Prénom *
                                            </Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                placeholder="Ex: Karim Benali"
                                                required
                                                style={{
                                                    borderRadius: "10px",
                                                    borderColor: "#CBD7CE",
                                                    padding: "10px 14px",
                                                    fontSize: "0.92rem",
                                                }}
                                            />
                                        </Form.Group>
                                    </Col>

                                    <Col sm={6}>
                                        <Form.Group controlId="contactEmail">
                                            <Form.Label className="small fw-semibold" style={{ color: "#1D2924" }}>
                                                Adresse e-mail professionnelle *
                                            </Form.Label>
                                            <Form.Control
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                placeholder="votre@email.com"
                                                required
                                                style={{
                                                    borderRadius: "10px",
                                                    borderColor: "#CBD7CE",
                                                    padding: "10px 14px",
                                                    fontSize: "0.92rem",
                                                }}
                                            />
                                        </Form.Group>
                                    </Col>

                                    <Col sm={6}>
                                        <Form.Group controlId="contactProfile">
                                            <Form.Label className="small fw-semibold" style={{ color: "#1D2924" }}>
                                                Vous êtes
                                            </Form.Label>
                                            <Form.Select
                                                name="profileType"
                                                value={formData.profileType}
                                                onChange={handleChange}
                                                style={{
                                                    borderRadius: "10px",
                                                    borderColor: "#CBD7CE",
                                                    padding: "10px 14px",
                                                    fontSize: "0.92rem",
                                                }}
                                            >
                                                <option value="buyer">Acheteur Professionnel / Commerce</option>
                                                <option value="farmer">Agriculteur / Exploitant / Coopérative</option>
                                                <option value="delivery">Partenaire Logistique / Livreur</option>
                                                <option value="other">Autre demande</option>
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>

                                    <Col sm={6}>
                                        <Form.Group controlId="contactSubject">
                                            <Form.Label className="small fw-semibold" style={{ color: "#1D2924" }}>
                                                Objet de la demande
                                            </Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="subject"
                                                value={formData.subject}
                                                onChange={handleChange}
                                                placeholder="Ex: Demande d'information sur les commandes"
                                                style={{
                                                    borderRadius: "10px",
                                                    borderColor: "#CBD7CE",
                                                    padding: "10px 14px",
                                                    fontSize: "0.92rem",
                                                }}
                                            />
                                        </Form.Group>
                                    </Col>

                                    <Col xs={12}>
                                        <Form.Group controlId="contactMessage">
                                            <Form.Label className="small fw-semibold" style={{ color: "#1D2924" }}>
                                                Message *
                                            </Form.Label>
                                            <Form.Control
                                                as="textarea"
                                                rows={4}
                                                name="message"
                                                value={formData.message}
                                                onChange={handleChange}
                                                placeholder="Décrivez votre besoin ou votre question..."
                                                required
                                                style={{
                                                    borderRadius: "10px",
                                                    borderColor: "#CBD7CE",
                                                    padding: "10px 14px",
                                                    fontSize: "0.92rem",
                                                }}
                                            />
                                        </Form.Group>
                                    </Col>

                                    <Col xs={12} className="pt-2">
                                        <Button
                                            type="submit"
                                            className="w-100 py-3 rounded-pill fw-bold"
                                            style={{
                                                backgroundColor: "#194638",
                                                borderColor: "#194638",
                                                color: "#ffffff",
                                                fontSize: "0.95rem",
                                                boxShadow: "0 4px 12px rgba(25, 70, 56, 0.18)",
                                            }}
                                        >
                                            Envoyer le message →
                                        </Button>
                                    </Col>
                                </Row>
                            </Form>
                        </div>
                    </Col>
                </Row>
            </Container>
        </section>
    );
}

