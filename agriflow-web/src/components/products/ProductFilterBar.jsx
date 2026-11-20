import { Row, Col } from "react-bootstrap";
import { Button, Input, Select, Badge } from "../common";

const SORT_OPTIONS = [
    { value: "latest", label: "Plus récents d'abord" },
    { value: "price_asc", label: "Prix croissant (MAD)" },
    { value: "price_desc", label: "Prix décroissant (MAD)" },
    { value: "name_asc", label: "Nom du produit (A à Z)" },
];

const PRICE_TIERS = [
    { value: "all", label: "Tous les prix" },
    { value: "under_10", label: "< 10 MAD" },
    { value: "10_to_25", label: "10 – 25 MAD" },
    { value: "above_25", label: "> 25 MAD" },
];

/**
 * ProductFilterBar — Barre de recherche et de filtres pour le Catalogue
 * Fournit une expérience de filtrage réactive, ergonomique et accessible.
 */
export default function ProductFilterBar({
    searchQuery,
    onSearchChange,
    onSearchSubmit,
    selectedZone,
    onZoneChange,
    zoneOptions = [],
    sortBy,
    onSortChange,
    selectedPriceTier,
    onPriceTierChange,
    onResetFilters,
    totalCount = 0,
    filteredCount = 0,
    hasActiveFilters = false,
}) {
    const zonesList = [
        { value: "all", label: "Toutes les régions" },
        ...zoneOptions.map((z) => ({ value: z, label: z })),
    ];

    return (
        <section
            aria-label="Filtres du catalogue"
            className="mb-4 p-3 p-md-4 rounded-4"
            style={{
                backgroundColor: "var(--af-surface, #FFFFFF)",
                border: "1px solid var(--af-border, #E2E9E3)",
                boxShadow: "var(--af-shadow-sm, 0 1px 3px rgba(21, 55, 47, 0.05))",
            }}
        >
            <form onSubmit={onSearchSubmit}>
                <Row className="g-3 align-items-end">
                    {/* Recherche textuelle */}
                    <Col xs={12} md={5} lg={4}>
                        <Input
                            label="Recherche de récolte"
                            id="catalog-search"
                            type="search"
                            placeholder="Tomates, agrumes, argan, terroir..."
                            value={searchQuery}
                            onChange={(e) => onSearchChange(e.target.value)}
                        />
                    </Col>

                    {/* Filtre Région / Terroir */}
                    <Col xs={6} sm={6} md={3} lg={3}>
                        <Select
                            label="Bassin de production"
                            id="catalog-zone"
                            value={selectedZone}
                            onChange={(e) => onZoneChange(e.target.value)}
                            options={zonesList}
                        />
                    </Col>

                    {/* Fourchette de Prix */}
                    <Col xs={6} sm={6} md={2} lg={2}>
                        <Select
                            label="Gamme de prix"
                            id="catalog-price-tier"
                            value={selectedPriceTier}
                            onChange={(e) => onPriceTierChange(e.target.value)}
                            options={PRICE_TIERS}
                        />
                    </Col>

                    {/* Tri */}
                    <Col xs={12} sm={6} md={2} lg={3}>
                        <Select
                            label="Trier par"
                            id="catalog-sort"
                            value={sortBy}
                            onChange={(e) => onSortChange(e.target.value)}
                            options={SORT_OPTIONS}
                        />
                    </Col>
                </Row>
            </form>

            {/* Barre de métadonnées et Reset */}
            <div
                className="mt-3 pt-3 border-top d-flex flex-wrap align-items-center justify-content-between gap-2"
                style={{ borderColor: "var(--af-border, #E2E9E3)" }}
            >
                <div className="d-flex align-items-center gap-2">
                    <span
                        className="small"
                        style={{ color: "var(--af-ink-600, #68756E)", fontWeight: 500 }}
                    >
                        Résultats disponibles :
                    </span>
                    <Badge variant="green">
                        {filteredCount} {filteredCount === 1 ? "produit" : "produits"}
                    </Badge>
                    {totalCount > filteredCount && (
                        <span className="small text-muted">
                            (sur un total de {totalCount})
                        </span>
                    )}
                </div>

                {hasActiveFilters && (
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={onResetFilters}
                        className="text-decoration-underline py-1 px-2"
                    >
                        Réinitialiser tous les filtres ✕
                    </Button>
                )}
            </div>
        </section>
    );
}

