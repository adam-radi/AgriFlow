/**
 * Composant SectionHeader pour unifier l'en-tête de toutes les sections publiques et tableaux de bord.
 * Gère l'eyebrow / tag, le titre H2, la description et un slot d'action optionnel.
 */
export default function SectionHeader({
    eyebrow,
    title,
    subtitle,
    description,
    action,
    align = "left",
    className = "",
    style = {},
    ...props
}) {
    const isCenter = align === "center";
    const subText = subtitle || description;

    return (
        <div
            className={`af-section-header-wrap mb-4 ${className}`}
            style={{
                textAlign: isCenter ? "center" : "left",
                maxWidth: isCenter ? "720px" : "100%",
                marginInline: isCenter ? "auto" : undefined,
                ...style,
            }}
            {...props}
        >
            <div
                className={`d-flex ${
                    isCenter
                        ? "flex-column align-items-center"
                        : "flex-column flex-md-row justify-content-between align-items-md-end gap-3"
                }`}
            >
                <div style={{ maxWidth: isCenter ? "100%" : "680px" }}>
                    {eyebrow && (
                        <div
                            className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill mb-2"
                            style={{
                                backgroundColor: "var(--af-green-100, #e8f2ec)",
                                color: "var(--af-green-900, #194638)",
                                fontSize: "0.78rem",
                                fontWeight: 700,
                                letterSpacing: "0.06em",
                                textTransform: "uppercase",
                            }}
                        >
                            {eyebrow}
                        </div>
                    )}

                    {title && (
                        <h2
                            className="fw-bold mb-1"
                            style={{
                                color: "var(--af-green-950, #15372f)",
                                letterSpacing: "-0.03em",
                                fontSize: "clamp(1.75rem, 3.2vw, 2.4rem)",
                                lineHeight: 1.2,
                            }}
                        >
                            {title}
                        </h2>
                    )}

                    {subText && (
                        <p
                            className="mb-0"
                            style={{
                                color: "var(--af-ink-600, #65736b)",
                                fontSize: "1rem",
                                lineHeight: 1.6,
                                marginTop: "6px",
                            }}
                        >
                            {subText}
                        </p>
                    )}
                </div>

                {action && !isCenter && (
                    <div className="flex-shrink-0 pt-2 pt-md-0">
                        {action}
                    </div>
                )}
            </div>

            {action && isCenter && (
                <div className="mt-3">
                    {action}
                </div>
            )}
        </div>
    );
}
