import { Link } from "react-router-dom";

const FALLBACK_PRODUCT_IMAGE =
    "https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&q=80";

/**
 * ProductCard — Carte produit agricole moderne et responsive
 * Respecte le Design System AgriFlow (Phase 02 / Phase 03)
 */
export default function ProductCard({ product }) {
    if (!product) return null;

    const quantities = product.quantities || [];
    const farmerName =
        product.farmer?.name ||
        (typeof product.farmer_name === "string" ? product.farmer_name : null) ||
        "Exploitation partenaire";
    const farmerZone = product.farmer?.zone || "Maroc";

    const categoryOrVariety =
        (typeof product.category === "object" ? product.category?.name : product.category) ||
        product.variety ||
        "Récolte Directe";

    // Calcul du prix et de son unité
    let displayPrice = null;
    let priceUnit = "l'unité";

    if (quantities.length > 0) {
        displayPrice = parseFloat(quantities[0].price).toFixed(2);
        priceUnit = `Pack ${quantities[0].label} kg`;
    } else if (product.price != null) {
        displayPrice = parseFloat(product.price).toFixed(2);
        priceUnit = "kg";
    } else if (product.base_price != null) {
        displayPrice = parseFloat(product.base_price).toFixed(2);
        priceUnit = "kg";
    }

    return (
        <Link
            to={`/products/${product.id}`}
            className="text-decoration-none d-block h-100"
            id={`product-card-${product.id}`}
            style={{ color: "inherit" }}
        >
            <article
                className="h-100 d-flex flex-column af-card-interactive"
                style={{
                    backgroundColor: "var(--af-surface, #FFFFFF)",
                    borderRadius: "20px",
                    border: "1px solid var(--af-border, #E2E9E3)",
                    boxShadow: "var(--af-shadow-sm, 0 1px 3px rgba(21, 55, 47, 0.05))",
                    overflow: "hidden",
                }}
            >
                {/* Zone Supérieure : Photographie & Badges d'état */}
                <div
                    style={{
                        position: "relative",
                        width: "100%",
                        height: "215px",
                        overflow: "hidden",
                        backgroundColor: "var(--af-green-100, #E8F2EC)",
                    }}
                >
                    <img
                        src={product.image || FALLBACK_PRODUCT_IMAGE}
                        alt={product.name || "Récolte agricole"}
                        loading="lazy"
                        style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            display: "block",
                            transition: "transform 0.4s ease",
                        }}
                        onError={(e) => {
                            e.target.src = FALLBACK_PRODUCT_IMAGE;
                        }}
                    />

                    {/* Zone d'origine et statut */}
                    <div
                        style={{
                            position: "absolute",
                            top: "12px",
                            left: "12px",
                            right: "12px",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                        }}
                    >
                        <span
                            className="px-2 py-1 rounded-pill text-white fw-semibold"
                            style={{
                                backgroundColor: "rgba(21, 55, 47, 0.78)",
                                backdropFilter: "blur(6px)",
                                WebkitBackdropFilter: "blur(6px)",
                                fontSize: "0.72rem",
                                letterSpacing: "0.02em",
                            }}
                        >
                            {farmerZone}
                        </span>

                        {product.is_available === false ? (
                            <span
                                className="px-2 py-1 rounded-pill text-white fw-semibold"
                                style={{
                                    backgroundColor: "rgba(182, 66, 66, 0.92)",
                                    fontSize: "0.72rem",
                                }}
                            >
                                Épuisé
                            </span>
                        ) : (
                            <span
                                className="px-2 py-1 rounded-pill text-white fw-semibold"
                                style={{
                                    backgroundColor: "rgba(36, 122, 80, 0.88)",
                                    backdropFilter: "blur(6px)",
                                    fontSize: "0.72rem",
                                }}
                            >
                                En stock
                            </span>
                        )}
                    </div>
                </div>

                {/* Zone Inférieure : Informations & Détails */}
                <div className="p-3 d-flex flex-column flex-grow-1">
                    <div className="mb-1">
                        <span
                            className="text-uppercase fw-bold"
                            style={{
                                fontSize: "0.7rem",
                                color: "var(--af-green-700, #398565)",
                                letterSpacing: "0.05em",
                            }}
                        >
                            {categoryOrVariety}
                        </span>
                        <h3
                            className="fw-bold mb-1 mt-1"
                            style={{
                                fontSize: "1.08rem",
                                color: "var(--af-green-950, #15372F)",
                                lineHeight: 1.3,
                                letterSpacing: "-0.015em",
                            }}
                        >
                            {product.name}
                        </h3>
                    </div>

                    <p
                        className="small mb-3"
                        style={{
                            color: "var(--af-ink-600, #68756E)",
                            lineHeight: 1.5,
                            flex: 1,
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                        }}
                    >
                        {product.description || "Récolte fraîche en direct de l'exploitation partenaire."}
                    </p>

                    <div
                        className="pt-2 border-top d-flex justify-content-between align-items-end"
                        style={{ borderColor: "var(--af-border, #E2E9E3)" }}
                    >
                        <div>
                            <span style={{ fontSize: "0.76rem", color: "var(--af-ink-600, #68756E)", display: "block" }}>
                                {farmerName}
                            </span>
                            <div className="d-flex align-items-baseline gap-1 mt-1">
                                <span
                                    className="fw-bold"
                                    style={{
                                        fontSize: "1.22rem",
                                        color: "var(--af-green-900, #194638)",
                                        letterSpacing: "-0.02em",
                                    }}
                                >
                                    {displayPrice ? `${displayPrice} MAD` : "Sur demande"}
                                </span>
                                {displayPrice && (
                                    <span style={{ fontSize: "0.75rem", color: "var(--af-ink-600, #68756E)" }}>
                                        / {priceUnit}
                                    </span>
                                )}
                            </div>
                        </div>

                        <span
                            className="fw-bold d-inline-flex align-items-center justify-content-center rounded-circle"
                            style={{
                                width: "34px",
                                height: "34px",
                                backgroundColor: "var(--af-green-100, #E8F2EC)",
                                color: "var(--af-green-900, #194638)",
                                fontSize: "0.95rem",
                                transition: "all 150ms ease",
                            }}
                        >
                            →
                        </span>
                    </div>
                </div>
            </article>
        </Link>
    );
}
