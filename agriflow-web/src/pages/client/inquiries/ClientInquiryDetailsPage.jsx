import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Container, Row, Col, Card, Badge, Spinner, Alert, Modal } from "react-bootstrap";
import { Button } from "../../../components/common";
import {
    fetchInquiryById,
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
    pending: { label: "En attente du producteur", bg: "warning", text: "dark" },
    accepted: { label: "Acceptée par le producteur", bg: "primary", text: "white" },
    confirmed: { label: "Accord confirmé", bg: "success", text: "white" },
    rejected: { label: "Demande refusée", bg: "danger", text: "white" },
    cancelled: { label: "Demande annulée", bg: "secondary", text: "white" },
};

export default function ClientInquiryDetailsPage() {
    const { id } = useParams();
    const dispatch = useDispatch();
    const inquiry = useSelector(selectCurrentInquiry);
    const loading = useSelector(selectInquiryLoading);
    const actionLoading = useSelector(selectInquiryActionLoading);
    const error = useSelector(selectInquiryError);
    const successMessage = useSelector(selectInquirySuccessMessage);

    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [showCancelModal, setShowCancelModal] = useState(false);

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

    const handleConfirm = async () => {
        const res = await dispatch(confirmInquiryAgreement(inquiry.id));
        if (confirmInquiryAgreement.fulfilled.match(res)) {
            setShowConfirmModal(false);
        }
    };

    const handleCancel = async () => {
        const res = await dispatch(cancelInquiry(inquiry.id));
        if (cancelInquiry.fulfilled.match(res)) {
            setShowCancelModal(false);
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
                    <Button as={Link} to="/client/inquiries" variant="primary" pill>
                        Retour à mes demandes
                    </Button>
                </Alert>
            </Container>
        );
    }

    return (
        <Container fluid className="py-4 px-lg-5">
            {/* Back link */}
            <div className="mb-3">
                <Link to="/client/inquiries" className="text-decoration-none small text-muted d-inline-flex align-items-center gap-1">
                    ← Retour à mes demandes d&apos;achat
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

            {/* Header info */}
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
                <div>
                    <span
                        className="text-uppercase fw-bold small"
                        style={{ color: "var(--af-green-700, #398565)", letterSpacing: "0.05em" }}
                    >
                        Demande d&apos;achat #{inquiry.id}
                    </span>
                    <h2 className="fw-bold mb-1" style={{ color: "var(--af-green-950, #15372F)" }}>
                        {inquiry.product?.name || "Produit agricole"}
                    </h2>
                    <p className="text-muted small mb-0">
                        Producteur : <strong className="text-dark">{inquiry.farmer?.name}</strong> · Émise le {inquiry.created_at ? new Date(inquiry.created_at).toLocaleDateString("fr-FR") : ""}
                    </p>
                </div>
                <div>
                    <Badge bg={statusMeta.bg} text={statusMeta.text} className="fs-6 py-2 px-3 rounded-pill">
                        {statusMeta.label}
                    </Badge>
                </div>
            </div>

            {/* Workflow status step banner */}
            <Card className="border-0 shadow-sm rounded-4 mb-4">
                <Card.Body className="p-4">
                    <div className="d-flex justify-content-between position-relative py-2">
                        {[
                            { num: 1, label: "Demande envoyée", done: true, active: isPending },
                            { num: 2, label: "Décision du producteur", done: isAccepted || isConfirmed, active: isAccepted },
                            { num: 3, label: "Accord confirmé", done: isConfirmed, active: isConfirmed },
                        ].map((s) => (
                            <div key={s.num} className="d-flex flex-column align-items-center text-center" style={{ flex: 1 }}>
                                <div
                                    className={`rounded-circle d-flex align-items-center justify-content-center fw-bold ${
                                        s.done
                                            ? "bg-success text-white"
                                            : isRejected || isCancelled
                                            ? "bg-light text-muted border"
                                            : "bg-light text-muted border"
                                    }`}
                                    style={{ width: "36px", height: "36px", fontSize: "0.9rem" }}
                                >
                                    {s.done ? "✓" : s.num}
                                </div>
                                <span className={`small mt-2 ${s.active ? "fw-bold text-dark" : "text-muted"}`}>
                                    {s.label}
                                </span>
                            </div>
                        ))}
                    </div>
                </Card.Body>
            </Card>

            <Row className="g-4">
                {/* Main Content: Inquiry Details & Decision callout */}
                <Col xs={12} lg={8}>
                    {/* Decision alert when accepted */}
                    {isAccepted && (
                        <div
                            className="p-4 rounded-4 mb-4"
                            style={{
                                backgroundColor: "var(--af-green-50, #F4F8F5)",
                                border: "2px solid var(--af-green-600, #398565)",
                            }}
                        >
                            <div className="d-flex align-items-start gap-3">
                                <span className="fs-3">🎉</span>
                                <div className="flex-grow-1">
                                    <h5 className="fw-bold mb-1" style={{ color: "var(--af-green-950, #15372F)" }}>
                                        Votre proposition a été acceptée par l&apos;agriculteur !
                                    </h5>
                                    <p className="small text-muted mb-3">
                                        L&apos;exploitant {inquiry.farmer?.name} a validé les conditions (quantité et prix). Veuillez confirmer la commande pour sceller définitivement la transaction.
                                    </p>
                                    <div className="d-flex flex-wrap gap-2">
                                        <Button
                                            variant="primary"
                                            pill
                                            onClick={() => setShowConfirmModal(true)}
                                            isLoading={actionLoading}
                                        >
                                            ✓ Confirmer définitivement la commande
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            className="text-danger"
                                            onClick={() => setShowCancelModal(true)}
                                        >
                                            Annuler ma demande
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {isConfirmed && (
                        <Alert variant="success" className="rounded-4 p-4 mb-4">
                            <h5 className="fw-bold mb-1">✓ Transaction validée et confirmée !</h5>
                            <p className="small mb-0">
                                L&apos;accord d&apos;achat a été confirmé. Le producteur prépare la mise à disposition de la récolte selon les termes convenus.
                            </p>
                        </Alert>
                    )}

                    {isRejected && (
                        <Alert variant="danger" className="rounded-4 p-4 mb-4">
                            <h5 className="fw-bold mb-1">✕ Demande d&apos;achat refusée</h5>
                            <p className="small mb-0">
                                L&apos;exploitant agricole n&apos;a pas pu donner une suite favorable à votre demande pour ce lot.
                            </p>
                        </Alert>
                    )}

                    {isCancelled && (
                        <Alert variant="secondary" className="rounded-4 p-4 mb-4">
                            <h5 className="fw-bold mb-1">Demande d&apos;achat annulée</h5>
                            <p className="small mb-0">
                                Vous avez annulé cette demande. Aucun engagement n&apos;est en cours avec le producteur.
                            </p>
                        </Alert>
                    )}

                    {isPending && (
                        <Alert variant="warning" className="rounded-4 p-4 mb-4">
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <h6 className="fw-bold mb-1">Demande en cours d&apos;examen</h6>
                                    <p className="small mb-0 text-muted">
                                        L&apos;exploitant {inquiry.farmer?.name} étudie votre proposition de prix et de quantité. Vous serez notifié dès sa réponse.
                                    </p>
                                </div>
                                <Button
                                    variant="outline-danger"
                                    pill
                                    size="sm"
                                    onClick={() => setShowCancelModal(true)}
                                >
                                    Annuler la demande
                                </Button>
                            </div>
                        </Alert>
                    )}

                    {/* Inquiry Details Card */}
                    <Card className="border-0 shadow-sm rounded-4">
                        <Card.Header className="bg-transparent border-bottom-0 pt-4 px-4 pb-0">
                            <h5 className="fw-bold mb-0" style={{ color: "var(--af-green-950, #15372F)" }}>
                                Récapitulatif de la Demande d&apos;Achat
                            </h5>
                        </Card.Header>
                        <Card.Body className="p-4">
                            <Row className="g-4">
                                <Col xs={12} sm={6}>
                                    <span className="text-muted small d-block">Volume demandé</span>
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
                                    <span className="text-muted small d-block">Zone de livraison souhaitée</span>
                                    <strong className="fs-6 text-dark">
                                        {inquiry.delivery_zone || "Maroc"}
                                    </strong>
                                </Col>
                                <Col xs={12} sm={6}>
                                    <span className="text-muted small d-block">Date de livraison souhaitée</span>
                                    <strong className="fs-6 text-dark">
                                        {inquiry.desired_delivery_date || "Non spécifiée"}
                                    </strong>
                                </Col>
                                {inquiry.notes && (
                                    <Col xs={12}>
                                        <span className="text-muted small d-block">Instructions ou message transmis</span>
                                        <p className="p-3 bg-light rounded-3 small mb-0 text-dark">
                                            {inquiry.notes}
                                        </p>
                                    </Col>
                                )}
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>

                {/* Right Col: Farmer Info & Total Amount */}
                <Col xs={12} lg={4}>
                    <Card className="border-0 shadow-sm rounded-4 mb-4">
                        <Card.Header className="bg-transparent border-bottom-0 pt-4 px-4 pb-0">
                            <h5 className="fw-bold mb-0" style={{ color: "var(--af-green-950, #15372F)" }}>
                                Exploitant Partenaire
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
                                    👨‍🌾
                                </div>
                                <div>
                                    <h6 className="fw-bold mb-0" style={{ color: "var(--af-green-950, #15372F)" }}>
                                        {inquiry.farmer?.name}
                                    </h6>
                                    <span className="small text-muted">
                                        Exploitant agricole certifié
                                    </span>
                                </div>
                            </div>

                            <div className="d-flex flex-column gap-2 small">
                                <div className="d-flex justify-content-between">
                                    <span className="text-muted">Total estimé :</span>
                                    <strong className="fs-5 text-success">{totalEstimated} DH</strong>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Modal: Confirm Agreement */}
            <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)} centered contentClassName="rounded-4 border-0">
                <Modal.Header closeButton className="border-bottom-0 pt-4 px-4">
                    <Modal.Title className="fw-bold">Confirmer définitivement la commande</Modal.Title>
                </Modal.Header>
                <Modal.Body className="px-4 pb-4">
                    <p className="text-muted small mb-3">
                        En confirmant cette demande, vous validez l&apos;accord transactionnel avec l&apos;exploitant <strong>{inquiry.farmer?.name}</strong> pour <strong>{inquiry.current_quantity} kg</strong> de <strong>{inquiry.product?.name}</strong> à <strong>{inquiry.current_price} DH/kg</strong> (Montant total : <strong>{totalEstimated} DH</strong>).
                    </p>
                    <div className="d-flex justify-content-end gap-2 pt-2">
                        <Button variant="ghost" onClick={() => setShowConfirmModal(false)}>
                            Annuler
                        </Button>
                        <Button variant="primary" pill onClick={handleConfirm} isLoading={actionLoading}>
                            Confirmer mon accord
                        </Button>
                    </div>
                </Modal.Body>
            </Modal>

            {/* Modal: Cancel Inquiry */}
            <Modal show={showCancelModal} onHide={() => setShowCancelModal(false)} centered contentClassName="rounded-4 border-0">
                <Modal.Header closeButton className="border-bottom-0 pt-4 px-4">
                    <Modal.Title className="fw-bold text-danger">Annuler la demande d&apos;achat</Modal.Title>
                </Modal.Header>
                <Modal.Body className="px-4 pb-4">
                    <p className="text-muted small mb-3">
                        Êtes-vous sûr de vouloir annuler cette demande d&apos;achat ? L&apos;agriculteur en sera informé.
                    </p>
                    <div className="d-flex justify-content-end gap-2 pt-2">
                        <Button variant="ghost" onClick={() => setShowCancelModal(false)}>
                            Retour
                        </Button>
                        <Button variant="danger" pill onClick={handleCancel} isLoading={actionLoading}>
                            Oui, annuler la demande
                        </Button>
                    </div>
                </Modal.Body>
            </Modal>
        </Container>
    );
}
