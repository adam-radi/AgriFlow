import { forwardRef } from "react";
import { Link } from "react-router-dom";

/**
 * Composant Button réutilisable pour le Design System AgriFlow.
 * Supporte les variantes visuelles, tailles, états de chargement et l'utilisation en tant que lien (Router Link ou balise a).
 */
const Button = forwardRef(function Button(
    {
        children,
        variant = "primary",
        size = "md",
        type = "button",
        disabled = false,
        isLoading = false,
        block = false,
        pill = false,
        as = "button",
        to,
        href,
        className = "",
        style = {},
        ...props
    },
    ref
) {
    // Classes de base du design system
    const sizeClasses = {
        sm: "af-btn-sm",
        md: "",
        lg: "af-btn-lg",
    };

    const variantClasses = {
        primary: "af-btn-primary",
        secondary: "af-btn-secondary",
        ghost: "af-btn-ghost",
        danger: "af-btn-danger",
        outline: "af-btn-secondary",
    };

    const classes = [
        "af-btn",
        variantClasses[variant] || "af-btn-primary",
        sizeClasses[size] || "",
        block ? "af-btn-block" : "",
        className,
    ]
        .filter(Boolean)
        .join(" ");

    const combinedStyle = {
        ...(pill ? { borderRadius: "var(--af-radius-pill, 999px)" } : {}),
        ...style,
    };

    const content = (
        <>
            {isLoading && (
                <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                    style={{ width: "1rem", height: "1rem", borderWidth: "2px" }}
                />
            )}
            {children}
        </>
    );

    // Rendu en tant que lien React Router
    if (to || as === Link) {
        return (
            <Link
                ref={ref}
                to={to || "#"}
                className={classes}
                style={combinedStyle}
                aria-disabled={disabled || isLoading}
                tabIndex={disabled || isLoading ? -1 : undefined}
                {...props}
            >
                {content}
            </Link>
        );
    }

    // Rendu en tant que lien externe classique
    if (href || as === "a") {
        return (
            <a
                ref={ref}
                href={href || "#"}
                className={classes}
                style={combinedStyle}
                aria-disabled={disabled || isLoading}
                tabIndex={disabled || isLoading ? -1 : undefined}
                {...props}
            >
                {content}
            </a>
        );
    }

    // Rendu bouton HTML standard
    return (
        <button
            ref={ref}
            type={type}
            disabled={disabled || isLoading}
            className={classes}
            style={combinedStyle}
            aria-busy={isLoading}
            {...props}
        >
            {content}
        </button>
    );
});

export default Button;
