import { useEffect, useState, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Container, Row, Col, Alert } from "react-bootstrap";
import {
    fetchProductById,
    fetchProducts,
    clearSelectedProduct,
} from "../../features/products/productSlice";
import {
    selectSelectedProduct,
    selectProductsLoading,
    selectProductsError,
    selectAllProducts,
} from "../../features/products/productSelectors";
import { addToCart } from "../../features/orders/cartSlice";

import {
    ProductGallery,
    ProductProducerCard,
    ProductSpecsTable,
    ProductInquiryModal,
    ProductCard,
} from "../../components/products";
import {
    Badge,
    Button,
    LoadingState,
    EmptyState,
    ErrorState,
} from "../../components/common";

/**
 * ProductDetailsPage — Landing page épurée et professionnelle pour chaque récolte
 * Présentation aérée, concise et visuelle, sans blocs de texte surchargés.
 */
export default function ProductDetailsPage() {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const product = useSelector(selectSelectedProduct);
    const allProducts = useSelector(selectAllProducts);
    const loading = useSelector(selectProductsLoading);
    const error = useSelector(selectProductsError);
    const { isAuthenticated } = useSelector((state) => state.auth);

    // États locaux
    const [selectedQtyId, setSelectedQtyId] = useState(null);
    const [packQty, setPackQty] = useState(1);
    const [showInquiryModal, setShowInquiryModal] = useState(false);
    const [cartSuccess, setCartSuccess] = useState(false);

    // Chargement de la fiche produit par son identifiant
    useEffect(() => {
        dispatch(fetchProductById(id));
        return () => {
            dispatch(clearSelectedProduct());
        };
    }, [dispatch, id]);

    // Chargement des autres produits pour alimenter les récoltes similaires
    useEffect(() => {
        if (!allProducts || allProducts.length === 0) {
            dispatch(fetchProducts({ page: 1 }));
        }
    }, [dispatch, allProducts]);

    // Détermination de la récolte active et du conditionnement sélectionné
    const quantities = product?.quantities || [];
    const selectedQty =
        quantities.find((q) => q.id === selectedQtyId) ||
        quantities[0] ||
        null;

    const firstHarvest = product?.harvests?.[0] || null;
    const isAvailable = product?.is_available !== false;

    // Calcul du prix unitaire affiché
    let unitPrice = null;
    let unitLabel = "l'unité";

    if (selectedQty) {
        unitPrice = parseFloat(selectedQty.price);
        unitLabel = `Pack ${selectedQty.label} kg`;
    } else if (product?.price != null) {
        unitPrice = parseFloat(product.price);
        unitLabel = "kg";
    } else if (product?.base_price != null) {
        unitPrice = parseFloat(product.base_price);
        unitLabel = "kg";
    }

    // Récoltes similaires (même terroir ou même producteur, en excluant le produit courant)
    const relatedProducts = useMemo(() => {
        if (!product || !Array.isArray(allProducts) || allProducts.length === 0) return [];
        const others = allProducts.filter((p) => String(p.id) !== String(product.id));

        const sameZoneOrFarmer = others.filter(
            (p) =>
                (product.farmer?.zone && p.farmer?.zone === product.farmer?.zone) ||
                (product.farmer?.id && p.farmer?.id === product.farmer?.id)
        );

        if (sameZoneOrFarmer.length >= 3) {
            return sameZoneOrFarmer.slice(0, 4);
        }
        return others.slice(0, 4);
    }, [product, allProducts]);

    // Gestion de l'ajout au panier / commande
    const handleAddToCart = () => {
        if (!selectedQty || !firstHarvest) return;
        if (!isAuthenticated) {
            navigate("/login");
            return;
        }

        dispatch(
            addToCart({
                harvest_id: firstHarvest.id,
                quantity_standard_id: selectedQty.id,
                quantity: packQty,
            })
        );
        setCartSuccess(true);
        setTimeout(() => setCartSuccess(false), 4000);
    };

    const handleRetry = () => {
        dispatch(fetchProductById(id));
    };

    // ─── ÉTATS DE CHARGEMENT ET ERREURS ──────────────────────────────────────────

    if (loading && !product) {
        return (
            <div
                className="py-5"
                style={{
                    backgroundColor: "var(--af-canvas, #F6F8F5)",
                    minHeight: "calc(100vh - 88px)",
                }}
            >
                <Container className="py-4">
                    <LoadingState variant="table" count={4} />
                </Container>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div
                className="py-5"
                style={{
                    backgroundColor: "var(--af-canvas, #F6F8F5)",
                    minHeight: "calc(100vh - 88px)",
                }}
            >
                <Container className="py-5">
                    {error ? (
                        <ErrorState
                            title="Erreur lors de l'accès au produit"
                            message={
                                typeof error === "string"
                                    ? error
                                    : "Ce produit agricole n'a pas pu être chargé depuis la base de données."
                            }
                            onRetry={handleRetry}
                        />
                    ) : (
                        <EmptyState
                            title="Produit introuvable"
                            description="Cette récolte n'existe plus ou a été retirée par son exploitant."
                            action={
                                <Button as={Link} to="/products" variant="primary" pill>
                                    Retour au catalogue des récoltes
                                </Button>
                            }
                        />
                    )}
                </Container>
            </div>
        );
    }

    // ─── RENDU PRINCIPAL ─────────────────────────────────────────────────────────

    const farmerZone = product.farmer?.zone || "Maroc";
    const categoryOrVariety =
        (typeof product.category === "object" ? product.category?.name : product.category) ||
        product.variety ||
        "Récolte de terroir";

    return (
        <div
            className="pb-5"
            style={{
                backgroundColor: "var(--af-canvas, #F6F8F5)",
                minHeight: "calc(100vh - 88px)",
            }}
        >
            <Container className="py-4 py-md-5">
                {/* ── B. Fil d'Ariane épuré ───────────────────────────── */}
                <nav aria-label="Fil d'Ariane" className="mb-4">
                    <ol className="breadcrumb m-0 d-flex align-items-center gap-2 small">
                        <li className="breadcrumb-item">
                            <Link
                                to="/"
                                className="text-decoration-none"
                                style={{ color: "var(--af-ink-600, #68756E)", fontWeight: 500 }}
                            >
                                Accueil
                            </Link>
                        </li>
                        <li className="breadcrumb-item">
                            <Link
                                to="/products"
                                className="text-decoration-none"
                                style={{ color: "var(--af-ink-600, #68756E)", fontWeight: 500 }}
                            >
                                Catalogue des récoltes
                            </Link>
                        </li>
                        <li
                            className="breadcrumb-item active text-truncate"
                            style={{
                                color: "var(--af-green-950, #15372F)",
                                fontWeight: 600,
                                maxWidth: "260px",
                            }}
                            aria-current="page"
                        >
                            {product.name}
                        </li>
                    </ol>
                </nav>

                {/* ── C. Présentation principale (Galerie & Bloc d'achat) ── */}
                <Row className="g-4 g-lg-5 mb-5 align-items-start">
                    {/* Colonne Gauche : Product Gallery */}
                    <Col xs={12} lg={6}>
                        <ProductGallery
                            primaryImage={product.image}
                            productName={product.name}
                            isAvailable={isAvailable}
                            zone={farmerZone}
                        />
                    </Col>

                    {/* Colonne Droite : Informations Produit & Commerce */}
                    <Col xs={12} lg={6}>
                        <div className="d-flex flex-column h-100">
                            {/* Puces de synthèse : catégorie, terroir, disponibilité */}
                            <div className="d-flex align-items-center gap-2 mb-2 flex-wrap">
                                <Badge variant="green">{categoryOrVariety}</Badge>
                                <span
                                    className="px-2 py-1 rounded-pill small fw-medium"
                                    style={{ backgroundColor: "var(--af-surface, #FFFFFF)", border: "1px solid var(--af-border, #E2E9E3)", color: "var(--af-ink-700, #3F4D45)" }}
                                >
                                    📍 Bassin {farmerZone}
                                </span>
                                {isAvailable ? (
                                    <span
                                        className="px-2 py-1 rounded-pill small fw-medium"
                                        style={{ backgroundColor: "var(--af-green-100, #E8F2EC)", color: "var(--af-green-900, #194638)" }}
                                    >
                                        ✓ En stock
                                    </span>
                                ) : (
                                    <span
                                        className="px-2 py-1 rounded-pill small fw-medium text-danger"
                                        style={{ backgroundColor: "#FEE2E2" }}
                                    >
                                        Épuisé
                                    </span>
                                )}
                            </div>

                            {/* Nom du produit */}
                            <h1
                                className="fw-bold mb-3"
                                style={{
                                    color: "var(--af-green-950, #15372F)",
                                    fontSize: "clamp(2rem, 3.4vw, 2.7rem)",
                                    letterSpacing: "-0.025em",
                                    lineHeight: 1.18,
                                }}
                            >
                                {product.name}
                            </h1>

                            {/* Boîte tarifaire & actions commerciales */}
                            <div
                                className="p-4 rounded-4 mb-3"
                                style={{
                                    backgroundColor: "var(--af-surface, #FFFFFF)",
                                    border: "1px solid var(--af-border, #E2E9E3)",
                                }}
                            >
                                <div className="d-flex align-items-baseline gap-2 mb-3">
                                    <span
                                        className="fw-bold"
                                        style={{
                                            fontSize: "clamp(2rem, 3.2vw, 2.5rem)",
                                            color: "var(--af-green-900, #194638)",
                                            letterSpacing: "-0.03em",
                                        }}
                                    >
                                        {unitPrice ? `${unitPrice.toFixed(2)} MAD` : "Sur devis"}
                                    </span>
                                    {unitPrice && (
                                        <span
                                            className="small"
                                            style={{ color: "var(--af-ink-600, #68756E)", fontWeight: 500 }}
                                        >
                                            HT / {unitLabel}
                                        </span>
                                    )}
                                </div>

                                {/* Sélecteur de packs si disponible */}
                                {quantities.length > 0 && (
                                    <div className="mb-3">
                                        <label
                                            className="small text-muted fw-semibold mb-2 d-block"
                                        >
                                            Conditionnement au choix :
                                        </label>
                                        <div className="d-flex flex-wrap gap-2">
                                            {quantities.map((q) => {
                                                const isSelected = selectedQty?.id === q.id;
                                                return (
                                                    <button
                                                        key={q.id}
                                                        type="button"
                                                        onClick={() => setSelectedQtyId(q.id)}
                                                        className="btn btn-sm rounded-pill px-3 py-1 fw-semibold transition-all"
                                                        style={{
                                                            backgroundColor: isSelected
                                                                ? "var(--af-green-900, #194638)"
                                                                : "var(--af-canvas, #F6F8F5)",
                                                            color: isSelected ? "#FFFFFF" : "var(--af-ink-900, #1D2924)",
                                                            border: isSelected
                                                                ? "1px solid var(--af-green-900, #194638)"
                                                                : "1px solid var(--af-border, #E2E9E3)",
                                                            fontSize: "0.85rem",
                                                        }}
                                                    >
                                                        Pack {q.label} kg · {parseFloat(q.price).toFixed(2)} MAD
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}

                                {/* Quantité de packs si commande possible */}
                                {isAvailable && firstHarvest && selectedQty && (
                                    <div className="d-flex align-items-center justify-content-between mb-3 pt-2 border-top" style={{ borderColor: "var(--af-border, #E2E9E3)" }}>
                                        <span className="small text-muted fw-semibold">
                                            Quantité de packs :
                                        </span>
                                        <div className="d-flex align-items-center gap-2">
                                            <button
                                                type="button"
                                                className="btn btn-sm btn-outline-secondary rounded-circle d-flex align-items-center justify-content-center"
                                                style={{ width: "30px", height: "30px", padding: 0 }}
                                                onClick={() => setPackQty(Math.max(1, packQty - 1))}
                                            >
                                                −
                                            </button>
                                            <span className="fw-bold px-2" style={{ minWidth: "26px", textAlign: "center" }}>
                                                {packQty}
                                            </span>
                                            <button
                                                type="button"
                                                className="btn btn-sm btn-outline-secondary rounded-circle d-flex align-items-center justify-content-center"
                                                style={{ width: "30px", height: "30px", padding: 0 }}
                                                onClick={() => setPackQty(packQty + 1)}
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {cartSuccess && (
                                    <Alert
                                        variant="success"
                                        className="rounded-3 mb-3 py-2 small d-flex justify-content-between align-items-center"
                                        style={{ backgroundColor: "var(--af-green-100)", color: "var(--af-green-900)" }}
                                    >
                                        <span>✓ Ajouté à votre panier !</span>
                                        <Link to="/client/cart" className="fw-bold text-decoration-underline ms-2" style={{ color: "var(--af-green-950)" }}>
                                            Voir mon panier →
                                        </Link>
                                    </Alert>
                                )}

                                {/* Boutons d'action clairs */}
                                <div className="d-flex flex-column gap-2">
                                    <Button
                                        type="button"
                                        variant="primary"
                                        size="lg"
                                        pill
                                        onClick={() => setShowInquiryModal(true)}
                                        className="w-100"
                                    >
                                        Demander une cotation directe →
                                    </Button>

                                    {isAvailable && firstHarvest && selectedQty && (
                                        <Button
                                            type="button"
                                            variant="secondary"
                                            size="lg"
                                            pill
                                            onClick={handleAddToCart}
                                            className="w-100"
                                        >
                                            Ajouter au panier ({((unitPrice || 0) * packQty).toFixed(2)} MAD)
                                        </Button>
                                    )}
                                </div>
                            </div>

                            {/* Repères qualité simples et sobres (sans phrases à rallonge) */}
                            <div className="d-flex flex-wrap align-items-center gap-3 pt-1">
                                <span className="small text-muted">
                                    <strong style={{ color: "var(--af-green-700, #398565)" }}>✓</strong> Direct producteur
                                </span>
                                <span className="small text-muted">
                                    <strong style={{ color: "var(--af-green-700, #398565)" }}>✓</strong> Chaîne du frais
                                </span>
                                <span className="small text-muted">
                                    <strong style={{ color: "var(--af-green-700, #398565)" }}>✓</strong> Traçabilité garantie
                                </span>
                            </div>
                        </div>
                    </Col>
                </Row>

                {/* ── E. Description simple & Fiche technique ─────────── */}
                <Row className="g-4 mb-5">
                    <Col xs={12} lg={8}>
                        {/* Bloc Description : sobre, aéré, sans lourdeur */}
                        <div
                            className="p-4 rounded-4 mb-4"
                            style={{
                                backgroundColor: "var(--af-surface, #FFFFFF)",
                                border: "1px solid var(--af-border, #E2E9E3)",
                            }}
                        >
                            <h3
                                className="fw-bold mb-2"
                                style={{
                                    color: "var(--af-green-950, #15372F)",
                                    fontSize: "1.15rem",
                                    letterSpacing: "-0.015em",
                                }}
                            >
                                Description de la récolte
                            </h3>

                            <p
                                className="m-0"
                                style={{
                                    color: "var(--af-ink-700, #3F4D45)",
                                    fontSize: "0.98rem",
                                    lineHeight: 1.65,
                                    maxWidth: "680px",
                                }}
                            >
                                {product.description ||
                                    "Récolte fraîche sélectionnée et préparée sur exploitation partenaire pour les professionnels de l'alimentation et de la distribution."}
                            </p>
                        </div>

                        {/* ── G. Caractéristiques du lot (Grille synthétique) ── */}
                        <ProductSpecsTable product={product} />
                    </Col>

                    {/* ── F. Profil du Producteur ────────────────────── */}
                    <Col xs={12} lg={4}>
                        <div className="sticky-top" style={{ top: "108px" }}>
                            <ProductProducerCard
                                farmer={product.farmer}
                                onOpenInquiry={() => setShowInquiryModal(true)}
                            />
                        </div>
                    </Col>
                </Row>

                {/* ── H. Récoltes similaires ─────────────────────────── */}
                {relatedProducts.length > 0 && (
                    <section aria-label="Récoltes similaires" className="pt-4 border-top" style={{ borderColor: "var(--af-border, #E2E9E3)" }}>
                        <div className="d-flex justify-content-between align-items-baseline mb-4">
                            <div>
                                <span
                                    className="small text-uppercase fw-bold"
                                    style={{ color: "var(--af-green-700, #398565)", letterSpacing: "0.05em" }}
                                >
                                    RÉCOLTES DU MÊME TERROIR
                                </span>
                                <h3
                                    className="fw-bold mt-1 m-0"
                                    style={{ color: "var(--af-green-950, #15372F)", fontSize: "1.35rem" }}
                                >
                                    Autres récoltes disponibles
                                </h3>
                            </div>

                            <Link
                                to="/products"
                                className="small fw-semibold text-decoration-none"
                                style={{ color: "var(--af-green-900, #194638)" }}
                            >
                                Tout voir →
                            </Link>
                        </div>

                        <Row className="g-4">
                            {relatedProducts.map((relProduct) => (
                                <Col key={relProduct.id} xs={12} sm={6} lg={3}>
                                    <ProductCard product={relProduct} />
                                </Col>
                            ))}
                        </Row>
                    </section>
                )}
            </Container>

            {/* ── I. Barre d'action mobile fixe ───────────────────────── */}
            <div
                className="d-lg-none position-fixed bottom-0 start-0 end-0 p-3 bg-white border-top shadow-lg"
                style={{ zIndex: 1030, borderColor: "var(--af-border, #E2E9E3)" }}
            >
                <div className="d-flex align-items-center justify-content-between gap-3">
                    <div>
                        <span className="small text-muted d-block" style={{ fontSize: "0.75rem" }}>Prix net</span>
                        <strong className="fw-bold" style={{ color: "var(--af-green-900)", fontSize: "1.1rem" }}>
                            {unitPrice ? `${unitPrice.toFixed(2)} MAD` : "Sur devis"}
                        </strong>
                    </div>

                    <Button
                        type="button"
                        variant="primary"
                        pill
                        size="md"
                        onClick={() => setShowInquiryModal(true)}
                        className="flex-grow-1 text-center"
                    >
                        Demander cotation →
                    </Button>
                </div>
            </div>

            {/* ── Dialogue de cotation / prise de contact ────────────── */}
            <ProductInquiryModal
                show={showInquiryModal}
                onHide={() => setShowInquiryModal(false)}
                product={product}
                farmer={product.farmer}
            />
        </div>
    );
}
