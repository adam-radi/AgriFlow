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

// Visuels B2B professionnels pour lots en gros, caisses de récoltes et palettes
const WHOLESALE_FALLBACK_IMAGES = [
    "https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&q=80", // Marché de gros / Caisses de récoltes
    "https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?w=800&q=80", // Caisses de tomates en gros
    "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=800&q=80", // Cagettes d'agrumes
];

const STATUS_CONFIG = {
    pending: {
        label: "En attente de décision",
        subtitle: "L'exploitant examine actuellement votre proposition",
        badgeBg: "#FEF3C7",
        badgeColor: "#92400E",
        badgeBorder: "#FDE68A",
    },
    accepted: {
        label: "Proposition acceptée",
        subtitle: "L'exploitant a validé vos conditions — En attente de votre confirmation",
        badgeBg: "#D1FAE5",
        badgeColor: "#065F46",
        badgeBorder: "#A7F3D0",
    },
    confirmed: {
        label: "Accord scellé & confirmé",
        subtitle: "Transaction commerciale validée par les deux parties",
        badgeBg: "#E8F2EC",
        badgeColor: "#15372F",
        badgeBorder: "#398565",
    },
    rejected: {
        label: "Demande refusée",
        subtitle: "L'exploitant n'a pas pu donner une suite favorable",
        badgeBg: "#FEE2E2",
        badgeColor: "#991B1B",
        badgeBorder: "#FECACA",
    },
    cancelled: {
        label: "Demande annulée",
        subtitle: "Vous avez annulé cette demande d'approvisionnement",
        badgeBg: "#F3F4F6",
        badgeColor: "#4B5563",
        badgeBorder: "#E5E7EB",
    },
};

