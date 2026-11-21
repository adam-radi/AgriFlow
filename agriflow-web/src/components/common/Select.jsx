import { forwardRef } from "react";

/**
 * Composant Select accessible et compatible react-hook-form.
 * Supporte un tableau d'options ou des balises <option> enfants.
 */
const Select = forwardRef(function Select(
    {
        label,
        id,
        name,
        options = [],
        placeholder,
        error,
        helperText,
        required = false,
        disabled = false,
        className = "",
        containerClassName = "",
        children,
        ...props
    },
    ref
) {
    const selectId = id || name || Math.random().toString(36).slice(2, 9);
    const errorId = error ? `${selectId}-error` : undefined;
    const helperId = helperText ? `${selectId}-helper` : undefined;

    const selectClasses = [
        "af-select",
        className,
    ]
        .filter(Boolean)
        .join(" ");

    return (
        <div className={`af-field ${containerClassName}`}>
            {label && (
                <label htmlFor={selectId} className="af-label">
                    {label} {required && <span className="text-danger">*</span>}
                </label>
            )}

            <select
                ref={ref}
                id={selectId}
                name={name}
                disabled={disabled}
                className={selectClasses}
                aria-invalid={Boolean(error)}
                aria-describedby={[errorId, helperId].filter(Boolean).join(" ") || undefined}
                {...props}
            >
                {placeholder && (
                    <option value="" disabled>
                        {placeholder}
                    </option>
                )}
                {options.length > 0
                    ? options.map((opt) => (
                          <option
                              key={opt.value}
                              value={opt.value}
                              disabled={opt.disabled}
                          >
                              {opt.label}
                          </option>
                      ))
                    : children}
            </select>

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

export default Select;
