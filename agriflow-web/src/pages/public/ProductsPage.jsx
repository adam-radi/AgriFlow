import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Container, Row, Col } from "react-bootstrap";
import { fetchProducts, setSearchQuery } from "../../features/products/productSlice";
import {
    selectAllProducts,
    selectProductsLoading,
    selectProductsError,
    selectProductsPagination,
    selectSearchQuery,
} from "../../features/products/productSelectors";

import ProductCard from "../../components/products/ProductCard";
import ProductFilterBar from "../../components/products/ProductFilterBar";
import ProductPagination from "../../components/products/ProductPagination";
import {
    Badge,
    Button,
    LoadingState,
    EmptyState,
    ErrorState,
} from "../../components/common";

/**
 * Helper d'extraction du prix d'un produit pour le tri et le filtrage
 */
function getProductEffectivePrice(product) {
    if (!product) return 0;
    if (product.quantities && product.quantities.length > 0) {
        return parseFloat(product.quantities[0].price) || 0;
    }
    if (product.price != null) {
        return parseFloat(product.price) || 0;
    }
    if (product.base_price != null) {
        return parseFloat(product.base_price) || 0;
    }
    return 0;
}

/**
 * ProductsPage — Page Catalogue des récoltes agricoles (AgriFlow V2)
 *
 * Fonctionnalités :
 * - Intégration transparente dans PublicLayout (Floating Navbar & Footer).
 * - Connexion directe au store Redux (`fetchProducts`, `productSlice`).
 * - Filtrage multi-critères : recherche textuelle, région/zone, fourchette de prix, tri.
 * - Gestion réactive des états (Loading skeletons, Empty state avec reset, Error state avec retry).
 * - Pagination active et synchronisée avec l'API backend Laravel.
 */
