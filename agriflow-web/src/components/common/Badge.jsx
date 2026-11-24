export default function Badge({
    children,
    variant = "neutral",
    size = "md",
    className = "",
    ...props
}) {
    const variantClass = `af-badge-${variant}`;
    const sizeStyle = size === "sm" ? { fontSize: "0.72rem", padding: "0.15rem 0.5rem" } : {};

    return (
        <span
            className={`af-badge ${variantClass} ${className}`.trim()}
            style={sizeStyle}
            {...props}
        >
            {children}
        </span>
    );
}
