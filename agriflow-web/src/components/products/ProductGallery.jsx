import { useState } from "react";

const FALLBACK_PRODUCT_IMAGE =
    "https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&q=80";

const COMPLEMENTARY_AGRICULTURAL_VIEWS = [
    "https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?w=800&q=80",
    "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=800&q=80",
    "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=800&q=80",
];

/**
 * ProductGallery — Galerie d'images interactive pour la page de détails produit
 * Supporte le changement de vue, le zoom subtil et la gestion des images invalides.
 */
export default function ProductGallery({
    primaryImage,
    productName = "Récolte agricole",
    isAvailable = true,
    zone = "Maroc",
}) {
    const validPrimary = primaryImage || FALLBACK_PRODUCT_IMAGE;

    // Galerie de 3 vignettes (image principale + vues du terroir/récolte)
    const galleryImages = [
        validPrimary,
        COMPLEMENTARY_AGRICULTURAL_VIEWS[0],
        COMPLEMENTARY_AGRICULTURAL_VIEWS[1],
    ];

    const [activeImage, setActiveImage] = useState(validPrimary);
    const [hasError, setHasError] = useState(false);

    const handleThumbnailClick = (img) => {
        setActiveImage(img);
        setHasError(false);
    };

    return (
        <section aria-label="Galerie de photographies de la récolte">
            {/* Vue Principale */}
            <div
                style={{
                    position: "relative",
                    width: "100%",
                    height: "clamp(340px, 45vw, 490px)",
                    borderRadius: "24px",
                    overflow: "hidden",
                    backgroundColor: "var(--af-green-100, #E8F2EC)",
                    border: "1px solid var(--af-border, #E2E9E3)",
                    boxShadow: "var(--af-shadow-md, 0 4px 12px rgba(21, 55, 47, 0.07))",
                }}
            >
                <img
                    src={hasError ? FALLBACK_PRODUCT_IMAGE : activeImage}
                    alt={productName}
                    style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        display: "block",
                        transition: "transform 0.4s ease",
                    }}
                    onError={() => setHasError(true)}
                />

                {/* Badges superposés */}
                <div
                    style={{
                        position: "absolute",
                        top: "16px",
                        left: "16px",
                        right: "16px",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}
                >
                    <span
                        className="px-3 py-1 rounded-pill text-white fw-semibold"
                        style={{
                            backgroundColor: "rgba(21, 55, 47, 0.8)",
                            backdropFilter: "blur(8px)",
                            WebkitBackdropFilter: "blur(8px)",
                            fontSize: "0.78rem",
                            letterSpacing: "0.03em",
                        }}
                    >
                        {zone}
                    </span>

                    {isAvailable ? (
                        <span
                            className="px-3 py-1 rounded-pill text-white fw-semibold"
                            style={{
                                backgroundColor: "rgba(36, 122, 80, 0.9)",
                                backdropFilter: "blur(8px)",
                                WebkitBackdropFilter: "blur(8px)",
                                fontSize: "0.78rem",
                            }}
                        >
                            En stock · Disponible
                        </span>
                    ) : (
                        <span
                            className="px-3 py-1 rounded-pill text-white fw-semibold"
                            style={{
                                backgroundColor: "rgba(182, 66, 66, 0.92)",
                                fontSize: "0.78rem",
                            }}
                        >
                            Épuisé pour cette récolte
                        </span>
                    )}
                </div>
            </div>

            {/* Miniatures sélectionnables */}
            <div className="d-flex align-items-center gap-3 mt-3">
                {galleryImages.map((img, index) => {
                    const isSelected = activeImage === img;
                    return (
                        <button
                            key={index}
                            type="button"
                            onClick={() => handleThumbnailClick(img)}
                            aria-label={`Vue ${index + 1} de la récolte`}
                            style={{
                                width: "72px",
                                height: "72px",
                                borderRadius: "14px",
                                overflow: "hidden",
                                padding: 0,
                                border: isSelected
                                    ? "2px solid var(--af-green-700, #398565)"
                                    : "1px solid var(--af-border, #E2E9E3)",
                                transform: isSelected ? "scale(1.04)" : "scale(1)",
                                opacity: isSelected ? 1 : 0.72,
                                transition: "all 0.2s ease",
                                cursor: "pointer",
                                backgroundColor: "var(--af-canvas, #F6F8F5)",
                            }}
                        >
                            <img
                                src={img}
                                alt={`Vignette ${index + 1}`}
                                style={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover",
                                }}
                            />
                        </button>
                    );
                })}
            </div>
        </section>
    );
}
