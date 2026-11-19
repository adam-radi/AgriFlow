import { Link } from "react-router-dom";
import Logo from "../components/layout/Logo";
import { Badge } from "../components/common";
import "../assets/auth.css";

/**
 * RegisterPage — Choix du profil d'inscription (Phase 05)
 * Permet à l'utilisateur de s'orienter simplement entre Agriculteur et Acheteur Professionnel.
 */
export default function RegisterPage() {
    return (
        <div className="af-auth-wrapper">
            <div className="af-auth-container" style={{ maxWidth: "1100px" }}>
                {/* ── Colonne Gauche : Sélection du profil ──────────────── */}
                <div className="af-auth-form-col">
                    <div>
                        {/* En-tête avec Logo officiel */}
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
                                Inscription · Étape 1/2
                            </span>
                        </div>

                        <h1 className="af-auth-title">Rejoignez AgriFlow</h1>
                        <p className="af-auth-subtitle">
                            Sélectionnez votre activité pour configurer votre compte professionnel adapté.
                        </p>

                        {/* Cartes de choix des deux profils */}
                        <div className="d-flex flex-column gap-3 mb-4">
                            {/* Option 1 : Agriculteur & Producteur */}
                            <Link
                                to="/register/farmer"
                                className="af-profile-card text-decoration-none"
                                id="choose-farmer-profile"
                            >
                                <div className="d-flex justify-content-between align-items-center mb-2">
                                    <Badge variant="green" size="sm">
                                        PRODUCTION & EXPLOITATION
                                    </Badge>
                                    <span
                                        className="fw-bold"
                                        style={{ color: "var(--af-green-900, #194638)", fontSize: "1.1rem" }}
                                    >
                                        →
                                    </span>
                                </div>
                                <h2
                                    className="fw-bold mb-1"
                                    style={{ color: "var(--af-green-950, #15372F)", fontSize: "1.2rem" }}
                                >
                                    Agriculteur ou Coopérative
                                </h2>
                                <p
                                    className="small m-0"
                                    style={{ color: "var(--af-ink-600, #68756E)", lineHeight: 1.5 }}
                                >
                                    Vous produisez des fruits, légumes ou produits du terroir et souhaitez les
                                    commercialiser directement auprès des acheteurs professionnels.
                                </p>
                            </Link>

                            {/* Option 2 : Acheteur Professionnel */}
                            <Link
                                to="/register/client"
                                className="af-profile-card text-decoration-none"
                                id="choose-buyer-profile"
                            >
                                <div className="d-flex justify-content-between align-items-center mb-2">
                                    <Badge variant="neutral" size="sm">
                                        COMMERCES & RESTAURATION
                                    </Badge>
                                    <span
                                        className="fw-bold"
                                        style={{ color: "var(--af-green-900, #194638)", fontSize: "1.1rem" }}
                                    >
                                        →
                                    </span>
                                </div>
                                <h2
                                    className="fw-bold mb-1"
                                    style={{ color: "var(--af-green-950, #15372F)", fontSize: "1.2rem" }}
                                >
                                    Acheteur Professionnel
                                </h2>
                                <p
                                    className="small m-0"
                                    style={{ color: "var(--af-ink-600, #68756E)", lineHeight: 1.5 }}
                                >
                                    Épiceries, primeurs, restaurateurs ou grossistes : approvisionnez votre établissement
                                    en récoltes fraîches au tarif net exploitation.
                                </p>
                            </Link>
                        </div>

                        {/* Lien de connexion */}
                        <div className="text-center">
                            <span className="small text-muted">Vous possédez déjà un compte ? </span>
                            <Link
                                to="/login"
                                className="small fw-bold text-decoration-none"
                                style={{ color: "var(--af-green-900, #194638)" }}
                            >
                                Se connecter
                            </Link>
                        </div>
                    </div>

                    {/* Support & Contact */}
                    <div className="text-center pt-4 border-top mt-4" style={{ borderColor: "var(--af-border, #E2E9E3)" }}>
                        <span className="small text-muted" style={{ fontSize: "0.8rem" }}>
                            Assistance à l&apos;inscription :{" "}
                            <a
                                href="mailto:contact@agriflow.ma"
                                className="fw-semibold text-decoration-none"
                                style={{ color: "var(--af-green-700, #398565)" }}
                            >
                                contact@agriflow.ma
                            </a>
                        </span>
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
                            ✓
                        </div>
                        <h2 className="af-auth-glass-quote">
                            « Une communauté de confiance au service de l&apos;agriculture marocaine. »
                        </h2>
                        <p className="af-auth-glass-meta m-0">
                            Rejoignez des centaines d&apos;exploitants et d&apos;acheteurs partenaires réunis autour de la transparence des prix et de la fraîcheur.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

