/**
 * Composant Badge / Pill de statut pour le Design System AgriFlow.
 * Idéal pour afficher les statuts de commande, labels d'exploitation, disponibilités et catégories.
 */
export default function Badge({
    children,
    variant = "neutral",
    size = "md",
    dot = false,
    className = "",
    style = {},
    ...props
}) {
    const variantClasses = {
        neutral: "af-badge-neutral",
        success: "af-badge-success",
        warning: "af-badge-warning",
        danger: "af-badge-danger",
        info: "af-badge-info",
        green: "af-badge-green",
    };

    const dotColors = {
        neutral: "var(--af-ink-500, #7f8b84)",
        success: "var(--af-success, #247a50)",
        warning: "var(--af-warning, #a96d17)",
        danger: "var(--af-danger, #b64242)",
        info: "var(--af-info, #326f9e)",
        green: "var(--af-green-600, #398565)",
    };

    const sizeStyles = {
        sm: { fontSize: "0.7rem", padding: "0.15rem 0.5rem", minHeight: "20px" },
        md: { fontSize: "0.78rem", padding: "0.25rem 0.65rem", minHeight: "24px" },
    };

    const classes = [
        "af-badge",
        variantClasses[variant] || "af-badge-neutral",
        className,
    ]
        .filter(Boolean)
        .join(" ");

    const combinedStyle = {
        borderRadius: "var(--af-radius-pill, 999px)",
        ...(sizeStyles[size] || sizeStyles.md),
        ...style,
    };

    return (
        <span className={classes} style={combinedStyle} {...props}>
            {dot && (
                <span
                    style={{
                        display: "inline-block",
                        width: "6px",
                        height: "6px",
                        borderRadius: "50%",
                        backgroundColor: dotColors[variant] || dotColors.neutral,
                    }}
                    aria-hidden="true"
                />
            )}
            {children}
        </span>
    );
}
