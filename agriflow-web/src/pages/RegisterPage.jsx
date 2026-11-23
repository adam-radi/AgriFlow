import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Alert } from "react-bootstrap";
import Logo from "../components/layout/Logo";
import { Badge } from "../components/common";
import { registerFarmer, registerClient } from "../features/auth/authThunks";
import { selectAuthLoading, selectAuthError } from "../features/auth/authSelectors";
import "../assets/auth.css";

const BUYER_ZONES = [
    { value: "Casablanca-Settat", label: "Grand Casablanca / Settat" },
    { value: "Rabat-Salé-Kénitra", label: "Rabat / Salé / Kénitra" },
    { value: "Marrakech-Safi", label: "Marrakech / Région Haouz" },
    { value: "Souss-Massa", label: "Agadir / Région Souss-Massa" },
    { value: "Tanger-Tétouan-Al Hoceïma", label: "Tanger / Région Nord" },
    { value: "Fès-Meknès", label: "Fès / Meknès" },
    { value: "Oriental", label: "Oujda / Berkane / Nador" },
    { value: "Autre région", label: "Autre région du Maroc" },
];

/**
 * RegisterPage — Inscription AgriFlow avec Choix de Rôle (Phase 07)
 *
 * Permet à l'utilisateur de :
 * 1. Choisir son profil : Agriculteur ou Acheteur Professionnel
 * 2. Remplir le formulaire adapté
 * 3. Accéder immédiatement à l'espace correspondant après inscription
 */
