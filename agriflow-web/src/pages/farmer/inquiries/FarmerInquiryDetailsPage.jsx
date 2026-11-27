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

// Visuels B2B professionnels pour lots en gros, caisses de récoltes et palettes
const WHOLESALE_FALLBACK_IMAGES = [
    "https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&q=80", // Marché de gros / Caisses de récoltes
    "https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?w=800&q=80", // Caisses de tomates en gros
    "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=800&q=80", // Cagettes d'agrumes
];

const STATUS_CONFIG = {
    pending: {
        label: "Nouvelle demande à traiter",
        subtitle: "L'acheteur professionnel attend votre décision commerciale",
        badgeBg: "#FEF3C7",
        badgeColor: "#92400E",
        badgeBorder: "#FDE68A",
    },
    accepted: {
        label: "Vous avez accepté l'offre",
        subtitle: "L'acheteur a été notifié pour confirmer définitivement la commande",
        badgeBg: "#D1FAE5",
        badgeColor: "#065F46",
        badgeBorder: "#A7F3D0",
    },
    confirmed: {
        label: "Accord scellé & confirmé",
        subtitle: "Transaction commerciale validée — Lot prêt pour préparation",
        badgeBg: "#E8F2EC",
        badgeColor: "#15372F",
        badgeBorder: "#398565",
    },
    rejected: {
        label: "Demande refusée",
        subtitle: "Vous avez décliné cette proposition d'achat",
        badgeBg: "#FEE2E2",
        badgeColor: "#991B1B",
        badgeBorder: "#FECACA",
    },
    cancelled: {
        label: "Annulée par l'acheteur",
        subtitle: "L'acheteur a retiré sa demande d'approvisionnement",
        badgeBg: "#F3F4F6",
        badgeColor: "#4B5563",
        badgeBorder: "#E5E7EB",
    },
};

