import { Link } from "react-router-dom";

const FALLBACK_PRODUCT_IMAGE =
    "https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&q=80";

export default function ProductCard({ product }) {
    if (!product) return null;

    const quantities = product.quantities || [];
    const farmerName =
        product.farmer?.name ||
        (typeof product.farmer_name === "string" ? product.farmer_name : null) ||
        "Exploitation partenaire";
    const farmerZone = product.farmer?.zone || "Maroc";

    // Price calculation
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
                className="h-100 d-flex flex-column"
                style={{
                    backgroundColor: "#FFFFFF",
                    borderRadius: "22px",
                    border: "1px solid #E2E9E3",
                    boxShadow: "0 2px 8px rgba(21, 55, 47, 0.04)",
                    overflow: "hidden",
                    transition: "transform 200ms ease, box-shadow 200ms ease, border-color 200ms ease",
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-4px)";
                    e.currentTarget.style.boxShadow = "0 14px 30px rgba(21, 55, 47, 0.09)";
                    e.currentTarget.style.borderColor = "#CBD7CE";
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 2px 8px rgba(21, 55, 47, 0.04)";
                    e.currentTarget.style.borderColor = "#E2E9E3";
                }}
            >
                {/* Zone Supérieure : Photographie en Arrière-plan */}
                <div
                    style={{
                        position: "relative",
                        width: "100%",
                        height: "215px",
                        overflow: "hidden",
                        backgroundColor: "#E8F2EC",
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
                                backgroundColor: "rgba(21, 55, 47, 0.75)",
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
                                    backgroundColor: "rgba(182, 66, 66, 0.9)",
                                    fontSize: "0.72rem",
                                }}
                            >
                                Épuisé
                            </span>
                        ) : (
                            <span
                                className="px-2 py-1 rounded-pill text-white fw-semibold"
                                style={{
                                    backgroundColor: "rgba(36, 122, 80, 0.85)",
                                    backdropFilter: "blur(6px)",
                                    fontSize: "0.72rem",
                                }}
                            >
                                En stock
                            </span>
                        )}
                    </div>
                </div>

                {/* Zone Inférieure : Zone Blanche d'Informations */}
                <div className="p-3 d-flex flex-column flex-grow-1">
                    <div className="mb-1">
                        <span
                            className="text-uppercase fw-semibold"
                            style={{
                                fontSize: "0.7rem",
                                color: "#398565",
                                letterSpacing: "0.05em",
                            }}
                        >
                            Récolte Directe
                        </span>
                        <h3
                            className="fw-bold mb-1 mt-1"
                            style={{
                                fontSize: "1.1rem",
                                color: "#15372F",
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
                            color: "#68756E",
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
                        style={{ borderColor: "#F0F3EF" }}
                    >
                        <div>
                            <span style={{ fontSize: "0.76rem", color: "#68756E", display: "block" }}>
                                {farmerName}
                            </span>
                            <div className="d-flex align-items-baseline gap-1 mt-1">
                                <span
                                    className="fw-bold"
                                    style={{
                                        fontSize: "1.25rem",
                                        color: "#194638",
                                        letterSpacing: "-0.02em",
                                    }}
                                >
                                    {displayPrice ? `${displayPrice} MAD` : "Sur demande"}
                                </span>
                                {displayPrice && (
                                    <span style={{ fontSize: "0.75rem", color: "#68756E" }}>
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
                                backgroundColor: "#E8F2EC",
                                color: "#194638",
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