export default function RegisterPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const loading = useSelector(selectAuthLoading);
    const serverError = useSelector(selectAuthError);

    // Initial role based on query param or route (default: Farmer)
    const initialRole = location.pathname.includes("client") ? "Client" : "Farmer";

    const [selectedRole, setSelectedRole] = useState(initialRole);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        zone: "Casablanca-Settat",
        password: "",
        password_confirmation: "",
    });
    const [showPassword, setShowPassword] = useState(false);
    const [localError, setLocalError] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setLocalError("");
    };

    const handleRoleSelect = (role) => {
        setSelectedRole(role);
        setLocalError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLocalError("");

        if (!formData.name.trim()) {
            setLocalError("Le nom complet est obligatoire.");
            return;
        }

        if (!formData.email.trim()) {
            setLocalError("L'adresse e-mail est obligatoire.");
            return;
        }

        if (formData.password.length < 8) {
            setLocalError("Le mot de passe doit comporter au moins 8 caractères.");
            return;
        }

        if (formData.password !== formData.password_confirmation) {
            setLocalError("Les mots de passe ne correspondent pas.");
            return;
        }

        try {
            if (selectedRole === "Farmer") {
                const payload = {
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone || undefined,
                    password: formData.password,
                    password_confirmation: formData.password_confirmation,
                };
                await dispatch(registerFarmer(payload)).unwrap();
                // Redirection immédiate vers le dashboard Agriculteur (Phase 07)
                navigate("/farmer/dashboard");
            } else {
                const payload = {
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone,
                    zone: formData.zone,
                    password: formData.password,
                    password_confirmation: formData.password_confirmation,
                };
                await dispatch(registerClient(payload)).unwrap();
                // Redirection immédiate vers le catalogue acheteur
                navigate("/products");
            }
        } catch {
            // L'erreur est capturée et affichée via Redux
        }
    };

    const displayError = localError || serverError;

    return (
        <div className="af-auth-wrapper">
            <div className="af-auth-container" style={{ maxWidth: "1120px" }}>
                {/* ── Colonne Gauche : Formulaire et Sélection ──────────────── */}
                <div className="af-auth-form-col">
                    <div>
                        {/* En-tête */}
                        <div className="af-auth-form-header">
                            <Link to="/" className="text-decoration-none d-inline-block" aria-label="Retour à l'accueil AgriFlow">
                                <Logo height={36} />
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
                                Création de compte
                            </span>
                        </div>

                        <h1 className="af-auth-title">Rejoignez AgriFlow</h1>
                        <p className="af-auth-subtitle">
                            La plateforme agricole marocaine qui relie directement producteurs et acheteurs professionnels.
                        </p>

                        {/* ── Section Étape 2 : Quel type de profil souhaitez-vous créer ? ── */}
                        <div className="mb-4">
                            <label className="af-auth-label" style={{ fontSize: "0.92rem", fontWeight: 700, color: "var(--af-green-950, #15372F)" }}>
                                Quel type de profil souhaitez-vous créer ?
                            </label>

                            <div className="d-flex flex-column gap-2 mt-2" role="radiogroup" aria-label="Choix du profil">
                                {/* Option 1 : Agriculteur */}
                                <div
                                    role="radio"
                                    aria-checked={selectedRole === "Farmer"}
                                    tabIndex={0}
                                    onClick={() => handleRoleSelect("Farmer")}
                                    onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && handleRoleSelect("Farmer")}
                                    style={{
                                        border: selectedRole === "Farmer"
                                            ? "2px solid var(--af-green-700, #398565)"
                                            : "1px solid var(--af-border, #E2E9E3)",
                                        backgroundColor: selectedRole === "Farmer"
                                            ? "var(--af-green-50, #EAF3EC)"
                                            : "#FFFFFF",
                                        borderRadius: "14px",
                                        padding: "14px 16px",
                                        cursor: "pointer",
                                        transition: "all 0.2s ease",
                                    }}
                                >
                                    <div className="d-flex justify-content-between align-items-center mb-1">
                                        <div className="d-flex align-items-center gap-2">
                                            <span style={{ fontSize: "1.2rem" }}>🌾</span>
                                            <strong style={{ color: "var(--af-green-950, #15372F)", fontSize: "1rem" }}>
                                                Agriculteur
                                            </strong>
                                        </div>
                                        <Badge variant={selectedRole === "Farmer" ? "green" : "neutral"} size="sm">
                                            {selectedRole === "Farmer" ? "✓ Sélectionné" : "Production"}
                                        </Badge>
                                    </div>
                                    <p className="small m-0 text-muted" style={{ lineHeight: 1.45 }}>
                                        Je souhaite proposer et vendre mes produits agricoles directement.
                                    </p>
                                </div>

                                {/* Option 2 : Acheteur Professionnel */}
                                <div
                                    role="radio"
                                    aria-checked={selectedRole === "Client"}
                                    tabIndex={0}
                                    onClick={() => handleRoleSelect("Client")}
                                    onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && handleRoleSelect("Client")}
                                    style={{
                                        border: selectedRole === "Client"
                                            ? "2px solid var(--af-green-700, #398565)"
                                            : "1px solid var(--af-border, #E2E9E3)",
                                        backgroundColor: selectedRole === "Client"
                                            ? "var(--af-green-50, #EAF3EC)"
                                            : "#FFFFFF",
                                        borderRadius: "14px",
                                        padding: "14px 16px",
                                        cursor: "pointer",
                                        transition: "all 0.2s ease",
                                    }}
                                >
                                    <div className="d-flex justify-content-between align-items-center mb-1">
                                        <div className="d-flex align-items-center gap-2">
                                            <span style={{ fontSize: "1.2rem" }}>🏬</span>
                                            <strong style={{ color: "var(--af-green-950, #15372F)", fontSize: "1rem" }}>
                                                Acheteur professionnel
                                            </strong>
                                        </div>
                                        <Badge variant={selectedRole === "Client" ? "green" : "neutral"} size="sm">
                                            {selectedRole === "Client" ? "✓ Sélectionné" : "Commerces"}
                                        </Badge>
                                    </div>
                                    <p className="small m-0 text-muted" style={{ lineHeight: 1.45 }}>
                                        Je souhaite découvrir et acheter des produits agricoles au tarif exploitation.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Message d'erreur */}
                        {displayError && (
                            <Alert variant="danger" className="py-2 small rounded-3 mb-3">
                                ⚠️ {typeof displayError === "string" ? displayError : "Erreur de validation."}
                            </Alert>
                        )}

                        {/* ── Formulaire Inscription ─────────────────────────── */}
                        <form onSubmit={handleSubmit} noValidate>
                            {/* Nom complet */}
                            <div className="af-auth-group">
                                <label className="af-auth-label" htmlFor="register-name">
                                    {selectedRole === "Farmer" ? "Nom complet ou Nom de l'exploitation" : "Nom du responsable / Établissement"}
                                </label>
                                <input
                                    id="register-name"
                                    type="text"
                                    name="name"
                                    className="af-auth-input"
                                    placeholder={selectedRole === "Farmer" ? "ex. Karim Benali (Ferme Bio Souss)" : "ex. Épicerie Al Amal"}
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    autoComplete="name"
                                />
                            </div>

                            {/* Email & Téléphone en grille */}
                            <div className="row g-2 af-auth-group">
                                <div className="col-12 col-md-7">
                                    <label className="af-auth-label" htmlFor="register-email">
                                        Adresse e-mail
                                    </label>
                                    <input
                                        id="register-email"
                                        type="email"
                                        name="email"
                                        className="af-auth-input"
                                        placeholder="contact@exemple.ma"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        autoComplete="email"
                                    />
                                </div>

                                <div className="col-12 col-md-5">
                                    <label className="af-auth-label" htmlFor="register-phone">
                                        Téléphone {selectedRole === "Farmer" ? "(optionnel)" : "*"}
                                    </label>
                                    <input
                                        id="register-phone"
                                        type="tel"
                                        name="phone"
                                        className="af-auth-input"
                                        placeholder="06 12 34 56 78"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        autoComplete="tel"
                                    />
                                </div>
                            </div>

                            {/* Zone d'activité (affiché spécifiquement si Acheteur professionnel) */}
                            {selectedRole === "Client" && (
                                <div className="af-auth-group">
                                    <label className="af-auth-label" htmlFor="register-zone">
                                        Région d&apos;approvisionnement principale
                                    </label>
                                    <select
                                        id="register-zone"
                                        name="zone"
                                        className="af-auth-input"
                                        value={formData.zone}
                                        onChange={handleChange}
                                    >
                                        {BUYER_ZONES.map((z) => (
                                            <option key={z.value} value={z.value}>
                                                {z.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            {/* Mot de passe */}
                            <div className="af-auth-group">
                                <div className="d-flex justify-content-between align-items-center mb-1">
                                    <label className="af-auth-label m-0" htmlFor="register-password">
                                        Mot de passe (8 car. min)
                                    </label>
                                    <button
                                        type="button"
                                        className="btn btn-link p-0 text-muted small text-decoration-none"
                                        onClick={() => setShowPassword(!showPassword)}
                                        style={{ fontSize: "0.78rem" }}
                                    >
                                        {showPassword ? "Masquer" : "Afficher"}
                                    </button>
                                </div>
                                <input
                                    id="register-password"
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    className="af-auth-input"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    autoComplete="new-password"
                                />
                            </div>

                            {/* Confirmation mot de passe */}
                            <div className="af-auth-group">
                                <label className="af-auth-label" htmlFor="register-confirm">
                                    Confirmer le mot de passe
                                </label>
                                <input
                                    id="register-confirm"
                                    type={showPassword ? "text" : "password"}
                                    name="password_confirmation"
                                    className="af-auth-input"
                                    placeholder="••••••••"
                                    value={formData.password_confirmation}
                                    onChange={handleChange}
                                    required
                                    autoComplete="new-password"
                                />
                            </div>

                            {/* Bouton de soumission */}
                            <button
                                type="submit"
                                className="btn w-100 py-2 rounded-pill fw-semibold text-white mt-2"
                                style={{
                                    backgroundColor: "var(--af-green-950, #15372F)",
                                    boxShadow: "0 4px 14px rgba(21, 55, 47, 0.2)",
                                }}
                                disabled={loading}
                            >
                                {loading ? "Création du compte..." : `Créer mon compte ${selectedRole === "Farmer" ? "Agriculteur" : "Acheteur"}`}
                            </button>
                        </form>

                        {/* Lien vers Connexion */}
                        <div className="text-center mt-3">
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

                    {/* Support */}
                    <div className="text-center pt-3 border-top mt-4" style={{ borderColor: "var(--af-border, #E2E9E3)" }}>
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
                                width: "34px",
                                height: "34px",
                                backgroundColor: "rgba(255, 255, 255, 0.2)",
                                color: "#FFFFFF",
                                fontSize: "0.95rem",
                            }}
                        >
                            ✓
                        </div>
                        <h2 className="af-auth-glass-quote">
                            « Une communauté certifiée au service de l&apos;agriculture marocaine. »
                        </h2>
                        <p className="af-auth-glass-meta m-0">
                            Accédez immédiatement à votre tableau de bord après inscription. Vos outils de vente et commandes s&apos;activeront dès validation de votre profil.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
