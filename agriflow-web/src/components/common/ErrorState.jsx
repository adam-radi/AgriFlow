import Button from "./Button";

/**
 * Composant ErrorState pour les retours d'erreurs API ou d'affichage.
 * Permet d'informer l'utilisateur avec sobriété et de proposer un bouton de réessai.
 */
export default function ErrorState({
    title = "Une erreur est survenue",
    message = "Impossible de récupérer les informations pour le moment. Veuillez réessayer.",
    onRetry,
    retryLabel = "Réessayer",
    variant = "warning",
    className = "",
    style = {},
    ...props
}) {
    const alertClasses = {
        warning: "af-alert-warning",
        danger: "af-alert-danger",
    };

    return (
        <div
            className={`af-alert ${alertClasses[variant] || "af-alert-warning"} d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 p-3 rounded-3 ${className}`}
            role="alert"
            style={{
                borderRadius: "var(--af-radius-md, 12px)",
                ...style,
            }}
            {...props}
        >
            <div>
                {title && (
                    <strong className="d-block mb-1" style={{ fontSize: "0.92rem" }}>
                        {title}
                    </strong>
                )}
                <span style={{ fontSize: "0.88rem", opacity: 0.9 }}>{message}</span>
            </div>

            {onRetry && (
                <Button
                    variant="secondary"
                    size="sm"
                    onClick={onRetry}
                    className="flex-shrink-0 align-self-start align-self-sm-auto"
                >
                    {retryLabel}
                </Button>
            )}
        </div>
    );
}
