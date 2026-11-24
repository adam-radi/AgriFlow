export default function Button({
    children,
    type = "button",
    variant = "primary",
    size = "md",
    pill = false,
    block = false,
    isLoading = false,
    disabled = false,
    className = "",
    onClick,
    ...props
}) {
    const variantClass = `af-btn-${variant}`;
    const sizeClass = size === "sm" ? "af-btn-sm" : size === "lg" ? "af-btn-lg" : "";
    const pillClass = pill ? "rounded-pill" : "";
    const blockClass = block ? "af-btn-block" : "";

    return (
        <button
            type={type}
            disabled={disabled || isLoading}
            onClick={onClick}
            className={`af-btn ${variantClass} ${sizeClass} ${pillClass} ${blockClass} ${className}`.trim()}
            {...props}
        >
            {isLoading ? (
                <>
                    <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                    />
                    <span>Chargement...</span>
                </>
            ) : (
                children
            )}
        </button>
    );
}
