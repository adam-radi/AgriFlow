import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { fetchCart, removeFromCart, updateCartItem, clearCart } from "../../../features/orders/cartSlice";
import {
    selectCartItems,
    selectCartCount,
    selectCartTotal,
    selectCartLoading,
    selectCartError,
} from "../../../features/orders/orderSelectors";
import CartItem from "../../../components/orders/CartItem";
import CartSummary from "../../../components/orders/CartSummary";
import { Button, LoadingState, EmptyState, Badge } from "../../../components/common";
import { Alert, Row, Col } from "react-bootstrap";

/**
 * CartPage — Gestion du panier d'approvisionnement B2B (Lot 10)
 */
export default function CartPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const cartItems = useSelector(selectCartItems) || [];
    const cartCount = useSelector(selectCartCount) || 0;
    const cartTotal = useSelector(selectCartTotal) || 0;
    const loading = useSelector(selectCartLoading);
    const error = useSelector(selectCartError);

    useEffect(() => {
        dispatch(fetchCart());
    }, [dispatch]);

    function handleUpdate(itemId, quantity) {
        dispatch(updateCartItem({ itemId, quantity }));
    }

    function handleRemove(itemId) {
        dispatch(removeFromCart(itemId));
    }

    function handleClear() {
        if (window.confirm("Voulez-vous vider l'ensemble de votre panier ?")) {
            dispatch(clearCart());
        }
    }

    return (
        <div className="af-dashboard-container">
            {/* ── 1. En-tête ────────────────────────────────────────────── */}
            <div className="af-dashboard-header-row">
                <div className="af-dashboard-title-group">
                    <div className="d-flex align-items-center gap-2 mb-1 flex-wrap">
                        <h1>Mon Panier d&apos;Approvisionnement</h1>
                        <Badge variant="primary" size="md">
                            {cartCount} lot{cartCount > 1 ? "s" : ""}
                        </Badge>
                    </div>
                    <p>
                        Vérifiez vos volumes et conditionnements avant de finaliser la commande auprès des exploitants.
                    </p>
                </div>

                <div className="af-dashboard-actions">
                    <Link to="/products" className="af-btn-secondary-pill">
                        ← Continuer mes achats
                    </Link>
                    {cartItems.length > 0 && (
                        <button
                            type="button"
                            className="btn btn-sm btn-outline-danger rounded-pill px-3"
                            onClick={handleClear}
                        >
                            Vider le panier
                        </button>
                    )}
                </div>
            </div>

            {/* Alerte d'erreur éventuelle */}
            {error && (
                <Alert variant="danger" className="rounded-3 shadow-sm mb-4">
                    {typeof error === "string" ? error : error?.message || "Une erreur est survenue lors du chargement du panier"}
                </Alert>
            )}

            {/* ── 2. Contenu du Panier ──────────────────────────────────── */}
            {loading && cartItems.length === 0 ? (
                <LoadingState message="Chargement de votre panier..." />
            ) : cartItems.length === 0 ? (
                <EmptyState
                    icon="🛒"
                    title="Votre panier d'approvisionnement est vide"
                    description="Parcourez notre catalogue agricole pour sélectionner vos récoltes et conditionnements directement auprès des producteurs."
                    action={
                        <Button
                            variant="primary"
                            pill
                            onClick={() => navigate("/products")}
                        >
                            Explorer le catalogue agricole
                        </Button>
                    }
                />
            ) : (
                <Row className="g-4">
                    {/* Colonne Liste des articles */}
                    <Col lg={8}>
                        <div className="af-panel-card">
                            <div className="af-panel-header mb-3">
                                <h2 className="af-panel-title">Articles Sélectionnés</h2>
                                <span className="af-stat-subtitle-text">
                                    {cartItems.length} référence{cartItems.length > 1 ? "s" : ""}
                                </span>
                            </div>

                            {cartItems.map((item) => (
                                <CartItem
                                    key={item.id}
                                    item={item}
                                    onUpdate={handleUpdate}
                                    onRemove={handleRemove}
                                />
                            ))}
                        </div>
                    </Col>

                    {/* Colonne Récapitulatif et validation */}
                    <Col lg={4}>
                        <div className="d-flex flex-column gap-3">
                            <CartSummary
                                cartItems={cartItems}
                                cartTotal={cartTotal}
                                cartCount={cartCount}
                            />

                            <Button
                                variant="primary"
                                pill
                                size="lg"
                                className="w-100 py-3 fw-bold"
                                onClick={() => navigate("/client/checkout")}
                            >
                                Passer à la commande →
                            </Button>
                        </div>
                    </Col>
                </Row>
            )}
        </div>
    );
}
