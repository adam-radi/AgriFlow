import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Card, Row, Col, Table, Alert, Modal } from "react-bootstrap";
import { fetchOrderById, cancelOrder, clearOrderError, clearOrderSuccess } from "../../../features/orders/orderSlice";
import {
    selectCurrentOrder,
    selectOrdersLoading,
    selectOrdersError,
} from "../../../features/orders/orderSelectors";
import OrderStatusBadge from "../../../components/orders/OrderStatusBadge";
import { LoadingState, Button, Badge } from "../../../components/common";

const ORDER_STEPS = [
    { key: "pending", label: "Commande enregistrée", desc: "En attente de confirmation" },
    { key: "confirmed", label: "Confirmée par l'exploitant", desc: "Validation de la récolte" },
    { key: "processing", label: "Conditionnement & Préparation", desc: "Tri et emballage certifié" },
    { key: "in_delivery", label: "En cours d'acheminement", desc: "Transport direct exploitation" },
    { key: "delivered", label: "Réceptionnée & Conforme", desc: "Lot livré à destination" },
];

function getStepIndex(status) {
    if (!status) return 0;
    const s = status.toLowerCase();
    if (s === "cancelled") return -1;
    if (s === "delivered" || s === "completed") return 4;
    if (s === "in_delivery" || s === "delivering" || s === "ready_for_delivery") return 3;
    if (s === "processing" || s === "preparing" || s === "harvesting") return 2;
    if (s === "confirmed") return 1;
    return 0; // pending
}

/**
 * OrderDetailsPage — Fiche détaillée et suivi logistique d'une commande (Lot 10)
 */
