import { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { Row, Col, Alert } from "react-bootstrap";
import { fetchCart, clearCart } from "../../../features/orders/cartSlice";
import {
    selectCartItems,
    selectCartTotal,
    selectCartCount,
    selectCartLoading,
} from "../../../features/orders/orderSelectors";
import { createInquiry } from "../../../features/inquiries/inquirySlice";
import { Button, LoadingState, Badge, EmptyState } from "../../../components/common";

/**
 * RequestSummaryPage – Récapitulatif de la demande d'approvisionnement B2B
 *
 * Remplace le Checkout e-commerce classique (cassé).
 * Soumet une PurchaseInquiry par article du panier via le workflow B2B Lot 12.
 *
 * Route : /client/checkout (inchangée pour ne pas casser les liens existants)
 */
export default function CheckoutPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const rawCartItems = useSelector(selectCartItems);
    const cartItems = useMemo(() => rawCartItems || [], [rawCartItems]);
    const cartTotal = useSelector(selectCartTotal) || 0;
    const cartCount = useSelector(selectCartCount) || 0;
    const cartLoading = useSelector(selectCartLoading);

    const [hasLoadedCart, setHasLoadedCart] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState(null);
    const [message, setMessage] = useState("");
    const [deliveryZone, setDeliveryZone] = useState("");

    useEffect(() => {
        dispatch(fetchCart()).finally(() => setHasLoadedCart(true));
    }, [dispatch]);

    // Redirection si panier vide une fois chargé
    useEffect(() => {
        if (hasLoadedCart && !cartLoading && cartItems.length === 0) {
            navigate("/client/cart");
        }
    }, [hasLoadedCart, cartLoading, cartItems, navigate]);

    async function handleSubmit(e) {
        e.preventDefault();
        setSubmitError(null);
        setSubmitting(true);

        const errors = [];

        for (const item of cartItems) {
            const productId = item.harvest?.product_id ?? item.product_id;
            const unitPrice = Number(item.unit_price ?? 0);

            if (!productId) {
                errors.push(`Article #${item.id} : produit introuvable.`);
                continue;
            }
            if (unitPrice <= 0) {
                errors.push(
                    `Article #${item.id} : le prix unitaire est invalide. Veuillez mettre à jour votre panier.`
                );
                continue;
            }

            const payload = {
                product_id: productId,
                harvest_id: item.harvest_id ?? null,
                quantity_standard_id: item.quantity_standard_id ?? null,
                quantity: item.quantity,
                proposed_price: unitPrice,
                delivery_zone: deliveryZone.trim() || null,
                desired_delivery_date: null,
                message: message.trim() || null,
            };

            const result = await dispatch(createInquiry(payload));
            if (result.meta?.requestStatus === "rejected") {
                const errMsg =
                    typeof result.payload === "string"
                        ? result.payload
                        : JSON.stringify(result.payload);
                errors.push(`${item.harvest?.product?.name ?? "Produit"} : ${errMsg}`);
            }
        }

        setSubmitting(false);

        if (errors.length > 0) {
            setSubmitError(errors.join("\n"));
            return;
        }

        // Tout est soumis — vider le panier et naviguer
        await dispatch(clearCart());
        navigate("/client/inquiries");
    }

    // — États de chargement et vide —
    if (cartLoading && !hasLoadedCart) {
        return (
            <div className="af-dashboard-container">
                <LoadingState message="Préparation de votre récapitulatif..." />
            </div>
        );
    }

    if (hasLoadedCart && cartItems.length === 0) {
        return (
            <div className="af-dashboard-container">
                <EmptyState
                    icon="🛒"
                    title="Votre panier est vide"
                    description="Ajoutez des produits depuis le catalogue avant de finaliser votre demande."
                    action={
                        <Button variant="primary" pill onClick={() => navigate("/products")}>
                            Explorer le catalogue
                        </Button>
                    }
                />
            </div>
        );
    }

    return (
        <div className="af-dashboard-container">
            {/* ── 1. En-tête ───────────────────────────────────────────────── */}
            <div className="af-dashboard-header-row">
                <div className="af-dashboard-title-group">
                    <div className="d-flex align-items-center gap-2 mb-1 flex-wrap">
                        <Link to="/client/cart" className="text-decoration-none small text-muted">
                            ← Retour au panier
                        </Link>
                        <span className="text-muted">/</span>
                        <h1>Récapitulatif de la Demande</h1>
                        <Badge variant="primary" size="md">
                            {cartCount} lot{cartCount > 1 ? "s" : ""}
                        </Badge>
                    </div>
                    <p>
                        Vérifiez votre sélection et envoyez votre demande directement aux exploitants.
                        Chaque agriculteur sera notifié et pourra accepter ou négocier les conditions.
                    </p>
                </div>
            </div>

            {/* Alerte d'erreur de soumission */}
            {submitError && (
                <Alert variant="danger" className="rounded-3 shadow-sm mb-4">
                    <strong>Certaines demandes n'ont pas pu être soumises :</strong>
                    <pre className="mb-0 mt-2 small" style={{ whiteSpace: "pre-wrap" }}>
                        {submitError}
                    </pre>
                </Alert>
            )}

            <form onSubmit={handleSubmit}>
                <Row className="g-4">
                    {/* ── 2. Articles sélectionnés ──────────────────────────── */}
                    <Col lg={7}>
                        <div className="af-panel-card mb-4">
                            <div className="af-panel-header mb-3">
                                <h2 className="af-panel-title">Produits sélectionnés</h2>
                                <span className="af-stat-subtitle-text">
                                    {cartItems.length} référence{cartItems.length > 1 ? "s" : ""}
                                </span>
                            </div>

                            <div className="d-flex flex-column gap-3">
                                {cartItems.map((item) => {
                                    const productName =
                                        item.harvest?.product?.name ||
                                        `Produit #${item.harvest?.product_id ?? item.product_id}`;
                                    const packLabel =
                                        item.quantity_standard?.label || "Conditionnement standard";
                                    const unitPrice = Number(item.unit_price ?? 0);
                                    const subtotal =
                                        item.subtotal != null
                                            ? Number(item.subtotal)
                                            : unitPrice * item.quantity;
                                    const farmerName =
                                        item.harvest?.product?.farmer?.name ||
                                        item.harvest?.product?.farmer?.company_name ||
                                        "Exploitant agricole";

                                    return (
                                        <div
                                            key={item.id}
                                            className="d-flex align-items-center justify-content-between gap-3 p-3 rounded-4"
                                            style={{
                                                backgroundColor: "var(--af-canvas, #F6F8F5)",
                                                border: "1px solid var(--af-border, #E2E9E3)",
                                            }}
                                        >
                                            {/* Icône + infos */}
                                            <div className="d-flex align-items-center gap-3">
                                                <div
                                                    className="rounded-3 d-flex align-items-center justify-content-center flex-shrink-0"
                                                    style={{
                                                        width: "44px",
                                                        height: "44px",
                                                        backgroundColor: "var(--af-green-100, #E8F2EC)",
                                                        fontSize: "1.3rem",
                                                    }}
                                                >
                                                    🌾
                                                </div>
                                                <div>
                                                    <div
                                                        className="fw-bold small mb-0"
                                                        style={{ color: "var(--af-green-950, #15372F)" }}
                                                    >
                                                        {productName}
                                                    </div>
                                                    <div className="text-muted" style={{ fontSize: "0.78rem" }}>
                                                        {packLabel} · {item.quantity} lot
                                                        {item.quantity > 1 ? "s" : ""} · {farmerName}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Prix */}
                                            <div className="text-end flex-shrink-0">
                                                <div
                                                    className="fw-bold"
                                                    style={{ color: "var(--af-primary-forest, #15372F)" }}
                                                >
                                                    {subtotal.toFixed(2)} DH
                                                </div>
                                                <div className="text-muted" style={{ fontSize: "0.75rem" }}>
                                                    {unitPrice.toFixed(2)} DH / lot
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* ── 3. Informations complémentaires ────────────────── */}
                        <div className="af-panel-card">
                            <h2 className="af-panel-title mb-3">Informations complémentaires</h2>
                            <div className="d-flex flex-column gap-3">
                                <div>
                                    <label className="form-label fw-semibold small text-muted">
                                        Zone de livraison souhaitée
                                        <span className="text-muted fw-normal ms-1">(optionnel)</span>
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control rounded-3"
                                        placeholder="Ex : Casablanca, Rabat-Salé, Marrakech…"
                                        value={deliveryZone}
                                        onChange={(e) => setDeliveryZone(e.target.value)}
                                        maxLength={255}
                                    />
                                </div>
                                <div>
                                    <label className="form-label fw-semibold small text-muted">
                                        Message pour les exploitants
                                        <span className="text-muted fw-normal ms-1">(optionnel)</span>
                                    </label>
                                    <textarea
                                        className="form-control rounded-3"
                                        rows={3}
                                        placeholder="Contraintes de conditionnement, calendrier de réception, volume annuel prévu…"
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        maxLength={2000}
                                    />
                                    <div className="text-end text-muted mt-1" style={{ fontSize: "0.75rem" }}>
                                        {message.length}/2000
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Col>

                    {/* ── 4. Synthèse et validation ─────────────────────────── */}
                    <Col lg={5}>
                        <div className="af-panel-card" style={{ position: "sticky", top: "1.5rem" }}>
                            <h2 className="af-panel-title mb-3">Récapitulatif</h2>

                            {/* Totaux */}
                            <div className="d-flex flex-column gap-2 mb-4">
                                <div className="d-flex justify-content-between text-muted small">
                                    <span>Références sélectionnées</span>
                                    <span className="fw-semibold text-dark">
                                        {cartItems.length} article{cartItems.length > 1 ? "s" : ""}
                                    </span>
                                </div>
                                <div className="d-flex justify-content-between text-muted small">
                                    <span>Total conditionnements</span>
                                    <span className="fw-semibold text-dark">
                                        {cartCount} lot{cartCount > 1 ? "s" : ""}
                                    </span>
                                </div>
                                <div className="d-flex justify-content-between text-muted small">
                                    <span>Demandes à envoyer</span>
                                    <span className="fw-semibold text-dark">{cartItems.length}</span>
                                </div>

                                <hr className="my-2" style={{ borderColor: "var(--af-border, #E2E9E3)" }} />

                                <div className="d-flex justify-content-between align-items-center">
                                    <span
                                        className="fw-bold"
                                        style={{ color: "var(--af-green-950, #15372F)" }}
                                    >
                                        Montant estimé
                                    </span>
                                    <span
                                        className="fs-3 fw-bold"
                                        style={{ color: "var(--af-primary-forest, #15372F)" }}
                                    >
                                        {Number(cartTotal).toLocaleString("fr-FR", {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2,
                                        })}{" "}
                                        DH
                                    </span>
                                </div>
                            </div>

                            {/* Bloc de réassurance */}
                            <div
                                className="p-3 rounded-3 mb-4"
                                style={{
                                    backgroundColor: "var(--af-green-50, #F4F9F6)",
                                    border: "1px solid var(--af-green-200, #C4DFD1)",
                                }}
                            >
                                <div className="d-flex align-items-start gap-2 mb-2">
                                    <span>📋</span>
                                    <span className="small text-dark">
                                        <strong>Pas de paiement immédiat.</strong> Votre demande est
                                        transmise à chaque exploitant qui dispose de 48h pour vous répondre.
                                    </span>
                                </div>
                                <div className="d-flex align-items-start gap-2 mb-2">
                                    <span>🤝</span>
                                    <span className="small text-dark">
                                        <strong>Accord direct.</strong> Vous confirmez uniquement après
                                        acceptation de l'exploitant.
                                    </span>
                                </div>
                                <div className="d-flex align-items-start gap-2">
                                    <span>🔔</span>
                                    <span className="small text-dark">
                                        <strong>Notifications en temps réel</strong> à chaque étape.
                                    </span>
                                </div>
                            </div>

                            {/* CTA */}
                            <Button
                                type="submit"
                                variant="primary"
                                pill
                                size="lg"
                                className="w-100 py-3 fw-bold mb-3"
                                isLoading={submitting}
                                disabled={submitting || cartItems.length === 0}
                            >
                                {submitting
                                    ? "Envoi en cours…"
                                    : `Envoyer ${cartItems.length > 1 ? `${cartItems.length} demandes` : "la demande"} →`}
                            </Button>

                            <div className="text-center text-muted small">
                                En envoyant, chaque exploitant reçoit une notification et peut
                                accepter, refuser ou vous proposer d'autres conditions.
                            </div>
                        </div>
                    </Col>
                </Row>
            </form>
        </div>
    );
}
