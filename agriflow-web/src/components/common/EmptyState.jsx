/**
 * Composant EmptyState pour afficher les cas où aucune donnée n'est disponible
 * (catalogue vide, panier vide, aucun résultat de recherche, etc.).
 */
export default function EmptyState({
    title = "Aucun élément trouvé",
    description = "Il n'y a actuellement aucune donnée disponible à afficher.",
    icon,
    action,
    className = "",
    style = {},
    ...props
}) {
    return (
        <div
            className={`af-empty-state rounded-4 p-5 text-center ${className}`}
            style={{
                backgroundColor: "var(--af-canvas, #f6f8f5)",
                border: "1px dashed var(--af-border-strong, #cbd7ce)",
                ...style,
            }}
            {...props}
        >
            {icon && (
                <div
                    className="mb-2"
                    style={{
                        fontSize: "2.5rem",
                        lineHeight: 1,
                    }}
                >
                    {icon}
                </div>
            )}

            <h4
                className="fw-bold mb-2"
                style={{
                    color: "var(--af-green-950, #15372f)",
                    fontSize: "1.2rem",
                    letterSpacing: "-0.015em",
                }}
            >
                {title}
            </h4>

            <p
                style={{
                    color: "var(--af-ink-600, #65736b)",
                    fontSize: "0.95rem",
                    maxWidth: "460px",
                    margin: "0 auto",
                    lineHeight: 1.6,
                }}
            >
                {description}
            </p>

            {action && <div className="mt-4">{action}</div>}
        </div>
    );
}
