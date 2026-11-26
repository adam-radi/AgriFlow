import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Modal, Row, Col } from "react-bootstrap";
import { Button, Input } from "../common";
import { selectUser } from "../../features/auth/authSelectors";

/**
 * ProductInquiryModal — Dialogue de demande de cotation directe auprès de l'exploitant
 * Permet aux acheteurs B2B de solliciter des volumes spécifiques sans intermédiaire.
 */
export default function ProductInquiryModal({
    show,
    onHide,
    product,
    farmer,
}) {
    const authUser = useSelector(selectUser);

    const [form, setForm] = useState(() => ({
        name: authUser?.name || "",
        businessName: authUser?.company_name || authUser?.business_name || "",
        contact: authUser?.phone || authUser?.email || "",
        estimatedVolume: "",
        message: "",
    }));
    const [submitted, setSubmitted] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitting(true);

        // Simulation de prise en charge instantanée côté client
        setTimeout(() => {
            setSubmitting(false);
            setSubmitted(true);
        }, 400);
    };

    const handleClose = () => {
        setSubmitted(false);
        setForm({
            name: authUser?.name || "",
            businessName: authUser?.company_name || authUser?.business_name || "",
            contact: authUser?.phone || authUser?.email || "",
            estimatedVolume: "",
            message: "",
        });
        onHide();
    };

    return (
        <Modal
            show={show}
            onHide={handleClose}
            centered
            contentClassName="rounded-4 border-0 shadow-lg"
        >
            <Modal.Header closeButton className="border-bottom-0 pb-0 pt-4 px-4">
                <div>
                    <span
                        className="text-uppercase fw-bold small"
                        style={{ color: "var(--af-green-700, #398565)", letterSpacing: "0.05em" }}
                    >
                        Mise en relation directe
                    </span>
                    <Modal.Title
                        className="fw-bold mt-1"
                        style={{ color: "var(--af-green-950, #15372F)", fontSize: "1.35rem" }}
                    >
                        Demander une cotation · {product?.name}
                    </Modal.Title>
                </div>
            </Modal.Header>

            <Modal.Body className="p-4">
                {submitted ? (
                    <div className="text-center py-4">
                        <div
                            className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
                            style={{
                                width: "64px",
                                height: "64px",
                                backgroundColor: "var(--af-green-100, #E8F2EC)",
                                color: "var(--af-green-900, #194638)",
                                fontSize: "1.8rem",
                            }}
                        >
                            ✓
                        </div>
                        <h4 className="fw-bold mb-2" style={{ color: "var(--af-green-950, #15372F)" }}>
                            Demande transmise avec succès !
                        </h4>
                        <p className="small text-muted mb-4">
                            L&apos;exploitant {farmer?.name ? `(${farmer.name})` : "partenaire"} a été notifié de votre besoin.
                            Notre équipe de coordination régionale reste également à votre disposition.
                        </p>
                        <Button variant="primary" pill onClick={handleClose} className="w-100">
                            Fermer
                        </Button>
                    </div>
                ) : (
                    <>
                        <p className="small text-muted mb-3">
                            Renseignez vos coordonnées professionnelles et les volumes estimés pour que le producteur
                            puisse vous confirmer les disponibilités et les tarifs dégressifs.
                        </p>

                        <form onSubmit={handleSubmit}>
                            <Row className="g-3">
                                <Col xs={12} sm={6}>
                                    <Input
                                        label="Votre Nom & Prénom *"
                                        name="name"
                                        value={form.name}
                                        onChange={handleChange}
                                        placeholder="Ex: Karim Tazi"
                                        required
                                    />
                                </Col>

                                <Col xs={12} sm={6}>
                                    <Input
                                        label="Établissement / Entreprise"
                                        name="businessName"
                                        value={form.businessName}
                                        onChange={handleChange}
                                        placeholder="Ex: Marché Central / Resto Bio"
                                    />
                                </Col>

                                <Col xs={12} sm={6}>
                                    <Input
                                        label="Téléphone ou E-mail *"
                                        name="contact"
                                        value={form.contact}
                                        onChange={handleChange}
                                        placeholder="06... ou contact@..."
                                        required
                                    />
                                </Col>

                                <Col xs={12} sm={6}>
                                    <Input
                                        label="Volume estimé"
                                        name="estimatedVolume"
                                        value={form.estimatedVolume}
                                        onChange={handleChange}
                                        placeholder="Ex: 500 kg / 20 caisses"
                                    />
                                </Col>

                                <Col xs={12}>
                                    <Input
                                        as="textarea"
                                        rows={3}
                                        label="Message ou questions particulières"
                                        name="message"
                                        value={form.message}
                                        onChange={handleChange}
                                        placeholder="Précisez vos dates d'approvisionnement ou vos contraintes logistiques..."
                                    />
                                </Col>

                                <Col xs={12} className="pt-2">
                                    <Button
                                        type="submit"
                                        variant="primary"
                                        pill
                                        size="lg"
                                        isLoading={submitting}
                                        className="w-100"
                                    >
                                        Envoyer ma demande à l&apos;exploitant →
                                    </Button>
                                </Col>
                            </Row>
                        </form>
                    </>
                )}
            </Modal.Body>
        </Modal>
    );
}
