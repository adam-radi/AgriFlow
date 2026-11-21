/**
 * Composant LoadingState pour unifier les états de chargement (skeletons et spinners).
 * Permet d'éviter les spinners bruts et offre une transition visuelle fluide.
 */
export default function LoadingState({
    variant = "card",
    count = 4,
    lines = 3,
    height = 200,
    className = "",
    style = {},
    ...props
}) {
    if (variant === "spinner") {
        return (
            <div
                className={`d-flex flex-column align-items-center justify-content-center py-5 ${className}`}
                style={style}
                {...props}
            >
                <div
                    className="spinner-border text-success mb-2"
                    role="status"
                    style={{
                        color: "var(--af-green-700, #2d7356) !important",
                        width: "2.5rem",
                        height: "2.5rem",
                    }}
                >
                    <span className="visually-hidden">Chargement en cours...</span>
                </div>
                <small style={{ color: "var(--af-ink-600, #65736b)" }}>Synchronisation en cours...</small>
            </div>
        );
    }

    if (variant === "lines") {
        return (
            <div className={`d-flex flex-column gap-2 ${className}`} style={style} {...props}>
                {Array.from({ length: lines }).map((_, idx) => (
                    <div
                        key={idx}
                        className="af-skeleton"
                        style={{
                            height: "16px",
                            width: idx === lines - 1 ? "60%" : "100%",
                        }}
                    />
                ))}
            </div>
        );
    }

    if (variant === "table") {
        return (
            <div className={`d-flex flex-column gap-3 py-3 ${className}`} style={style} {...props}>
                {Array.from({ length: count }).map((_, idx) => (
                    <div
                        key={idx}
                        className="af-skeleton"
                        style={{
                            height: "44px",
                            width: "100%",
                            borderRadius: "var(--af-radius-md, 10px)",
                        }}
                    />
                ))}
            </div>
        );
    }

    // Default: "card" skeleton (e.g. for product cards)
    return (
        <div className={`row g-4 ${className}`} style={style} {...props}>
            {Array.from({ length: count }).map((_, idx) => (
                <div key={idx} className="col-12 col-sm-6 col-lg-3">
                    <div
                        className="h-100 d-flex flex-column"
                        style={{
                            backgroundColor: "var(--af-surface, #ffffff)",
                            borderRadius: "var(--af-radius-lg, 20px)",
                            border: "1px solid var(--af-border, #e2e9e3)",
                            overflow: "hidden",
                        }}
                    >
                        <div
                            className="af-skeleton"
                            style={{
                                height: `${height}px`,
                                borderRadius: "0",
                            }}
                        />
                        <div className="p-3 d-flex flex-column gap-2">
                            <div className="af-skeleton" style={{ height: "18px", width: "70%" }} />
                            <div className="af-skeleton" style={{ height: "14px", width: "90%" }} />
                            <div className="af-skeleton" style={{ height: "14px", width: "40%", marginBottom: "12px" }} />
                            <div className="af-skeleton" style={{ height: "24px", width: "50%", marginTop: "auto" }} />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