export default function ProductsPage() {
    const dispatch = useDispatch();
    const products = useSelector(selectAllProducts);
    const loading = useSelector(selectProductsLoading);
    const error = useSelector(selectProductsError);
    const pagination = useSelector(selectProductsPagination);
    const globalSearchQuery = useSelector(selectSearchQuery);

    // États locaux de filtrage et tri
    const [searchLocal, setSearchLocal] = useState(globalSearchQuery || "");
    const [selectedZone, setSelectedZone] = useState("all");
    const [selectedPriceTier, setSelectedPriceTier] = useState("all");
    const [sortBy, setSortBy] = useState("latest");
    const [currentPage, setCurrentPage] = useState(pagination.currentPage || 1);

    // Chargement initial des produits depuis l'API Laravel
    useEffect(() => {
        dispatch(fetchProducts({ page: currentPage }));
    }, [dispatch, currentPage]);

    // Extraction dynamique des bassins agricoles présents dans les produits
    const zoneOptions = useMemo(() => {
        const zones = new Set();
        products.forEach((p) => {
            const z = p.farmer?.zone;
            if (z && typeof z === "string" && z.trim().length > 0) {
                zones.add(z.trim());
            }
        });
        // Bassins de production clés par défaut au Maroc
        ["Souss-Massa", "Berkane / Oriental", "Gharb - Kénitra", "Marrakech-Safi", "Fès-Meknès"].forEach((z) => zones.add(z));
        return Array.from(zones).sort();
    }, [products]);

    // Filtrage et tri côté client des produits reçus
    const filteredProducts = useMemo(() => {
        if (!Array.isArray(products)) return [];

        let list = [...products];

        // 1. Filtre par recherche textuelle (nom, description, variété)
        const q = searchLocal.trim().toLowerCase();
        if (q.length > 0) {
            list = list.filter((p) => {
                const nameMatch = (p.name || "").toLowerCase().includes(q);
                const descMatch = (p.description || "").toLowerCase().includes(q);
                const varietyMatch = (p.variety || "").toLowerCase().includes(q);
                const categoryMatch = typeof p.category === "string"
                    ? p.category.toLowerCase().includes(q)
                    : (p.category?.name || "").toLowerCase().includes(q);
                const farmerMatch = (p.farmer?.name || "").toLowerCase().includes(q);
                return nameMatch || descMatch || varietyMatch || categoryMatch || farmerMatch;
            });
        }

        // 2. Filtre par zone / région
        if (selectedZone !== "all") {
            list = list.filter((p) => {
                const z = p.farmer?.zone || "";
                return z.toLowerCase() === selectedZone.toLowerCase();
            });
        }

        // 3. Filtre par fourchette de prix
        if (selectedPriceTier !== "all") {
            list = list.filter((p) => {
                const price = getProductEffectivePrice(p);
                if (selectedPriceTier === "under_10") return price > 0 && price < 10;
                if (selectedPriceTier === "10_to_25") return price >= 10 && price <= 25;
                if (selectedPriceTier === "above_25") return price > 25;
                return true;
            });
        }

        // 4. Tri
        list.sort((a, b) => {
            if (sortBy === "price_asc") {
                return getProductEffectivePrice(a) - getProductEffectivePrice(b);
            }
            if (sortBy === "price_desc") {
                return getProductEffectivePrice(b) - getProductEffectivePrice(a);
            }
            if (sortBy === "name_asc") {
                return (a.name || "").localeCompare(b.name || "");
            }
            // "latest"
            const dateA = new Date(a.created_at || 0).getTime();
            const dateB = new Date(b.created_at || 0).getTime();
            return dateB - dateA;
        });

        return list;
    }, [products, searchLocal, selectedZone, selectedPriceTier, sortBy]);

    // Détection si des filtres personnalisés sont actifs
    const hasActiveFilters =
        searchLocal.trim().length > 0 ||
        selectedZone !== "all" ||
        selectedPriceTier !== "all" ||
        sortBy !== "latest";

    // Gestionnaires d'événements
    const handleSearchSubmit = (e) => {
        if (e) e.preventDefault();
        dispatch(setSearchQuery(searchLocal));
    };

    const handleResetFilters = () => {
        setSearchLocal("");
        setSelectedZone("all");
        setSelectedPriceTier("all");
        setSortBy("latest");
        dispatch(setSearchQuery(""));
    };

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleRetry = () => {
        dispatch(fetchProducts({ page: currentPage }));
    };

    return (
        <div
            className="pb-5"
            style={{
                backgroundColor: "var(--af-canvas, #F6F8F5)",
                minHeight: "calc(100vh - 88px)",
            }}
        >
            <Container className="py-4 py-md-5">
                {/* ── B. Catalogue Introduction ────────────────────────── */}
                <header className="mb-4 mb-md-5">
                    <div className="d-flex flex-column align-items-start">
                        <div className="mb-3">
                            <Badge variant="green">
                                MARCHÉ DIRECT EN GROS & DEMI-GROS
                            </Badge>
                        </div>

                        <div className="d-flex flex-wrap align-items-baseline justify-content-between gap-3 w-100 mb-2">
                            <h1
                                className="fw-bold m-0"
                                style={{
                                    color: "var(--af-green-950, #15372F)",
                                    fontSize: "clamp(2rem, 3.8vw, 2.8rem)",
                                    letterSpacing: "-0.03em",
                                    lineHeight: 1.15,
                                }}
                            >
                                Catalogue des produits agricoles
                            </h1>

                            {pagination.totalItems > 0 && (
                                <span
                                    className="small fw-semibold"
                                    style={{ color: "var(--af-green-700, #398565)" }}
                                >
                                    {pagination.totalItems} lots répertoriés
                                </span>
                            )}
                        </div>

                        <p
                            className="m-0"
                            style={{
                                color: "var(--af-ink-600, #68756E)",
                                fontSize: "1.05rem",
                                lineHeight: 1.6,
                                maxWidth: "700px",
                            }}
                        >
                            Découvrez les récoltes maraîchères et fruitières proposées directement par nos producteurs
                            et coopératives agricoles partenaires sans intermédiaire commercial.
                        </p>
                    </div>
                </header>

                {/* ── C. Search & Filters Bar ─────────────────────────── */}
                <ProductFilterBar
                    searchQuery={searchLocal}
                    onSearchChange={setSearchLocal}
                    onSearchSubmit={handleSearchSubmit}
                    selectedZone={selectedZone}
                    onZoneChange={setSelectedZone}
                    zoneOptions={zoneOptions}
                    sortBy={sortBy}
                    onSortChange={setSortBy}
                    selectedPriceTier={selectedPriceTier}
                    onPriceTierChange={setSelectedPriceTier}
                    onResetFilters={handleResetFilters}
                    totalCount={products.length}
                    filteredCount={filteredProducts.length}
                    hasActiveFilters={hasActiveFilters}
                />

                {/* ── D. Product Grid, Loading, Empty & Error States ──── */}
                {loading ? (
                    <LoadingState variant="card" count={8} />
                ) : error ? (
                    <ErrorState
                        title="Impossible de charger le catalogue"
                        message={
                            typeof error === "string"
                                ? error
                                : "Une erreur réseau est survenue lors de la récupération des récoltes. Veuillez vérifier votre connexion."
                        }
                        onRetry={handleRetry}
                    />
                ) : products.length === 0 ? (
                    <EmptyState
                        title="Aucune récolte disponible actuellement"
                        description="Nos agriculteurs préparent activement les prochains lots saisonniers. Revenez très bientôt."
                        action={
                            <Button variant="primary" pill onClick={handleRetry}>
                                Actualiser le catalogue
                            </Button>
                        }
                    />
                ) : filteredProducts.length === 0 ? (
                    <EmptyState
                        title="Aucun produit ne correspond à vos filtres"
                        description="Essayez de modifier vos critères de recherche ou de sélectionner un autre bassin de production."
                        action={
                            <Button variant="primary" pill onClick={handleResetFilters}>
                                Réinitialiser tous les filtres
                            </Button>
                        }
                    />
                ) : (
                    <>
                        <Row className="g-4">
                            {filteredProducts.map((product) => (
                                <Col key={product.id} xs={12} sm={6} lg={4} xl={3}>
                                    <ProductCard product={product} />
                                </Col>
                            ))}
                        </Row>

                        {/* ── E. Pagination ─────────────────────────────── */}
                        <ProductPagination
                            currentPage={pagination.currentPage || currentPage}
                            totalPages={pagination.totalPages || 1}
                            onPageChange={handlePageChange}
                        />
                    </>
                )}
            </Container>
        </div>
    );
}
