import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Container, Row, Col, Card, Badge, Spinner, Alert, Form } from "react-bootstrap";
import { Button, Input } from "../../../components/common";
import { selectUser } from "../../../features/auth/authSelectors";
import {
    fetchInquiryById,
    submitCounterOffer,
    acceptInquiryOffer,
    confirmInquiryAgreement,
    cancelInquiry,
    clearInquiryError,
    clearInquirySuccess,
} from "../../../features/inquiries/inquirySlice";
import {
    selectCurrentInquiry,
    selectInquiryLoading,
    selectInquiryActionLoading,
    selectInquiryError,
    selectInquirySuccessMessage,
} from "../../../features/inquiries/inquirySelectors";

const STATUS_CONFIG = {
    pending: { label: "En attente de l'agriculteur", bg: "warning", text: "dark", step: 1 },
    negotiating: { label: "Négociation active", bg: "info", text: "dark", step: 2 },
    accepted: { label: "Accord de principe trouvé", bg: "primary", text: "white", step: 3 },
    confirmed: { label: "Transaction validée & confirmée", bg: "success", text: "white", step: 4 },
    in_delivery: { label: "Récolte en cours d'expédition", bg: "info", text: "dark", step: 5 },
    delivered: { label: "Commande livrée & réceptionnée", bg: "success", text: "white", step: 6 },
    rejected: { label: "Demande refusée", bg: "danger", text: "white", step: 0 },
    cancelled: { label: "Demande annulée", bg: "secondary", text: "white", step: 0 },
};