export default function OrderDetailsPage() {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const order = useSelector(selectCurrentOrder);
    const loading = useSelector(selectOrdersLoading);
    const error = useSelector(selectOrdersError);
    const successMsg = useSelector((state) => state.orders.success);

    const [showCancelModal, setShowCancelModal] = useState(false);
    const [cancelling, setCancelling] = useState(false);

    useEffect(() => {
        dispatch(fetchOrderById(id));
        return () => {
            dispatch(clearOrderError());
            dispatch(clearOrderSuccess());
        };
    }, [dispatch, id]);

    const handleConfirmCancel = async () => {
        setCancelling(true);
        const res = await dispatch(cancelOrder(id));
        setCancelling(false);
        setShowCancelModal(false);
        if (res.meta?.requestStatus === "fulfilled") {
            dispatch(fetchOrderById(id));
        }
    };

    if (loading && !order) {
        return (
            <div className="af-dashboard-container">
                <LoadingState message="Chargement des détails de la commande..." />
            </div>
        );
    }

    if (error && !order) {
        return (
            <div className="af-dashboard-container py-5 text-center">
                <Alert variant="danger" className="rounded-4 mb-4">
                    {typeof error === "string" ? error : error?.message || "Impossible de charger la commande."}
                </Alert>
                <Link to="/client/orders" className="af-btn-primary-pill">
                    ← Retour à mes commandes
                </Link>
            </div>
        );
    }

    const currentStep = getStepIndex(order?.status);
    const isCancelled = order?.status === "cancelled";
    const canCancel = order?.status === "pending" || order?.status === "confirmed";

    const totalAmount = order?.total_amount != null
        ? Number(order.total_amount)
        : order?.total != null
        ? Number(order.total)
        : 0;

    const formattedDate = order?.created_at
        ? new Date(order.created_at).toLocaleDateString("fr-FR", {
              day: "numeric",
              month: "long",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
          })
        : "—";

    const formattedDelivery = order?.delivery_date
        ? new Date(order.delivery_date).toLocaleDateString("fr-FR", {
              day: "numeric",
              month: "long",
              year: "numeric",
          })
        : "À convenir avec le producteur";

    return (
        <div className="af-dashboard-container">
            {/* ── 1. Navigation & Header ────────────────────────────────────── */}
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
                <div className="d-flex align-items-center gap-2">
                    <button
                        type="button"
                        className="btn btn-outline-secondary btn-sm rounded-pill px-3"
                        onClick={() => navigate("/client/orders")}
                    >
                        ← Retour aux commandes
                    </button>
                    <span className="text-muted">/</span>
                    <span className="fw-bold" style={{ color: "var(--af-green-950, #15372F)" }}>
                        Commande #{order?.id}
                    </span>
                </div>

                <div className="d-flex align-items-center gap-2">
                    <button
                        type="button"
                        onClick={() => window.print()}
                        className="btn btn-sm btn-outline-success rounded-pill px-3"
                    >
                        🖨️ Imprimer le bon de commande
                    </button>

                    {canCancel && (
                        <button
                            type="button"
                            onClick={() => setShowCancelModal(true)}
                            className="btn btn-sm btn-outline-danger rounded-pill px-3"
                        >
                            Annuler la commande
                        </button>
                    )}
                </div>
            </div>

            {/* Notification de succès */}
            {successMsg && (
                <Alert variant="success" className="rounded-3 shadow-sm mb-4" dismissible onClose={() => dispatch(clearOrderSuccess())}>
                    {successMsg}
                </Alert>
            )}

            {/* ── 2. Statut et Timeline Stepper ─────────────────────────────── */}
            <div className="af-panel-card mb-4">
                <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-4">
                    <div>
                        <h2 className="af-panel-title mb-1">
                            Suivi Logistique de la Commande #{order?.id}
                        </h2>
                        <span className="af-stat-subtitle-text">
                            Enregistrée le {formattedDate}
                        </span>
                    </div>
                    <OrderStatusBadge status={order?.status} size="md" />
                </div>

                {/* Stepper visuel */}
                {isCancelled ? (
                    <Alert variant="danger" className="rounded-3 mb-0">
                        <div className="d-flex align-items-center gap-2">
                            <span className="fs-5">⚠️</span>
                            <div>
                                <strong>Cette commande a été annulée.</strong> Les stocks réservés ont été réaffectés à l&apos;exploitant.
                            </div>
                        </div>
                    </Alert>
                ) : (
                    <div className="af-stepper-container py-3">
                        <Row className="g-3">
                            {ORDER_STEPS.map((step, idx) => {
                                const isDone = idx < currentStep;
                                const isCurrent = idx === currentStep;
                                return (
                                    <Col key={step.key} xs={12} sm={6} lg className="position-relative">
                                        <div
                                            className={`p-3 rounded-4 h-100 transition-all ${
                                                isCurrent
                                                    ? "border-2 shadow-sm"
                                                    : isDone
                                                    ? "opacity-90"
                                                    : "opacity-40"
                                            }`}
                                            style={{
                                                backgroundColor: isCurrent
                                                    ? "var(--af-green-50, #F4F9F6)"
                                                    : "var(--af-canvas, #F6F8F5)",
                                                borderColor: isCurrent
                                                    ? "var(--af-primary-forest, #15372F)"
                                                    : "var(--af-border, #E2E9E3)",
                                                borderStyle: "solid",
                                                borderWidth: isCurrent ? "2px" : "1px",
                                            }}
                                        >
                                            <div className="d-flex align-items-center gap-2 mb-2">
                                                <div
                                                    className="d-flex align-items-center justify-content-center rounded-circle fw-bold"
                                                    style={{
                                                        width: "28px",
                                                        height: "28px",
                                                        backgroundColor: isDone || isCurrent
                                                            ? "var(--af-primary-forest, #15372F)"
                                                            : "#CBD5E1",
                                                        color: "#FFFFFF",
                                                        fontSize: "0.85rem",
                                                    }}
                                                >
                                                    {isDone ? "✓" : idx + 1}
                                                </div>
                                                <span className="fw-bold small" style={{ color: "var(--af-green-950, #15372F)" }}>
                                                    {step.label}
                                                </span>
                                            </div>
                                            <p className="text-muted small mb-0 ps-1" style={{ fontSize: "0.8rem" }}>
                                                {step.desc}
                                            </p>
                                        </div>
                                    </Col>
                                );
                            })}
                        </Row>
                    </div>
                )}
            </div>

            {/* ── 3. Détails des articles & Coordonnées ──────────────────────── */}
            <Row className="g-4">
                {/* Colonne gauche : Tableau des articles */}
                <Col lg={8}>
                    <div className="af-panel-card h-100">
                        <div className="af-panel-header mb-3">
                            <h2 className="af-panel-title">Lots et Produits Commandés</h2>
                            <Badge variant="neutral" size="sm">
                                {order?.items?.length || 0} référence(s)
                            </Badge>
                        </div>

                        <div className="table-responsive">
                            <Table className="align-middle af-dashboard-table mb-0">
                                <thead>
                                    <tr>
                                        <th>Produit agricole</th>
                                        <th>Conditionnement</th>
                                        <th className="text-center">Quantité</th>
                                        <th className="text-end">Prix unitaire</th>
                                        <th className="text-end">Sous-total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {(!order?.items || order.items.length === 0) ? (
                                        <tr>
                                            <td colSpan={5} className="text-center text-muted py-4">
                                                Aucun article spécifié dans cette commande.
                                            </td>
                                        </tr>
                                    ) : (
                                        order.items.map((item, idx) => {
                                            const productName = item.product?.name || `Produit #${item.product_id}`;
                                            const packLabel = item.quantity_standard?.label || "Standard";
                                            const qty = item.quantity ?? 1;
                                            const unitPrice = item.unit_price != null ? Number(item.unit_price) : 0;
                                            const subtotal = item.subtotal != null ? Number(item.subtotal) : unitPrice * qty;

                                            return (
                                                <tr key={item.id || idx}>
                                                    <td>
                                                        <div className="d-flex align-items-center gap-2">
                                                            <div
                                                                className="rounded-circle d-flex align-items-center justify-content-center text-white"
                                                                style={{
                                                                    width: "36px",
                                                                    height: "36px",
                                                                    backgroundColor: "var(--af-primary-forest, #15372F)",
                                                                    fontSize: "1rem",
                                                                }}
                                                            >
                                                                🌱
                                                            </div>
                                                            <div>
                                                                <strong style={{ color: "var(--af-green-950, #15372F)" }}>
                                                                    {productName}
                                                                </strong>
                                                                {item.harvest_id && (
                                                                    <div className="text-muted small">
                                                                        Lot Récolte #{item.harvest_id}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <span
                                                            className="badge px-2 py-1 rounded-pill"
                                                            style={{
                                                                backgroundColor: "var(--af-green-50, #F4F9F6)",
                                                                color: "var(--af-green-900, #194638)",
                                                                border: "1px solid var(--af-green-200, #C4DFD1)",
                                                            }}
                                                        >
                                                            {packLabel}
                                                        </span>
                                                    </td>
                                                    <td className="text-center fw-bold">
                                                        {qty}
                                                    </td>
                                                    <td className="text-end">
                                                        {unitPrice.toFixed(2)} DH
                                                    </td>
                                                    <td className="text-end fw-bold" style={{ color: "var(--af-primary-forest, #15372F)" }}>
                                                        {subtotal.toFixed(2)} DH
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    )}
                                </tbody>
                            </Table>
                        </div>
                    </div>
                </Col>

                {/* Colonne droite : Synthèse financière et livraison */}
                <Col lg={4}>
                    <div className="d-flex flex-column gap-4">
                        {/* Carte Synthèse Financière */}
                        <div className="af-panel-card">
                            <h2 className="af-panel-title mb-3">Récapitulatif Financier</h2>

                            <div className="d-flex flex-column gap-2">
                                <div className="d-flex justify-content-between text-muted small">
                                    <span>Sous-total HT</span>
                                    <span>{totalAmount.toFixed(2)} DH</span>
                                </div>
                                <div className="d-flex justify-content-between text-muted small">
                                    <span>Logistique & Acheminement</span>
                                    <span className="text-success fw-semibold">Inclus / Circuit Court</span>
                                </div>
                                <div className="d-flex justify-content-between text-muted small">
                                    <span>TVA & Taxes</span>
                                    <span>Régime agricole</span>
                                </div>

                                <hr className="my-2" style={{ borderColor: "var(--af-border, #E2E9E3)" }} />

                                <div className="d-flex justify-content-between align-items-center">
                                    <span className="fw-bold" style={{ color: "var(--af-green-950, #15372F)" }}>
                                        Total Net à Payer
                                    </span>
                                    <span
                                        className="fs-4 fw-bold"
                                        style={{ color: "var(--af-primary-forest, #15372F)" }}
                                    >
                                        {totalAmount.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} DH
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Carte Livraison & Exploitation */}
                        <div className="af-panel-card">
                            <h2 className="af-panel-title mb-3">Informations Logistiques</h2>

                            <div className="d-flex flex-column gap-3">
                                <div>
                                    <span className="text-muted small text-uppercase fw-semibold d-block">
                                        Région de destination
                                    </span>
                                    <strong style={{ color: "var(--af-green-950, #15372F)" }}>
                                        📍 {order?.zone || "Maroc (à confirmer)"}
                                    </strong>
                                </div>

                                <div>
                                    <span className="text-muted small text-uppercase fw-semibold d-block">
                                        Date de livraison prévue
                                    </span>
                                    <strong style={{ color: "var(--af-green-950, #15372F)" }}>
                                        📅 {formattedDelivery}
                                    </strong>
                                </div>

                                <div>
                                    <span className="text-muted small text-uppercase fw-semibold d-block">
                                        Mode de règlement
                                    </span>
                                    <strong style={{ color: "var(--af-green-950, #15372F)" }}>
                                        {order?.payment?.status ? `Paiement ${order.payment.status}` : "Paiement à la livraison / Virement direct"}
                                    </strong>
                                </div>

                                <div className="pt-2 border-top" style={{ borderColor: "var(--af-border, #E2E9E3)" }}>
                                    <div className="d-flex align-items-center gap-2">
                                        <span className="fs-5">🛡️</span>
                                        <span className="small text-muted">
                                            Garantie AgriFlow : traçabilité du producteur à l&apos;acheteur.
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Col>
            </Row>

            {/* Modal d'annulation de commande */}
            <Modal show={showCancelModal} onHide={() => setShowCancelModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title className="fw-bold fs-5">Confirmer l&apos;annulation</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p className="mb-0">
                        Êtes-vous sûr de vouloir annuler la commande <strong>#{order?.id}</strong> ?
                        Cette action est irréversible et libérera les récoltes réservées.
                    </p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="outline" pill onClick={() => setShowCancelModal(false)}>
                        Conserver la commande
                    </Button>
                    <Button variant="danger" pill isLoading={cancelling} onClick={handleConfirmCancel}>
                        Confirmer l&apos;annulation
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}
