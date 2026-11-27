import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Container, Row, Col, Card, Badge, Spinner, Alert, Modal } from "react-bootstrap";
import { Button, Input } from "../../../components/common";
import {
    fetchInquiryById,
    acceptInquiryOffer,
    rejectInquiry,
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
    pending: { label: "Nouvelle demande reçue", bg: "warning", text: "dark" },
    accepted: { label: "Acceptée par vous", bg: "primary", text: "white" },
    confirmed: { label: "Accord confirmé", bg: "success", text: "white" },
    rejected: { label: "Demande refusée", bg: "danger", text: "white" },
    cancelled: { label: "Annulée par l'acheteur", bg: "secondary", text: "white" },
};

export default function FarmerInquiryDetailsPage() {
    const { id } = useParams();
    const dispatch = useDispatch();
    const inquiry = useSelector(selectCurrentInquiry);
    const loading = useSelector(selectInquiryLoading);
    const actionLoading = useSelector(selectInquiryActionLoading);
    const error = useSelector(selectInquiryError);
    const successMessage = useSelector(selectInquirySuccessMessage);

    const [showAcceptModal, setShowAcceptModal] = useState(false);
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [rejectReason, setRejectReason] = useState("");

    useEffect(() => {
        if (id) {
            dispatch(fetchInquiryById(id));
        }
        return () => {
            dispatch(clearInquiryError());
            dispatch(clearInquirySuccess());
        };
    }, [dispatch, id]);

    const statusMeta = STATUS_CONFIG[inquiry?.status] || {
        label: inquiry?.status,
        bg: "secondary",
        text: "white",
    };

    const isPending = inquiry?.status === "pending";
    const isAccepted = inquiry?.status === "accepted";
    const isConfirmed = inquiry?.status === "confirmed";
    const isRejected = inquiry?.status === "rejected";
    const isCancelled = inquiry?.status === "cancelled";

    const totalEstimated = (Number(inquiry?.current_quantity || 0) * Number(inquiry?.current_price || 0)).toFixed(2);

    const handleAccept = async () => {
        const res = await dispatch(acceptInquiryOffer(inquiry.id));
        if (acceptInquiryOffer.fulfilled.match(res)) {
            setShowAcceptModal(false);
        }
    };

    const handleReject = async (e) => {
        e.preventDefault();
        const res = await dispatch(rejectInquiry({ id: inquiry.id, reason: rejectReason }));
        if (rejectInquiry.fulfilled.match(res)) {
            setShowRejectModal(false);
            setRejectReason("");
        }
    };

    if (loading && !inquiry) {
        return (
            <Container className="py-5 text-center">
                <Spinner animation="border" variant="success" />
                <p className="mt-3 text-muted small">Chargement de la demande d&apos;achat...</p>
            </Container>
        );
    }

    if (!inquiry && !loading) {
        return (
            <Container className="py-5">
                <Alert variant="warning" className="rounded-4 p-4 text-center">
                    <h5>Demande d&apos;achat introuvable</h5>
                    <p className="small text-muted mb-3">Cette demande n&apos;existe pas ou a été supprimée.</p>
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
                    ← Retour à mes demandes reçues
                </Link>
            </div>

            {/* Notifications feedback */}
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

            {/* Header */}
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
                <div>
                    <span
                        className="text-uppercase fw-bold small"
                        style={{ color: "var(--af-green-700, #398565)", letterSpacing: "0.05em" }}
                    >
                        Demande d&apos;achat reçue #{inquiry.id}
                    </span>
                    <h2 className="fw-bold mb-1" style={{ color: "var(--af-green-950, #15372F)" }}>
                        {inquiry.product?.name || "Produit agricole"}
                    </h2>
                    <p className="text-muted small mb-0">
                        Acheteur : <strong className="text-dark">{inquiry.buyer?.name}</strong> {inquiry.buyer?.company_name ? `(${inquiry.buyer.company_name})` : ""} · Reçue le {inquiry.created_at ? new Date(inquiry.created_at).toLocaleDateString("fr-FR") : ""}
                    </p>
                </div>
                <div>
                    <Badge bg={statusMeta.bg} text={statusMeta.text} className="fs-6 py-2 px-3 rounded-pill">
                        {statusMeta.label}
                    </Badge>
                </div>
            </div>

            <Row className="g-4">
                {/* Left col: Details & Farmer Action */}
                <Col xs={12} lg={8}>
                    {/* Action buttons when pending */}
                    {isPending && (
                        <div
                            className="p-4 rounded-4 mb-4"
                            style={{
                                backgroundColor: "var(--af-green-50, #F4F8F5)",
                                border: "1px solid var(--af-green-300, #bbf7d0)",
                            }}
                        >
                            <h5 className="fw-bold mb-2" style={{ color: "var(--af-green-950, #15372F)" }}>
                                Décision sur cette demande d&apos;achat
                            </h5>
                            <p className="small text-muted mb-3">
                                Vous pouvez accepter l&apos;offre de l&apos;acheteur aux conditions indiquées, ou la refuser si votre stock ou calendrier ne le permet pas.
                            </p>
                            <div className="d-flex flex-wrap gap-2">
                                <Button
                                    variant="primary"
                                    pill
                                    onClick={() => setShowAcceptModal(true)}
                                    isLoading={actionLoading}
                                >
                                    ✓ Accepter la demande d&apos;achat
                                </Button>
                                <Button
                                    variant="outline-danger"
                                    pill
                                    onClick={() => setShowRejectModal(true)}
                                >
                                    ✕ Refuser la demande
                                </Button>
                            </div>
                        </div>
                    )}

                    {isAccepted && (
                        <Alert variant="info" className="rounded-4 p-4 mb-4">
                            <h5 className="fw-bold mb-1">✓ Demande acceptée</h5>
                            <p className="small mb-0">
                                Vous avez accepté cette proposition. L&apos;acheteur professionnel a été notifié pour confirmer définitivement la commande.
                            </p>
                        </Alert>
                    )}

                    {isConfirmed && (
                        <Alert variant="success" className="rounded-4 p-4 mb-4">
                            <h5 className="fw-bold mb-1">🎉 Accord confirmé définitivement !</h5>
                            <p className="small mb-0">
                                L&apos;acheteur a validé la transaction. Vous pouvez préparer le lot pour la mise à disposition convenue.
                            </p>
                        </Alert>
                    )}

                    {isRejected && (
                        <Alert variant="danger" className="rounded-4 p-4 mb-4">
                            <h5 className="fw-bold mb-1">✕ Demande refusée</h5>
                            <p className="small mb-0">
                                Vous avez refusé cette proposition d&apos;achat.
                            </p>
                        </Alert>
                    )}

                    {isCancelled && (
                        <Alert variant="secondary" className="rounded-4 p-4 mb-4">
                            <h5 className="fw-bold mb-1">Demande annulée par l&apos;acheteur</h5>
                            <p className="small mb-0">
                                L&apos;acheteur a retiré sa demande.
                            </p>
                        </Alert>
                    )}

                    {/* Proposal Details Card */}
                    <Card className="border-0 shadow-sm rounded-4">
                        <Card.Header className="bg-transparent border-bottom-0 pt-4 px-4 pb-0">
                            <h5 className="fw-bold mb-0" style={{ color: "var(--af-green-950, #15372F)" }}>
                                Conditions de la Demande
                            </h5>
                        </Card.Header>
                        <Card.Body className="p-4">
                            <Row className="g-4">
                                <Col xs={12} sm={6}>
                                    <span className="text-muted small d-block">Quantité souhaitée</span>
                                    <strong className="fs-5" style={{ color: "var(--af-green-950, #15372F)" }}>
                                        {inquiry.current_quantity} kg
                                    </strong>
                                </Col>
                                <Col xs={12} sm={6}>
                                    <span className="text-muted small d-block">Prix unitaire proposé</span>
                                    <strong className="fs-5 text-success">
                                        {inquiry.current_price} DH / kg
                                    </strong>
                                </Col>
                                <Col xs={12} sm={6}>
                                    <span className="text-muted small d-block">Lieu de livraison souhaité</span>
                                    <strong className="fs-6 text-dark">
                                        {inquiry.delivery_zone || "Maroc"}
                                    </strong>
                                </Col>
                                <Col xs={12} sm={6}>
                                    <span className="text-muted small d-block">Date d&apos;approvisionnement souhaitée</span>
                                    <strong className="fs-6 text-dark">
                                        {inquiry.desired_delivery_date || "Non spécifiée"}
                                    </strong>
                                </Col>
                                {inquiry.notes && (
                                    <Col xs={12}>
                                        <span className="text-muted small d-block">Message de l&apos;acheteur</span>
                                        <p className="p-3 bg-light rounded-3 small mb-0 text-dark">
                                            {inquiry.notes}
                                        </p>
                                    </Col>
                                )}
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>

                {/* Right col: Buyer Details & Total Value */}
                <Col xs={12} lg={4}>
                    <Card className="border-0 shadow-sm rounded-4 mb-4">
                        <Card.Header className="bg-transparent border-bottom-0 pt-4 px-4 pb-0">
                            <h5 className="fw-bold mb-0" style={{ color: "var(--af-green-950, #15372F)" }}>
                                Acheteur Professionnel
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
                                        {inquiry.buyer?.company_name || "Acheteur B2B"}
                                    </span>
                                </div>
                            </div>

                            <div className="d-flex flex-column gap-2 small">
                                <div className="d-flex justify-content-between">
                                    <span className="text-muted">Valeur totale estimée :</span>
                                    <strong className="fs-5 text-success">{totalEstimated} DH</strong>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Modal: Accept Inquiry */}
            <Modal show={showAcceptModal} onHide={() => setShowAcceptModal(false)} centered contentClassName="rounded-4 border-0">
                <Modal.Header closeButton className="border-bottom-0 pt-4 px-4">
                    <Modal.Title className="fw-bold">Accepter la demande d&apos;achat</Modal.Title>
                </Modal.Header>
                <Modal.Body className="px-4 pb-4">
                    <p className="text-muted small mb-3">
                        En acceptant cette demande, vous indiquez à l&apos;acheteur <strong>{inquiry.buyer?.name}</strong> que vous êtes d&apos;accord pour lui fournir <strong>{inquiry.current_quantity} kg</strong> à <strong>{inquiry.current_price} DH/kg</strong> (Total : <strong>{totalEstimated} DH</strong>).
                    </p>
                    <div className="d-flex justify-content-end gap-2 pt-2">
                        <Button variant="ghost" onClick={() => setShowAcceptModal(false)}>
                            Annuler
                        </Button>
                        <Button variant="primary" pill onClick={handleAccept} isLoading={actionLoading}>
                            Confirmer l&apos;acceptation
                        </Button>
                    </div>
                </Modal.Body>
            </Modal>

            {/* Modal: Reject Inquiry */}
            <Modal show={showRejectModal} onHide={() => setShowRejectModal(false)} centered contentClassName="rounded-4 border-0">
                <Modal.Header closeButton className="border-bottom-0 pt-4 px-4">
                    <Modal.Title className="fw-bold text-danger">Refuser la demande d&apos;achat</Modal.Title>
                </Modal.Header>
                <Modal.Body className="px-4 pb-4">
                    <form onSubmit={handleReject}>
                        <p className="text-muted small mb-3">
                            Veuillez indiquer un motif optionnel de refus pour informer l&apos;acheteur.
                        </p>
                        <Input
                            as="textarea"
                            rows={3}
                            label="Motif du refus (facultatif)"
                            name="rejectReason"
                            placeholder="Ex : Volume non disponible pour cette période, capacité de récolte insuffisante..."
                            value={rejectReason}
                            onChange={(e) => setRejectReason(e.target.value)}
                        />
                        <div className="d-flex justify-content-end gap-2 pt-3">
                            <Button variant="ghost" onClick={() => setShowRejectModal(false)}>
                                Annuler
                            </Button>
                            <Button type="submit" variant="danger" pill isLoading={actionLoading}>
                                Confirmer le refus
                            </Button>
                        </div>
                    </form>
                </Modal.Body>
            </Modal>
        </Container>
    );
}