export default function FarmerInquiryDetailsPage() {
    const { id } = useParams();
    const dispatch = useDispatch();
    const inquiry = useSelector(selectCurrentInquiry);
    const loading = useSelector(selectInquiryLoading);
    const actionLoading = useSelector(selectInquiryActionLoading);
    const error = useSelector(selectInquiryError);
    const successMessage = useSelector(selectInquirySuccessMessage);

    const [selectedPhoto, setSelectedPhoto] = useState(null);
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

    useEffect(() => {
        if (inquiry?.product?.image) {
            setSelectedPhoto(inquiry.product.image);
        } else {
            setSelectedPhoto(WHOLESALE_FALLBACK_IMAGES[0]);
        }
    }, [inquiry]);

    const statusMeta = STATUS_CONFIG[inquiry?.status] || {
        label: inquiry?.status,
        subtitle: "",
        badgeBg: "#F3F4F6",
        badgeColor: "#4B5563",
        badgeBorder: "#E5E7EB",
    };

    const isPending = inquiry?.status === "pending";
    const isAccepted = inquiry?.status === "accepted";
    const isConfirmed = inquiry?.status === "confirmed";
    const isRejected = inquiry?.status === "rejected";
    const isCancelled = inquiry?.status === "cancelled";

    const totalEstimated = (Number(inquiry?.current_quantity || 0) * Number(inquiry?.current_price || 0)).toFixed(2);
    const unitLabel = inquiry?.quantity_standard?.label || "kg (vrac / caisses)";

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
                <p className="mt-3 text-muted small">Chargement des détails de la demande...</p>
            </Container>
        );
    }

    if (!inquiry && !loading) {
        return (
            <Container className="py-5">
                <Card className="border-0 shadow-sm rounded-4 p-5 text-center bg-white">
                    <h4 className="fw-bold mb-2" style={{ color: "var(--af-green-950, #15372F)" }}>
                        Demande d&apos;achat introuvable
                    </h4>
                    <p className="text-muted small mb-4">
                        Cette demande n&apos;existe pas ou concerne une autre exploitation.
                    </p>
                    <div>
                        <Button as={Link} to="/farmer/inquiries" variant="primary" pill>
                            Retour à mes demandes reçues
                        </Button>
                    </div>
                </Card>
            </Container>
        );
    }

    const productPhotos = [
        inquiry.product?.image || WHOLESALE_FALLBACK_IMAGES[0],
        WHOLESALE_FALLBACK_IMAGES[1],
        WHOLESALE_FALLBACK_IMAGES[2],
    ];

    return (
        <Container fluid className="py-4 px-lg-5" style={{ maxWidth: "1280px" }}>
            {/* ── BREADCRUMB / RETOUR ────────────────────────────────────────────── */}
            <div className="mb-4">
                <Link
                    to="/farmer/inquiries"
                    className="btn btn-sm btn-light rounded-pill px-3 py-2 text-decoration-none d-inline-flex align-items-center gap-2"
                    style={{ color: "var(--af-green-900, #194638)", border: "1px solid #E5EBE6" }}
                >
                    <span>←</span>
                    <span className="fw-semibold">Retour aux demandes reçues</span>
                </Link>
            </div>

            {/* ── NOTIFICATIONS BANNER ──────────────────────────────────────────── */}
            {successMessage && (
                <Alert variant="success" dismissible onClose={() => dispatch(clearInquirySuccess())} className="rounded-4 shadow-sm mb-4 border-0">
                    ✓ {successMessage}
                </Alert>
            )}
            {error && (
                <Alert variant="danger" dismissible onClose={() => dispatch(clearInquiryError())} className="rounded-4 shadow-sm mb-4 border-0">
                    ✕ {typeof error === "string" ? error : error?.message || "Une erreur est survenue."}
                </Alert>
            )}

            {/* ── 1. ONE UI HERO HEADER ────────────────────────────────────────── */}
            <div
                className="p-4 p-md-5 rounded-5 mb-4 shadow-sm"
                style={{
                    backgroundColor: "#FFFFFF",
                    border: "1px solid #EAEFEA",
                }}
            >
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3">
                    <div>
                        <div className="d-flex align-items-center gap-2 mb-2">
                            <span className="badge rounded-pill bg-light text-muted border px-3 py-2 fw-semibold" style={{ fontSize: "12px" }}>
                                PROPOSITION REÇUE #{inquiry.id}
                            </span>
                            <span className="text-muted small">
                                Reçue le {inquiry.created_at ? new Date(inquiry.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" }) : ""}
                            </span>
                        </div>
                        <h1 className="fw-bold mb-1" style={{ color: "var(--af-green-950, #15372F)", fontSize: "clamp(1.6rem, 3vw, 2.2rem)", letterSpacing: "-0.02em" }}>
                            {inquiry.product?.name || "Lot agricole en gros"}
                        </h1>
                        <p className="text-muted mb-0 small">
                            {statusMeta.subtitle}
                        </p>
                    </div>

                    {/* Status Pill One UI */}
                    <div
                        className="px-4 py-2 rounded-pill d-inline-flex align-items-center gap-2"
                        style={{
                            backgroundColor: statusMeta.badgeBg,
                            color: statusMeta.badgeColor,
                            border: `1.5px solid ${statusMeta.badgeBorder}`,
                            fontWeight: 700,
                            fontSize: "14px",
                        }}
                    >
                        <span
                            className="rounded-circle"
                            style={{
                                width: "9px",
                                height: "9px",
                                backgroundColor: statusMeta.badgeColor,
                            }}
                        />
                        <span>{statusMeta.label}</span>
                    </div>
                </div>
            </div>

            {/* ── 2. SECTION ACTIONS DÉCISIONNELLES (SI NOUVELLE DEMANDE) ────────── */}
            {isPending && (
                <div
                    className="p-4 p-md-5 rounded-5 mb-5 shadow-sm text-white position-relative overflow-hidden"
                    style={{
                        background: "linear-gradient(135deg, #15372F 0%, #205545 100%)",
                    }}
                >
                    <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-center gap-4">
                        <div style={{ maxWidth: "680px" }}>
                            <div className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill bg-white text-dark small fw-bold mb-3">
                                <span>⚡</span> Décision requise sur votre récolte
                            </div>
                            <h3 className="fw-bold mb-2 text-white">
                                Acceptez-vous de vendre ce volume à ces conditions ?
                            </h3>
                            <p className="mb-0 text-white-50 small">
                                L&apos;acheteur professionnel propose d&apos;acquérir <strong>{inquiry.current_quantity} kg</strong> au prix de <strong>{inquiry.current_price} DH/kg</strong> (Total de la vente : <strong>{totalEstimated} DH</strong>).
                            </p>
                        </div>
                        <div className="d-flex flex-column flex-sm-row gap-2 flex-shrink-0">
                            <button
                                type="button"
                                onClick={() => setShowAcceptModal(true)}
                                disabled={actionLoading}
                                className="btn btn-lg rounded-pill px-4 fw-bold shadow-sm"
                                style={{
                                    backgroundColor: "#FFFFFF",
                                    color: "var(--af-green-950, #15372F)",
                                    border: "none",
                                    fontSize: "15px",
                                }}
                            >
                                ✓ Accepter la demande d&apos;achat
                            </button>
                            <button
                                type="button"
                                onClick={() => setShowRejectModal(true)}
                                className="btn btn-lg btn-outline-light rounded-pill px-4 fw-semibold"
                                style={{ fontSize: "14px" }}
                            >
                                Refuser
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {isAccepted && (
                <div
                    className="p-4 rounded-4 mb-4"
                    style={{
                        backgroundColor: "#ECFDF5",
                        border: "1px solid #A7F3D0",
                        color: "#065F46",
                    }}
                >
                    <div className="d-flex align-items-center gap-3">
                        <span className="fs-3">✓</span>
                        <div>
                            <strong className="d-block fs-6">Demande acceptée par votre exploitation !</strong>
                            <span className="small">
                                L&apos;acheteur a reçu votre accord. Dès qu&apos;il confirme définitivement le dossier, la commande sera scellée.
                            </span>
                        </div>
                    </div>
                </div>
            )}

            {isConfirmed && (
                <div
                    className="p-4 rounded-4 mb-4"
                    style={{
                        backgroundColor: "#ECFDF5",
                        border: "1px solid #A7F3D0",
                        color: "#065F46",
                    }}
                >
                    <div className="d-flex align-items-center gap-3">
                        <span className="fs-3">🎉</span>
                        <div>
                            <strong className="d-block fs-6">Vente confirmée et validée !</strong>
                            <span className="small">
                                La commande est scellée. Veuillez préparer le lot ({inquiry.current_quantity} kg) pour la mise à disposition convenue.
                            </span>
                        </div>
                    </div>
                </div>
            )}

            {isRejected && (
                <div
                    className="p-4 rounded-4 mb-4"
                    style={{
                        backgroundColor: "#FEF2F2",
                        border: "1px solid #FECACA",
                        color: "#991B1B",
                    }}
                >
                    <strong>Demande refusée par votre exploitation</strong>
                </div>
            )}

            {/* ── 3. GRILLE MÉTRIQUE ONE UI (CHIFFRES CLÉS) ───────────────────────── */}
            <Row className="g-3 mb-5">
                <Col xs={12} sm={6} lg={3}>
                    <div
                        className="p-4 rounded-4 h-100 bg-white shadow-xs"
                        style={{ border: "1px solid #EAEFEA" }}
                    >
                        <span className="text-muted small d-block mb-1 text-uppercase fw-semibold" style={{ fontSize: "11px", letterSpacing: "0.04em" }}>
                            Volume demandé
                        </span>
                        <div className="d-flex align-items-baseline gap-1">
                            <span className="fw-bold fs-3" style={{ color: "var(--af-green-950, #15372F)" }}>
                                {inquiry.current_quantity}
                            </span>
                            <span className="text-muted fw-semibold small">kg</span>
                        </div>
                        <span className="small text-muted d-block mt-1" style={{ fontSize: "12px" }}>
                            Conditionnement : {unitLabel}
                        </span>
                    </div>
                </Col>

                <Col xs={12} sm={6} lg={3}>
                    <div
                        className="p-4 rounded-4 h-100 bg-white shadow-xs"
                        style={{ border: "1px solid #EAEFEA" }}
                    >
                        <span className="text-muted small d-block mb-1 text-uppercase fw-semibold" style={{ fontSize: "11px", letterSpacing: "0.04em" }}>
                            Prix unitaire proposé
                        </span>
                        <div className="d-flex align-items-baseline gap-1">
                            <span className="fw-bold fs-3 text-success">
                                {inquiry.current_price}
                            </span>
                            <span className="text-muted fw-semibold small">DH / kg</span>
                        </div>
                        <span className="small text-muted d-block mt-1" style={{ fontSize: "12px" }}>
                            Proposition de l&apos;acheteur
                        </span>
                    </div>
                </Col>

                <Col xs={12} sm={6} lg={3}>
                    <div
                        className="p-4 rounded-4 h-100 bg-white shadow-xs"
                        style={{ border: "1px solid #EAEFEA" }}
                    >
                        <span className="text-muted small d-block mb-1 text-uppercase fw-semibold" style={{ fontSize: "11px", letterSpacing: "0.04em" }}>
                            Valeur totale de la vente
                        </span>
                        <div className="d-flex align-items-baseline gap-1">
                            <span className="fw-bold fs-3" style={{ color: "var(--af-green-950, #15372F)" }}>
                                {totalEstimated}
                            </span>
                            <span className="text-muted fw-semibold small">DH</span>
                        </div>
                        <span className="small text-muted d-block mt-1" style={{ fontSize: "12px" }}>
                            Montant estimé de la transaction
                        </span>
                    </div>
                </Col>

                <Col xs={12} sm={6} lg={3}>
                    <div
                        className="p-4 rounded-4 h-100 bg-white shadow-xs"
                        style={{ border: "1px solid #EAEFEA" }}
                    >
                        <span className="text-muted small d-block mb-1 text-uppercase fw-semibold" style={{ fontSize: "11px", letterSpacing: "0.04em" }}>
                            Lieu & Date souhaitée
                        </span>
                        <div className="fw-bold fs-6 text-dark text-truncate">
                            {inquiry.delivery_zone || "Maroc"}
                        </div>
                        <span className="small text-muted d-block mt-1" style={{ fontSize: "12px" }}>
                            Date visée : <strong>{inquiry.desired_delivery_date || "À convenir"}</strong>
                        </span>
                    </div>
                </Col>
            </Row>

            {/* ── 4. SECTION PRINCIPALE : PRODUIT & PHOTOS DU LOT ─────────────────── */}
            <Card className="border-0 shadow-sm rounded-5 mb-5 overflow-hidden bg-white">
                <Card.Header className="bg-white border-bottom-0 pt-4 px-4 px-md-5 pb-0">
                    <div className="d-flex align-items-center justify-content-between">
                        <div>
                            <span className="text-uppercase small fw-bold text-muted" style={{ letterSpacing: "0.05em" }}>
                                Récolte Concernée
                            </span>
                            <h4 className="fw-bold mb-0 mt-1" style={{ color: "var(--af-green-950, #15372F)" }}>
                                Photos du produit et détails du lot
                            </h4>
                        </div>
                        <Badge bg="light" text="dark" className="border px-3 py-2 rounded-pill small">
                            Lot professionnel B2B
                        </Badge>
                    </div>
                </Card.Header>
                <Card.Body className="p-4 p-md-5">
                    <Row className="g-4 align-items-center">
                        {/* Photos du produit */}
                        <Col xs={12} lg={5}>
                            <div
                                className="rounded-4 overflow-hidden mb-3 shadow-xs position-relative"
                                style={{
                                    height: "280px",
                                    backgroundColor: "var(--af-green-100, #E8F2EC)",
                                    border: "1px solid #E5EBE6",
                                }}
                            >
                                <img
                                    src={selectedPhoto || WHOLESALE_FALLBACK_IMAGES[0]}
                                    alt={inquiry.product?.name || "Produit agricole"}
                                    style={{
                                        width: "100%",
                                        height: "100%",
                                        objectFit: "cover",
                                    }}
                                />
                                <span
                                    className="position-absolute bottom-0 start-0 m-3 px-3 py-1 rounded-pill small bg-white text-dark fw-bold shadow-sm"
                                    style={{ fontSize: "11px" }}
                                >
                                    📸 Vue de votre lot
                                </span>
                            </div>

                            {/* Galerie de vignettes de gros */}
                            <div className="d-flex gap-2">
                                {productPhotos.map((imgUrl, idx) => (
                                    <button
                                        key={idx}
                                        type="button"
                                        onClick={() => setSelectedPhoto(imgUrl)}
                                        className="p-0 border-0 rounded-3 overflow-hidden"
                                        style={{
                                            width: "72px",
                                            height: "56px",
                                            opacity: selectedPhoto === imgUrl ? 1 : 0.6,
                                            outline: selectedPhoto === imgUrl ? "2.5px solid var(--af-green-700, #398565)" : "none",
                                            cursor: "pointer",
                                            transition: "opacity 0.2s, outline 0.2s",
                                        }}
                                    >
                                        <img
                                            src={imgUrl}
                                            alt={`Vue ${idx + 1}`}
                                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                        />
                                    </button>
                                ))}
                            </div>
                        </Col>

                        {/* Informations techniques du produit */}
                        <Col xs={12} lg={7}>
                            <div className="d-flex flex-column gap-3">
                                <div>
                                    <h5 className="fw-bold mb-1" style={{ color: "var(--af-green-950, #15372F)" }}>
                                        {inquiry.product?.name}
                                    </h5>
                                    <p className="text-muted small mb-0">
                                        {inquiry.product?.description || "Produit issu de votre exploitation agricole certifiée."}
                                    </p>
                                </div>

                                <hr className="my-1 text-muted opacity-25" />

                                <Row className="g-3 small">
                                    <Col xs={6}>
                                        <span className="text-muted d-block">Votre prix catalogue :</span>
                                        <strong>{inquiry.product?.base_price ? `${inquiry.product.base_price} DH / kg` : "Non spécifié"}</strong>
                                    </Col>
                                    <Col xs={6}>
                                        <span className="text-muted d-block">Conditionnement :</span>
                                        <strong>{unitLabel}</strong>
                                    </Col>
                                    <Col xs={6}>
                                        <span className="text-muted d-block">Volume sollicité :</span>
                                        <strong className="text-success">{inquiry.current_quantity} kg</strong>
                                    </Col>
                                    <Col xs={6}>
                                        <span className="text-muted d-block">Zone convenue :</span>
                                        <strong>{inquiry.delivery_zone || "Maroc"}</strong>
                                    </Col>
                                </Row>

                                {inquiry.notes && (
                                    <div className="p-3 rounded-4 mt-2" style={{ backgroundColor: "#F7FAF8", border: "1px solid #E5EBE6" }}>
                                        <span className="fw-bold small d-block mb-1" style={{ color: "var(--af-green-900, #194638)" }}>
                                            📝 Instructions & message de l&apos;acheteur pro :
                                        </span>
                                        <p className="small text-muted mb-0 fst-italic">
                                            &ldquo;{inquiry.notes}&rdquo;
                                        </p>
                                    </div>
                                )}
                            </div>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>

            {/* ── 5. SECTION ACTEURS DE LA TRANSACTION (B2B) ─────────────────────── */}
            <div className="mb-5">
                <div className="mb-3">
                    <span className="text-uppercase small fw-bold text-muted" style={{ letterSpacing: "0.05em" }}>
                        Parties Prenantes
                    </span>
                    <h4 className="fw-bold mb-0 mt-1" style={{ color: "var(--af-green-950, #15372F)" }}>
                        Acteurs de la transaction
                    </h4>
                </div>

                <Row className="g-4">
                    {/* Acheteur Professionnel */}
                    <Col xs={12} md={6}>
                        <div
                            className="p-4 rounded-5 h-100 bg-white shadow-sm"
                            style={{ border: "1px solid #EAEFEA" }}
                        >
                            <div className="d-flex align-items-center gap-3 mb-3 pb-3 border-bottom">
                                <div
                                    className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                                    style={{
                                        width: "52px",
                                        height: "52px",
                                        backgroundColor: "#E0F2FE",
                                        color: "#0369A1",
                                        fontSize: "1.4rem",
                                    }}
                                >
                                    🏢
                                </div>
                                <div>
                                    <span className="badge rounded-pill bg-light text-muted border small mb-1">
                                        ACHETEUR PROFESSIONNEL (DEMANDEUR)
                                    </span>
                                    <h5 className="fw-bold mb-0" style={{ color: "var(--af-green-950, #15372F)" }}>
                                        {inquiry.buyer?.name || "Acheteur Professionnel"}
                                    </h5>
                                </div>
                            </div>

                            <div className="d-flex flex-column gap-2 small">
                                <div className="d-flex justify-content-between">
                                    <span className="text-muted">Établissement / Société :</span>
                                    <strong className="text-dark">{inquiry.buyer?.company_name || inquiry.buyer?.business_name || "Structure B2B"}</strong>
                                </div>
                                <div className="d-flex justify-content-between">
                                    <span className="text-muted">Lieu d&apos;activité :</span>
                                    <strong className="text-dark">{inquiry.buyer?.city || inquiry.delivery_zone || "Maroc"}</strong>
                                </div>
                                {inquiry.buyer?.phone && (
                                    <div className="d-flex justify-content-between">
                                        <span className="text-muted">Contact professionnel :</span>
                                        <strong className="text-dark">{inquiry.buyer.phone}</strong>
                                    </div>
                                )}
                            </div>
                        </div>
                    </Col>

                    {/* Vendeur (Votre Exploitation) */}
                    <Col xs={12} md={6}>
                        <div
                            className="p-4 rounded-5 h-100 bg-white shadow-sm"
                            style={{ border: "1px solid #EAEFEA" }}
                        >
                            <div className="d-flex align-items-center gap-3 mb-3 pb-3 border-bottom">
                                <div
                                    className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                                    style={{
                                        width: "52px",
                                        height: "52px",
                                        backgroundColor: "var(--af-green-100, #E8F2EC)",
                                        color: "var(--af-green-900, #194638)",
                                        fontSize: "1.4rem",
                                    }}
                                >
                                    👨‍🌾
                                </div>
                                <div>
                                    <span className="badge rounded-pill bg-light text-muted border small mb-1">
                                        VENDEUR (VOTRE EXPLOITATION)
                                    </span>
                                    <h5 className="fw-bold mb-0" style={{ color: "var(--af-green-950, #15372F)" }}>
                                        {inquiry.farmer?.name || "Votre Exploitation"}
                                    </h5>
                                </div>
                            </div>

                            <div className="d-flex flex-column gap-2 small">
                                <div className="d-flex justify-content-between">
                                    <span className="text-muted">Bassin de production :</span>
                                    <strong className="text-dark">{inquiry.farmer?.zone || "Maroc"}</strong>
                                </div>
                                <div className="d-flex justify-content-between">
                                    <span className="text-muted">Statut vérification :</span>
                                    <strong className="text-success">✓ Exploitant vérifié AgriFlow</strong>
                                </div>
                            </div>
                        </div>
                    </Col>
                </Row>
            </div>

            {/* ── MODAL : ACCEPTATION DE LA DEMANDE ──────────────────────────────── */}
            <Modal show={showAcceptModal} onHide={() => setShowAcceptModal(false)} centered contentClassName="rounded-5 border-0 shadow-lg p-3">
                <Modal.Header closeButton className="border-bottom-0 pb-0">
                    <Modal.Title className="fw-bold" style={{ color: "var(--af-green-950, #15372F)" }}>
                        Accepter la demande d&apos;achat
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="py-3">
                    <p className="text-muted small mb-3">
                        En confirmant, vous indiquez à l&apos;acheteur pro <strong>{inquiry.buyer?.name}</strong> que vous acceptez de lui fournir <strong>{inquiry.current_quantity} kg</strong> au tarif proposé de <strong>{inquiry.current_price} DH/kg</strong> (Total : <strong>{totalEstimated} DH</strong>).
                    </p>
                    <div className="d-flex justify-content-end gap-2 pt-2">
                        <Button variant="ghost" onClick={() => setShowAcceptModal(false)}>
                            Annuler
                        </Button>
                        <Button variant="primary" pill onClick={handleAccept} isLoading={actionLoading}>
                            Confirmer l&apos;accord
                        </Button>
                    </div>
                </Modal.Body>
            </Modal>

            {/* ── MODAL : REFUS DE LA DEMANDE ────────────────────────────────────── */}
            <Modal show={showRejectModal} onHide={() => setShowRejectModal(false)} centered contentClassName="rounded-5 border-0 shadow-lg p-3">
                <Modal.Header closeButton className="border-bottom-0 pb-0">
                    <Modal.Title className="fw-bold text-danger">
                        Refuser la demande d&apos;achat
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="py-3">
                    <form onSubmit={handleReject}>
                        <p className="text-muted small mb-3">
                            Indiquez un motif optionnel de refus pour informer le professionnel.
                        </p>
                        <Input
                            as="textarea"
                            rows={3}
                            label="Motif du refus (facultatif)"
                            name="rejectReason"
                            placeholder="Ex : Capacité de récolte insuffisante pour cette date, volume minimum non atteint..."
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
