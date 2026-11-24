import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Row, Col, Alert } from "react-bootstrap";

import { registerFarmer } from "../features/auth/authThunks";
import {
    selectAuthLoading,
    selectAuthError,
} from "../features/auth/authSelectors";
import Logo from "../components/layout/Logo";
import { Button, Badge } from "../components/common";
import "../assets/auth.css";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MOROCCAN_PHONE_REGEX = /^(?:(?:\+|00)212|0)[5-7]\d{8}$/;

const FARMER_REGIONS = [
    { value: "Souss-Massa", label: "Souss-Massa (Agadir, Taroudant, Chtouka)" },
    { value: "Gharb-Chrarda-Béni Hssen", label: "Gharb (Kénitra, Sidi Kacem)" },
    { value: "Fès-Meknès", label: "Saïss / Fès / Meknès" },
    { value: "Marrakech-Safi", label: "Haouz / Marrakech / Chichaoua" },
    { value: "Tadla-Azilal", label: "Béni Mellal / Tadla" },
    { value: "Tanger-Tétouan-Al Hoceïma", label: "Larache / Loukkos / Nord" },
    { value: "Oriental", label: "Berkane / Moulouya / Oujda" },
    { value: "Casablanca-Settat", label: "Chaouia / Doukkala / Settat" },
    { value: "Autre région", label: "Autre région agricole du Maroc" },
];

/**
 * RegisterFarmerPage — Inscription dédiée aux Producteurs & Agriculteurs
 * Conçu selon le Design System AgriFlow (Split-screen avec UX et validation poussées).
 */
