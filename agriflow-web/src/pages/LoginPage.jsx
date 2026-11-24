import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, Link } from "react-router-dom";
import { Alert } from "react-bootstrap";

import { loginUser } from "../features/auth/authThunks";
import {
    selectAuthLoading,
    selectAuthError,
    selectIsAuthenticated,
    selectUserRole,
} from "../features/auth/authSelectors";
import Logo from "../components/layout/Logo";
import { Button } from "../components/common";
import "../assets/auth.css";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * LoginPage — Page de connexion officielle AgriFlow (Phase 05 / 07)
 * Conception split-screen premium, feedback temps réel et gestion fine des erreurs.
 */
export default function LoginPage() {
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [fieldErrors, setFieldErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);

    const dispatch = useDispatch();
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const loading = useSelector(selectAuthLoading);
    const serverError = useSelector(selectAuthError);
    const role = useSelector(selectUserRole);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        // Nettoyage immédiat de l'erreur du champ modifié
        if (fieldErrors[name]) {
            setFieldErrors((prev) => ({ ...prev, [name]: "" }));
        }
    };

    const validateForm = () => {
        const errors = {};
        const trimmedEmail = formData.email.trim();

        if (!trimmedEmail) {
            errors.email = "L'adresse e-mail est obligatoire.";
        } else if (!EMAIL_REGEX.test(trimmedEmail)) {
            errors.email = "Format d'e-mail invalide (ex: contact@exemple.ma).";
        }

        if (!formData.password) {
            errors.password = "Le mot de passe est obligatoire.";
        }

        setFieldErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        dispatch(loginUser(formData));
    };

    // Redirection automatique selon le rôle après connexion
    if (isAuthenticated) {
        const roleMap = {
            Admin: "/admin",
            Farmer: "/farmer/dashboard",
            Client: "/client/dashboard",
            Livreur: "/delivery/dashboard",
        };
        return <Navigate to={roleMap[role] || "/"} replace />;
    }

    return (
        <div className="af-auth-wrapper">
            <div className="af-auth-container">
                {/* ── Colonne Gauche : Formulaire & Identité ────────────── */}
                <div className="af-auth-form-col">
                    <div>
                        {/* En-tête : Logo AgriFlow officiel & Indicateur Pays */}
                        <div className="af-auth-form-header">
                            <Link to="/" className="text-decoration-none d-inline-block" aria-label="Retour à l'accueil AgriFlow">
                                <Logo height={38} />
                            </Link>
                            <span
                                className="small px-2 py-1 rounded-pill"
                                style={{
                                    backgroundColor: "var(--af-canvas, #F6F8F5)",
                                    color: "var(--af-ink-700, #3F4D45)",
                                    fontSize: "0.78rem",
                                    fontWeight: 600,
                                    border: "1px solid var(--af-border, #E2E9E3)",
                                }}
                            >
                                Maroc 🇲🇦
                            </span>
                        </div>

                        {/* Titre & Sous-titre accueillants */}
                        <h1 className="af-auth-title">Bonjour !</h1>
                        <p className="af-auth-subtitle">
                            Pour vous connecter à votre compte, renseignez votre adresse e-mail ainsi que votre mot de passe.
                        </p>

                        {/* Alerte d'erreur globale ou serveur */}
                        {serverError && (
                            <Alert
                                variant="danger"
                                className="rounded-3 mb-4 py-2 small d-flex align-items-center gap-2"
                                style={{
                                    backgroundColor: "#FFF0EF",
                                    borderColor: "#FED7AA",
                                    color: "#9A3412",
                                }}
                            >
                                <span style={{ fontSize: "1.1rem" }}>⚠️</span>
                                <div>
                                    {typeof serverError === "string"
                                        ? serverError
                                        : "Identifiants invalides. Veuillez vérifier votre adresse e-mail et mot de passe."}
                                </div>
                            </Alert>
                        )}

                        {/* Formulaire de connexion */}
                        <form onSubmit={handleSubmit} noValidate>
                            {/* Champ E-mail */}
                            <div className="af-auth-group">
                                <label className="af-auth-label" htmlFor="login-email">
                                    Adresse e-mail professionnelle
                                </label>
                                <input
                                    id="login-email"
                                    className={`af-auth-input ${fieldErrors.email ? "is-invalid" : ""}`}
                                    type="email"
                                    name="email"
                                    placeholder="exemple@exploitation.ma"
                                    value={formData.email}
                                    onChange={handleChange}
                                    disabled={loading}
                                    required
                                    autoComplete="email"
                                    aria-describedby={fieldErrors.email ? "login-email-error" : undefined}
                                />
                                {fieldErrors.email && (
                                    <div id="login-email-error" className="af-field-error">
                                        <span>✕</span> {fieldErrors.email}
                                    </div>
                                )}
                            </div>

                            {/* Champ Mot de passe avec toggle */}
                            <div className="af-auth-group">
                                <div className="d-flex justify-content-between align-items-center mb-1">
                                    <label className="af-auth-label m-0" htmlFor="login-password">
                                        Mot de passe
                                    </label>
                                </div>
                                <div className="af-password-wrapper">
                                    <input
                                        id="login-password"
                                        className={`af-auth-input ${fieldErrors.password ? "is-invalid" : ""}`}
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        placeholder="••••••••"
                                        value={formData.password}
                                        onChange={handleChange}
                                        disabled={loading}
                                        required
                                        autoComplete="current-password"
                                        aria-describedby={fieldErrors.password ? "login-password-error" : undefined}
                                    />
                                    <button
                                        type="button"
                                        className="af-password-toggle"
                                        onClick={() => setShowPassword(!showPassword)}
                                        aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                                    >
                                        {showPassword ? "Masquer" : "Afficher"}
                                    </button>
                                </div>
                                {fieldErrors.password && (
                                    <div id="login-password-error" className="af-field-error">
                                        <span>✕</span> {fieldErrors.password}
                                    </div>
                                )}
                            </div>

                            {/* Bouton de soumission avec état de chargement */}
                            <div className="mt-4">
                                <Button
                                    type="submit"
                                    variant="primary"
                                    pill
                                    size="lg"
                                    isLoading={loading}
                                    disabled={loading}
                                    className="w-100"
                                >
                                    {loading ? "Connexion en cours..." : "Se connecter →"}
                                </Button>
                            </div>
                        </form>

                        {/* Lien vers inscription */}
                        <div className="text-center mt-4">
                            <span className="small text-muted">Vous n&apos;avez pas encore de compte ? </span>
                            <Link
                                to="/register"
                                className="small fw-bold text-decoration-none"
                                style={{ color: "var(--af-green-900, #194638)" }}
                            >
                                Créer un compte
                            </Link>
                        </div>
                    </div>

                    {/* Pied du formulaire : Support & Contact */}
                    <div className="text-center pt-4 border-top mt-4" style={{ borderColor: "var(--af-border, #E2E9E3)" }}>
                        <span className="small text-muted d-block" style={{ fontSize: "0.8rem" }}>
                            Besoin d&apos;aide ou d&apos;assistance ?
                        </span>
                        <a
                            href="mailto:contact@agriflow.ma"
                            className="small fw-semibold text-decoration-none"
                            style={{ color: "var(--af-green-700, #398565)", fontSize: "0.82rem" }}
                        >
                            contact@agriflow.ma
                        </a>
                    </div>
                </div>

                {/* ── Colonne Droite : Visuel Agricole & Glass Card ──────── */}
                <div className="af-auth-visual-col">
                    <div className="af-auth-visual-overlay" />
                    <div className="af-auth-glass-card">
                        <div
                            className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
                            style={{
                                width: "32px",
                                height: "32px",
                                backgroundColor: "rgba(255, 255, 255, 0.2)",
                                color: "#FFFFFF",
                                fontSize: "0.9rem",
                            }}
                        >
                            🌱
                        </div>
                        <h2 className="af-auth-glass-quote">
                            « La relation commerciale directe entre producteurs et acheteurs professionnels. »
                        </h2>
                        <p className="af-auth-glass-meta m-0">
                            AgriFlow simplifie les échanges maraîchers et fruitiers à travers tout le Maroc sans intermédiaires commerciaux.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
