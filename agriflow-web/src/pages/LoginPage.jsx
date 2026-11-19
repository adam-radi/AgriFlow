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

/**
 * LoginPage — Page de connexion officielle AgriFlow (Phase 05)
 * Conception split-screen premium, épurée et rassurante, inspirée des standards AgTech.
 */
export default function LoginPage() {
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [showPassword, setShowPassword] = useState(false);

    const dispatch = useDispatch();
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const loading = useSelector(selectAuthLoading);
    const error = useSelector(selectAuthError);
    const role = useSelector(selectUserRole);

    const handleChange = (e) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(loginUser(formData));
    };

    // Redirection automatique selon le rôle après connexion
    if (isAuthenticated) {
        const roleMap = {
            Admin: "/admin",
            Farmer: "/farmer/dashboard",
            Client: "/products",
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

                        {/* Alerte d'erreur éventuelle */}
                        {error && (
                            <Alert
                                variant="danger"
                                className="rounded-3 mb-4 py-2 small"
                                style={{
                                    backgroundColor: "#FFF0EF",
                                    borderColor: "#FED7AA",
                                    color: "#9A3412",
                                }}
                            >
                                {typeof error === "string" ? error : "Identifiants invalides. Veuillez vérifier vos accès."}
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
                                    className="af-auth-input"
                                    type="email"
                                    name="email"
                                    placeholder="exemple@exploitation.ma"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    autoComplete="email"
                                />
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
                                        className="af-auth-input"
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        placeholder="••••••••"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                        autoComplete="current-password"
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
                            </div>

                            {/* Bouton de soumission */}
                            <div className="mt-4">
                                <Button
                                    type="submit"
                                    variant="primary"
                                    pill
                                    size="lg"
                                    isLoading={loading}
                                    className="w-100"
                                >
                                    Se connecter →
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
