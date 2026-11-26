import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Container, Row, Col, Card, Badge, Spinner, Alert } from "react-bootstrap";
import { Button, Input } from "../../../components/common";
import { selectUser } from "../../../features/auth/authSelectors";
import {
    fetchInquiryById,
    submitCounterOffer,
    acceptInquiryOffer,
    confirmInquiryAgreement,
    rejectInquiry,
    updateInquiryDeliveryStatus,
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
    pending: { label: "Nouvelle demande reçue", bg: "warning", text: "dark", step: 1 },
    negotiating: { label: "Négociation active", bg: "info", text: "dark", step: 2 },
    accepted: { label: "Accord de principe trouvé", bg: "primary", text: "white", step: 3 },
    confirmed: { label: "Accord confirmé · Prêt pour expédition", bg: "success", text: "white", step: 4 },
    in_delivery: { label: "En cours d'expédition", bg: "info", text: "dark", step: 5 },
    delivered: { label: "Commande livrée & réceptionnée", bg: "success", text: "white", step: 6 },
    rejected: { label: "Demande refusée", bg: "danger", text: "white", step: 0 },
    cancelled: { label: "Demande annulée par l'acheteur", bg: "secondary", text: "white", step: 0 },
};

export default function FarmerInquiryDetailsPage() {
    const { id } = useParams();
    const dispatch = useDispatch();
    const user = useSelector(selectUser);
    const inquiry = useSelector(selectCurrentInquiry);
    const loading = useSelector(selectInquiryLoading);
    const actionLoading = useSelector(selectInquiryActionLoading);
    const error = useSelector(selectInquiryError);
    const successMessage = useSelector(selectInquirySuccessMessage);

    const [showCounterForm, setShowCounterForm] = useState(false);
    const [showRejectForm, setShowRejectForm] = useState(false);
    const [rejectReason, setRejectReason] = useState("");
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
    const isConfirmed = inquiry?.status === "confirmed";
    const isInDelivery = inquiry?.status === "in_delivery";
    const isDelivered = inquiry?.status === "delivered";

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
        if (window.confirm("Acceptez-vous ces conditions de vente pour votre récolte ?")) {
            dispatch(acceptInquiryOffer(inquiry.id));
        }
    };

    const handleConfirm = () => {
        if (window.confirm("Confirmez-vous définitivement cet accord transactionnel avec l'acheteur ?")) {
            dispatch(confirmInquiryAgreement(inquiry.id));
        }
    };

    const handleReject = async (e) => {
        e.preventDefault();
        if (window.confirm("Êtes-vous sûr de vouloir refuser cette demande ?")) {
            const res = await dispatch(rejectInquiry({ id: inquiry.id, reason: rejectReason }));
            if (rejectInquiry.fulfilled.match(res)) {
                setShowRejectForm(false);
            }
        }
    };

    const handleDeliveryUpdate = (status) => {
        const actionLabel = status === "in_delivery" ? "marquer cette commande en cours d'expédition" : "confirmer la livraison finale";
        if (window.confirm(`Souhaitez-vous ${actionLabel} ?`)) {
            dispatch(updateInquiryDeliveryStatus({ id: inquiry.id, status }));
        }
    };

    if (loading && !inquiry) {
        return (
            <Container className="py-5 text-center">
                <Spinner animation="border" variant="success" />
                <p className="mt-3 text-muted small">Chargement de la négociation commerciale...</p>
            </Container>
        );
    }

    if (!inquiry && !loading) {
        return (
            <Container className="py-5">
                <Alert variant="warning" className="rounded-4 p-4 text-center">
                    <h5>Demande introuvable ou accès non autorisé</h5>
                    <p className="small text-muted mb-3">Cette demande d&apos;achat n&apos;existe pas ou concerne un autre producteur.</p>
                    <Button as={Link} to="/farmer/inquiries" variant="primary" pill>
                        Retour aux demandes reçues
                    </Button>
                </Alert>
            </Container>
        );
    }

    return (
        <Container fluid className="py-4 px-lg-5">
            {/* Back link */}
            <div className="mb-3">
                <Link to="/farmer/inquiries" className="text-decoration-none small text-muted d-inline-flex align-items-center gap-1">
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

            {/* Transaction progress stepper */}
            <Card className="border-0 shadow-sm rounded-4 mb-4">
                <Card.Body className="p-4">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <span className="small text-uppercase fw-bold text-muted">Statut de la transaction commerciale</span>
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
                                { num: 1, label: "Reçue" },
                                { num: 2, label: "Négociation" },
                                { num: 3, label: "Accord de principe" },
                                { num: 4, label: "Confirmé" },
                                { num: 5, label: "Expédition" },
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
                                Fil des négociations & Contre-propositions
                            </h5>
                            <span className="badge bg-light text-dark rounded-pill">
                                {inquiry.negotiations?.length || 0} tour(s)
                            </span>
                        </Card.Header>
                        <Card.Body className="p-4">
                            {/* Initial proposal from buyer */}
                            <div className="p-3 rounded-4 mb-3" style={{ backgroundColor: "var(--af-green-50, #F4F8F5)", border: "1px solid var(--af-green-200, #D2E4DA)" }}>
                                <div className="d-flex justify-content-between align-items-center mb-1">
                                    <strong className="small" style={{ color: "var(--af-green-900, #194638)" }}>
                                        📋 Proposition initiale de l&apos;acheteur ({inquiry.buyer?.name})
                                    </strong>
                                    <span className="text-muted small">
                                        {inquiry.created_at ? new Date(inquiry.created_at).toLocaleDateString("fr-FR") : ""}
                                    </span>
                                </div>
                                <div className="d-flex flex-wrap gap-3 small mt-2">
                                    <span>Quantité : <strong>{inquiry.initial_quantity} kg</strong></span>
                                    <span>Prix proposé : <strong className="text-success">{inquiry.initial_price} DH/kg</strong></span>
                                    <span>Lieu de livraison : <strong>{inquiry.delivery_zone || "Casablanca"}</strong></span>
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
                                    const isMe = neg.sender_id === user?.id || neg.sender_role === "farmer";
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
                                                    {isMe ? "Vous (Exploitant)" : `Acheteur (${neg.sender?.name || inquiry.buyer?.name})`}
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

                            {/* Counter offer & actions for farmer */}
                            {isNegotiable && (
                                <div className="mt-4 pt-3 border-top">
                                    {!showCounterForm && !showRejectForm ? (
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
                                                ✓ Accepter la proposition
                                            </Button>
                                            {isAccepted && (
                                                <Button
                                                    variant="success"
                                                    pill
                                                    isLoading={actionLoading}
                                                    onClick={handleConfirm}
                                                >
                                                    🚀 Confirmer définitivement la vente
                                                </Button>
                                            )}
                                            <Button
                                                variant="ghost"
                                                className="text-danger"
                                                onClick={() => setShowRejectForm(true)}
                                            >
                                                Refuser la demande
                                            </Button>
                                        </div>
                                    ) : showCounterForm ? (
                                        <Card className="border p-3 rounded-4 bg-light">
                                            <h6 className="fw-bold mb-3" style={{ color: "var(--af-green-950, #15372F)" }}>
                                                Proposer vos nouvelles conditions
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
                                                            label="Quantité disponible (kg) *"
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
                                                            label="Date d'expédition possible"
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
                                                            label="Message pour l'acheteur"
                                                            name="message"
                                                            placeholder="Indiquez par exemple : 'Nous pouvons assurer 500kg à 15 DH/kg avec emballage bois inclus'..."
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
                                                            Transmettre la contre-offre
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
                                    ) : (
                                        <Card className="border p-3 rounded-4 bg-light border-danger">
                                            <h6 className="fw-bold text-danger mb-2">
                                                Motif du refus de la demande
                                            </h6>
                                            <form onSubmit={handleReject}>
                                                <Input
                                                    as="textarea"
                                                    rows={2}
                                                    label="Raison du refus (facultatif)"
                                                    name="rejectReason"
                                                    placeholder="Volume indisponible pour cette date, contraintes de transport..."
                                                    value={rejectReason}
                                                    onChange={(e) => setRejectReason(e.target.value)}
                                                />
                                                <div className="d-flex gap-2 mt-3">
                                                    <Button
                                                        type="submit"
                                                        variant="danger"
                                                        pill
                                                        isLoading={actionLoading}
                                                    >
                                                        Confirmer le refus
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        onClick={() => setShowRejectForm(false)}
                                                    >
                                                        Annuler
                                                    </Button>
                                                </div>
                                            </form>
                                        </Card>
                                    )}
                                </div>
                            )}

                            {/* Logistics buttons when confirmed or in delivery */}
                            {(isConfirmed || isInDelivery) && (
                                <div className="mt-4 pt-3 border-top">
                                    <h6 className="fw-bold mb-2" style={{ color: "var(--af-green-950, #15372F)" }}>
                                        Pilotage de l&apos;Acheminement
                                    </h6>
                                    <div className="d-flex flex-wrap gap-2">
                                        {isConfirmed && (
                                            <Button
                                                variant="primary"
                                                pill
                                                isLoading={actionLoading}
                                                onClick={() => handleDeliveryUpdate("in_delivery")}
                                            >
                                                🚚 Expédier la marchandise (En acheminement)
                                            </Button>
                                        )}
                                        {isInDelivery && (
                                            <Button
                                                variant="success"
                                                pill
                                                isLoading={actionLoading}
                                                onClick={() => handleDeliveryUpdate("delivered")}
                                            >
                                                ✓ Confirmer la livraison finale effectuée
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            )}

                            {isDelivered && (
                                <Alert variant="success" className="rounded-4 mt-4 mb-0">
                                    <h6 className="fw-bold mb-1">✓ Transaction menée à terme !</h6>
                                    <p className="small mb-0">
                                        La récolte a été réceptionnée par l&apos;acheteur. La transaction est archivée avec succès.
                                    </p>
                                </Alert>
                            )}
                        </Card.Body>
                    </Card>
                </Col>

                {/* Right col: Buyer Details & Agreement Summary */}
                <Col xs={12} lg={4}>
                    <Card className="border-0 shadow-sm rounded-4 mb-4">
                        <Card.Header className="bg-transparent border-bottom-0 pt-4 px-4 pb-0">
                            <h5 className="fw-bold mb-0" style={{ color: "var(--af-green-950, #15372F)" }}>
                                Acheteur & Modalités
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
                                    🏢
                                </div>
                                <div>
                                    <h6 className="fw-bold mb-0" style={{ color: "var(--af-green-950, #15372F)" }}>
                                        {inquiry.buyer?.name}
                                    </h6>
                                    <span className="small text-muted">
                                        {inquiry.buyer?.company_name || inquiry.buyer?.business_name || "Acheteur Professionnel"}
                                    </span>
                                </div>
                            </div>

                            <div className="d-flex flex-column gap-2 small mb-4">
                                <div className="d-flex justify-content-between">
                                    <span className="text-muted">Produit concerné :</span>
                                    <strong>{inquiry.product?.name}</strong>
                                </div>
                                <div className="d-flex justify-content-between">
                                    <span className="text-muted">Volume négocié :</span>
                                    <strong>{inquiry.current_quantity} kg</strong>
                                </div>
                                <div className="d-flex justify-content-between">
                                    <span className="text-muted">Prix convenu :</span>
                                    <strong className="text-success">{inquiry.current_price} DH / kg</strong>
                                </div>
                                <div className="d-flex justify-content-between">
                                    <span className="text-muted">Zone de livraison :</span>
                                    <strong>{inquiry.delivery_zone || "Casablanca"}</strong>
                                </div>
                                <div className="d-flex justify-content-between">
                                    <span className="text-muted">Date souhaitée :</span>
                                    <strong>{inquiry.desired_delivery_date || "À convenir"}</strong>
                                </div>
                                <hr className="my-2" />
                                <div className="d-flex justify-content-between fs-6">
                                    <span className="fw-bold">Valeur totale :</span>
                                    <strong className="text-success fs-5">
                                        {(Number(inquiry.current_quantity || 0) * Number(inquiry.current_price || 0)).toFixed(2)} DH
                                    </strong>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>

                    {/* Logistics Card */}
                    <Card className="border-0 shadow-sm rounded-4">
                        <Card.Body className="p-4">
                            <h6 className="fw-bold mb-3" style={{ color: "var(--af-green-950, #15372F)" }}>
                                📦 Statut Logistique
                            </h6>
                            <p className="small text-muted mb-2">
                                Étape actuelle : <Badge bg={statusMeta.bg} text={statusMeta.text}>{statusMeta.label}</Badge>
                            </p>
                            <p className="small text-muted mb-0">
                                Dès validation de l&apos;accord, vous pouvez déclencher l&apos;expédition de vos caisses ou palettes directement vers la destination convenue.
                            </p>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}
