import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Modal, Row, Col, Alert } from "react-bootstrap";
import { Button, Input } from "../common";
import { selectUser } from "../../features/auth/authSelectors";
import { createInquiry } from "../../features/inquiries/inquirySlice";

/**
 * ProductInquiryModal — Dialogue de négociation directe et demande d'achat B2B
 * Connecté au backend Laravel (Lot 12 - Axe A).
 */
export default function ProductInquiryModal({
    show,
    onHide,
    product,
    farmer,
}) {
    const dispatch = useDispatch();
    const authUser = useSelector(selectUser);

    const [form, setForm] = useState(() => ({
        quantity: "100",
        proposed_price: product?.price ? String(product.price) : "",
        delivery_zone: authUser?.city || "Casablanca",
        desired_delivery_date: new Date(Date.now() + 7 * 86400000).toISOString().split("T")[0],
        message: "",
    }));

    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);
    const [createdInquiryId, setCreatedInquiryId] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
        if (errorMessage) setErrorMessage(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setErrorMessage(null);

        try {
            const payload = {
                product_id: product?.id,
                quantity: parseFloat(form.quantity),
                proposed_price: parseFloat(form.proposed_price || product?.price || 0),
                delivery_zone: form.delivery_zone,
                desired_delivery_date: form.desired_delivery_date || null,
                message: form.message,
            };

            const resultAction = await dispatch(createInquiry(payload));
            if (createInquiry.fulfilled.match(resultAction)) {
                setCreatedInquiryId(resultAction.payload?.id || null);
                setSubmitted(true);
            } else {
                const errPayload = resultAction.payload;
                const msg = typeof errPayload === "string" 
                    ? errPayload 
                    : (errPayload?.message || errPayload?.product_id?.[0] || "Une erreur est survenue lors de l'envoi.");
                setErrorMessage(msg);
            }
        } catch (err) {
            setErrorMessage(err.message || "Erreur réseau.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleClose = () => {
        setSubmitted(false);
        setErrorMessage(null);
        setForm({
            quantity: "100",
            proposed_price: product?.price ? String(product.price) : "",
            delivery_zone: authUser?.city || "Casablanca",
            desired_delivery_date: new Date(Date.now() + 7 * 86400000).toISOString().split("T")[0],
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
                        Négociation directe B2B
                    </span>
                    <Modal.Title
                        className="fw-bold mt-1"
                        style={{ color: "var(--af-green-950, #15372F)", fontSize: "1.35rem" }}
                    >
                        Demander une offre · {product?.name}
                    </Modal.Title>
                </div>
            </Modal.Header>

            <Modal.Body className="p-4">
                {errorMessage && (
                    <Alert variant="danger" className="rounded-3 py-2 px-3 small mb-3">
                        {errorMessage}
                    </Alert>
                )}

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
                            Demande d&apos;achat transmise !
                        </h4>
                        <p className="small text-muted mb-4">
                            L&apos;exploitant {farmer?.name ? `(${farmer.name})` : "partenaire"} a reçu votre proposition de prix et de volume. Vous pouvez suivre l&apos;avancement et échanger directement des contre-propositions.
                        </p>
                        <div className="d-flex flex-column gap-2">
                            {createdInquiryId ? (
                                <Button as={Link} to={`/client/inquiries/${createdInquiryId}`} variant="primary" pill className="w-100">
                                    Consulter la négociation en direct →
                                </Button>
                            ) : (
                                <Button as={Link} to="/client/inquiries" variant="primary" pill className="w-100">
                                    Voir mes demandes d&apos;achat →
                                </Button>
                            )}
                            <Button variant="ghost" onClick={handleClose} className="w-100 text-muted">
                                Continuer mes recherches
                            </Button>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="p-3 rounded-3 mb-3" style={{ backgroundColor: "var(--af-gray-50, #f8f9fa)", border: "1px solid var(--af-gray-200, #e9ecef)" }}>
                            <div className="d-flex justify-content-between align-items-center small text-muted">
                                <span>Prix catalogue de référence :</span>
                                <strong className="text-dark">{product?.price ? `${product.price} DH / kg` : "Non spécifié"}</strong>
                            </div>
                            <div className="d-flex justify-content-between align-items-center small text-muted mt-1">
                                <span>Producteur :</span>
                                <strong className="text-dark">{farmer?.name || "Exploitant partenaire"}</strong>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <Row className="g-3">
                                <Col xs={12} sm={6}>
                                    <Input
                                        label="Quantité souhaitée (kg) *"
                                        name="quantity"
                                        type="number"
                                        step="1"
                                        min="1"
                                        value={form.quantity}
                                        onChange={handleChange}
                                        placeholder="Ex: 500"
                                        required
                                    />
                                </Col>

                                <Col xs={12} sm={6}>
                                    <Input
                                        label="Prix proposé (DH / kg) *"
                                        name="proposed_price"
                                        type="number"
                                        step="0.1"
                                        min="0.1"
                                        value={form.proposed_price}
                                        onChange={handleChange}
                                        placeholder={`Ex: ${product?.price || 12}`}
                                        required
                                    />
                                </Col>

                                <Col xs={12} sm={6}>
                                    <Input
                                        label="Zone de livraison *"
                                        name="delivery_zone"
                                        value={form.delivery_zone}
                                        onChange={handleChange}
                                        placeholder="Ex: Casablanca, Fès, Agadir"
                                        required
                                    />
                                </Col>

                                <Col xs={12} sm={6}>
                                    <Input
                                        label="Date souhaitée *"
                                        name="desired_delivery_date"
                                        type="date"
                                        value={form.desired_delivery_date}
                                        onChange={handleChange}
                                        required
                                    />
                                </Col>

                                <Col xs={12}>
                                    <Input
                                        as="textarea"
                                        rows={3}
                                        label="Message ou conditions particulières"
                                        name="message"
                                        value={form.message}
                                        onChange={handleChange}
                                        placeholder="Précisez votre calibre souhaité, emballage (caisses, sacs) ou conditions de déchargement..."
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
                                        Soumettre la proposition à l&apos;agriculteur →
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