export default function RegisterFarmerPage() {

  const [formData, setFormData] = useState({
        name: "",
        phone: "",
        region: "Souss-Massa",
        email: "",
        password: "",
        password_confirmation: "",
    });
    const [fieldErrors, setFieldErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [localError, setLocalError] = useState("");

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const loading = useSelector(selectAuthLoading);
    const serverError = useSelector(selectAuthError);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setLocalError("");
        if (fieldErrors[name]) {
            setFieldErrors((prev) => ({ ...prev, [name]: "" }));
        }
    };

    const validateForm = () => {
        const errors = {};
        const trimmedName = formData.name.trim();
        const trimmedEmail = formData.email.trim();
        const cleanPhone = formData.phone.replace(/[\s.-]/g, "");

        if (!trimmedName) {
            errors.name = "Le nom complet ou nom de l'exploitation est obligatoire.";
        } else if (trimmedName.length < 2) {
            errors.name = "Le nom doit comporter au moins 2 caractères.";
        }

        if (!trimmedEmail) {
            errors.email = "L'adresse e-mail professionnelle est obligatoire.";
        } else if (!EMAIL_REGEX.test(trimmedEmail)) {
            errors.email = "Format d'adresse e-mail invalide (ex: contact@exemple.ma).";
        }

        if (cleanPhone && !MOROCCAN_PHONE_REGEX.test(cleanPhone)) {
            errors.phone = "Numéro de téléphone marocain invalide (ex: 06 12 34 56 78).";
        }

        if (!formData.password) {
            errors.password = "Le mot de passe est obligatoire.";
        } else if (formData.password.length < 8) {
            errors.password = "Le mot de passe doit comporter au moins 8 caractères.";
        }

        if (!formData.password_confirmation) {
            errors.password_confirmation = "Veuillez confirmer votre mot de passe.";
        } else if (formData.password !== formData.password_confirmation) {
            errors.password_confirmation = "Les mots de passe ne correspondent pas.";
        }

        setFieldErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLocalError("");

        if (!validateForm()) return;

        const payload = {
            name: formData.name.trim(),
            email: formData.email.trim(),
            phone: formData.phone.trim() || undefined,
            password: formData.password,
            password_confirmation: formData.password_confirmation,
        };

        try {
            await dispatch(registerFarmer(payload)).unwrap();
            navigate("/farmer/dashboard");
        } catch (err) {
            if (err && typeof err === "object") {
                const apiFieldErrors = {};
                for (const [key, msgs] of Object.entries(err)) {
                    apiFieldErrors[key] = Array.isArray(msgs) ? msgs[0] : msgs;
                }
                setFieldErrors((prev) => ({ ...prev, ...apiFieldErrors }));
            } else if (typeof err === "string") {
                setLocalError(err);
            }
        }
    };

    const displayError = localError || (typeof serverError === "string" ? serverError : null);

    return (
        <div className="af-auth-wrapper">
            <div className="af-auth-container" style={{ maxWidth: "1120px" }}>
                {/* ── Colonne Gauche : Formulaire Agriculteur ──────────── */}
                <div className="af-auth-form-col">
                    <div>
                        {/* En-tête avec Logo officiel & Badge rôle */}
                        <div className="af-auth-form-header">
                            <Link to="/" className="text-decoration-none d-inline-block" aria-label="Retour à l'accueil AgriFlow">
                                <Logo height={38} />
                            </Link>
                            <Badge variant="green" size="sm">
                                COMPTE AGRICULTEUR 🌾
                            </Badge>
                        </div>

                        <h1 className="af-auth-title">Inscription Agriculteur</h1>
                        <p className="af-auth-subtitle">
                            Producteurs, coopératives et exploitants : proposez vos récoltes et vendez directement aux professionnels sans intermédiaire.
                        </p>

                        {/* Message d'erreur */}
                        {displayError && (
                            <Alert
                                variant="danger"
                                className="rounded-3 mb-4 py-2 small d-flex align-items-center gap-2"
                                style={{ backgroundColor: "#FFF0EF", borderColor: "#FED7AA", color: "#9A3412" }}
                            >
                                <span>⚠️</span>
                                <div>{displayError}</div>
                            </Alert>
                        )}

                        {/* Formulaire */}
                        <form onSubmit={handleSubmit} noValidate>
                            <Row className="g-3">
                                {/* Nom complet ou Exploitation */}
                                <Col xs={12} sm={6}>
                                    <div className="af-auth-group mb-0">
                                        <label className="af-auth-label" htmlFor="farmer-name">
                                            Nom ou Nom de l&apos;exploitation *
                                        </label>
                                        <input
                                            id="farmer-name"
                                            className={`af-auth-input ${fieldErrors.name ? "is-invalid" : ""}`}
                                            type="text"
                                            name="name"
                                            placeholder="Ex: Karim Benali (Ferme Bio Souss)"
                                            value={formData.name}
                                            onChange={handleChange}
                                            disabled={loading}
                                            required
                                            autoComplete="name"
                                        />
                                        {fieldErrors.name && (
                                            <div className="af-field-error">
                                                <span>✕</span> {fieldErrors.name}
                                            </div>
                                        )}
                                    </div>
                                </Col>

                                {/* Téléphone */}
                                <Col xs={12} sm={6}>
                                    <div className="af-auth-group mb-0">
                                        <label className="af-auth-label" htmlFor="farmer-phone">
                                            Téléphone de contact
                                        </label>
                                        <input
                                            id="farmer-phone"
                                            className={`af-auth-input ${fieldErrors.phone ? "is-invalid" : ""}`}
                                            type="tel"
                                            name="phone"
                                            placeholder="06 12 34 56 78"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            disabled={loading}
                                            autoComplete="tel"
                                        />
                                        {fieldErrors.phone && (
                                            <div className="af-field-error">
                                                <span>✕</span> {fieldErrors.phone}
                                            </div>
                                        )}
                                    </div>
                                </Col>

                                {/* Région de production */}
                                <Col xs={12} sm={6}>
                                    <div className="af-auth-group mb-0">
                                        <label className="af-auth-label" htmlFor="farmer-region">
                                            Bassin de production agricole
                                        </label>
                                        <select
                                            id="farmer-region"
                                            className="af-auth-input"
                                            name="region"
                                            value={formData.region}
                                            onChange={handleChange}
                                            disabled={loading}
                                        >
                                            {FARMER_REGIONS.map((r) => (
                                                <option key={r.value} value={r.value}>
                                                    {r.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </Col>

                                {/* Adresse e-mail */}
                                <Col xs={12} sm={6}>
                                    <div className="af-auth-group mb-0">
                                        <label className="af-auth-label" htmlFor="farmer-email">
                                            Adresse e-mail professionnelle *
                                        </label>
                                        <input
                                            id="farmer-email"
                                            className={`af-auth-input ${fieldErrors.email ? "is-invalid" : ""}`}
                                            type="email"
                                            name="email"
                                            placeholder="producteur@exploitation.ma"
                                            value={formData.email}
                                            onChange={handleChange}
                                            disabled={loading}
                                            required
                                            autoComplete="email"
                                        />
                                        {fieldErrors.email && (
                                            <div className="af-field-error">
                                                <span>✕</span> {fieldErrors.email}
                                            </div>
                                        )}
                                    </div>
                                </Col>

                                {/* Mot de passe */}
                                <Col xs={12} sm={6}>
                                    <div className="af-auth-group mb-0">
                                        <label className="af-auth-label" htmlFor="farmer-password">
                                            Mot de passe (8 car. min) *
                                        </label>
                                        <div className="af-password-wrapper">
                                            <input
                                                id="farmer-password"
                                                className={`af-auth-input ${fieldErrors.password ? "is-invalid" : ""}`}
                                                type={showPassword ? "text" : "password"}
                                                name="password"
                                                placeholder="••••••••"
                                                value={formData.password}
                                                onChange={handleChange}
                                                disabled={loading}
                                                required
                                                autoComplete="new-password"
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
                                            <div className="af-field-error">
                                                <span>✕</span> {fieldErrors.password}
                                            </div>
                                        )}
                                    </div>
                                </Col>

                                {/* Confirmation mot de passe */}
                                <Col xs={12} sm={6}>
                                    <div className="af-auth-group mb-0">
                                        <label className="af-auth-label" htmlFor="farmer-confirm">
                                            Confirmer le mot de passe *
                                        </label>
                                        <input
                                            id="farmer-confirm"
                                            className={`af-auth-input ${fieldErrors.password_confirmation ? "is-invalid" : ""}`}
                                            type={showPassword ? "text" : "password"}
                                            name="password_confirmation"
                                            placeholder="••••••••"
                                            value={formData.password_confirmation}
                                            onChange={handleChange}
                                            disabled={loading}
                                            required
                                            autoComplete="new-password"
                                        />
                                        {fieldErrors.password_confirmation && (
                                            <div className="af-field-error">
                                                <span>✕</span> {fieldErrors.password_confirmation}
                                            </div>
                                        )}
                                    </div>
                                </Col>

                                {/* Bouton de soumission */}
                                <Col xs={12} className="pt-2">
                                    <Button
                                        type="submit"
                                        id="register-farmer-submit-btn"
                                        variant="primary"
                                        pill
                                        size="lg"
                                        isLoading={loading}
                                        disabled={loading}
                                        className="w-100"
                                    >
                                        {loading ? "Création du compte en cours..." : "Créer mon compte Agriculteur →"}
                                    </Button>
                                </Col>
                            </Row>
                        </form>

                        <div className="text-center mt-3">
                            <span className="small text-muted">Vous êtes acheteur professionnel ? </span>
                            <Link
                                to="/register/client"
                                className="small fw-semibold text-decoration-none"
                                style={{ color: "var(--af-green-900, #194638)" }}
                            >
                                Inscription Acheteur Pro
                            </Link>
                        </div>
                    </div>

                    {/* Support & Connexion */}
                    <div className="text-center pt-3 border-top mt-4" style={{ borderColor: "var(--af-border, #E2E9E3)" }}>
                        <span className="small text-muted">Déjà inscrit sur AgriFlow ? </span>
                        <Link
                            to="/login"
                            className="small fw-bold text-decoration-none"
                            style={{ color: "var(--af-green-900, #194638)" }}
                        >
                            Se connecter
                        </Link>
                    </div>
                </div>

                {/* ── Colonne Droite : Visuel Agricole & Glass Card (Partie 2) ─── */}
                <div
                    className="af-auth-visual-col"
                    style={{
                        backgroundImage:
                            'url("https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=1000&q=80")',
                    }}
                >
                    <div className="af-auth-visual-overlay" />
                    <div className="af-auth-glass-card">
                        <div
                            className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
                            style={{
                                width: "32px",
                                height: "32px",
                                backgroundColor: "rgba(255, 255, 255, 0.2)",
                                color: "#FFFFFF",
                                fontSize: "0.95rem",
                            }}
                        >
                            🌾
                        </div>
                        <h2 className="af-auth-glass-quote">
                            « Du terroir marocain directement aux commerces et marchés. »
                        </h2>
                        <p className="af-auth-glass-meta m-0">
                            Vendez vos récoltes en direct sans intermédiaire. Développez votre réseau d&apos;acheteurs professionnels certifiés partout au Maroc.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
