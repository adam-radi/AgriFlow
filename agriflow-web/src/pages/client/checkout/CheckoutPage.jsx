import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { Row, Col, Table, Alert } from "react-bootstrap";
import { createOrder, clearOrderError, clearOrderSuccess } from "../../../features/orders/orderSlice";
import { fetchCart, clearCart } from "../../../features/orders/cartSlice";
import {
    selectCartItems,
    selectCartTotal,
    selectCartCount,
    selectCartLoading,
} from "../../../features/orders/orderSelectors";
import { selectUser } from "../../../features/auth/authSelectors";
import { Button, LoadingState, Badge } from "../../../components/common";

const MOROCCAN_REGIONS = [
    "Casablanca-Settat",
    "Rabat-Salé-Kénitra",
    "Souss-Massa",
    "Marrakech-Safi",
    "Fès-Meknès",
    "Tanger-Tétouan-Al Hoceïma",
    "Béni Mellal-Khénifra",
    "Oriental",
    "Drâa-Tafilalet",
    "Guelmim-Oued Noun",
    "Laâyoune-Sakia El Hamra",
    "Dakhla-Oued Ed-Dahab",
];

/**
 * CheckoutPage — Finalisation et validation de la commande B2B (Lot 10)
 */
export default function CheckoutPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const user = useSelector(selectUser);
    const cartItems = useSelector(selectCartItems) || [];
    const cartTotal = useSelector(selectCartTotal) || 0;
    const cartCount = useSelector(selectCartCount) || 0;
    const cartLoading = useSelector(selectCartLoading);
    const orderLoading = useSelector((state) => state.orders.loading);
    const orderError = useSelector((state) => state.orders.error);

    const [hasLoadedCart, setHasLoadedCart] = useState(false);
    const [zone, setZone] = useState("");
    const [deliveryDate, setDeliveryDate] = useState("");
    const [notes, setNotes] = useState("");

    useEffect(() => {
        dispatch(fetchCart()).finally(() => {
            setHasLoadedCart(true);
        });
        return () => {
            dispatch(clearOrderError());
            dispatch(clearOrderSuccess());
        };
    }, [dispatch]);

    // Initialisation par défaut de la région
    useEffect(() => {
        if (!zone && cartItems.length > 0) {
            const defaultZone =
                cartItems[0]?.harvest?.product?.farmer?.zone ||
                user?.city ||
                "Casablanca-Settat";
            setZone(defaultZone);
        }
    }, [cartItems, user, zone]);

    // Redirection automatique si le panier est vide une fois chargé
    useEffect(() => {
        if (hasLoadedCart && !cartLoading && cartItems.length === 0) {
            navigate("/client/cart");
        }
    }, [hasLoadedCart, cartLoading, cartItems, navigate]);

    async function handleSubmit(e) {
        e.preventDefault();
        dispatch(clearOrderError());

        const payload = {
            zone: zone || "Casablanca-Settat",
            delivery_date: deliveryDate || null,
            items: cartItems.map((item) => ({
                harvest_id: item.harvest_id,
                quantity_standard_id: item.quantity_standard_id,
                quantity: item.quantity,
                scheduled_harvest_date: item.harvest?.start_date || null,
            })),
        };

        const result = await dispatch(createOrder(payload));
        if (result.meta?.requestStatus === "fulfilled") {
            dispatch(clearCart());
            navigate("/client/orders");
        }
    }

    if (cartLoading && !hasLoadedCart) {
        return (
            <div className="af-dashboard-container">
                <LoadingState message="Préparation de votre commande..." />
            </div>
        );
    }

    return (
        <div className="af-dashboard-container">
            {/* ── 1. En-tête ────────────────────────────────────────────── */}
            <div className="af-dashboard-header-row">
                <div className="af-dashboard-title-group">
                    <div className="d-flex align-items-center gap-2 mb-1 flex-wrap">
                        <Link to="/client/cart" className="text-decoration-none small text-muted">
                            ← Retour au panier
                        </Link>
                        <span className="text-muted">/</span>
                        <h1>Validation de la Commande</h1>
                    </div>
                    <p>
                        Renseignez votre région de livraison et confirmez votre approvisionnement direct.
                    </p>
                </div>
            </div>

            {/* Alerte d'erreur de commande */}
            {orderError && (
                <Alert
                    variant="danger"
                    className="rounded-3 shadow-sm mb-4"
                    dismissible
                    onClose={() => dispatch(clearOrderError())}
                >
                    {typeof orderError === "string"
                        ? orderError
                        : orderError?.message || "Échec de la validation de la commande. Veuillez vérifier vos articles."}
                </Alert>
            )}

            {/* ── 2. Formulaire & Récapitulatif ─────────────────────────── */}
            <form onSubmit={handleSubmit}>
                <Row className="g-4">
                    {/* Colonne gauche : Articles et informations de livraison */}
                    <Col lg={7}>
                        {/* Récapitulatif des articles */}
                        <div className="af-panel-card mb-4">
                            <div className="af-panel-header mb-3">
                                <h2 className="af-panel-title">Lots à Confirmer</h2>
                                <Badge variant="primary" size="sm">
                                    {cartItems.length} lot(s)
                                </Badge>
                            </div>

                            <div className="table-responsive">
                                <Table className="align-middle af-dashboard-table mb-0">
                                    <thead>
                                        <tr>
                                            <th>Produit</th>
                                            <th>Pack</th>
                                            <th className="text-center">Qté</th>
                                            <th className="text-end">Prix</th>
                                            <th className="text-end">Sous-total</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {cartItems.map((item) => (
                                            <tr key={item.id}>
                                                <td>
                                                    <strong>
                                                        {item.harvest?.product?.name || "Produit agricole"}
                                                    </strong>
                                                </td>
                                                <td>
                                                    <span className="badge bg-light text-dark border">
                                                        {item.quantity_standard?.label || "Standard"}
                                                    </span>
                                                </td>
                                                <td className="text-center fw-bold">{item.quantity}</td>
                                                <td className="text-end">
                                                    {Number(item.unit_price).toFixed(2)} DH
                                                </td>
                                                <td className="text-end fw-bold" style={{ color: "var(--af-primary-forest, #15372F)" }}>
                                                    {Number(item.subtotal || 0).toFixed(2)} DH
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </div>
                        </div>

                        {/* Coordonnées logistiques */}
                        <div className="af-panel-card">
                            <h2 className="af-panel-title mb-3">Coordonnées de Livraison</h2>

                            <Row className="g-3">
                                <Col md={6}>
                                    <label className="form-label fw-semibold small text-muted">
                                        Région de destination *
                                    </label>
                                    <select
                                        className="form-select rounded-3"
                                        value={zone}
                                        onChange={(e) => setZone(e.target.value)}
                                        required
                                    >
                                        <option value="">Sélectionnez une région...</option>
                                        {MOROCCAN_REGIONS.map((r) => (
                                            <option key={r} value={r}>
                                                {r}
                                            </option>
                                        ))}
                                    </select>
                                </Col>

                                <Col md={6}>
                                    <label className="form-label fw-semibold small text-muted">
                                        Date de livraison souhaitée
                                    </label>
                                    <input
                                        type="date"
                                        className="form-control rounded-3"
                                        value={deliveryDate}
                                        onChange={(e) => setDeliveryDate(e.target.value)}
                                        min={new Date().toISOString().split("T")[0]}
                                    />
                                </Col>

                                <Col xs={12}>
                                    <label className="form-label fw-semibold small text-muted">
                                        Instructions particulières ou contraintes d&apos;accès
                                    </label>
                                    <textarea
                                        className="form-control rounded-3"
                                        rows={3}
                                        placeholder="Ex: Quai de déchargement accessible le matin, contact responsable réception..."
                                        value={notes}
                                        onChange={(e) => setNotes(e.target.value)}
                                    />
                                </Col>
                            </Row>
                        </div>
                    </Col>

                    {/* Colonne droite : Synthèse et validation finale */}
                    <Col lg={5}>
                        <div className="af-panel-card">
                            <h2 className="af-panel-title mb-3">Synthèse Financière</h2>

                            <div className="d-flex flex-column gap-2 mb-3">
                                <div className="d-flex justify-content-between text-muted small">
                                    <span>Total conditionnements</span>
                                    <span className="fw-semibold text-dark">{cartCount} lot(s)</span>
                                </div>
                                <div className="d-flex justify-content-between text-muted small">
                                    <span>Logistique & Acheminement</span>
                                    <span className="text-success fw-semibold">Inclus</span>
                                </div>
                                <div className="d-flex justify-content-between text-muted small">
                                    <span>Mode de règlement</span>
                                    <span className="fw-semibold text-dark">À réception / Virement</span>
                                </div>

                                <hr className="my-2" style={{ borderColor: "var(--af-border, #E2E9E3)" }} />

                                <div className="d-flex justify-content-between align-items-center">
                                    <span className="fw-bold" style={{ color: "var(--af-green-950, #15372F)" }}>
                                        Total Net à Payer
                                    </span>
                                    <span
                                        className="fs-3 fw-bold"
                                        style={{ color: "var(--af-primary-forest, #15372F)" }}
                                    >
                                        {Number(cartTotal).toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} DH
                                    </span>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                variant="primary"
                                pill
                                size="lg"
                                className="w-100 py-3 fw-bold mb-3"
                                isLoading={orderLoading}
                                disabled={orderLoading || cartItems.length === 0}
                            >
                                Confirmer la commande directe →
                            </Button>

                            <div className="text-center text-muted small">
                                En confirmant, votre commande est directement transmise à l&apos;exploitant agricole qui validera la disponibilité de la récolte.
                            </div>
                        </div>
                    </Col>
                </Row>
            </form>
        </div>
    );
}
