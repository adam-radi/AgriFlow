/**
 * Composant Card standardisé pour le Design System AgriFlow.
 * Inclut les sous-composants Header, Title, Description, Body et Footer.
 */
export default function Card({
    children,
    variant = "default",
    as: Component = "div",
    className = "",
    style = {},
    ...props
}) {
    const variantStyles = {
        default: {
            backgroundColor: "var(--af-surface, #ffffff)",
            border: "1px solid var(--af-border, #e2e9e3)",
            boxShadow: "var(--af-shadow-xs, 0 1px 2px rgba(25, 45, 34, 0.05))",
        },
        elevated: {
            backgroundColor: "var(--af-surface, #ffffff)",
            border: "1px solid var(--af-border, #e2e9e3)",
            boxShadow: "var(--af-shadow-md, 0 8px 24px rgba(25, 45, 34, 0.08))",
        },
        interactive: {
            backgroundColor: "var(--af-surface, #ffffff)",
            border: "1px solid var(--af-border, #e2e9e3)",
            boxShadow: "var(--af-shadow-xs, 0 1px 2px rgba(25, 45, 34, 0.05))",
            cursor: "pointer",
            transition: "transform 180ms ease, box-shadow 180ms ease, border-color 180ms ease",
        },
        muted: {
            backgroundColor: "var(--af-canvas, #f6f8f5)",
            border: "1px solid var(--af-border, #e2e9e3)",
            boxShadow: "none",
        },
    };

    const combinedStyle = {
        borderRadius: "var(--af-radius-lg, 16px)",
        ...(variantStyles[variant] || variantStyles.default),
        ...style,
    };

    return (
        <Component
            className={`af-card ${variant === "interactive" ? "af-card-interactive" : ""} ${className}`}
            style={combinedStyle}
            {...props}
        >
            {children}
        </Component>
    );
}

Card.Header = function CardHeader({ children, className = "", style = {}, ...props }) {
    return (
        <div className={`af-card-header ${className}`} style={style} {...props}>
            {children}
        </div>
    );
};

Card.Title = function CardTitle({ children, as: Component = "h3", className = "", style = {}, ...props }) {
    return (
        <Component className={`af-card-title ${className}`} style={style} {...props}>
            {children}
        </Component>
    );
};

Card.Description = function CardDescription({ children, className = "", style = {}, ...props }) {
    return (
        <p className={`af-card-description ${className}`} style={style} {...props}>
            {children}
        </p>
    );
};

Card.Body = function CardBody({ children, className = "", style = {}, ...props }) {
    return (
        <div className={`af-card-body ${className}`} style={style} {...props}>
            {children}
        </div>
    );
};

Card.Footer = function CardFooter({ children, className = "", style = {}, ...props }) {
    return (
        <div
            className={`af-card-footer pt-3 mt-auto border-top ${className}`}
            style={{ borderColor: "var(--af-border, #e2e9e3)", ...style }}
            {...props}
        >
            {children}
        </div>
    );
};