export default function ClientInquiryDetailsPage() {
    const { id } = useParams();
    const dispatch = useDispatch();
    const user = useSelector(selectUser);
    const inquiry = useSelector(selectCurrentInquiry);
    const loading = useSelector(selectInquiryLoading);
    const actionLoading = useSelector(selectInquiryActionLoading);
    const error = useSelector(selectInquiryError);
    const successMessage = useSelector(selectInquirySuccessMessage);

    const [showCounterForm, setShowCounterForm] = useState(false);
    const [counterForm, setCounterForm] = useState({
        proposed_price: "",
        proposed_quantity: "",
        proposed_delivery_date: "",
        message: "",
    });

    useEffect(() => {
        if (id) {
            dispatch(fetchInquiryById(id));
        }
        return () => {
            dispatch(clearInquiryError());
            dispatch(clearInquirySuccess());
        };
    }, [dispatch, id]);

    useEffect(() => {
        if (inquiry) {
            setCounterForm({
                proposed_price: String(inquiry.current_price || ""),
                proposed_quantity: String(inquiry.current_quantity || ""),
                proposed_delivery_date: inquiry.desired_delivery_date || "",
                message: "",
            });
        }
    }, [inquiry]);

    const statusMeta = STATUS_CONFIG[inquiry?.status] || {
        label: inquiry?.status,
        bg: "secondary",
        text: "white",
        step: 1,
    };

    const isNegotiable = ["pending", "negotiating", "accepted"].includes(inquiry?.status);
    const isAccepted = inquiry?.status === "accepted";
    const isConfirmed = ["confirmed", "in_delivery", "delivered"].includes(inquiry?.status);

    const handleCounterSubmit = async (e) => {
        e.preventDefault();
        const payload = {
            proposed_price: parseFloat(counterForm.proposed_price),
            proposed_quantity: parseFloat(counterForm.proposed_quantity),
            proposed_delivery_date: counterForm.proposed_delivery_date || null,
            message: counterForm.message,
        };

        const res = await dispatch(submitCounterOffer({ id: inquiry.id, data: payload }));
        if (submitCounterOffer.fulfilled.match(res)) {
            setShowCounterForm(false);
            setCounterForm((prev) => ({ ...prev, message: "" }));
        }
    };

    const handleAccept = () => {
        if (window.confirm("Voulez-vous accepter l'offre actuelle pour cette commande ?")) {
            dispatch(acceptInquiryOffer(inquiry.id));
        }
    };

    const handleConfirm = () => {
        if (window.confirm("Confirmez-vous définitivement cet accord transactionnel avec l'agriculteur ?")) {
            dispatch(confirmInquiryAgreement(inquiry.id));
        }
    };

    const handleCancel = () => {
        if (window.confirm("Êtes-vous sûr de vouloir annuler cette demande d'achat ?")) {
            dispatch(cancelInquiry(inquiry.id));
        }
    };

    if (loading && !inquiry) {
        return (
            <Container className="py-5 text-center">
                <Spinner animation="border" variant="success" />
                <p className="mt-3 text-muted small">Chargement de la négociation directe...</p>
            </Container>
        );
    }

    if (!inquiry && !loading) {
        return (
            <Container className="py-5">
                <Alert variant="warning" className="rounded-4 p-4 text-center">
                    <h5>Demande introuvable ou accès non autorisé</h5>
                    <p className="small text-muted mb-3">Cette négociation n&apos;existe pas ou a été archivée.</p>
                    <Button as={Link} to="/client/inquiries" variant="primary" pill>
                        Retour à mes demandes
                    </Button>
                </Alert>
            </Container>
        );
    }

    return (
        <Container fluid className="py-4 px-lg-5">
            {/* Navigation back */}
            <div className="mb-3">
                <Link to="/client/inquiries" className="text-decoration-none small text-muted d-inline-flex align-items-center gap-1">
                    ← Retour à la liste des demandes
                </Link>
            </div>

            {/* Notifications */}
            {successMessage && (
                <Alert variant="success" dismissible onClose={() => dispatch(clearInquirySuccess())} className="rounded-3 shadow-sm mb-4">
                    ✓ {successMessage}
                </Alert>
            )}
            {error && (
                <Alert variant="danger" dismissible onClose={() => dispatch(clearInquiryError())} className="rounded-3 shadow-sm mb-4">
                    ✕ {typeof error === "string" ? error : error?.message || "Une erreur est survenue."}
                </Alert>
            )}

            {/* Stepper progress */}
            <Card className="border-0 shadow-sm rounded-4 mb-4">
                <Card.Body className="p-4">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <span className="small text-uppercase fw-bold text-muted">Étape de la transaction</span>
                        <Badge bg={statusMeta.bg} text={statusMeta.text} className="rounded-pill px-3 py-2">
                            {statusMeta.label}
                        </Badge>
                    </div>

                    <div className="position-relative py-2">
                        <div
                            className="position-absolute top-50 start-0 translate-middle-y w-100"
                            style={{ height: "4px", backgroundColor: "var(--af-gray-200, #e9ecef)", zIndex: 0 }}
                        />
                        <div
                            className="position-absolute top-50 start-0 translate-middle-y"
                            style={{
                                height: "4px",
                                backgroundColor: "var(--af-green-600, #398565)",
                                width: `${Math.min(100, Math.max(0, ((statusMeta.step - 1) / 5) * 100))}%`,
                                transition: "width 0.4s ease",
                                zIndex: 1,
                            }}
                        />

                        <div className="d-flex justify-content-between position-relative" style={{ zIndex: 2 }}>
                            {[
                                { num: 1, label: "Demande" },
                                { num: 2, label: "Négociation" },
                                { num: 3, label: "Accord" },
                                { num: 4, label: "Confirmé" },
                                { num: 5, label: "Acheminement" },
                                { num: 6, label: "Livré" },
                            ].map((s) => {
                                const isDone = statusMeta.step >= s.num;
                                const isCurrent = statusMeta.step === s.num;
                                return (
                                    <div key={s.num} className="d-flex flex-column align-items-center text-center">
                                        <div
                                            className={`rounded-circle d-flex align-items-center justify-content-center fw-bold ${
                                                isCurrent
                                                    ? "bg-success text-white shadow"
                                                    : isDone
                                                    ? "bg-success text-white"
                                                    : "bg-light text-muted border"
                                            }`}
                                            style={{ width: "32px", height: "32px", fontSize: "0.85rem" }}
                                        >
                                            {isDone && !isCurrent ? "✓" : s.num}
                                        </div>
                                        <span className="small mt-1 text-muted d-none d-sm-inline" style={{ fontSize: "0.75rem" }}>
                                            {s.label}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </Card.Body>
            </Card>

            <Row className="g-4">
                {/* Left col: Negotiation Chat & History */}
                <Col xs={12} lg={8}>
                    <Card className="border-0 shadow-sm rounded-4 mb-4">
                        <Card.Header className="bg-transparent border-bottom-0 pt-4 px-4 pb-0 d-flex justify-content-between align-items-center">
                            <h5 className="fw-bold mb-0" style={{ color: "var(--af-green-950, #15372F)" }}>
                                Historique des échanges & Contre-offres
                            </h5>
                            <span className="badge bg-light text-dark rounded-pill">
                                {inquiry.negotiations?.length || 0} tour(s)
                            </span>
                        </Card.Header>
                        <Card.Body className="p-4">
                            {/* Initial inquiry note */}
                            <div className="p-3 rounded-4 mb-3" style={{ backgroundColor: "var(--af-green-50, #F4F8F5)", border: "1px solid var(--af-green-200, #D2E4DA)" }}>
                                <div className="d-flex justify-content-between align-items-center mb-1">
                                    <strong className="small" style={{ color: "var(--af-green-900, #194638)" }}>
                                        🌱 Votre proposition initiale
                                    </strong>
                                    <span className="text-muted small">
                                        {inquiry.created_at ? new Date(inquiry.created_at).toLocaleDateString("fr-FR") : ""}
                                    </span>
                                </div>
                                <div className="d-flex flex-wrap gap-3 small mt-2">
                                    <span>Quantité : <strong>{inquiry.initial_quantity} kg</strong></span>
                                    <span>Prix proposé : <strong className="text-success">{inquiry.initial_price} DH/kg</strong></span>
                                    <span>Zone : <strong>{inquiry.delivery_zone || "Casablanca"}</strong></span>
                                    <span>Date souhaitée : <strong>{inquiry.desired_delivery_date || "Non spécifiée"}</strong></span>
                                </div>
                                {inquiry.notes && (
                                    <p className="mt-2 mb-0 small text-muted fst-italic">
                                        &ldquo;{inquiry.notes}&rdquo;
                                    </p>
                                )}
                            </div>

                            {/* Negotiation thread items */}
                            <div className="d-flex flex-column gap-3">
                                {inquiry.negotiations?.map((neg) => {
                                    const isMe = neg.sender_id === user?.id || neg.sender_role === "buyer";
                                    return (
                                        <div
                                            key={neg.id}
                                            className={`p-3 rounded-4 ${
                                                isMe
                                                    ? "align-self-end bg-white border shadow-xs"
                                                    : "align-self-start border-0"
                                            }`}
                                            style={{
                                                maxWidth: "85%",
                                                backgroundColor: isMe ? "#ffffff" : "var(--af-gray-100, #F0F4F2)",
                                            }}
                                        >
                                            <div className="d-flex justify-content-between align-items-center gap-3 mb-1">
                                                <strong className="small" style={{ color: isMe ? "var(--af-green-800, #194638)" : "var(--af-green-950, #15372F)" }}>
                                                    {isMe ? "Vous (Acheteur)" : `Exploitant (${neg.sender?.name || inquiry.farmer?.name || "Producteur"})`}
                                                </strong>
                                                <span className="text-muted" style={{ fontSize: "0.75rem" }}>
                                                    {neg.created_at ? new Date(neg.created_at).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit", day: "2-digit", month: "short" }) : ""}
                                                </span>
                                            </div>
                                            <div className="d-flex flex-wrap gap-2 small my-2">
                                                <span className="badge bg-light text-dark border">
                                                    Prix : <strong>{neg.proposed_price} DH/kg</strong>
                                                </span>
                                                <span className="badge bg-light text-dark border">
                                                    Volume : <strong>{neg.proposed_quantity} kg</strong>
                                                </span>
                                                {neg.proposed_delivery_date && (
                                                    <span className="badge bg-light text-dark border">
                                                        Livraison : <strong>{neg.proposed_delivery_date}</strong>
                                                    </span>
                                                )}
                                            </div>
                                            {neg.message && (
                                                <p className="small mb-0 text-muted">
                                                    {neg.message}
                                                </p>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Counter offer toggle and form */}
                            {isNegotiable && (
                                <div className="mt-4 pt-3 border-top">
                                    {!showCounterForm ? (
                                        <div className="d-flex flex-wrap gap-2">
                                            <Button
                                                variant="outline-primary"
                                                pill
                                                onClick={() => setShowCounterForm(true)}
                                            >
                                                ✍️ Faire une contre-proposition
                                            </Button>
                                            <Button
                                                variant="primary"
                                                pill
                                                isLoading={actionLoading}
                                                onClick={handleAccept}
                                            >
                                                ✓ Accepter les conditions actuelles
                                            </Button>
                                            {isAccepted && (
                                                <Button
                                                    variant="success"
                                                    pill
                                                    isLoading={actionLoading}
                                                    onClick={handleConfirm}
                                                >
                                                    🚀 Confirmer définitivement la transaction
                                                </Button>
                                            )}
                                        </div>
                                    ) : (
                                        <Card className="border p-3 rounded-4 bg-light">
                                            <h6 className="fw-bold mb-3" style={{ color: "var(--af-green-950, #15372F)" }}>
                                                Votre nouvelle proposition
                                            </h6>
                                            <form onSubmit={handleCounterSubmit}>
                                                <Row className="g-3">
                                                    <Col xs={12} sm={6}>
                                                        <Input
                                                            label="Prix proposé (DH / kg) *"
                                                            name="proposed_price"
                                                            type="number"
                                                            step="0.1"
                                                            min="0.1"
                                                            value={counterForm.proposed_price}
                                                            onChange={(e) => setCounterForm({ ...counterForm, proposed_price: e.target.value })}
                                                            required
                                                        />
                                                    </Col>
                                                    <Col xs={12} sm={6}>
                                                        <Input
                                                            label="Quantité (kg) *"
                                                            name="proposed_quantity"
                                                            type="number"
                                                            step="1"
                                                            min="1"
                                                            value={counterForm.proposed_quantity}
                                                            onChange={(e) => setCounterForm({ ...counterForm, proposed_quantity: e.target.value })}
                                                            required
                                                        />
                                                    </Col>
                                                    <Col xs={12} sm={6}>
                                                        <Input
                                                            label="Date d'expédition souhaitée"
                                                            name="proposed_delivery_date"
                                                            type="date"
                                                            value={counterForm.proposed_delivery_date}
                                                            onChange={(e) => setCounterForm({ ...counterForm, proposed_delivery_date: e.target.value })}
                                                        />
                                                    </Col>
                                                    <Col xs={12}>
                                                        <Input
                                                            as="textarea"
                                                            rows={2}
                                                            label="Message explicatif pour l'agriculteur"
                                                            name="message"
                                                            placeholder="Indiquez par exemple : 'Si nous prenons 300kg, pouvez-vous faire 14 DH/kg ?'..."
                                                            value={counterForm.message}
                                                            onChange={(e) => setCounterForm({ ...counterForm, message: e.target.value })}
                                                        />
                                                    </Col>
                                                    <Col xs={12} className="d-flex gap-2">
                                                        <Button
                                                            type="submit"
                                                            variant="primary"
                                                            pill
                                                            isLoading={actionLoading}
                                                        >
                                                            Envoyer la proposition
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            onClick={() => setShowCounterForm(false)}
                                                        >
                                                            Annuler
                                                        </Button>
                                                    </Col>
                                                </Row>
                                            </form>
                                        </Card>
                                    )}
                                </div>
                            )}

                            {isConfirmed && (
                                <Alert variant="success" className="rounded-4 mt-4 mb-0">
                                    <h6 className="fw-bold mb-1">🎉 Accord transactionnel validé !</h6>
                                    <p className="small mb-0">
                                        Les termes de cette transaction ont été scellés. L&apos;agriculteur prépare le conditionnement et l&apos;acheminement de la récolte vers votre zone de livraison.
                                    </p>
                                </Alert>
                            )}
                        </Card.Body>
                    </Card>
                </Col>

                {/* Right col: Recap & Actions */}
                <Col xs={12} lg={4}>
                    <Card className="border-0 shadow-sm rounded-4 mb-4">
                        <Card.Header className="bg-transparent border-bottom-0 pt-4 px-4 pb-0">
                            <h5 className="fw-bold mb-0" style={{ color: "var(--af-green-950, #15372F)" }}>
                                Récapitulatif Accord
                            </h5>
                        </Card.Header>
                        <Card.Body className="p-4">
                            <div className="d-flex align-items-center gap-3 pb-3 mb-3 border-bottom">
                                <div
                                    className="rounded-3 d-flex align-items-center justify-content-center flex-shrink-0"
                                    style={{
                                        width: "48px",
                                        height: "48px",
                                        backgroundColor: "var(--af-green-100, #E8F2EC)",
                                        color: "var(--af-green-800, #194638)",
                                        fontSize: "1.35rem",
                                    }}
                                >
                                    🌱
                                </div>
                                <div>
                                    <h6 className="fw-bold mb-0" style={{ color: "var(--af-green-950, #15372F)" }}>
                                        {inquiry.product?.name}
                                    </h6>
                                    <span className="small text-muted">
                                        Exploitant : {inquiry.farmer?.name}
                                    </span>
                                </div>
                            </div>

                            <div className="d-flex flex-column gap-2 small mb-4">
                                <div className="d-flex justify-content-between">
                                    <span className="text-muted">Volume d&apos;accord :</span>
                                    <strong>{inquiry.current_quantity} kg</strong>
                                </div>
                                <div className="d-flex justify-content-between">
                                    <span className="text-muted">Prix unitaire convenu :</span>
                                    <strong className="text-success">{inquiry.current_price} DH / kg</strong>
                                </div>
                                <div className="d-flex justify-content-between">
                                    <span className="text-muted">Zone de livraison :</span>
                                    <strong>{inquiry.delivery_zone || "Casablanca"}</strong>
                                </div>
                                <div className="d-flex justify-content-between">
                                    <span className="text-muted">Date visée :</span>
                                    <strong>{inquiry.desired_delivery_date || "À convenir"}</strong>
                                </div>
                                <hr className="my-2" />
                                <div className="d-flex justify-content-between fs-6">
                                    <span className="fw-bold">Total estimé :</span>
                                    <strong className="text-success fs-5">
                                        {(Number(inquiry.current_quantity || 0) * Number(inquiry.current_price || 0)).toFixed(2)} DH
                                    </strong>
                                </div>
                            </div>

                            {/* Additional controls */}
                            {["pending", "negotiating"].includes(inquiry.status) && (
                                <Button
                                    variant="outline-danger"
                                    pill
                                    size="sm"
                                    className="w-100"
                                    onClick={handleCancel}
                                    isLoading={actionLoading}
                                >
                                    Annuler cette demande d&apos;achat
                                </Button>
                            )}
                        </Card.Body>
                    </Card>

                    {/* Delivery tracking panel */}
                    {isConfirmed && (
                        <Card className="border-0 shadow-sm rounded-4">
                            <Card.Body className="p-4">
                                <h6 className="fw-bold mb-3" style={{ color: "var(--af-green-950, #15372F)" }}>
                                    📦 Suivi Logistique & Expédition
                                </h6>
                                <p className="small text-muted mb-3">
                                    Statut actuel : <Badge bg={statusMeta.bg} text={statusMeta.text}>{statusMeta.label}</Badge>
                                </p>
                                <div className="p-3 bg-light rounded-3 small text-muted">
                                    L&apos;exploitant prend en charge la préparation et la mise à disposition de la marchandise pour transport vers <strong>{inquiry.delivery_zone || "votre entrepôt"}</strong>.
                                </div>
                            </Card.Body>
                        </Card>
                    )}
                </Col>
            </Row>
        </Container>
    );
}