export default function ClientInquiryDetailsPage() {
    const { id } = useParams();
    const dispatch = useDispatch();
    const inquiry = useSelector(selectCurrentInquiry);
    const loading = useSelector(selectInquiryLoading);
    const actionLoading = useSelector(selectInquiryActionLoading);
    const error = useSelector(selectInquiryError);
    const successMessage = useSelector(selectInquirySuccessMessage);

    const [selectedPhoto, setSelectedPhoto] = useState(null);
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
                        Cette demande n&apos;existe pas ou a été archivée.
                    </p>
                    <div>
                        <Button as={Link} to="/client/inquiries" variant="primary" pill>
                            Retour à mes demandes d&apos;achat
                        </Button>
                    </div>
                </Card>
            </Container>
        );
    }

    // Photos disponibles pour le lot
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
                    to="/client/inquiries"
                    className="btn btn-sm btn-light rounded-pill px-3 py-2 text-decoration-none d-inline-flex align-items-center gap-2"
                    style={{ color: "var(--af-green-900, #194638)", border: "1px solid #E5EBE6" }}
                >
                    <span>←</span>
                    <span className="fw-semibold">Retour aux demandes d&apos;achat</span>
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
                                DOSSIER #{inquiry.id}
                            </span>
                            <span className="text-muted small">
                                Émis le {inquiry.created_at ? new Date(inquiry.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" }) : ""}
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

            {/* ── 2. SECTION ACTIONS DÉCISIONNELLES (SI ACTION REQUISE) ──────────── */}
            {isAccepted && (
                <div
                    className="p-4 p-md-5 rounded-5 mb-5 shadow-sm text-white position-relative overflow-hidden"
                    style={{
                        background: "linear-gradient(135deg, #15372F 0%, #205545 100%)",
                    }}
                >
                    <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-center gap-4">
                        <div style={{ maxWidth: "680px" }}>
                            <div className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill bg-white text-dark small fw-bold mb-3">
                                <span>🎉</span> Décision du producteur
                            </div>
                            <h3 className="fw-bold mb-2 text-white">
                                L&apos;agriculteur a accepté vos conditions d&apos;achat !
                            </h3>
                            <p className="mb-0 text-white-50 small">
                                Le volume de <strong>{inquiry.current_quantity} kg</strong> au tarif proposé de <strong>{inquiry.current_price} DH/kg</strong> est validé par l&apos;exploitant. Cliquez sur le bouton ci-contre pour sceller définitivement la transaction commerciale.
                            </p>
                        </div>
                        <div className="d-flex flex-column flex-sm-row gap-2 flex-shrink-0">
                            <button
                                type="button"
                                onClick={() => setShowConfirmModal(true)}
                                disabled={actionLoading}
                                className="btn btn-lg rounded-pill px-4 fw-bold shadow-sm"
                                style={{
                                    backgroundColor: "#FFFFFF",
                                    color: "var(--af-green-950, #15372F)",
                                    border: "none",
                                    fontSize: "15px",
                                }}
                            >
                                ✓ Confirmer la commande définitivement
                            </button>
                            <button
                                type="button"
                                onClick={() => setShowCancelModal(true)}
                                className="btn btn-lg btn-outline-light rounded-pill px-4 fw-semibold"
                                style={{ fontSize: "14px" }}
                            >
                                Annuler
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {isPending && (
                <div
                    className="p-4 rounded-4 mb-4"
                    style={{
                        backgroundColor: "#FFFBEB",
                        border: "1px solid #FDE68A",
                    }}
                >
                    <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3">
                        <div>
                            <strong className="d-block" style={{ color: "#92400E" }}>
                                ⏳ Demande d&apos;achat en cours d&apos;examen
                            </strong>
                            <span className="small text-muted">
                                L&apos;exploitant examine votre offre. Vous recevrez une notification immédiate dès qu&apos;il accepte ou décline le lot.
                            </span>
                        </div>
                        <Button
                            variant="outline-danger"
                            pill
                            size="sm"
                            onClick={() => setShowCancelModal(true)}
                        >
                            Annuler ma demande
                        </Button>
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
                        <span className="fs-3">✓</span>
                        <div>
                            <strong className="d-block fs-6">Accord transactionnel confirmé !</strong>
                            <span className="small">
                                Cette commande en gros a été validée. L&apos;agriculteur prépare le conditionnement du lot pour la date convenue.
                            </span>
                        </div>
                    </div>
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
                            Tarif négocié de gré à gré
                        </span>
                    </div>
                </Col>

                <Col xs={12} sm={6} lg={3}>
                    <div
                        className="p-4 rounded-4 h-100 bg-white shadow-xs"
                        style={{ border: "1px solid #EAEFEA" }}
                    >
                        <span className="text-muted small d-block mb-1 text-uppercase fw-semibold" style={{ fontSize: "11px", letterSpacing: "0.04em" }}>
                            Valeur totale estimée
                        </span>
                        <div className="d-flex align-items-baseline gap-1">
                            <span className="fw-bold fs-3" style={{ color: "var(--af-green-950, #15372F)" }}>
                                {totalEstimated}
                            </span>
                            <span className="text-muted fw-semibold small">DH</span>
                        </div>
                        <span className="small text-muted d-block mt-1" style={{ fontSize: "12px" }}>
                            Règlement convenu avec l&apos;exploitant
                        </span>
                    </div>
                </Col>

                <Col xs={12} sm={6} lg={3}>
                    <div
                        className="p-4 rounded-4 h-100 bg-white shadow-xs"
                        style={{ border: "1px solid #EAEFEA" }}
                    >
                        <span className="text-muted small d-block mb-1 text-uppercase fw-semibold" style={{ fontSize: "11px", letterSpacing: "0.04em" }}>
                            Date & Destination
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
                                Fiche Marchandise
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
                        {/* Photos du produit (Vue principale + vignettes de gros) */}
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
                                    📸 Vue du lot agricole
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
                                        {inquiry.product?.description || "Récolte certifiée d'origine marocaine, triée et conditionnée pour le marché professionnel de gros."}
                                    </p>
                                </div>

                                <hr className="my-1 text-muted opacity-25" />

                                <Row className="g-3 small">
                                    <Col xs={6}>
                                        <span className="text-muted d-block">Prix catalogue de base :</span>
                                        <strong>{inquiry.product?.base_price ? `${inquiry.product.base_price} DH / kg` : "Non spécifié"}</strong>
                                    </Col>
                                    <Col xs={6}>
                                        <span className="text-muted d-block">Conditionnement :</span>
                                        <strong>{unitLabel}</strong>
                                    </Col>
                                    <Col xs={6}>
                                        <span className="text-muted d-block">Origine :</span>
                                        <strong>Bassin {inquiry.farmer?.zone || "Maroc"}</strong>
                                    </Col>
                                    <Col xs={6}>
                                        <span className="text-muted d-block">Disponibilité :</span>
                                        <span className="text-success fw-bold">✓ Direct producteur</span>
                                    </Col>
                                </Row>

                                {inquiry.notes && (
                                    <div className="p-3 rounded-4 mt-2" style={{ backgroundColor: "#F7FAF8", border: "1px solid #E5EBE6" }}>
                                        <span className="fw-bold small d-block mb-1" style={{ color: "var(--af-green-900, #194638)" }}>
                                            📝 Précisions ou instructions transmises :
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
                    {/* Vendeur (Exploitant Agricole) */}
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
                                        VENDEUR / EXPLOITANT
                                    </span>
                                    <h5 className="fw-bold mb-0" style={{ color: "var(--af-green-950, #15372F)" }}>
                                        {inquiry.farmer?.name || "Exploitant Agricole"}
                                    </h5>
                                </div>
                            </div>

                            <div className="d-flex flex-column gap-2 small">
                                <div className="d-flex justify-content-between">
                                    <span className="text-muted">Bassin agricole :</span>
                                    <strong className="text-dark">{inquiry.farmer?.zone || "Maroc"}</strong>
                                </div>
                                <div className="d-flex justify-content-between">
                                    <span className="text-muted">Statut vérification :</span>
                                    <strong className="text-success">✓ Exploitant vérifié</strong>
                                </div>
                                {inquiry.farmer?.phone && (
                                    <div className="d-flex justify-content-between">
                                        <span className="text-muted">Contact direct :</span>
                                        <strong className="text-dark">{inquiry.farmer.phone}</strong>
                                    </div>
                                )}
                            </div>
                        </div>
                    </Col>

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
                                        ACHETEUR PROFESSIONNEL
                                    </span>
                                    <h5 className="fw-bold mb-0" style={{ color: "var(--af-green-950, #15372F)" }}>
                                        {inquiry.buyer?.name || "Acheteur Pro"}
                                    </h5>
                                </div>
                            </div>

                            <div className="d-flex flex-column gap-2 small">
                                <div className="d-flex justify-content-between">
                                    <span className="text-muted">Établissement / Société :</span>
                                    <strong className="text-dark">{inquiry.buyer?.company_name || inquiry.buyer?.business_name || "Structure commerciale B2B"}</strong>
                                </div>
                                <div className="d-flex justify-content-between">
                                    <span className="text-muted">Lieu de livraison :</span>
                                    <strong className="text-dark">{inquiry.delivery_zone || "Maroc"}</strong>
                                </div>
                                {inquiry.buyer?.phone && (
                                    <div className="d-flex justify-content-between">
                                        <span className="text-muted">Téléphone professionnel :</span>
                                        <strong className="text-dark">{inquiry.buyer.phone}</strong>
                                    </div>
                                )}
                            </div>
                        </div>
                    </Col>
                </Row>
            </div>

            {/* ── MODAL : CONFIRMATION DÉFINITIVE PAR L'ACHETEUR ─────────────────── */}
            <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)} centered contentClassName="rounded-5 border-0 shadow-lg p-3">
                <Modal.Header closeButton className="border-bottom-0 pb-0">
                    <Modal.Title className="fw-bold" style={{ color: "var(--af-green-950, #15372F)" }}>
                        Confirmer définitivement la commande
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="py-3">
                    <p className="text-muted small mb-3">
                        Vous vous apprêtez à valider définitivement la commande pour <strong>{inquiry.current_quantity} kg</strong> de <strong>{inquiry.product?.name}</strong> au tarif de <strong>{inquiry.current_price} DH/kg</strong> auprès de <strong>{inquiry.farmer?.name}</strong>.
                    </p>
                    <div className="p-3 rounded-4 bg-light small mb-3">
                        <div className="d-flex justify-content-between mb-1">
                            <span className="text-muted">Montant total de la commande :</span>
                            <strong className="text-success fs-6">{totalEstimated} DH</strong>
                        </div>
                        <div className="d-flex justify-content-between">
                            <span className="text-muted">Destination :</span>
                            <strong>{inquiry.delivery_zone || "Maroc"}</strong>
                        </div>
                    </div>
                    <div className="d-flex justify-content-end gap-2 pt-2">
                        <Button variant="ghost" onClick={() => setShowConfirmModal(false)}>
                            Retour
                        </Button>
                        <Button variant="primary" pill onClick={handleConfirm} isLoading={actionLoading}>
                            Confirmer mon accord
                        </Button>
                    </div>
                </Modal.Body>
            </Modal>

            {/* ── MODAL : ANNULATION DE DEMANDE ──────────────────────────────────── */}
            <Modal show={showCancelModal} onHide={() => setShowCancelModal(false)} centered contentClassName="rounded-5 border-0 shadow-lg p-3">
                <Modal.Header closeButton className="border-bottom-0 pb-0">
                    <Modal.Title className="fw-bold text-danger">
                        Annuler la demande d&apos;achat
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="py-3">
                    <p className="text-muted small mb-3">
                        Êtes-vous sûr de vouloir annuler ce dossier d&apos;approvisionnement ? Cette action notifiera l&apos;agriculteur.
                    </p>
                    <div className="d-flex justify-content-end gap-2 pt-2">
                        <Button variant="ghost" onClick={() => setShowCancelModal(false)}>
                            Garder la demande
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
