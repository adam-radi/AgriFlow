import { forwardRef } from "react";

/**
 * Composant Input / Champ de formulaire accessible et compatible react-hook-form.
 * Gère les labels, textes d'aide, messages d'erreurs et états invalides.
 */
const Input = forwardRef(function Input(
    {
        label,
        id,
        name,
        type = "text",
        error,
        helperText,
        required = false,
        disabled = false,
        as = "input",
        rows = 4,
        className = "",
        containerClassName = "",
        ...props
    },
    ref
) {
    const inputId = id || name || Math.random().toString(36).slice(2, 9);
    const errorId = error ? `${inputId}-error` : undefined;
    const helperId = helperText ? `${inputId}-helper` : undefined;

    const inputClasses = [
        as === "textarea" ? "af-textarea" : "af-input",
        className,
    ]
        .filter(Boolean)
        .join(" ");

    return (
        <div className={`af-field ${containerClassName}`}>
            {label && (
                <label htmlFor={inputId} className="af-label">
                    {label} {required && <span className="text-danger">*</span>}
                </label>
            )}

            {as === "textarea" ? (
                <textarea
                    ref={ref}
                    id={inputId}
                    name={name}
                    rows={rows}
                    disabled={disabled}
                    className={inputClasses}
                    aria-invalid={Boolean(error)}
                    aria-describedby={[errorId, helperId].filter(Boolean).join(" ") || undefined}
                    {...props}
                />
            ) : (
                <input
                    ref={ref}
                    id={inputId}
                    name={name}
                    type={type}
                    disabled={disabled}
                    className={inputClasses}
                    aria-invalid={Boolean(error)}
                    aria-describedby={[errorId, helperId].filter(Boolean).join(" ") || undefined}
                    {...props}
                />
            )}

            {helperText && !error && (
                <span id={helperId} className="af-help">
                    {helperText}
                </span>
            )}

            {error && (
                <span id={errorId} className="af-error" role="alert">
                    {error}
                </span>
            )}
        </div>
    );
});

export default Input;
